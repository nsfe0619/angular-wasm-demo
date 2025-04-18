import { Component } from '@angular/core';
import { WasmService } from 'src/app/services/wasm.service';

interface MemoryRecord {
  ptr: number;
  value: string;
  size: number;
  method: string;
}

@Component({
  selector: 'app-lesson3',
  templateUrl: './lesson3.component.html',
  styleUrls: ['./lesson3.component.scss'],
})
export class Lesson3Component {
  inputStr = '';
  log: string[] = [];
  lastPtr = 0;
  lastLen = 0;
  memoryTable: MemoryRecord[] = [];

  constructor(public wasm: WasmService) {}

  createNew() {
    const str = this.inputStr;
    const ptr = this.wasm.createWithNew(str);
    this.lastPtr = ptr;
    this.lastLen = str.length;

    this.memoryTable.push({
      ptr,
      value: str,
      size: str.length * 2,
      method: '__new',
    });

    this.log.push(`🧪 __new → ptr=${ptr}`);
    this.logMemorySize();
  }

  createAndPin() {
    const str = this.inputStr;
    const ptr = this.wasm.createWithPin(str);
    this.lastPtr = ptr;
    this.lastLen = str.length;

    this.memoryTable.push({
      ptr,
      value: str,
      size: str.length * 2,
      method: '__new + __pin',
    });

    this.log.push(`📌 __new + __pin → ptr=${ptr}`);
    this.logMemorySize();
  }

  manualAlloc() {
    const str = this.inputStr;
    const ptr = this.wasm.manualAllocate(str);
    this.lastPtr = ptr;
    this.lastLen = str.length;

    this.memoryTable.push({
      ptr,
      value: str,
      size: str.length * 2,
      method: 'manualAllocate',
    });

    this.log.push(`⚙️ manualAllocate → ptr=${ptr}`);
    this.logMemorySize();
  }

  unpinAndGC() {
    const target = this.memoryTable.find((entry) => entry.ptr === this.lastPtr);

    if (!target) {
      this.log.push(`⚠️ 找不到記憶體記錄 ptr=${this.lastPtr}`);
      return;
    }

    if (target.method !== '__new + __pin') {
      this.log.push(`❌ 此記憶體非 __pin 分配，不可 unpin`);
      return;
    }

    this.wasm.releaseWithUnpin(this.lastPtr);
    this.wasm.runGC();
    this.memoryTable = this.memoryTable.filter((entry) => entry.ptr !== this.lastPtr);
    this.log.push(`🧹 __unpin + __collect → ptr=${this.lastPtr}`);
    this.logMemorySize();
  }

  restoreString(ptr: number, len: number) {
    try {
      console.log('ptr',ptr,'len',len)
      const mem = new Uint16Array(this.wasm['memory'].buffer, ptr, len);
      const str = String.fromCharCode(...mem);
      this.log.push(`🔍 還原字串（ptr=${ptr}）→ "${str}"`);
    } catch (e) {
      this.log.push(`❌ 還原失敗（ptr=${ptr}）：${e}`);
    }
  }


  checkMemoryTable() {
    const updated: MemoryRecord[] = [];

    for (const entry of this.memoryTable) {
      try {
        const mem = new Uint16Array(this.wasm['memory'].buffer, entry.ptr, entry.size / 2);
        const restored = String.fromCharCode(...mem);
        if (restored === entry.value) {
          updated.push(entry);
        } else {
          this.log.push(`⚠️ 資料不一致：ptr=${entry.ptr} ≠ "${restored}"`);
        }
      } catch (err) {
        this.log.push(`❌ 無法還原 ptr=${entry.ptr}（可能已被 GC）`);
      }
    }

    this.memoryTable = updated;
    this.log.push('✅ 記憶體狀態檢查完成');
  }

  logMemorySize() {
    const size = this.wasm['memory'].buffer.byteLength;
    this.log.push(`📦 記憶體用量：${(size / 1024).toFixed(2)} KB`);
  }

  clearLog() {
    this.log = [];
  }
}
