/*
 * @Description: ethers读取合约组件
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-19 10:42:59
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 14:08:14
 */
'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getBrowserProvider } from "@/app/lib/ethers";
import { erc20Abi } from "viem";

export default function EthersReadContract() {
    const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS!;
    const [decimals, setDecimals] = useState<number | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [totalSupply, setTotalSupply] = useState<string | null>(null);
    const [address, setAddress] = useState<string>('');
    const [balance, setBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const provider = await getBrowserProvider();
                const contract = new ethers.Contract(WETH_ADDRESS, erc20Abi, provider!);
                const [_decimals, _symbol, _name, _totalSupply] = await Promise.all([
                    contract.decimals(),
                    contract.symbol(),
                    contract.name(),
                    contract.totalSupply(),
                ]);
                setDecimals(_decimals);
                setSymbol(_symbol);
                setName(_name);
                setTotalSupply(_totalSupply ? ethers.formatEther(_totalSupply) : null);
                console.log('Ethers Read Contract');
            } catch (error) {
                console.error('Error fetching contract data:', error);
            }
        };
        fetchContractData();    
    }, [WETH_ADDRESS]);


    async function queryBalance() {
        if (!address) return;
        try {
            setIsLoading(true);
            const provider = await getBrowserProvider();
            const contract = new ethers.Contract(WETH_ADDRESS, erc20Abi, provider!);
            const _balance = await contract.balanceOf(address);
            setBalance(_balance ? ethers.formatEther(_balance) : null);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Ethers Read Contract</h1>
            <div className="mt-4">
                <p><b>Name:</b> {name} {symbol}</p>
                <p><b>Decimals:</b> {decimals}</p>
                <p><b>Total Supply:</b> {totalSupply}</p>
                <p><b>Address:</b> {address}</p>
            </div>
            
            {balance !== null && <div className="mt-2"><b>Balance:</b> {isLoading ? 'Loading...' : `${balance} ${symbol}`}</div>}

            <div className="mt-4">
                <input className="w-full p-2 border border-gray-300 rounded-md" placeholder="Address to query" value={address} onChange={(e)=>setAddress(e.target.value)} />
            </div>  
            <div className="mt-4">
                <button className="w-full px-4 py-2 border rounded bg-green-600 text-white cursor-pointer" onClick={queryBalance}>Get Balance</button>
            </div>            
        </div>
    )
}