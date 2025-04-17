import { Component } from '@angular/core';
import { WasmService } from 'src/app/services/wasm.service';

@Component({
  selector: 'app-lesson2',
  templateUrl: './lesson2.component.html',
  styleUrls: ['./lesson2.component.scss'],
})
export class Lesson2Component {
  inputStr = '';
  ptr = 0;
  len = 0;
  recoveredStr = '';

  constructor(private wasm: WasmService) {}

  getPointer() {
    const { ptr, len } = this.wasm.stringToUsize(this.inputStr);
    this.ptr = ptr;
    this.len = len;
  }

  recoverString() {
    this.recoveredStr = this.wasm.usizeToString(this.ptr, this.len);
  }
}
