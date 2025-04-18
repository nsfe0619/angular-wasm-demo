import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WasmService {
  private wasmInstance!: WebAssembly.Instance ;
  private memory!: WebAssembly.Memory;

  async init(): Promise<void> {
    if (this.wasmInstance) return;

    const response = await fetch('assets/wasm/add.wasm');
    const buffer = await response.arrayBuffer();

    const { instance } = await WebAssembly.instantiate(buffer, {
      env: {
        abort(_msg: number, _file: number, line: number, col: number) {
          console.error(`abort: ${line}:${col}`);
        },
      },
    });
    this.wasmInstance = instance;
    this.memory = instance.exports['memory'] as WebAssembly.Memory;
  }

  add(a: number, b: number): number {
    if (!this.wasmInstance) {
      throw new Error('WASM module not initialized.');
    }

    // 透過 exports 呼叫 add 函式
    const addFn = this.wasmInstance.exports['add'] as (a: number, b: number) => number;
    return addFn(a, b);
  }

  // lesson2
  stringToUsize(str: string): { ptr: number; len: number } {
    const len = str.length;
    const buffer = new Uint16Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = str.charCodeAt(i);
    }

    const alloc = this.wasmInstance.exports['alloc_utf16'] as (len: number) => number;
    const ptr = alloc(len * 2);

    const mem = new Uint16Array(this.memory.buffer, ptr, len);
    mem.set(buffer);

    return { ptr, len };
  }


  usizeToString(ptr: number, len: number): string {
    const mem = new Uint16Array(this.memory.buffer, ptr, len);
    return String.fromCharCode(...mem);
  }

  // lesson3
  createWithNew(str: string): number {
    return (this.wasmInstance.exports['createWithNew'] as (s: string) => number)(str);
  }

  createWithPin(str: string): number {
    return (this.wasmInstance.exports['createWithPin'] as (s: string) => number)(str);
  }

  manualAllocate(str: string): number {
    return (this.wasmInstance.exports['manualAllocate'] as (s: string) => number)(str);
  }

  releaseWithUnpin(ptr: number): void {
    (this.wasmInstance.exports['releaseWithUnpin'] as (ptr: number) => void)(ptr);
  }

  runGC(): void {
    (this.wasmInstance.exports['runGC'] as () => void)();
  }

}
