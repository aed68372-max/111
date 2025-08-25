import { cn } from '@/lib/utils';
import type { DashboardView } from '@/pages/Home';

interface NavigationTabsProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

export function NavigationTabs({ activeView, setActiveView }: NavigationTabsProps) {
  // 定义导航项
  const navItems = [
    { view: 'overview' as DashboardView, label: '总览', icon: 'fa-tachometer-alt' },
    { view: 'crops' as DashboardView, label: '作物', icon: 'fa-seedling' },
    { view: 'environment' as DashboardView, label: '环境', icon: 'fa-cloud-sun-rain' },
    { view: 'activities' as DashboardView, label: '活动', icon: 'fa-calendar-check' },
    { view: 'climate' as DashboardView, label: '气候韧性', icon: 'fa-wind' },
  ];

  return (
    <div className="border-t border-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                'flex flex-col items-center py-3 px-2 text-sm font-medium transition-all duration-200',
                activeView === item.view 
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-green-500'
              )}
            >
              <i className={`fa-solid ${item.icon} text-lg mb-1`}></i>
              <span>{item.label}</span>
              {activeView === item.view && (
                <span className="w-1/2 h-0.5 bg-green-600 rounded-full mt-1"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}