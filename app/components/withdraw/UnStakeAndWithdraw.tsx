'use client'

import { useAccount, useBalance, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import MetaNodeStakeABI from '../../abi/MetaNodeStake.json';
import { Wallet, CircleDollarSign, Lock, HandCoins, CircleCheckBig, Info } from 'lucide-react';
import { formatUnits, parseEther } from 'viem';
import { useEffect, useState } from "react";

export default function UnStakeAndWithdraw() {

    // 定义变量
    const [amount, setAmount] = useState('');
    const [unstakingLoading, setUnstakingLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

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


    // handleUnstake函数
    const handleUnstake = async () => {
        if (!amount) {
            alert('请输入Unstake金额');
            return;
        }
        if (isConfirming) {
            alert('请稍后，交易正在确认中');
            return;
        }
        if (!stakingBalanceData || stakingBalanceData < parseEther(amount)) {
            alert('Unstake金额溢出');
            return;
        }

        setUnstakingLoading(true);
        try {
            await writeContract({
                ...stakeContractParams,
                functionName: 'unstake',
                args: ['0', parseEther(amount || "0")]
            });
        } catch (error) {
            setUnstakingLoading(false);
        }
    }

    // handleWithdraw函数
    const handleWithdraw = async () => {
        if (isConfirming) {
            alert('请稍后，交易正在确认中');
            return;
        }
        setWithdrawLoading(true);
        try {
            await writeContract({
                ...stakeContractParams,
                functionName: 'withdraw',
                args: ['0']
            });
        } catch (error) {
            setWithdrawLoading(false);
        }
    }

    useEffect(() => {
        if (isConfirmed || error) {
            setUnstakingLoading(false)
            setWithdrawLoading(false)
            setAmount('')
            // 触发数据刷新
            setRefreshTrigger(prev => prev + 1);
            // 3秒后停止轮询
            setTimeout(() => setRefreshTrigger(0), 3000);
            if (isConfirmed) {
                alert(`Stake Success! TxHash: ${hash}`);
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
console.log(data,"data")
    return (
        <div>

            {/* 用户质押信息*/}
            <div className="rounded-lg bg-[#0b0f1a] shadow-md p-4">

                {/* 用户质押信息内容*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-4 bg-gray-900 rounded-lg px-4 py-4">
                    {/* 第1项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <Wallet className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-200">Balance</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{balanceData ? Number(formatUnits(balanceData.value, 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>
                    {/* 第2项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <CircleDollarSign className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-200">Staked Amount</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{stakingBalanceData ? Number(formatUnits(stakingBalanceData, 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>
                    {/* 第3项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <HandCoins className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-200">Available Withdraw</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{withdrawAmountData?.['1'] ? Number(formatUnits(withdrawAmountData['1'], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>
                    {/* 第4项*/}
                    <div className="bg-[#0b0f1a] rounded-lg p-2 flex-1 flex items-center">
                        <div className="px-2 py-4">
                            <Lock className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-200">Unstaked Locking</span>
                            {isConnected ? <p className="mt-1 text-sm font-bold text-orange-400">{userData?.[2] ? Number(formatUnits(userData[2], 18)).toFixed(4) : '0.0000'} ETH</p> : <p className="mt-1 text-sm font-bold text-white">N/A</p>}
                        </div>
                    </div>
                </div>

                {/* 介绍信息*/}
                <div className="bg-red-600/37 rounded-md p-2 flex-1 flex items-center justify-center">
                    <span className="text font-bold text-gray-300">Unstake And Withdraw Your ETH</span>
                </div>

                {/* unstake操作栏*/}
                <div className="bg-gray-900 rounded-lg p-2 mt-4">
                    {/* unstake标题*/}
                    <div className="text-lg font-bold text-white p-2 flex items-center">
                        <p className="w-4 h-4 rounded-full bg-orange-800" />
                        <span className="ml-2">Unstake</span>
                    </div>
                    {/* unstake内容*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-900 rounded-lg p-2">
                        {/* 第1列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-4 flex flex-col">
                            <span className="text-sm font-bold text-gray-400">Amount To Unstake</span>
                            <div className="flex items-center rounded-md bg-gray-900 border border-gray-800 mt-2">
                                <input
                                    className="flex-1 h-10 text-xl text-orange-500 font-bold px-4 border-none"
                                    type="text"
                                    placeholder="0.0000"
                                    value={amount || ""}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <span className="px-3 text font-bold text-gray-400">ETH</span>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-gray-600">Available: {isConnected ? <span className="mt-1 text-sm">{stakingBalanceData ? Number(formatUnits(stakingBalanceData, 18)).toFixed(4) : '0.0000'} ETH</span> : <span className="mt-1 text-sm font-bold text-white">N/A</span>} </span>
                            </div>
                            <button className="w-full h-10 bg-orange-800 text-white font-bold rounded-md mt-4 cursor-pointer"
                                disabled={unstakingLoading}
                                onClick={handleUnstake}>{unstakingLoading ? 'Unstaking...' : 'Unstake'}</button>
                        </div>
                        {/* 第2列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-2 flex flex-col">
                            <div className="bg-orange-800/40 rounded-md p-2 flex items-center">
                                <Info className="w-4 h-4 text-orange-400 mx-2" />
                                <span className="text-sm font-bold text-gray-300">How Unstake Works?</span>
                            </div>
                            <div className="mt-2">
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-800/40" />
                                    <span className="ml-2">Unstake amount should not greater than staked amount.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-800/40" />
                                    <span className="ml-2">Unstaking amount will be locked for 3 blocks.</span>
                                </p>
                                {/* <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-800/40" />
                                    <span className="ml-2">Unstaked amount can be withdrawn after 10 blocks have been mined.</span>
                                </p> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* withdraw操作栏*/}
                <div className="bg-gray-900 rounded-lg p-2 mt-4">
                    {/* withdraw标题*/}
                    <div className="text-lg font-bold text-white p-2 flex items-center">
                        <p className="w-4 h-4 rounded-full bg-blue-800" />
                        <span className="ml-2">Withdraw</span>
                    </div>

                    {/* withdraw内容*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-900 rounded-lg p-2">
                        {/* 第1列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-4 flex flex-col">
                            <span className="text-sm font-bold text-gray-400">Ready To Withdraw</span>
                            <div className="flex items-center rounded-md bg-gray-900 border border-gray-800 mt-2">
                                <input
                                    className="flex-1 h-10 text-xl text-blue-500 font-bold px-4 border-none "
                                    type="text"
                                    placeholder="0.0000"
                                    value={withdrawAmountData?.['1'] ? Number(formatUnits(withdrawAmountData['1'], 18)).toFixed(4) : '0.0000'}
                                    disabled={true}
                                />
                                <span className="px-3 text font-bold text-gray-400">ETH</span>
                            </div>
                            <button className="w-full h-10 bg-blue-800 text-white font-bold rounded-md mt-4 cursor-pointer"
                                disabled={withdrawLoading}
                                onClick={handleWithdraw}>{withdrawLoading ? 'Withdrawing...' : 'Withdraw'}</button>
                        </div>
                        {/* 第2列*/}
                        <div className="bg-[#0b0f1a] rounded-lg p-2 flex flex-col">
                            <div className="bg-blue-800/40 rounded-md p-2 flex items-center">
                                <Info className="w-4 h-4 text-blue-400 mx-2" />
                                <span className="text-sm font-bold text-gray-300">How Withdraw Works?</span>
                            </div>
                            <div className="mt-2">
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-800/40" />
                                    <span className="ml-2">​​Available withdraw can be withdrawn all at once.</span>
                                </p>
                                <p className="flex items-center text-sm font-bold text-gray-400 p-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-800/40" />
                                    <span className="ml-2">The withdrawn ETH will be credited to your wallet.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}