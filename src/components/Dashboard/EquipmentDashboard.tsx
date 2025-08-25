import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Progress 
} from 'recharts';

// 设备数据
const equipmentData = [
  { 
    id: 1, 
    name: '智能灌溉系统', 
    status: 'online', 
    location: 'A区', 
    battery: 85,
    lastActive: '刚刚',
    alerts: 0,
    type: 'irrigation'
  },
  { 
    id: 2, 
    name: '环境监测站', 
    status: 'online', 
    location: 'B区', 
    battery: 92,
    lastActive: '5分钟前',
    alerts: 0,
    type: 'monitoring'
  },
  { 
    id: 3, 
    name: '土壤传感器', 
    status: 'warning', 
    location: 'C区', 
    battery: 15,
    lastActive: '1小时前',
    alerts: 1,
    type: 'sensor'
  },
  { 
    id: 4, 
    name: '无人机巡检', 
    status: 'offline', 
    location: '仓库', 
    battery: 0,
    lastActive: '昨天',
    alerts: 2,
    type: 'drone'
  },
  { 
    id: 5, 
    name: '智能灌溉系统', 
    status: 'online', 
    location: 'D区', 
    battery: 78,
    lastActive: '10分钟前',
    alerts: 0,
    type: 'irrigation'
  },
  { 
    id: 6, 
    name: '环境监测站', 
    status: 'online', 
    location: 'E区', 
    battery: 65,
    lastActive: '30分钟前',
    alerts: 0,
    type: 'monitoring'
  },
];

// 设备运行时间数据
const runtimeData = [
  { 时间: '00:00', 运行设备: 3 },
  { 时间: '04:00', 运行设备: 5 },
  { 时间: '08:00', 运行设备: 8 },
  { 时间: '12:00', 运行设备: 10 },
  { 时间: '16:00', 运行设备: 9 },
  { 时间: '20:00', 运行设备: 6 },
];

// 设备类型筛选
const equipmentTypes = [
  { id: 'all', name: '所有设备' },
  { id: 'irrigation', name: '灌溉系统' },
  { id: 'monitoring', name: '监测设备' },
  { id: 'sensor', name: '传感器' },
  { id: 'drone', name: '无人机' },
];

// 设备状态标签组件
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    online: { text: '在线', bgClass: 'bg-green-100', textClass: 'text-green-800' },
    warning: { text: '警告', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
    offline: { text: '离线', bgClass: 'bg-red-100', textClass: 'text-red-800' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`}>
      {config.text}
    </span>
  );
}

// 设备卡片组件
function EquipmentCard({ equipment }: { equipment: typeof equipmentData[0] }) {
  // 获取设备图标
  const getEquipmentIcon = () => {
    switch (equipment.type) {
      case 'irrigation': return 'fa-faucet';
      case 'monitoring': return 'fa-thermometer-half';
      case 'sensor': return 'fa-microchip';
      case 'drone': return 'fa-drone';
      default: return 'fa-machine';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-3 ${
              equipment.status === 'online' ? 'bg-green-100' : 
              equipment.status === 'warning' ? 'bg-yellow-100' : 'bg-gray-100'
            } transition-colors duration-300 group-hover:scale-110`}>
              <i className={`fa-solid ${getEquipmentIcon()} ${
                equipment.status === 'online' ? 'text-green-600' : 
                equipment.status === 'warning' ? 'text-yellow-600' : 'text-gray-400'
              }`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">{equipment.name}</h3>
              <p className="text-sm text-gray-500">{equipment.location}</p>
            </div>
          </div>
          <StatusBadge status={equipment.status} />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">电池电量</span>
              <span className="font-medium">{equipment.battery}%</span>
            </div>
            <Progress 
              percent={equipment.battery} 
              strokeColor={
                equipment.battery > 50 ? '#4CAF50' : 
                equipment.battery > 20 ? '#FFC107' : '#F44336'
              } 
              strokeWidth={4}
              trailColor="#f0f0f0"
              trailWidth={4}
              radius={[2, 2, 2, 2]}
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">最后活动</span>
              <span className="font-medium">{equipment.lastActive}</span>
            </div>
            {equipment.alerts > 0 && (
              <div className="flex items-center mt-1 text-xs text-red-600">
                <i className="fa-solid fa-exclamation-circle mr-1"></i>
                <span>{equipment.alerts} 个警报需要处理</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <button className="text-green-600 hover:text-green-700 font-medium">
            <i className="fa-solid fa-cog mr-1"></i> 控制
          </button>
          <button className="text-gray-600 hover:text-gray-700 font-medium">
            <i className="fa-solid fa-history mr-1"></i> 历史
          </button>
          <button className="text-gray-600 hover:text-gray-700 font-medium">
            <i className="fa-solid fa-chart-line mr-1"></i> 数据
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EquipmentDashboard() {
  const [activeType, setActiveType] = useState('all');
  
  // 筛选设备
  const filteredEquipment = activeType === 'all' 
    ? equipmentData 
    : equipmentData.filter(item => item.type === activeType);
  
  // 计算设备状态统计
  const statusCount = {
    online: equipmentData.filter(item => item.status === 'online').length,
    warning: equipmentData.filter(item => item.status === 'warning').length,
    offline: equipmentData.filter(item => item.status === 'offline').length,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">设备监控</h2>
          <p className="text-gray-500">监控和管理农场智能设备</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <i className="fa-solid fa-download mr-1"></i> 导出报告
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <i className="fa-solid fa-refresh mr-1"></i> 刷新状态
          </button>
        </div>
      </div>
      
      {/* 设备状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">在线设备</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{statusCount.online}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <i className="fa-solid fa-check-circle text-green-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <i className="fa-solid fa-arrow-up mr-1"></i> 2 台设备已恢复在线
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">警告设备</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{statusCount.warning}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <i className="fa-solid fa-exclamation-triangle text-yellow-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-yellow-600 font-medium flex items-center">
              <i className="fa-solid fa-exclamation-circle mr-1"></i> 需要注意的设备
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">离线设备</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{statusCount.offline}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <i className="fa-solid fa-times-circle text-red-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-red-600 font-medium flex items-center">
              <i className="fa-solid fa-arrow-up mr-1"></i> 1 台设备离线，需要维修
            </span>
          </div>
        </div>
      </div>
      
      {/* 设备运行趋势 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">设备运行趋势</h3>
          <div className="flex space-x-2">
            <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">今日</button>
            <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">本周</button>
            <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">本月</button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={runtimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="时间" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }} 
                formatter={(value) => [`${value} 台`, '运行设备']}
              />
            
              <Line 
                type="monotone" 
                dataKey="运行设备" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="运行设备数量"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 设备列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-semibold text-lg text-gray-800">设备列表</h3>
          
          <div className="flex flex-wrap gap-2">
            {equipmentTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                  activeType === type.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            查看所有设备 <i className="fa-solid fa-angle-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
}