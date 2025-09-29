'use client'
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"


export default function WagmiSendTransaction() {
    // WETH在Sepolia上的合约地址
    const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS;
    const {address} = useAccount();
    const [amount, setAmount] = useState('0.00001');
    const [recipient, setRecipient] = useState('');

    // 使用useSendTransaction 进行原生ETH交易
    const {sendTransaction, data: sendTransactionData, isPending: isSendTransactionPending} = useSendTransaction();

    // 使用useWaitForTransactionReceipt 进行原生ETH交易确认
    const { isLoading: isSendTxConfirming, isSuccess: isSendTxConfirmed } = useWaitForTransactionReceipt({
        hash: sendTransactionData
    });

    // 实现Send ETH 操作
    const handleSendTx = () => {
        sendTransaction({
            to: recipient as `0x${string}`,
            value: parseEther(amount)
        })
    }

    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Send Transaction</h1>
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
                {/* Send ETH 操作 */}
                <button disabled={!amount || isSendTransactionPending} className="px-4 py-2 bg-blue-600 w-full text-white rounded cursor-pointer" onClick={handleSendTx}>
                    {isSendTransactionPending ? 'SendingTx...' : `Send ${amount} ETH`}
                </button>
                {isSendTxConfirming && <div className="text-sm text-green-500">Waiting For Confirming...</div>}
                {isSendTxConfirmed && <div className="text-sm text-green-500">SendTx Confirmed</div>}
            </div>
        </div>
    )
}