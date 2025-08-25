import { cn } from '@/lib/utils';
import type { DashboardView } from '@/pages/Home';

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }: SidebarProps) {
  // 定义导航项 - 完整的农业气象预警与决策支持系统导航
  const navItems = [
    { view: 'overview' as DashboardView, label: '总览', icon: 'fa-tachometer-alt', description: '系统整体概览与核心数据展示' },
    { view: 'climate-resilience' as DashboardView, label: '气候韧性评估', icon: 'fa-shield-alt', description: '评估农业系统对气候变化的适应能力' },
    { view: 'weather-monitoring' as DashboardView, label: '气象数据监测', icon: 'fa-cloud-meatball', description: '实时监测温度、湿度、降水等气象要素' },
    { view: 'alert-publishing' as DashboardView, label: '预警信息发布', icon: 'fa-bell', description: '及时发布各类气象灾害预警信息' },
    { view: 'alert-history' as DashboardView, label: '历史预警查询', icon: 'fa-history', description: '查询与分析历史预警记录数据' },
    { view: 'decision' as DashboardView, label: '决策方案生成', icon: 'fa-lightbulb', description: '基于气象数据自动生成应对决策方案' },
    { view: 'risk-assessment' as DashboardView, label: '灾害风险评估', icon: 'fa-exclamation-triangle', description: '评估不同区域灾害风险等级与影响范围' },
    { view: 'weather-model' as DashboardView, label: '气象模型分析', icon: 'fa-chart-line', description: '高级气象模型数据分析与预测' },
    { view: 'agri-info' as DashboardView, label: '农业信息管理', icon: 'fa-database', description: '管理农业生产相关基础信息数据' },
    { view: 'statistics' as DashboardView, label: '数据统计报表', icon: 'fa-file-excel', description: '生成各类数据统计分析报表' },
    { view: 'feedback' as DashboardView, label: '用户反馈建议', icon: 'fa-comment-dots', description: '提交系统使用反馈与功能改进建议' },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col shadow-sm`}>
      {/* 品牌标识 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <i className="fa-solid fa-leaf text-green-600 text-xl"></i>
          {!collapsed && <span className="ml-2 font-bold text-green-800 text-lg">智慧农业助手</span>}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${collapsed ? 'hidden' : 'block'}`}
        >
          <i className="fa-solid fa-angle-left text-gray-500"></i>
        </button>
      </div>
      
      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.view} className="mb-1">
              <button
                onClick={() => setActiveView(item.view)}
                className={cn(
                  `flex items-center w-full px-4 py-3 transition-all duration-200`,
                  activeView === item.view 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <i className={`fa-solid ${item.icon} text-lg ${collapsed ? 'mx-auto' : ''}`}></i>
                {!collapsed && (
                  <>
                    <span className="ml-3 font-medium">{item.label}</span>
                    {activeView === item.view && (
                      <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        活跃
                      </span>
                    )}
                  </>
                )}
              </button>
              {!collapsed && activeView === item.view && (
                <p className="text-xs text-gray-500 px-4 pb-3">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* 用户信息 */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full">
              <i className="fa-solid fa-user text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">农场管理员</p>
              <p className="text-xs text-gray-500">查看个人资料</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}