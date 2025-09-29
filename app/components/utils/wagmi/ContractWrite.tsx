/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-18 11:48:32
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 15:18:08
 */
'use client'
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"

export default function WagmiWriteContract() {

    // WETH在Sepolia上的合约地址
    const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS;
    const {address} = useAccount();
    const [amount, setAmount] = useState('0.00001');
    const [recipient, setRecipient] = useState('');


    // WETH ABI (只包含我们需要的方法)
    const WETH_ABI = [
        {
            constant: false,
            inputs: [],
            name: 'deposit',
            outputs: [],
            payable: true,
            stateMutability: 'payable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                { name: 'recipient', type: 'address' },
                { name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ] as const;

    // 1. 使用 useWriteContract 进行 WETH deposit
    const {data: depositData, isPending: isDepositPending, writeContract: deposit} = useWriteContract();

    // 2. 使用useWaitForTransactionReceipt 进行 WETH deposit 交易确认
    const {isLoading: isDepositConfirming, isSuccess: isDepositConfirmSuccess} = useWaitForTransactionReceipt({
        hash: depositData
    });

    // 3. 使用 useWriteContract 进行 WETH transfer
    const {data: transferData, isPending: isTransferPending, writeContract: transfer} = useWriteContract();

    // 4. 使用useWaitForTransactionReceipt 进行WETH transfer 交易确认
    const {isLoading: isTransferConfirming, isSuccess: isTransferConfirmed} = useWaitForTransactionReceipt({
        hash: transferData
    });

    // 处理实际deposit函数
    const handleDeposit = () => {
        if(!amount) return;
        deposit({
            address: WETH_ADDRESS as `0x${string}`,
            abi: WETH_ABI,
            functionName: 'deposit',
            value: parseEther(amount)
        })
    };

    // 处理实际transfer函数
    const handleTransfer = () => {
        if(!recipient || !amount) return;
        transfer({
            address: WETH_ADDRESS as `0x${string}`,
            abi: WETH_ABI,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, parseEther(amount)]
        })
    }

    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Write Contract</h1>
            
            <div className="mt-2 p-2 border rounded border-gray-500 mb-6">
                <div className="mb-2">
                    <p><b>Address: </b>{address}</p>
                    <p><b>WETH Address: </b> {WETH_ADDRESS}</p>
                </div>

                {/* <h3 className="text-lg font-medium">Input</h3> */}
                <input type="text" value={recipient} placeholder="recipient address here ..." onChange={(e) => setRecipient(e.target.value)} className="bg-white w-full p-2 border border-gray-300 rounded-md mb-3"/>
                <input type="text" value={amount} placeholder="amount in ether ..." onChange={(e) => setAmount(e.target.value)} className="bg-white w-full p-2 border border-gray-300 rounded-md mb-3"/>
            </div>
            <div className="flex justify-between">
                {/* WETH Deposit 操作 */}
                <button disabled={!amount || isDepositPending} className="w-full px-4 py-2 bg-blue-600 text-white rounded cursor-pointer" onClick={handleDeposit}>
                    {isDepositPending ? 'Depositing...' : `Deposit ${amount} ETH`}
                </button>
                {isDepositConfirming && <div className="text-sm text-green-500">Depositing...</div>}
                {isDepositConfirmSuccess && <div className="text-sm text-green-500">Deposit Confirmed</div>}
                {/* WETH Transfer 操作 */}
                <button disabled={!recipient || !amount || isTransferPending} className="w-full px-4 py-2 bg-green-600 text-white rounded cursor-pointer" onClick={handleTransfer}>
                    {isTransferPending ? 'Transferring...' : `Transfer ${amount} WETH`} 
                </button>
                {isTransferConfirming && <div className="text-sm text-green-500">Transferring...</div>}
                {isTransferConfirmed && <div className="text-sm text-green-500">Transfer Confirmed</div>}
            </div>
        </div>
    )
}