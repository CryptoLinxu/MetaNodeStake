/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-15 19:15:12
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-27 11:15:27
 */

'use client'

import "./globals.css";

// 导入 RainbowKit 样式文件
import '@rainbow-me/rainbowkit/styles.css';
// 导入 RainbowKit 的默认配置和提供者组件
import { RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import config from './config';
import Header from "./components/Header";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({children}: {children: React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={midnightTheme()}>
              <Header />
                {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}