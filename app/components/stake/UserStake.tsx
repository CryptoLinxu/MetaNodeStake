/*
 * @Description: 用户质押信息
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-26 10:08:51
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-26 21:42:30
 */
'use client'

import { useAccount, useBalance, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import MetaNodeStakeABI from '../../abi/MetaNodeStake.json';
import { Wallet, CircleDollarSign, Lock, HandCoins, CircleCheckBig, Info } from 'lucide-react';
import { formatUnits, parseEther } from 'viem';
import { useEffect, useState } from "react";

export default function UserStake() {

    // 定义变量
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { address, isConnected } = useAccount();
    const { data: balanceData, isLoading: balanceLoading } = useBalance({
        address,
        query: {
            enabled: isConnected,
            refetchInterval: refreshTrigger > 0 ? 1000 : false,

        }
    });

    const stakeContractParams = {
        address: process.env.NEXT_PUBLIC_METANODE_STAKE_HARDHAT_ADDRESS as `0x${string}`,
        abi: MetaNodeStakeABI
    }

    // 写合约
    const { writeContract, data: hash, error } = useWriteContract();
    // 等待交易确认
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });


    // handleStake函数
    const handleStake = async () => {
        if (!amount) {
            alert('请输入质押金额');
            return;
        }
        if (isConfirming) {
            alert('请稍后，交易正在确认中');
            return;
        }
        if (!balanceData || balanceData.value < parseEther(amount)) {
            alert('余额不足');
            return;
        }

        setLoading(true);
        try {
            await writeContract({
                ...stakeContractParams,
                functionName: 'depositETH',
                value: parseEther(amount),
            });
        } catch (error) {
            setLoading(false);
            alert(error);
            return;
        }
    }

    // handleClaim函数
    const handleClaim = async () => {
        if (isConfirming) {
            alert('请稍后，交易正在确认中');
            return;
        }
        setClaimLoading(true);
        try {
            await writeContract({
                ...stakeContractParams,
                functionName: 'claim',
                args: ['0'],
            });
        } catch (error) {
            setClaimLoading(false);
        }
    };

    useEffect(() => {
        if (isConfirmed || error) {
            setLoading(false)
            setAmount('')
            setClaimLoading(false);
            // 触发数据刷新
            setRefreshTrigger(prev => prev + 1);
            // 3秒后停止轮询
            setTimeout(() => setRefreshTrigger(0), 3000);
            if (isConfirmed) {
                alert(`Success! TxHash: ${hash}`);
            }
        }
    }, [isConfirmed, error])

    // 获取用户质押信息
    const { data, isLoading } = useReadContracts({
        contracts: [
            {
                ...stakeContractParams,
                functionName: 'withdrawAmount',
                args: ['0', address],
            },
            {
                ...stakeContractParams,
                functionName: 'stakingBalance',
                args: ['0', address],
            },
            {
                ...stakeContractParams,
                functionName: 'user',
                args: ['0', address],
            },
        ],
        query: {
            enabled: isConnected,
            refetchInterval: refreshTrigger > 0 ? 1000 : false,
        }
    });

    const [withdrawAmountData, stakingBalanceData, userData] = data?.map((item) => item.result) || [] as any[];


    return (
        <div>

            {/* 用户质押信息*/}
            <div className="rounded-lg bg-[#0b0f1a] shadow-md p-4">

                {/* 用户质押信息内容*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 mb-4 bg-gray-900 rounded-lg px-4 py-4">
                    {/* 第1项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <Wallet className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">用户余额</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{balanceData ? Number(formatUnits(balanceData.value, 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>
                    {/* 第2项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <CircleDollarSign className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-200">总质押金额</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{stakingBalanceData ? Number(formatUnits(stakingBalanceData, 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
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
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{userData?.[2] ? Number(formatUnits(userData[2], 18)).toFixed(4) : '0.0000'} MNT</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
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

                {/* 介绍信息*/}
                <div className="bg-red-600/37 rounded-md p-2 flex-1 flex items-center justify-center">
                    <span className="text font-bold text-gray-300">Stake ETH And Claim MetaNode</span>
                </div>

                {/* stake操作栏*/}
                <div className="bg-gray-900 rounded-lg p-2 mt-4">
                    {/* stake标题*/}
                    <div className="text-lg font-bold text-white p-2 flex items-center">
                        <p className="w-4 h-4 rounded-full bg-green-800" />
                        <span className="ml-2">Stake</span>
                    </div>
                    {/* stake内容栏*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-900 rounded-lg p-2">
                        {/* 第1列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-4 flex flex-col">
                            <span className="text-sm font-bold text-gray-400">Amount To Stake</span>
                            <div className="flex items-center rounded-md bg-gray-900 border border-gray-800 mt-2">
                                <input
                                    className="flex-1 h-10 bg-transparent text text-white font-bold px-4 border-none focus:ring-0"
                                    type="text"
                                    placeholder="0.0000"
                                    value={amount || ""}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <span className="px-3 text font-bold text-gray-400">ETH</span>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-gray-600">Available: {isConnected ? <span className="mt-1 text-sm">{balanceData ? Number(formatUnits(balanceData.value, 18)).toFixed(4) : '0.0000'} ETH</span> : <span className="mt-1 text-sm font-bold text-white">N/A</span>} </span>
                            </div>
                            <button className="w-full h-10 bg-green-800 text-white font-bold rounded-md mt-4 cursor-pointer"
                                disabled={loading}
                                onClick={handleStake}>{loading ? 'Staking...' : 'Stake'}</button>
                        </div>
                        {/* 第2列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-2 flex flex-col">
                            <div className="bg-green-800/40 rounded-md p-2 flex items-center">
                                <Info className="w-4 h-4 text-green-400/80 mx-2" />
                                <span className="text-sm font-bold text-gray-300">Staking Policy</span>
                            </div>
                            <div className="mt-2">
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-green-800/40" />
                                    <span className="ml-2">Minimum Staking Amount: 0.001 ETH.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-green-800/40" />
                                    <span className="ml-2">Unstaking Block Lock:​ 3 Blocks.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-green-800/40" />
                                    <span className="ml-2">​​Reward per Block:​​ 2.0 MNT.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* claim操作栏*/}
                <div className="bg-gray-900 rounded-lg p-2 mt-4">
                    {/* claim标题*/}
                    <div className="text-lg font-bold text-white p-2 flex items-center">
                        <p className="w-4 h-4 rounded-full bg-[#ee2b69]" />
                        <span className="ml-2">Claim</span>
                    </div>

                    {/* claim内容*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-900 rounded-lg p-2">
                        {/* 第1列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-4 flex flex-col">
                            <span className="text-sm font-bold text-gray-400">Ready To Claim</span>
                            <div className="flex items-center rounded-md bg-gray-900 border border-gray-800 mt-2">
                                <input
                                    className="flex-1 h-10 text-xl text-[#ee2b69] font-bold px-4 border-none"
                                    type="text"
                                    placeholder="0.0000"
                                    value={userData?.[2] && Number(formatUnits(userData[2], 18)).toFixed(4) || ""}
                                    disabled={true}
                                />
                                <span className="px-3 text font-bold text-gray-400">MNT</span>
                            </div>
                            <button className="w-full h-10 bg-[#ee2b69] text-white font-bold rounded-md mt-4 cursor-pointer"
                                disabled={claimLoading}
                                onClick={handleClaim}>{claimLoading ? 'Claiming...' : 'Claim'}</button>
                        </div>
                        {/* 第2列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-2 flex flex-col">
                            <div className="bg-[#ee2b69]/40 rounded-md p-2 flex items-center">
                                <Info className="w-4 h-4 text-[#ee2b69] mx-2" />
                                <span className="text-sm font-bold text-gray-300">How Rewards Work?</span>
                            </div>
                            <div className="mt-2">
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ee2b69]/40" />
                                    <span className="ml-2">Rewards accumulate based on your staked amount and time.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ee2b69]/40" />
                                    <span className="ml-2">You can claim rewards anytime.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ee2b69]/40" />
                                    <span className="ml-2">Rewards are paid in MetaNode tokens.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}