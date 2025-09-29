/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-18 08:59:58
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 15:09:25
 */
'use client'

import { useAccount, useBalance, useBlockNumber } from "wagmi";

export default function WagmiGetChainData() {
    const { address, isConnected, chain } = useAccount();
    const { data: balanceData, isLoading: balanceLoading, isError: balanceError } = useBalance({
        address: address,
        chainId: chain?.id || 11155111, // Sepolia网络ID
    });
    const { data: blockNumberData, isLoading: blockLoading, isError: blockError } = useBlockNumber({
        chainId: chain?.id || 11155111, // Sepolia网络ID
        watch: true, // 实时监听区块号变化
    });

    console.log('balanceData', balanceData);

    if(!isConnected) {
        return (
            <div>
                <h1 className="text-lg font-bold">Get Chain Data</h1>
                <p>Please connect your wallet to see chain data!</p>
            </div>
        )
    }
    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Get Data On Chain</h1>
            <div className="mt-2 p-2 border rounded border-gray-500">
                <p><b>Address:</b> {address}</p>
                <p><b>Chain:</b> {chain?.name}</p>
                <p><b>ChainId:</b> {chain?.id}</p>
                <p><b>Latest Block Number:</b> {blockNumberData}</p>
                <br />
                <p><b>Symbol:</b> {balanceData?.symbol.toString()}</p>
                <p><b>Balance:</b> {balanceData?.formatted.toString()}<span className="pl-2">{balanceData?.symbol}</span></p>
                {balanceLoading && <p>Loading balance...</p>}
                {balanceError && <p className="text-red-500">Error fetching balance</p>}
            </div>
        </div>
    )
}