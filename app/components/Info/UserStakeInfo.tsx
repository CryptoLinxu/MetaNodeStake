/*
 * @Description: 用户质押信息
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-26 10:08:51
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-26 22:40:37
 */
'use client'

import { useAccount, useReadContracts } from "wagmi";
import MetaNodeStakeABI from '../../abi/MetaNodeStake.json';
import { ChartColumnBig , CircleDollarSign, Lock, HandCoins, CircleCheckBig } from 'lucide-react';
import { formatUnits } from 'viem';

export default function UserStakeInfo() {

    const { address, isConnected } = useAccount();

    const stakeContractParams = {
        address: process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS as `0x${string}`,
        abi: MetaNodeStakeABI
    }

    // 获取用户质押信息
    const {data, isLoading} = useReadContracts({
        contracts: [
            {
                ...stakeContractParams,
                functionName: 'withdrawAmount',
                args:['0', address],
            },
            {
                ...stakeContractParams,
                functionName: 'stakingBalance',
                args:['0', address],
            },
            {
                ...stakeContractParams,
                functionName: 'user',
                args:['0', address],
            },
            {
                ...stakeContractParams,
                functionName: 'pendingMetaNode',
                args:['0', address],
            },
        ]
    });

    console.log(data, '用户质押信息')
    const [withdrawAmountData, stakingBalanceData, userData, pendingMetaNodeData] = data?.map((item) => item.result) || [] as any[];

    return (
        <div>

            {/* 用户质押信息*/}
            <div className="rounded-lg bg-[#0b0f1a] shadow-md px-4">
                {/* 用户质押信息标题*/}
                <div>
                    <div className="flex items-center py-4">
                        <p className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-sm text-gray-200 px-2">用户质押信息</span>
                    </div>
                </div>
                {/* 用户质押信息内容*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 mb-4 bg-gray-900 rounded-lg px-4 py-4">
                    {/* 第1项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <CircleDollarSign className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">总质押金额</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{stakingBalanceData ? Number(formatUnits(stakingBalanceData, 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                        </div>
                    </div>
                    {/* 第2项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <ChartColumnBig className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">请求金额</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{withdrawAmountData?.[0] ? Number(formatUnits(withdrawAmountData[0], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                        </div>
                    </div>
                    {/* 第3项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <Lock className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">待提取金额</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{withdrawAmountData?.['1'] ? Number(formatUnits(withdrawAmountData['1'], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                        </div>
                    </div>
                    {/* 第4项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <HandCoins className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">待领取奖励</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{userData?.[2] ? Number(formatUnits(userData[2], 18)).toFixed(4)  : '0.0000'} MNT</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                        </div>
                    </div>
                    {/* 第5项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <CircleCheckBig className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">已提取奖励</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{userData?.[1] ? Number(formatUnits(userData[1], 18)).toFixed(4) : '0.0000'} MNT</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}