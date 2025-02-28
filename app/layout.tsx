// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeWrapper from './ThemeWrapper'; // 确保路径正确

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hexa Guard Wallet Management System',
  description: 'Hexa Guard Wallet Management System, with MPC and Policy feature and extra AI agent to analyze the data base on Gnosis.',
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <ThemeWrapper> {/* 确保 ThemeWrapper 包裹了所有内容 */}
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}