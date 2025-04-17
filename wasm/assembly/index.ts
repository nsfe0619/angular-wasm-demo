// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

// 建立字串的 UTF-16 緩衝區空間，JS 會寫入這塊記憶體
export function alloc_utf16(byteLength: i32): usize {
  return __new(byteLength, idof<ArrayBuffer>()); // 使用 __new 建立 ArrayBuffer 記憶體區段
}

// 從指標位置與字元長度解碼成字串（1 字元 = 2 bytes）
export function getStringFromPtr(ptr: usize, len: i32): string {
  return String.UTF16.decodeUnsafe(ptr, len << 1); // len * 2 = bytes
}
