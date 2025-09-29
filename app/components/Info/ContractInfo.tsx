/*
 * @Description: 展示合约信息
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-25 18:04:39
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-26 22:45:48
 */
'use client'

import { useAccount, useReadContract, useBalance } from "wagmi";
import MetaNodeStakeABI from '../../abi/MetaNodeStake.json';

export default function ContractInfo() {

    const { address, isConnected, chain } = useAccount();
    // 获取合约余额
    const balanceData = useBalance({
        address: process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS as `0x${string}`,
        unit: 'ether',
    })
    // 获取池ID
    const {data: poolIdData} = useReadContract({
        address: process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS as `0x${string}`,
        abi: MetaNodeStakeABI,
        functionName: 'ETH_PID',
    });

    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS;

    return (
        <div>
            {/* 合约信息*/}
            <div className="flex items-center mb-4">
                <p className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm text-gray-200 px-2">合约信息</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                {/* 合约地址 */}
                <div className="flex items-center px-4 py-2">
                    <div>
                        <span className="text-sm text-gray-200">合约地址</span>
                        {isConnected ? <p className="mt-1 text-gray-400 font-bold text-sm bg-gray-800 px-2 py-1 rounded-md shadow-md">{CONTRACT_ADDRESS?.slice(0, 8) + '...' + CONTRACT_ADDRESS?.slice(-4)}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                    </div>
                </div>

                {/* 部署网络 */}
                <div className="flex items-center px-4 py-2">
                    <div>
                        <span className="text-sm text-gray-200">部署网络</span>
                        {isConnected ? <p className="mt-1 text-sm font-bold text-yellow-400 ">{chain?.name}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                    </div>
                </div>

                {/* 合约余额 */}
                <div className="flex items-center px-4 py-2">
                    <div>
                        <span className="text-sm text-gray-200">合约余额</span>
                        {isConnected ? (
                            balanceData?.data ? (
                                <p className="mt-1 text-sm font-bold text-blue-400">
                                {Number(balanceData.data.formatted).toFixed(4)} ETH
                                </p>
                            ) : (
                                <p className="mt-1 text-sm font-bold text-gray-400">Loading...</p>
                            )
                            ) : (
                            <p className="mt-1 text-sm font-bold text-white">N/A</p>
                        )}
                    </div>
                </div>

                {/* 钱包地址 */}
                <div className="flex items-center px-4 py-2">
                    <div>
                        <span className="text-sm text-gray-200">池 ID</span>
                        {isConnected ? <p className="mt-1 text-sm font-bold text-blue-400">{poolIdData?.toString()}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}