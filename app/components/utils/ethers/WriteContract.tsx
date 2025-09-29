'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getSigner, requestAccount } from "@/app/lib/ethers";
import { erc20Abi } from "viem";

export default function EthersWriteContract() {
    const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS!;
    const [to, setTo] = useState<string>('');
    const [amount, setAmount] = useState<string>('0.000000001');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function sendTransaction() {
        if (!to || !amount) return;
        try {
            await requestAccount();
            setIsLoading(true);
            const signer = await getSigner();
            const contract = new ethers.Contract(WETH_ADDRESS, erc20Abi, signer!);
            // 判断balance与amount是否足够
            const balance = await contract.balanceOf(await signer!.getAddress())
            if(balance < ethers.parseEther(amount)) {
                alert('Insufficient balance');
                setIsLoading(false);
                return;
            }
            const tx = await contract.transfer(to, ethers.parseEther(amount));
            setTxHash(tx.hash);
            await tx.wait(1);
            setIsLoading(false);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Ethers Write Contract</h1>
            <div className="mt-4">
                <input className="w-full p-2 border border-gray-300 rounded-md" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient Address"/>
                <input className="w-full p-2 border border-gray-300 rounded-md mt-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ETH"/>
                <button className="w-full mt-4 p-2 bg-green-600 text-white rounded cursor-pointer" onClick={sendTransaction} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Transaction"}
                </button>
                {txHash && <p className="mt-2 text-sm text-gray-600"><b>Transaction Hash:</b>{txHash ? txHash : 'N/A'}</p>}
            </div>        
        </div>
    )

}