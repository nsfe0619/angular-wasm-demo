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
