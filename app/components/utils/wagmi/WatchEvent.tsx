/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-18 11:53:24
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 18:30:32
 */
'use client'
import { useWatchContractEvent } from "wagmi"
import { erc20Abi, formatUnits } from "viem"
import { useState } from "react"

interface transferLog {
    from: `0x${string}` | undefined,
    to: `0x${string}` | undefined,
    value: bigint | undefined,
    txHash: `0x${string}`,
}

export default function WagmiWatchEvent() {
    const [transferLogs, setTransferLogs] = useState<transferLog[]>([]);
    const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS;

    useWatchContractEvent({
        address: WETH_ADDRESS as `0x$(string)`,
        abi: erc20Abi,
        eventName: 'Transfer',
        onLogs: (logs) => {
            const newTransfers: transferLog[] = logs.map(log => ({
                from: log.args.from as `0x${string}`,
                to: log.args.to as `0x${string}`,
                value: log.args.value ? BigInt(log.args.value) : undefined,
                txHash: log.transactionHash as `0x${string}`
            }))

            setTransferLogs(prev => [...newTransfers, ...prev].slice(0, 3));
        }
    });

    // 格式化地址显示
    const formatAddress = (addr: string) => {
        return `${addr.slice(0,6)}...${addr.slice(-4)}`
    }

    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Watch Contract Event</h1>
            <div className="mt-2 p-2 border rounded order-gray-500 overflow-auto">
                <div className="mb-2">
                    <p><b>Watch Event Address: </b>{WETH_ADDRESS}</p>
                </div>

                {transferLogs.length === 0 ? (
                    <p className="text-gray-500 text-center">Waiting For Event...</p>
                ) : (
                    transferLogs.map((transfer, idx) => (
                        <div key={idx} className="p-2 m-1 border rounded-lg bg-green-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    <b>From:</b> {transfer.from && formatAddress(transfer.from)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    <b>To:</b> { transfer.to && formatAddress(transfer.to)}
                                </span>
                                <span className="text-center font-bold text-blue-600">
                                    {transfer.value && formatUnits(transfer.value, 18)} WETH
                                </span>
                            </div>
                            <div className="text-xs text-gray-800 mt-1">
                                <b>TxHash: </b>{transfer.txHash}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
