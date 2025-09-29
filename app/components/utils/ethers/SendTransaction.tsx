/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-19 13:50:54
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 14:13:14
 */
'use client'

import { useState } from "react";
import { ethers } from "ethers";
import { getSigner, requestAccount } from "@/app/lib/ethers";

export default function EthersSendTransaction() {
    const [to, setTo] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function sendTransaction() {
        const accounts = await requestAccount();
        if (accounts.length === 0) {
            alert('No account found. Please connect your wallet.');
            return;
        }
        const signer = await getSigner();
        if (!signer) {
            alert('No signer found. Please connect your wallet.');
            return;
        }
        // 注意用法
        const balance = await signer.provider.getBalance(accounts[0]);
        if(balance < ethers.parseEther(amount)){
            alert('Insufficient balance');
            return;
        }
        setIsLoading(true);
        try {
            const tx = await signer.sendTransaction({
                to,
                value: ethers.parseEther(amount)
            });
            setTxHash(tx.hash)
            await tx.wait(1);
            setIsLoading(false);
            alert('Transaction confirmed');
        } catch (error) {
            console.error('Error sending transaction:', error);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Ethers Send Transaction</h1>
            <div className="mt-4">
                <input className="w-full p-2 border border-gray-300 rounded-md" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient Address"/>
            </div>
            <div className="mt-4">
                <input className="w-full p-2 border border-gray-300 rounded-md" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ETH"/>
            </div>
            <div className="mt-4">
                <button className="w-full p-2 bg-green-600 text-white rounded-md cursor-pointer" onClick={sendTransaction} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Transaction'}
                </button>
            </div>
            {txHash && (
                <div className="mt-4">
                    <p className="text-gray-600 text-sm"><b>Transaction Hash:</b> {txHash}</p>
                </div>
            )}
        </div>
    )
}