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
wasm/
├── assembly/
│   └── index.ts            ← 撰寫 AssemblyScript 原始碼
├── asconfig.json           ← 編譯設定檔（可保留預設）
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
