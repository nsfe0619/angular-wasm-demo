// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

// lesson2
// 建立字串的 UTF-16 緩衝區空間，JS 會寫入這塊記憶體
export function alloc_utf16(byteLength: i32): usize {
  return __new(byteLength, idof<ArrayBuffer>()); // 使用 __new 建立 ArrayBuffer 記憶體區段
}

// 從指標位置與字元長度解碼成字串（1 字元 = 2 bytes）
export function getStringFromPtr(ptr: usize, len: i32): string {
  return String.UTF16.decodeUnsafe(ptr, len << 1); // len * 2 = bytes
}

// lesson3
// 🧠 將字串內容寫入指定記憶體區
function writeUTF16ToMemory(str: string, ptr: usize): void {
  const mem = changetype<Uint16Array>(ptr);
  for (let i = 0, len = str.length; i < len; i++) {
    mem[i] = str.charCodeAt(i);
  }
}

// ✅ 使用 __new 分配記憶體並寫入字串
export function createWithNew(str: string): usize {
  const ptr = __new(str.length << 1, idof<ArrayBuffer>());
  writeUTF16ToMemory(str, ptr);
  return ptr;
}

// ✅ 使用 __new 並 __pin
export function createWithPin(str: string): usize {
  const ptr = __new(str.length << 1, idof<ArrayBuffer>());
  __pin(ptr);
  writeUTF16ToMemory(str, ptr);
  return ptr;
}

// ✅ 手動記憶體配置（無 GC）
let heapOffset: usize = 0;
const PAGE_SIZE: usize = 64 * 1024;

export function manualAllocate(str: string): usize {
  const byteLength = str.length << 1;

  if (heapOffset == 0) {
    heapOffset = <usize>memory.size() * PAGE_SIZE;
  }

  const ptr = heapOffset;
  heapOffset += byteLength;

  writeUTF16ToMemory(str, ptr);
  return ptr;
}

// ✅ 釋放 GC 保護（配合 __pin）
export function releaseWithUnpin(ptr: usize): void {
  __unpin(ptr);
}

// ✅ 強制執行 GC
export function runGC(): void {
  __collect();
}

