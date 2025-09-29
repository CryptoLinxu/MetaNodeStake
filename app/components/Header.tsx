/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-17 22:20:56
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-29 16:22:26
 */
// components/Header.tsx
'use client'; // 如果需要在组件中使用 React 状态或事件处理，则需添加

import Link from 'next/link';
import { WalletConnect } from './RainbowKit';
export default function Header() {
  return (
    <header className="flex items-center w-full px-4 py-3 bg-black shadow-sm">
      {/* Logo 部分，占据 1/4，使用 next/link 包裹以实现客户端导航 */}
      <div className="w-1/4 flex-shrink-0">
        <Link href="/" passHref>
          {/* <h2 className="text-xl font-bold text-white px-4">Stake Dapp</h2> */}
          <h2
            className="text-2xl font-bold px-4 
             bg-gradient-to-tr from-[#00d2ff] via-[#3a7bd5] to-[#f9d423]
             bg-clip-text text-transparent"
          >
            Stake Dapp
          </h2>
        </Link>
      </div>

      {/* 空白占位，占据 1/4 */}
      <div className="w-1/4 hidden md:block"></div> {/* 中等屏幕及以上显示 */}

      {/* 导航栏，占据 1/4，居中对齐 */}
      <nav className="w-1/4 flex justify-center gap-x-8">
        <Link href="/" className="px-3 py-2 font-bold text-white hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        <Link href="/stake" className="px-3 py-2 font-bold text-white hover:text-blue-600 transition-colors duration-200">
          Stake
        </Link>
        <Link href="/withdraw" className="px-3 py-2 font-bold text-white hover:text-blue-600 transition-colors duration-200">
          Withdraw
        </Link>
        {/* 添加更多导航链接 */}
        <Link href="/about" className="px-3 py-2 font-bold text-white hover:text-blue-600 transition-colors duration-200">
          About
        </Link>
      </nav>

      {/* WalletConnect 按钮，占据 1/4，右对齐 */}
      <div className="w-1/4 flex justify-end">
        <WalletConnect />
      </div>
    </header>
  );
}