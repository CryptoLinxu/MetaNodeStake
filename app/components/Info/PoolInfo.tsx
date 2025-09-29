/*
 * @Description: 池规则信息
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-25 18:04:39
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-26 21:30:14
 */
'use client'

import { useAccount, useReadContracts } from "wagmi";
import MetaNodeStakeABI from '../../abi/MetaNodeStake.json';
import MetaNodeABI from '../../abi/MetaNode.json';
import { ChartColumnBig , CircleDollarSign, Lock, HandCoins, CircleCheck } from 'lucide-react';
import { formatUnits } from 'viem';
import UserStakeInfo from './UserStakeInfo';

export default function ContractInfo() {

    const { address, isConnected, chain } = useAccount();

    const stakeContractParams = {
        address: process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS as `0x${string}`,
        abi: MetaNodeStakeABI
    }
    const metanodeContractParams = {
        address: process.env.NEXT_PUBLIC_METANODE_HARDHAT_ADDRESS as `0x${string}`,
        abi: MetaNodeABI
    }

    // 获取池信息
    const {data, isLoading} = useReadContracts({
        contracts: [
            {
                ...stakeContractParams,
                functionName: 'ETH_PID',
            },
            {
                ...stakeContractParams,
                functionName: 'withdrawPaused',
            },
            {
                ...stakeContractParams,
                functionName: 'claimPaused',
            },
            {
                ...stakeContractParams,
                functionName: 'startBlock',
            },
            {
                ...stakeContractParams,
                functionName: 'endBlock',
            },
            {
                ...stakeContractParams,
                functionName: 'MetaNodePerBlock',
            },
            {
                ...stakeContractParams,
                functionName: 'pool',
                args:['0'],
            },
            {
                ...metanodeContractParams,
                functionName: 'symbol',
            },
        ]
    });

    const [poolIdData, withdrawPausedData, claimPausedData, startBlockData, endBlockData, metaNodePerBlockData, poolData, metaNodeSymbolData] = data?.map((item) => item.result) || [] as any[];

    return (
        <div className="mt-4">
            {/* 合约信息*/}
            <div className="flex items-center mb-4">
                <p className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-200 px-2">质押信息</span>
            </div>
            <div className="rounded-lg border border-gray-600 bg-[#0b0f1a] shadow-md">
                 {/* 池基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-900 rounded-lg m-4">

                    {/* 奖励token */}
                    <div className="flex items-center justify-center m-4 p-2 bg-[#0b0f1a] shadow-md rounded-lg">
                        <div className="text-center">
                            <span className="text-sm text-gray-200">奖励 Token</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-yellow-400 text-sm">{metaNodeSymbolData?.toString()}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>


                    {/* 池ID */}
                    <div className="flex items-center justify-center m-4 p-2 bg-[#0b0f1a] shadow-md rounded-lg">
                        <div className="text-center">
                            <span className="text-sm text-gray-200">质押池 ID</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-blue-400">{poolIdData?.toString()}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>

                    {/* 提取功能状态withdraw */}
                    <div className="flex items-center justify-center m-4 p-2 bg-[#0b0f1a] shadow-md rounded-lg">
                        <div className="text-center">
                            <span className="text-sm text-gray-200">Withdraw 提取功能</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-gray-400 text-sm">{withdrawPausedData ? <span className="text-red-500">已暂停</span> : <span className="text-green-500">正常</span>}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>

                    {/* 奖励领取功能状态claim */}
                    <div className="flex items-center justify-center m-4 p-2 bg-[#0b0f1a] shadow-md rounded-lg">
                        <div className="text-center">
                            <span className="text-sm text-gray-200">Claim 领取功能</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-gray-400 text-sm">{claimPausedData ? <span className="text-red-500">已暂停</span> : <span className="text-green-500">正常</span>}</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>

                </div>

                {/* 子标题*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div className="flex items-center px-4 py-4">
                        <p className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-200 px-2">质押规则</span>
                    </div>
                    <div className="flex items-center px-2 py-4">
                        <p className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-sm text-gray-200 px-2">资金状态</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-4 mb-4">

                    {/* 质押规则 */}
                    <div className="flex flex-col px-4 py-4 bg-gray-900 rounded-lg">
                        <div className="flex justify-between items-center bg-[#0b0f1a] rounded-lg p-2">
                            <span className="text-sm text-gray-200">最小质押金额：</span>
                            {isConnected ? <p className="text-sm font-bold text-gray-400">
                                {poolData?.[5] && Number(formatUnits(poolData[5], 18)).toFixed(4)} ETH</p> : <p className="text-sm font-bold text-white">N/A</p>}
                        </div>

                        <div className="flex justify-between items-center bg-[#0b0f1a] rounded-lg p-2 mt-2">
                            <span className="text-sm text-gray-200">解押锁定区块数：</span>
                            {isConnected ? <p className="text-sm font-bold text-gray-400">
                                {poolData?.[6] && poolData?.[6]?.toString()} 区块</p> : <p className="text-sm font-bold text-white">N/A</p>}
                        </div>

                        <div className="flex justify-between items-center bg-[#0b0f1a] rounded-lg p-2 mt-2">
                            <span className="text-sm text-gray-200">出块奖励数：</span>
                            {isConnected ? <p className="text-sm font-bold text-gray-400">
                                {metaNodePerBlockData && Number(formatUnits(metaNodePerBlockData, 18)).toFixed(4)} {metaNodeSymbolData?.toString()}</p> : <p className="text-sm font-bold text-white">N/A</p>}
                        </div>

                        <div className="flex justify-between items-center bg-[#0b0f1a] rounded-lg p-2 mt-2">
                            <span className="text-sm text-gray-200">开始区块：</span>
                            {isConnected ? <p className="text-sm font-bold text-gray-400">
                                {startBlockData?.toString()}</p> : <p className="text-sm font-bold text-white">N/A</p>}
                        </div>

                        <div className="flex justify-between items-center bg-[#0b0f1a] rounded-lg p-2 mt-2">
                            <span className="text-sm text-gray-200">终止区块：</span>
                            {isConnected ? <p className="text-sm font-bold text-gray-400">
                                {endBlockData?.toString()}</p> : <p className="text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>


                    {/* 资金状态 */}
                    <div className="flex flex-col px-4 py-4 bg-gray-900 rounded-lg">
                        <div className="flex flex-col gap-4 w-full h-full">
                            {/* 第一行 */}
                            <div className="flex gap-4 flex-1">
                                <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                                    <div className="p-4">
                                        <CircleDollarSign className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-200">总质押金额</span>
                                        {isConnected ? <p className="mt-1 text-sm font-bold text-yellow-400">{poolData?.[4] ? Number(formatUnits(poolData[4], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                                    </div>
                                </div>
                                <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                                    <div className="p-4">
                                        <ChartColumnBig className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-200">请求提取数</span>
                                        {isConnected ? <p className="mt-1 text-sm font-bold text-blue-400">{poolData?.[4] ? Number(formatUnits(poolData[4], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                                    </div>
                                </div>
                            </div>
                             {/* 第二行 */}
                            <div className="flex gap-4 flex-1">
                               <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                                    <div className="p-4">
                                        <HandCoins className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-200">可提取金额</span>
                                        {isConnected ? <p className="mt-1 text-sm font-bold text-green-400">{poolData?.[4] ? Number(formatUnits(poolData[4], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                                    </div>
                                </div>
                                <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                                    <div className="p-4">
                                        <Lock className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-200">锁定金额</span>
                                        {isConnected ? <p className="mt-1 text-sm font-bold text-red-400">{poolData?.[4] ? Number(formatUnits(poolData[4], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 引入用户质押信息 */}
                 <UserStakeInfo />
            </div>
        </div>
    );
}