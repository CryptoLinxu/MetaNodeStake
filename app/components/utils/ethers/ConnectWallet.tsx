/*
 * @Description: ethers连接钱包组件
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-19 09:25:39
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 13:48:00
 */
'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getBrowserProvider, requestAccount } from "@/app/lib/ethers";

export default function EthersWalletConnect() {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    async function connect() {
        try {
            const accounts = await requestAccount();
            accounts.length > 0 && setAddress(accounts[0]);
            const provider = await getBrowserProvider();
            const network = await provider?.getNetwork();
            setChainId(network?.chainId ? Number(network.chainId) : null);
            const balance = await provider?.getBalance(accounts[0]);
            setBalance(balance ? ethers.formatEther(balance): null)
            // 监听账户变化
            const eth = (window as any).ethereum;
            if(eth && eth.on) {
                eth.on('accountChanged', handleAccountsChanged);
                eth.on('chainChanged', handleChainChanged);
            } 
        }catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    }

    function handleAccountsChanged(accounts: string[]) {
        if (accounts.length === 0) {
            // 用户断开连接
            setAddress(null);
            setChainId(null);
            setBalance(null);
        } else {
            setAddress(accounts[0]);
            // 刷新余额
            refreshBalance();
        }
    }

    async function refreshBalance() {
        if (address) {
            const provider = await getBrowserProvider();
            const balance = await provider?.getBalance(address);
            setBalance(balance ? ethers.formatEther(balance): null)
        }
    }

    function handleChainChanged(chainId: string) {
        setChainId(Number(chainId));
        // 刷新余额
        refreshBalance();   
    }

    useEffect(() => {
        return () => {
            const eth = (window as any).ethereum;
            if(eth && eth.removeListener) {
                eth.removeListener('accountChanged', handleAccountsChanged);
                eth.removeListener('chainChanged', handleChainChanged);
            } 
        }
    }, []);

    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Ethers Connected</h1>
            <div className="mt-2 p-2 w-full">
                <p><b>Address:</b> {address}  {address && <button className="mt-2 px-2 text-white bg-green-600 border border-green-600 text-sm rounded cursor-pointer" onClick={() => { navigator.clipboard.writeText(address); }}>Copy</button>}</p>
                <p><b>ChainId:</b> {chainId}</p>
                <p><b>Balance:</b> {balance}</p>
            </div>
            <button className="w-full px-2 py-2 mt-4 bg-green-600 text-white rounded cursor-pointer" onClick={() => connect()}>Connect</button>
        </div>
    )
}