/*
 * @Description: 项目介绍
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-26 12:46:37
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-26 23:18:52
 */
export default function About() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">质押项目说明</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. 项目介绍</h2>
                <p className="mb-4">
                    这是一个ETH和ERC20代币质押生息的项目，包含以下操作：质押(stake)、取消质押(unstake)、提取(withdraw)、领取奖励(claim)。主要业务有：
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>质押(stake)</strong>: 质押ETH或ERC20代币</li>
                    <li><strong>取消质押(unstake)</strong>: 取消质押</li>
                    <li><strong>提取(withdraw)</strong>: 提取质押的ETH或ERC20代币</li>
                    <li><strong>领取奖励(claim)</strong>: 领取质押奖励</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. 技术栈</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Next.js 15</li>
                    <li>Wagmi</li>
                    <li>Ethers.js V6</li>
                    <li>RainbowKit</li>
                    <li>Hardhat</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. 业务需求</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        使用RainbowKit实现hardhat本地节点连接
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        使用RainbowKit实现钱包连接前后Header组件开发，展示钱包连接按钮及连接后的钱包信息
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        <div className="flex flex-col">
                            使用Wagmi查询链上数据
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>获取hardhat链信息</li>
                                <li>获取hardhat链上当前账户信息</li>
                            </ul>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        <div className="flex flex-col">
                            使用Wagmi实现MetaNode合约读取信息
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>获取MetaNodeToken的基本信息</li>
                                <li>查询某个用户地址的余额</li>
                            </ul>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        <div className="flex flex-col">
                            使用Wagmi实现MetaNodeStake合约读写操作
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>stake: 质押ETH或ERC20代币</li>
                                <li>unstake: 取消质押(执行unstake操作后，需经过10个区块才能提取)</li>
                                <li>withdraw: 提取质押的ETH或ERC20代币</li>
                                <li>claim: 领取质押奖励</li>
                            </ul>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✅</span>
                        <div className="flex flex-col">
                            使用Wagmi实现合约事件监听
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>监听Stake事件</li>
                                <li>监听Unstake事件</li>
                                <li>监听Withdraw事件</li>
                                <li>监听Claim事件</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. 安装依赖</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                    <code className="text-sm">
                        npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query ethers
                    </code>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. 运行项目</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                    <code className="text-sm">npm run dev</code>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">6. 注意事项</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>执行unstake操作后，需经过10个区块才能提取</li>
                    <li>执行unstake操作后，执行withdrawAmount操作，可以发现<code>requestAmount</code>是unstake操作的请求解压金额</li>
                    <li><code>requestAmount</code>后，还有<code>pendingWithdrawAmount</code>，表示已经经过了unstake操作后10个区块，可以立即提取的金额</li>
                    <li><strong>锁定金额</strong>: 表示已经unstake了，但还未达到10个区块，计算公式: <code>LockAmount = requestAmount - pendingWithdrawAmount</code></li>
                </ul>
            </section>
        </div>
    );
}