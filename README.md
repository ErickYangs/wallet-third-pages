# Web3 钱包 React 应用

这是一个使用 React + TypeScript + Vite 构建的 Web3 钱包应用，集成了 wagmi 和 viem 来实现钱包连接功能。

## 功能特性

- 🏠 **首页**: 应用介绍和功能概览
- 💼 **钱包页面**: 连接和管理 Web3 钱包，查看余额和链信息
- 👥 **社交页面**: Web3 社交功能，发布动态和消息
- 🔗 **钱包连接**: 支持 MetaMask、WalletConnect 等多种钱包
- 📱 **响应式设计**: 适配桌面和移动设备

## 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript 接口 for Ethereum
- **React Router** - 客户端路由
- **TanStack Query** - 数据获取和缓存

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm build
```

## 使用说明

1. **连接钱包**: 在钱包页面选择并连接您的 Web3 钱包
2. **查看余额**: 连接后可以查看钱包地址、余额和当前链信息
3. **社交功能**: 连接钱包后可以使用社交功能，发布动态和查看消息

## 配置说明

### WalletConnect 配置

在 `src/config/wagmi.ts` 中，您需要替换 WalletConnect 的 Project ID：

```typescript
walletConnect({
  projectId: 'your-walletconnect-project-id', // 替换为您的 Project ID
}),
```

获取 Project ID 请访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)

### 支持的链

当前支持以下链：
- Ethereum Mainnet
- Sepolia Testnet

您可以在 `src/config/wagmi.ts` 中添加更多链。

## 项目结构

```
src/
├── components/          # 可复用组件
│   └── Navigation.tsx   # 导航组件
├── config/             # 配置文件
│   └── wagmi.ts        # Wagmi 配置
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Wallet.tsx      # 钱包页面
│   └── Social.tsx      # 社交页面
├── providers/          # 上下文提供者
│   └── Web3Provider.tsx # Web3 提供者
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 开发指南

### 添加新的钱包连接器

在 `src/config/wagmi.ts` 中添加新的连接器：

```typescript
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  connectors: [
    // ... 现有连接器
    coinbaseWallet({
      appName: 'Web3 Wallet App',
    }),
  ],
  // ...
})
```

### 添加新的页面

1. 在 `src/pages/` 中创建新页面组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/components/Navigation.tsx` 中添加导航链接

## 许可证

MIT License