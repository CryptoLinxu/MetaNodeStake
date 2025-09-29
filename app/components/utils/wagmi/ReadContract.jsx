/*
 * @Description: 读取已部署ERC20合约信息
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-18 09:17:04
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-18 12:45:43
 */
'use client'

import { useReadContract, useAccount } from "wagmi";
import { erc20Abi } from "viem";

export default function WagmiReadContract() {
    const ERC20_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WETH_SEPOLIA_ADDRESS;
    const { address } = useAccount();
    
    const {data: name, isLoading: isLoadingName } = useReadContract({
        address: ERC20_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "name"
    })

    const {data: symbol, isLoading: isLoadingSymbol } = useReadContract({
        address: ERC20_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "symbol"
    })

    const {data: decimals, isLoading: isLoadingDecimals } = useReadContract({
        address: ERC20_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "decimals"
    })

    const {data: totalSupply, isLoading: isLoadingTotalSupply } = useReadContract({
        address: ERC20_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "totalSupply"
    })

    const {data: balance, isLoading } = useReadContract({
        address: ERC20_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
        query: { enabled: !!address },
    })

    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Read Contract</h1>
            <div className="mt-2 p-2 border rounded border-gray-500">
                <p><b>Name:</b> {isLoadingName ? "Loading..." : name}</p>
                <p><b>Symbol:</b> {isLoadingSymbol ? "Loading..." : symbol}</p>
                <p><b>Decimals:</b> {isLoadingDecimals? "Loading..." : decimals}</p>
                <p><b>Total Supply:</b> {isLoadingTotalSupply ? "Loading" : totalSupply}</p>
                <p><b>Account:</b> {address ? address : "Loading"}</p>
                <p><b>Balance:</b> {isLoading ? "Loading..." : balance}</p>
            </div>
        </div>
    )
}