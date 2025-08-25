import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  onClick?: () => void;
}

export function DashboardCard({ title, value, icon, trend, color, onClick }: DashboardCardProps) {
  // 确定趋势图标和颜色
  const getTrendIndicator = () => {
    switch (trend) {
      case 'up':
        return <i className="fa-solid fa-arrow-up text-green-500"></i>;
      case 'down':
        return <i className="fa-solid fa-arrow-down text-red-500"></i>;
      case 'stable':
        return <i className="fa-solid fa-minus text-gray-400"></i>;
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all duration-300 ${
        onClick ? 'hover:shadow-md hover:border-green-200 hover:-translate-y-1 cursor-pointer group' : 'hover:shadow-md'
      } overflow-hidden relative`}
      onClick={onClick}
    >
      {/* 背景动画效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800 group-hover:text-green-600 transition-colors duration-300">{value}</h3>
          <div className="flex items-center mt-2 text-xs">
            {getTrendIndicator()}
            <span className={cn(
              "ml-1 font-medium",
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 'text-gray-400'
            )}>
              {trend === 'up' ? '增长中' : trend === 'down' ? '下降中' : '稳定'}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <i className={`fa-solid ${icon} text-lg`} style={{ color }}></i>
        </div>
      </div>
      
      {onClick && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
          <i className="fa-solid fa-arrow-right text-green-500"></i>
        </div>
      )}
      
      {/* 底部进度条动画 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 overflow-hidden">
        <div className="h-full bg-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700"></div>
      </div>
    </div>
  );
}