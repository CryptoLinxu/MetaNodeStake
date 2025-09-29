/*
 * @Description: 配置本地hardhat和sepolia网络
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-17 21:21:35
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-24 15:37:02
 */

// 'use client'
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";
import { http } from "wagmi";


const config = getDefaultConfig({
    appName: "Stake DApp",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "3f6521206cd69bf86a4d40c1cee306cd",
    chains: [hardhat, sepolia],
    transports: {
        [hardhat.id]: http("http://localhost:8545"),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC),
    },
    ssr: true, // 设置为 false 以启用客户端渲染
})

export default config;