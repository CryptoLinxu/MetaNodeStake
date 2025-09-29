'use client'

import { useSwitchAccount } from "wagmi"

export default function WagmiRSwitchAccount() {
    const { connectors, switchAccount } = useSwitchAccount()
    
    return(
        <div className="w-full">
            <h1 className="text-lg font-bold">Wagmi Switch Account</h1>
            <div className="mt-2 p-2 border rounded ">
                {/* <p><b>Address:</b> {address}</p>
                <p><b>Is Connected:</b> {isConnected.toString()}</p>
                <p><b>Chain:</b> {chain?.name}</p>
                <p><b>ChainId:</b> {chain?.id}</p> */}
            </div>
        </div>
    )
}