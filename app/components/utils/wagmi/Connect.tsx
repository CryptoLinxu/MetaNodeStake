/*
 * @Description: wagmi连接钱包组件
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-17 23:18:47
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 15:12:58
 */
'use client'

import { useAccount, useConnect, useDisconnect } from "wagmi";
export default function WagmiWalletConnect() {
    // 使用wagmi的Hooks
    const { address, isConnected, chain } = useAccount();
    // const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    if (!isConnected) {
        return (
            <div>
                <h1 className="text-lg font-bold">Wagmi Connect</h1>
                <p>Please connect your wallet!</p>
            </div>
        )
    }
    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Connected</h1>
            <div className="mt-2 p-2 border border-gray-500 rounded">
                <p><b>Address:</b> {address}</p>
                <p><b>Is Connected:</b> {isConnected.toString()}</p>
                <p><b>Chain:</b> {chain?.name}</p>
                <p><b>ChainId:</b> {chain?.id}</p>
            </div>
            <button className="w-full px-4 py-2 mt-4 bg-red-600 text-white rounded cursor-pointer" onClick={() => disconnect()}>Disconnect</button>
        </div>
    )
}