import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WasmService {
  private wasmInstance: WebAssembly.Instance | null = null;

  async init(): Promise<void> {
    if (this.wasmInstance) return;

    const response = await fetch('assets/wasm/add.wasm');
    const buffer = await response.arrayBuffer();

    const { instance } = await WebAssembly.instantiate(buffer, {});
    this.wasmInstance = instance;
  }

  add(a: number, b: number): number {
    if (!this.wasmInstance) {
      throw new Error('WASM module not initialized.');
    }

    // 透過 exports 呼叫 add 函式
    const addFn = this.wasmInstance.exports['add'] as (a: number, b: number) => number;
    return addFn(a, b);
  }
}
