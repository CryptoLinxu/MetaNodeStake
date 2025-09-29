/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-15 19:15:12
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-27 12:42:03
 */

import ContractInfo from "./components/Info/ContractInfo";
import PoolInfo from "./components/Info/PoolInfo";
import UserInfo from "./components/Info/UserInfo";


export default function Home() {
  return (
    <div className="bg-[#0b0f1a] min-h-[calc(100vh-4rem)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="p-4 bg-gray-800 shadow-md rounded-lg">
                <UserInfo />
            </div>  
            <div className="p-4 bg-gray-800 shadow-md rounded-lg mt-4">
                <ContractInfo />
                <PoolInfo />
            </div>
        </div>
    </div>
  );
}
