# HexaGuard: Web3 MPC Wallet Management System

## Prerequisites

- Node.js (v20.10.0)
- npm (v10.x)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.local and fill in your credentials
4. Run development server:
   ```bash
   npm run dev
   ```

## Features

- Web3 Multi-Party Computation (MPC) Wallet
- AI-Powered Transaction Security
- Policy-Based Access Control

## Tech Stack

- Next.js 14
- TypeScript
- Wagmi + ethers
- Material-UI
- Tailwind CSS
- OpenAI Integration


##

```
AI MPC 錢包管理系統前端的完整實現。這個前端系統基於 Next.js + React MUI + wagmi + ethers.js，採用深色主題，主底色為綠色。下面是對各組件的總結：

主題設置：創建了一個深色綠色主題，使用綠色作為主色調，黑色背景提供良好的對比度。
錢包連接：
支持 MetaMask 和 WalletConnect
簡潔的連接對話框
網絡選擇器支持 Sepolia 測試網和 Sonic 測試網的切換
佈局和導航：
側邊欄導航可收縮
自適應頭部導航欄
麵包屑導航支持
資產管理：
資產卡片顯示代幣餘額和估算美元價值
總資產概覽卡片
支持添加自定義代幣
交易管理：
待處理交易列表
交易歷史記錄
新建交易對話框支持多種交易類型
交易詳情頁面顯示完整信息
政策管理：
政策列表和卡片展示
政策編輯對話框
支持多種政策類型（白名單、金額限制、時間鎖定、自定義）
AI 驗證：
AI 分析結果展示
風險評估和建議
AI 簽名驗證介面
工具函數：
地址處理
日期格式化
數字格式化
本地存儲管理
整個前端設計遵循現代 UI/UX 設計原則，具有以下特點：

一致性：統一的色彩、排版和元素風格
反饋性：交互動作都有適當的視覺反饋
易用性：清晰直觀的界面設計和操作流程
響應式：支持不同設備尺寸的適配
系統可以輕鬆與您的 Gnosis Safe + MPC + AI 簽名後端集成，實現完整的錢包管理功能。您可以根據實際情況修改合約地址、API 端點和具體功能邏輯。

要運行此前端系統，您需要：

安裝 Node.js 和 npm/yarn
設置一個新的 Next.js 項目
安裝所需依賴庫（MUI、wagmi、ethers.js、next-images 等）
將這些組件代碼集成到項目中
配置實際的合約地址和 API 端點
部署到您的服務器或雲平台
這套前端代碼為您的 AI MPC 錢包管理系統提供了一個完整的用戶界面，展示了系統的核心功能和價值主張，讓用戶能夠安全、高效地管理他們的加密資產。





```
