// 'use client'

// export default function WagmiSignAndVerify() {
//     return(
//         <div>
//             <h1 className="text-lg font-bold">Wagmi Signature & Verification</h1>
//             <div className="mt-2 p-2 border rounded bg-gray-100">
              
//             </div>
//         </div>
//     )
// }

'use client';

import React, { useState } from 'react';
import { useSignMessage, useVerifyMessage, useAccount } from 'wagmi';

export default function WagmiSignAndVerify() {
  const [message, setMessage] = useState('Hello, Web3!');
  const [signature, setSignature] = useState<string>('');
  const { address } = useAccount();

  // 使用 useSignMessage 进行消息签名
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  // 使用 useVerifyMessage 进行签名验证
  const { data: verificationResult, error: verificationError, refetch: verifyMessage } = useVerifyMessage({
    address: address as `0x${string}`,
    message,
    signature: signature as `0x${string}`,
    query: {
      enabled: false, // 初始时不执行验证
    }
  });

  // 处理消息签名
  const handleSign = async () => {
    if (!message) return;
    try {
      const sig = await signMessageAsync({ message });
      setSignature(sig);
    } catch (error) {
      console.error('签名失败:', error);
    }
  };

  // 处理签名验证
  const handleVerify = async () => {
    if (!signature || !message || !address) return;
    
    // 调用 refetch 函数执行验证
    const { data } = await verifyMessage();
    console.log('验证结果:', data);
  };

  // 清空状态
  const handleReset = () => {
    setSignature('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-lg font-bold">Wagmi Signature & Verification</h1>
      
      {/* 消息输入 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md resize-none"
          rows={3}
          placeholder="Message here ..."
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={handleSign}
          disabled={!message || isSigning || !address}
          className="flex-1 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md disabled:bg-gray-400"
        >
          {isSigning ? 'Signing...' : 'Sign'} 
        </button>
        
        <button
          onClick={handleVerify}
          disabled={!signature || !address}
          className="flex-1 px-4 py-2 bg-green-600 text-white cursor-pointer rounded-md disabled:bg-gray-400"
        >
          Verify
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Reset
        </button>
      </div>

      {/* 签名结果显示 */}
      {signature && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Signature:</h3>
          <p className="text-sm break-all font-mono bg-white p-2 rounded">
            {signature}
          </p>
        </div>
      )}

      {/* 验证结果显示 */}
      {verificationResult !== undefined && (
        <div className={`p-4 rounded-md ${
          verificationResult 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <h3 className="font-medium mb-2">Verify Result:</h3>
          <p>{verificationResult ? '✅ Verify Success' : '❌ Verify Failed'}</p>
          {verificationError && (
            <p className="text-sm mt-1">Error: {verificationError.message}</p>
          )}
        </div>
      )}

      {/* 状态信息 */}
      <div className="text-sm text-gray-600 space-y-2">
        <p>Address: {address || '未连接钱包'}</p>
        {/* <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">使用说明:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>1. 输入要签名的消息</li>
            <li>2. 点击"签名消息"生成签名</li>
            <li>3. 点击"验证签名"验证有效性</li>
            <li>4. 签名不会消耗 Gas 费用</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
