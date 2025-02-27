// config/wagmi.js
import { createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// 定義 Sonic Testnet 配置
export const sonicTestnet = {
  id: 99999,
  name: 'Sonic Testnet',
  network: 'sonic-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'SONIC',
  },
  rpcUrls: {
    public: { http: ['https://sonic-testnet.rpc.io'] }, // 替換為實際的 RPC URL
    default: { http: ['https://sonic-testnet.rpc.io'] },
  },
  blockExplorers: {
    default: { name: 'SonicScan', url: 'https://sonicscan.io' }, // 替換為實際的區塊瀏覽器 URL
  },
  testnet: true,
};

// 配置支持的鏈
const { chains, provider, webSocketProvider } = configureChains(
  [sepolia, sonicTestnet],
  [publicProvider()]
);

// 建立 MetaMask 和 WalletConnect 連接器
const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimChainChangedDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: true,
  },
});

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    showQrModal: true,
  },
});

// 創建 wagmi 客戶端
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [metaMaskConnector, walletConnectConnector],
  provider,
  webSocketProvider,
});

// 匯出鏈配置和連接器
export { chains };
export const connectors = [metaMaskConnector, walletConnectConnector];

// 合約地址配置
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    policyEngine: '0x...', // 設置 Sepolia 上的合約地址
  },
  [sonicTestnet.id]: {
    policyEngine: '0x...', // 設置 Sonic 上的合約地址
  }
};

// 支持的代幣配置
export const SUPPORTED_TOKENS = {
  [sepolia.id]: [
    {
      name: 'ETH',
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000', // ETH 原生代幣
      decimals: 18,
      logoUrl: '/images/tokens/eth.png',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      address: '0x...', // Sepolia 上的 USDC 代幣地址
      decimals: 6,
      logoUrl: '/images/tokens/usdc.png',
    },
    {
      name: 'WBTC',
      symbol: 'WBTC',
      address: '0x...', // Sepolia 上的 WBTC 代幣地址
      decimals: 8,
      logoUrl: '/images/tokens/wbtc.png',
    }
  ],
  [sonicTestnet.id]: [
    {
      name: 'SONIC',
      symbol: 'SONIC',
      address: '0x0000000000000000000000000000000000000000', // SONIC 原生代幣
      decimals: 18,
      logoUrl: '/images/tokens/sonic.png',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      address: '0x...', // Sonic 上的 USDC 代幣地址
      decimals: 6,
      logoUrl: '/images/tokens/usdc.png',
    }
  ]
};