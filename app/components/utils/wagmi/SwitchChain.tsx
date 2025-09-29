'use client'

import { useChainId, useSwitchChain } from "wagmi"

export default function WagmiWSwitchChain() {
    const { chains, switchChain } = useSwitchChain();
    const chainId = useChainId();

    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Switch Chain</h1>
            <div className="mt-2 pr-2">
                {chains.filter(v => v?.id !== chainId).map(chain => (
                    <button className="w-1/4 px-4 py-2 mr-4 mt-4 bg-green-600 text-white rounded cursor-pointer" key={chain.id} onClick={() => switchChain({chainId: chain.id})}>{chain.name}</button>
                ))}
            </div>
        </div>
    )
}