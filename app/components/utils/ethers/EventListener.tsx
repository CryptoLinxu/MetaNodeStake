'use client'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getBrowserProvider } from "@/app/lib/ethers";
import { erc20Abi } from "viem";

export default function EthersEventListener() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isListening, setIsListening] = useState<boolean>(false);

    const EVENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS!; 

    // 格式化地址显示
    const formatAddress = (addr: string) => {
        return `${addr.slice(0,6)}...${addr.slice(-4)}`
    }

    useEffect(() => {
        let contract: ethers.Contract | null = null;
        async function startListening() {
            const provider = await getBrowserProvider();
            if (!provider) {
                console.error('No provider found. Please connect your wallet.');
                return;
            }
            contract = new ethers.Contract(EVENT_CONTRACT_ADDRESS, erc20Abi, provider);
            contract.on('Transfer', (from, to, value) => {
                setLogs(prev => [...prev, `Transfer: ${formatAddress(from)} --> ${formatAddress(to)} (${ethers.formatEther(value)})`].slice(0, 5));
            });
            setIsListening(true);
        }
        startListening();
        return () => {
            if(contract) {
                contract.removeAllListeners('Transfer');
                setIsListening(false);
            }
        }
    }, []);

    return (
        <div className="w-full">
            <h1 className="text-lg font-bold">Ethers Event Listener</h1>
            <div className="mt-2">
                <p><b>Listening:</b> {isListening ? 'Yes' : 'No'}</p>
            </div>
            <div className="mt-4  max-h-48 overflow-auto">
                {logs.length === 0 ? <p className="text-gray-500"><b>No logs</b></p> 
                : logs.map((log, index) => <div className="p-2 m-2 rounded-lg bg-green-100" key={index}>{index+1}: {log}</div>)}
            </div>
        </div>
    );
}