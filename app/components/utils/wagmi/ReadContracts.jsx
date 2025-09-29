/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-18 09:17:04
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-18 22:56:00
 */
'use client'

import { useReadContracts, useAccount } from "wagmi";
import { erc20Abi } from "viem";

export default function WagmiReadContracts() {
    const ERC20_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS;
    const { address } = useAccount();
    
    // 一次性读取同一个合约的多个方法
    const {data, isLoading } = useReadContracts({
        contracts: [
            {
                address: ERC20_TOKEN_ADDRESS,
                abi: erc20Abi,
                functionName: "name"
            },{
                address: ERC20_TOKEN_ADDRESS,
                abi: erc20Abi,
                functionName: "symbol"
            },{
                address: ERC20_TOKEN_ADDRESS,
                abi: erc20Abi,
                functionName: "totalSupply"
            },{
                address: ERC20_TOKEN_ADDRESS,
                abi: erc20Abi,
                functionName: "decimals"
            },{
                address: ERC20_TOKEN_ADDRESS,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address],
                query: { enabled: !!address },
            }
        ]
    })

    const [name, symbol, totalSupply, decimals, balance] = data?.map((item) => item.result) ?? [];


    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Read Contracts</h1>
            <div className="mt-2 p-2 border rounded border-gray-500">
                <p><b>Name:</b> {isLoading ? "Loading..." : name}</p>
                <p><b>Symbol:</b> {isLoading ? "Loading..." : symbol}</p>
                <p><b>Decimals:</b> {isLoading? "Loading..." : decimals}</p>
                <p><b>Total Supply:</b> {isLoading ? "Loading" : totalSupply}</p>
                <p><b>Account:</b> {address ? address : "Loading"}</p>
                <p><b>Balance:</b> {isLoading ? "Loading..." : balance}</p>
            </div>
        </div>
    )
}