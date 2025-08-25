import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Progress 
} from 'recharts';

// 资源数据
const resourceData = [
  { name: '氮肥', 库存: 45, 使用率: 65, 单位: 'kg' },
  { name: '磷肥', 库存: 30, 使用率: 45, 单位: 'kg' },
  { name: '钾肥',	库存: 50, 使用率: 55, 单位: 'kg' },
  { name: '杀虫剂', 库存: 15, 使用率: 80, 单位: 'L' },
  { name: '除草剂', 库存: 20, 使用率: 30, 单位: 'L' },
];

// 资源消耗趋势
const consumptionTrend = [
  { 月份: '1月', 消耗: 45 },
  { 月份: '2月', 消耗: 52 },
  { 月份: '3月', 消耗: 68 },
  { 月份: '4月', 消耗: 58 },
];

// 资源类别
const resourceCategories = [
  { id: 'all', name: '全部资源' },
  { id: 'fertilizer', name: '肥料' },
  { id: 'pesticide', name: '农药' },
  { id: 'tools', name: '工具' },
  { id: 'other', name: '其他' },
];

// 资源卡片组件 
interface ResourceCardProps {
  id: number;
  name: string;
  stock: number;
  usage: number;
  unit: string;
  category: string;
}

function ResourceCard({ id, name, stock, usage, unit, category }: ResourceCardProps) {
  // 确定资源状态颜色
  const getStatusColor = () => {
    if (stock > 50) return 'bg-green-100 text-green-800';
    if (stock > 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // 确定资源状态文本
  const getStatusText = () => {
    if (stock > 50) return '库存充足';
    if (stock > 20) return '库存一般';
    return '库存不足';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full mr-2">
                {category}
              </span>
              <h3 className="font-semibold text-gray-800">{name}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">当前库存: {stock} {unit}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">使用率</span>
            <span className="font-medium">{usage}%</span>
          </div>
          <Progress 
            percent={usage} 
            strokeColor="#4CAF50" 
            strokeWidth={6}
            trailColor="#f0f0f0"
            trailWidth={6}
            radius={[3, 3, 3, 3]}
          />
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <button className="text-green-600 hover:text-green-700 font-medium">
            <i className="fa-solid fa-plus-circle mr-1"></i> 补充
          </button>
          <button className="text-gray-600 hover:text-gray-700 font-medium">
            <i className="fa-solid fa-history mr-1"></i> 历史
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesDashboard() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">资源管理</h2>
          <p className="text-gray-500">监控和管理农场资源库存与消耗</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
          <i className="fa-solid fa-plus mr-2"></i> 添加资源
        </button>
      </div>
      
      {/* 资源分类筛选 */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {resourceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 资源概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总资源种类</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">24</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fa-solid fa-cubes text-blue-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <i className="fa-solid fa-arrow-up mr-1"></i> 3 种新增资源
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">库存预警</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">5</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <i className="fa-solid fa-exclamation-circle text-red-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-red-600 font-medium flex items-center">
              <i className="fa-solid fa-arrow-up mr-1"></i> 2 种资源需补充
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">资源周转率</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">68%</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="fa-solid fa-sync-alt text-green-600 text-xl"></i> 
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <i className="fa-solid fa-arrow-up mr-1"></i> 较上月提升 5%
            </span>
          </div>
        </div>
      </div>
      
      {/* 资源列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-800">资源库存明细</h3>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceData.map((resource, index) => (
            <ResourceCard 
              key={index}
              id={index}
              name={resource.name}
              stock={resource.库存}
              usage={resource.使用率}
              unit={resource.单位}
              category={index < 3 ? '肥料' : '农药'}
            />
          ))}
          
          {/* 添加更多资源卡片占位 */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 hover:border-green-300 transition-colors cursor-pointer">
            <div className="p-3 bg-gray-100 rounded-full mb-2">
              <i className="fa-solid fa-plus text-gray-400"></i>
            </div>
            <p className="text-gray-500 text-sm">添加新资源</p>
          </div>
        </div>
      </div>
      
      {/* 资源消耗趋势 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">资源消耗趋势</h3>
          <div className="flex space-x-2">
            <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">季度</button>
            <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">年度</button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumptionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="月份" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }} 
                formatter={(value) => [`${value} 单位`, '资源消耗']}
              />
            
              <Bar 
                dataKey="消耗" 
                fill="#4CAF50" 
                radius={[4, 4, 0, 0]} 
                name="资源消耗"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">资源预测</h4>
            <p className="text-gray-800">根据当前消耗速度，氮肥将在 2 周内耗尽</p>
            <button className="text-green-600 text-sm mt-2 hover:underline">查看完整预测报告 →</button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">优化建议</h4>
            <p className="text-gray-800">磷肥使用率较低，建议调整施肥计划以减少浪费</p>
            <button className="text-green-600 text-sm mt-2 hover:underline">查看优化方案 →</button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">供应商信息</h4>
            <p className="text-gray-800">最近供应商：绿色农业物资公司 (价格优势: 8%)</p>
            <button className="text-green-600 text-sm mt-2 hover:underline">查看所有供应商 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}