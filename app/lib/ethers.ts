/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-19 08:57:50
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-19 09:13:56
 */
'use client';
import { ethers } from 'ethers';

export type EthersContext = {
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
}

let cachedProvider: ethers.BrowserProvider | null = null;
let cachedSigner: ethers.JsonRpcSigner | null = null;

export async function getBrowserProvider(): Promise<ethers.BrowserProvider | null> {
    if(typeof window === 'undefined') {
        throw new Error('Must be run in browser');
    }
    if(!cachedProvider) {
        if(!(window as any).ethereum) throw new Error('No injected Ethereum provider found');
        cachedProvider = new ethers.BrowserProvider((window as any).ethereum);
    }
    return cachedProvider;
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
    if(typeof window === 'undefined') {
        throw new Error('Must be run in browser');
    }
    if(!cachedSigner) {
        const provider = await getBrowserProvider();
        if(!provider) throw new Error('No provider found');
        cachedSigner = await provider.getSigner();
    }
    return cachedSigner;
}

export async function requestAccount(): Promise<string[]> {
    if(typeof window === 'undefined') {
        throw new Error('Must be run in browser');
    } 
    if(!(window as any).ethereum) throw new Error('No injected Ethereum provider found');
    return await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
}