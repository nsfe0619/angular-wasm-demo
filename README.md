# 🚀 angular-wasm-demo

這是一個結合 **Angular** 與 **AssemblyScript (WebAssembly)** 的教學專案。專案採用模組化設計，每個章節（Lesson）都是獨立的 Component，並由側邊選單統一管理。

> 📘 適合前端工程師學習 WASM 整合與應用。

---

## 📁 專案結構

```
src/ 
  └── app/ 
    ├── app.component.ts/html/scss ← 主框架與頁面容器 
    ├── app-routing.module.ts ← 路由設定 
    └── components/ ← 所有畫面元件集中管理 
      ├── menu/ ← 側邊選單 
      └── lesson0/ ← Lesson 0：環境建置 
```

## 🛠️ 安裝與執行

```
# 1. 複製專案
git clone git clone --branch master https://github.com/nsfe0619/angular-wasm-demo.git
cd angular-wasm-demo

# 2. 安裝套件
npm install

# 3. 啟動 Angular 開發伺服器
ng serve
```
---
## 📘 Lesson 0：安裝 AssemblyScript 並編譯 WASM

以下為初步整合 AssemblyScript 的步驟，可讓你將 TypeScript 語法編譯為 WebAssembly 模組，供 Angular 使用。

---

### ✅ 步驟 1：安裝 AssemblyScript

在專案根目錄執行：

```
npm install --save-dev assemblyscript
```

### ✅ 步驟 2：初始化 AssemblyScript 專案結構
```
npx asinit wasm
```
這會產生以下目錄結構：
```
angular-wasm-demo/
├── wasm/
│   ├──assembly/               ← 放 AssemblyScript 原始碼
│   │   └── index.ts
│   └── package.json       
├── src/                    ← Angular相關程式
└── build/                  ← 編譯輸出目標
    ├── debug.wasm
    └── release.wasm
```
 需手動把build內的wasm移至src下
 
 預期調整
 ```
 angular-wasm-demo/
├── wasm/
│   ├── assembly/           ← 放 AssemblyScript 原始碼
│   │   └── index.ts
│   ├── package.json       ← 編譯設定
│   └── asconfig.json       ← 編譯設定
├── src/
│   └── assets/
│       └── add.wasm        ← 編譯輸出目標
 ```
### ✅ 步驟 3：調整編譯設定與指令
📄 修改 wasm/asconfig.json
```
{
  "entries": ["assembly/index.ts"],
  "options": {
    "outFile": "../src/assets/wasm/add.wasm",
    "optimizeLevel": 3,   
    "shrinkLevel": 1,     
    "noAssert": true      
  }
}
```
📄 wasm/package.json
```
{
  "scripts": {
    "asbuild": "asc assembly/index.ts --config asconfig.json"
  }
}
```
📄 根目錄 package.json
```
{
  "scripts": {
    "dev": "npm --prefix wasm run asbuild && ng serve"
  }
}
```
✅ 說明：

編譯輸出會自動寫入 Angular 的靜態資源目錄 src/assets/wasm/add.wasm
可依需求調整檔名或目錄位置

### ✅ 步驟 4：啟動專案
```
npm run dev
```
執行後會：
產生 src/assets/wasm/add.wasm
啟動 Angular 開發伺服器：http://localhost:4200/

---
## 📘 Lesson 1：在 Angular 中呼叫 WebAssembly 加法函式

本章節將學習如何在 Angular 中載入 `.wasm` 檔案，並透過 TypeScript 呼叫 AssemblyScript 編譯出的 `add(a, b)` 函式。

---

### 🎯 目標

- 載入 `src/assets/wasm/add.wasm`
- 使用 `WebAssembly.instantiate` 初始化模組
- 在畫面上輸入兩個數字並計算加總結果

---

### 📁 新增檔案結構
```
src/ 
├── app/ 
│  ├── services/ 
│  │   └── wasm.service.ts ← 載入並呼叫 add 函式 
│  └── components/ 
│      └── lesson1/ 
│         ├── lesson1.component.ts 
│         ├── lesson1.component.html 
│         └── lesson1.component.scss
```

---

### ✅ 步驟 1：建立 WasmService

📄 `/wasm.service.ts`

讀取wasm檔案
```ts
  private wasmInstance: WebAssembly.Instance | null = null;

  async init(): Promise<void> {
    if (this.wasmInstance) return;

    const response = await fetch('assets/wasm/add.wasm');
    const buffer = await response.arrayBuffer();

    const { instance } = await WebAssembly.instantiate(buffer, {});
    this.wasmInstance = instance;
  }
```

預設的加法邏輯
```ts 
  add(a: number, b: number): number {
    if (!this.wasmInstance) {
      throw new Error('WASM module not initialized.');
    }

    const addFn = this.wasmInstance.exports.add as (a: number, b: number) => number;
    return addFn(a, b);
  }
}
```

### ✅ 步驟 2：建立 Lesson1 Component

/lesson1.component.ts
載入wasmService，並在初始化時初始化wasm
```ts
  constructor(private wasm: WasmService) {}

  async ngOnInit(): Promise<void> {
    await this.wasm.init();
  }
```

按鈕時運用方法
```ts
  calculate(): void {
    this.result = this.wasm.add(this.a, this.b);
  }
```

---
## Lesson 2 - 資料型別與 JS/TS 互動原理

### 🎯 課程目標

- 瞭解 AssemblyScript 中 `string` 與 `usize` 的轉換邏輯
- 學會從 Angular 將字串資料轉成 WebAssembly 可讀的記憶體格式
- 熟悉 WebAssembly 記憶體模型與 `memory.buffer` 操作
- ✅ 支援中文、英文與 emoji 字串處理

---

### 🧠 重點概念

| 概念 | 說明 |
|------|------|
| `usize` | 表示 WebAssembly 記憶體中的一段資料位址 |
| `String.charCodeAt()` | JS 中將字串轉為 UTF-16 編碼的整數 |
| `__new()` | AssemblyScript 中的記憶體分配函數 |
| `String.UTF16.decodeUnsafe()` | 將記憶體中內容解碼回字串（由 WASM 執行） |
| `memory.buffer` | JS 存取 WebAssembly 記憶體的 ArrayBuffer |

---

### 🖼 功能畫面

- 輸入任意字串（含中英文與 emoji）
- 點擊按鈕取得對應的 `usize` 位址與長度
- 點擊還原按鈕，將 `usize` + 長度轉回原始字串

---

### 🛠 實作細節

### Angular (`lesson2.component.ts`)

- 呼叫 `wasm.service.ts` 的 `stringToUsize()` 方法進行記憶體配置
- 使用 `Uint16Array` 將字串寫入 `memory.buffer`
- 儲存 `ptr` 與 `length`，可供反查

```ts
  getPointer() {
    const { ptr, len } = this.wasm.stringToUsize(this.inputStr);
    this.ptr = ptr;
    this.len = len;
  }

  recoverString() {
    this.recoveredStr = this.wasm.usizeToString(this.ptr, this.len);
  }
```

### WebAssembly (`index.ts`)

```ts
export function alloc_utf16(byteLength: i32): usize {
  return __new(byteLength, idof<ArrayBuffer>());
}

export function getStringFromPtr(ptr: usize, len: i32): string {
  return String.UTF16.decodeUnsafe(ptr, len << 1);
}
```

### Angular (wasm.service.ts)
✅ stringToUsize(str: string): { ptr: number; len: number }

這段程式碼將字串轉為 UTF-16 的 Uint16Array，寫入 WebAssembly 的記憶體中，並回傳該區塊的起始位置（ptr）與長度（len）。

```ts
  stringToUsize(str: string): { ptr: number; len: number } {
    const len = str.length; // 傳入的字串str取得長度len
    const buffer = new Uint16Array(len); // 將字串轉成對應長度陣列
    for (let i = 0; i < len; i++) {
      buffer[i] = str.charCodeAt(i); // 向 WASM 請求分配 len*2 bytes 空間
    }

    const alloc = this.wasmInstance.exports['alloc_utf16'] as (len: number) => number;
    const ptr = alloc(len * 2);

    const mem = new Uint16Array(this.memory.buffer, ptr, len);
    mem.set(buffer);  // 寫入記憶體

    return { ptr, len };
  }
```

✅ usizeToString(ptr: number, len: number): string
這段程式碼從記憶體的某個位址（ptr）與指定長度（len）讀取 UTF-16 字元，並轉為 JS 字串。

```ts
  usizeToString(ptr: number, len: number): string {
    // 從memory取得ptr位置開始的後面len位長度數值
    const mem = new Uint16Array(this.memory.buffer, ptr, len); 
    return String.fromCharCode(...mem); //將每個 UTF-16 字元組合成原始字串
  }
```

對應關係：charCodeAt() <--> fromCharCode()
因為 fromCharCode() 的參數格式是：
```
String.fromCharCode(code1, code2, ..., codeN)
```
但我們的記憶體是一個 陣列（例如 Uint16Array），所以需要用 展開運算子 ... 把它轉成單個參數串：
```
const mem = new Uint16Array([21704, 21966]);
String.fromCharCode(...mem); // 正確 ✅
String.fromCharCode(mem);    // 錯誤 ❌
```

### lesson2做的其他調整

將this.wasm.init();移動到app.component.ts的 ngOnInit下，就不用每頁載入，另外:
```
./package.json增加
    "explicitStart": false,
    "exportRuntime": true,
    "noAssert": true,
    "initialMemory": "1mb",
    "maximumMemory": "10mb"
```
1.  "explicitStart": false
WASM 模組在 匯入時就自動執行 start（例如做初始化），不需要手動呼叫 __start()。
2. "exportRuntime": true (重要)
    將 AssemblyScript 的 runtime 功能匯出，例如 __new()、__pin()、__collect() 等
3. "noAssert": true (方便開發)
    關閉 AssemblyScript 編譯出來的斷言（assertion），例如 array out of bounds、division by zero 等檢查
4. "initialMemory": "1mb"
    初始化給 WebAssembly 配置 1MB 記憶體（線性記憶體） 
5. "maximumMemory": "10mb"
    限制 WebAssembly 最多只能成長到 10MB 記憶體（預設是 2GB）
