/*
 * @Description: 
 * @Author: linxu devinlin9679@gmail.com
 * @Date: 2025-09-17 23:00:21
 * @LastEditors: linxu devinlin9679@gmail.com
 * @LastEditTime: 2025-09-18 08:46:48
 */
// components/CenteredBox.tsx
interface CenteredBoxProps {
  children: React.ReactNode; // 自定义内容
  className?: string; // 可选，用于扩展样式
}

export default function CenteredBox({ children, className = '' }: CenteredBoxProps) {
  return (
      <div className={`bg-white rounded-lg shadow-md p-6 flex items-center justify-center ${className}`}>
        {children}
      </div>
  );
}