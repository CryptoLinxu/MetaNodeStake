'use client'

import { useAccount, useBalance } from "wagmi";
import { Wallet, Waypoints, CircleUser } from "lucide-react"; // 用到钱包图标


export default function UserInfo(){

    const {address, isConnected, chain, chainId} = useAccount();
    const balanceData = useBalance({
        address: address as `0x${string}`,
        unit: 'ether',
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 连接状态 */}
            <div className="flex items-center px-4 py-4 rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                <div className="pr-4">
                    {isConnected ? <p className="w-3 h-3 rounded-full bg-green-500" /> : <p className="w-3 h-3 rounded-full bg-red-500" />}
                </div>
                <div>
                    <span className="text-sm text-gray-200">连接状态</span>
                    {isConnected ? <p className="mt-1 text-green-400 font-medium text-sm">已连接</p> : <p className="mt-1 text-red-400 font-medium text-sm">未连接</p>}
                </div>
            </div>

            {/* 钱包余额 */}
            <div className="flex items-center px-4 py-4 rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                <div className="pr-4">
                    <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <span className="text-sm text-gray-200">钱包余额</span>
                    {isConnected ? balanceData?.data?.value! > 0 && <p className="mt-1 text-lg font-bold text-blue-400">{balanceData?.data?.formatted && Number(balanceData?.data?.formatted).toFixed(4)} ETH</p> : <p className="mt-1 text-lg font-bold text-white">N/A</p>}
                    {balanceData?.data?.value! < 1 && <p className="text-red-500 text-sm mt-1">✗ 余额不足</p>}
                </div>
            </div>

            {/* 链信息 */}
            <div className="flex items-center px-4 py-4 rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                <div className="pr-4">
                    <Waypoints className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <span className="text-sm text-gray-200">当前网络</span>
                    {isConnected ? <p className="mt-1 text-lg font-bold text-green-400">{chain?.name} - {chainId}</p> : <p className="mt-1 text-lg font-bold text-white">N/A</p>}
                </div>
            </div>
            
            {/* 钱包地址 */}
            <div className="flex items-center px-4 py-4 rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                <div className="pr-4">
                    <CircleUser className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <span className="text-sm text-gray-200">钱包地址</span>
                    {isConnected ? <p className="mt-1 text-lg font-bold text-green-600">{address?.slice(0, 8) + '...' + address?.slice(-4)}</p> : <p className="mt-1 text-lg font-bold text-white">N/A</p>}
                </div>
            </div>
            
        </div>
    );
}