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
