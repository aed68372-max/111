import { useState } from 'react';
import { Alert, viewAlertDetails } from '@/lib/mockData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar
} from 'recharts';
import { getCloudCoverData, getRainfallDistributionData } from '@/lib/mockData';

// 近30天天气事件趋势数据
const weatherTrendData = [
  { day: '1', temperature: 26, rainfall: 0, humidity: 65 },
  { day: '5', temperature: 28, rainfall: 5, humidity: 70 },
  { day: '10', temperature: 24, rainfall: 35, humidity: 85 },
  { day: '15', temperature: 22, rainfall: 10, humidity: 75 },
  { day: '20', temperature: 29, rainfall: 0, humidity: 60 },
  { day: '25', temperature: 31, rainfall: 0, humidity: 55 },
  { day: '30', temperature: 27, rainfall: 45, humidity: 80 },
];

// 气候韧性指标数据
const resilienceMetrics = [
  { name: '抗旱能力', value: 82 },
  { name: '抗涝能力', value: 78 },
  { name: '抗病虫害', value: 85 },
  { name: '温度适应', value: 90 },
];

interface WeatherAlertProps {
  alerts: Alert[];
}

export function WeatherAlert({ alerts }: WeatherAlertProps) {
  const [activeTab, setActiveTab] = useState('alerts');
  
  // 根据预警类型确定样式和图标
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return { 
          bgColor: 'bg-yellow-50', 
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: 'fa-exclamation-triangle',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        };
      case 'alert':
        return { 
          bgColor: 'bg-red-50', 
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: 'fa-exclamation-circle',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'info':
      default:
        return { 
          bgColor: 'bg-blue-50', 
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: 'fa-info-circle',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  if (alerts.length === 0 && activeTab === 'alerts') return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}>
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">气候与环境管理</h3>
          <button className="text-sm text-green-600 hover:text-green-700">
            查看全部 <i className="fa-solid fa-angle-right ml-1"></i>
          </button>
        </div>
        
        {/* 标签切换 */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <button
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'alerts' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('alerts')}
          >
            环境预警
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'trends' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            气象趋势
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'cloud' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('cloud')}
          >
            云量分析
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'rainfall' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('rainfall')}
          >
            雨量分布
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'resilience' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('resilience')}
          >
            气候韧性指标
          </button>
        </div>
      </div>
      
      {/* 预警标签内容 */}
      {activeTab === 'alerts' && (
        <div className="divide-y divide-gray-100">
          {alerts.map((alert) => (
             <div 
               key={alert.id} 
               className={`p-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 border-l-4 border-transparent ${getAlertStyles(alert.type).borderColor} group`}
               onClick={() => viewAlertDetails(alert)}
             >
               <div className="flex"> 
                 <div className={`p-2 rounded-full mr-4 ${getAlertStyles(alert.type).iconBg} transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                   <i className={`fa-solid ${getAlertStyles(alert.type).icon} ${getAlertStyles(alert.type).iconColor}`}></i>
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start">                  
                     <h3 className={`font-bold ${getAlertStyles(alert.type).textColor} transition-colors duration-300 group-hover:translate-x-1`}>{alert.title}</h3>
                     <span className="text-xs text-gray-500">{alert.time}</span>
                   </div>
                   <p className="text-sm text-gray-600 mt-1 line-clamp-2 transition-all duration-300 group-hover:translate-x-1">{alert.description}</p>
                   <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                     <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{alert.affectedArea}</span>
                     <button className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center">
                       查看详情 <i className="fa-solid fa-angle-right ml-1 transition-transform duration-300 group-hover:translate-x-1"></i> 
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
      
       {/* 雨量分布标签内容 */}
       {activeTab === 'rainfall' && (
         <div className="p-4">
           <h4 className="text-sm font-medium text-gray-700 mb-4">区域雨量分布与趋势</h4>
           
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart 
                 data={getRainfallDistributionData()} 
                 margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                 animationDuration={1500}
                 animationEasing="ease-in-out"
               >
                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                 <XAxis dataKey="region" stroke="#666" angle={-45} textAnchor="end" height={40} />
                 <YAxis stroke="#666" />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: 'white', 
                     borderRadius: '12px',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                     border: 'none'
                   }}
                   formatter={(value) => [`${value} mm`, '降雨量']}
                 />
                 <Bar 
                   dataKey="rainfall" 
                   fill="#42A5F5" 
                   radius={[4, 4, 0, 0]} 
                   name="区域降雨量"
                   animationDuration={1500}
                   animationBegin={300}
                 />
                 <Bar 
                   dataKey="predicted" 
                   fill="#90CAF9" 
                   radius={[4, 4, 0, 0]} 
                   name="预测降雨量"
                   animationDuration={1500}
                   animationBegin={600}
                 />
                 <Legend />
               </BarChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
             <h5 className="font-medium text-blue-800 flex items-center">
               <i className="fa-solid fa-chart-line mr-2"></i> 降雨趋势分析
             </h5>
             <p className="mt-2 text-sm text-blue-700">
               过去30天总降雨量为128mm，较历史同期增加15%。A区和C区降雨量较大，需注意排水防涝；D区降雨量较少，建议增加灌溉。
             </p>
           </div>
         </div>
       )}
       
       {/* 气象趋势标签内容 */}
       {activeTab === 'trends' && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">近30天气象数据趋势</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weatherTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis yAxisId="left" orientation="left" stroke="#FF9800" />
                <YAxis yAxisId="right" orientation="right" stroke="#4CAF50" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }} 
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#FF9800" 
                  fill="#FF9800" 
                  fillOpacity={0.3} 
                  name="温度 (°C)"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#4CAF50" 
                  fill="#4CAF50" 
                  fillOpacity={0.3} 
                  name="降雨量 (mm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500">平均温度</p>
              <p className="text-xl font-bold text-blue-600">26.7°C</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">总降雨量</p>
              <p className="text-xl font-bold text-green-600">95mm</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-500">平均湿度</p>
              <p className="text-xl font-bold text-purple-600">70%</p>
            </div>
          </div>
        </div>
      )}
      
       {/* 云量分析标签内容 */}
       {activeTab === 'cloud' && (
         <div className="p-4">
           <h4 className="text-sm font-medium text-gray-700 mb-4">云量变化趋势分析</h4>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart 
                 data={getCloudCoverData()} 
                 margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                 animationDuration={1500}
                 animationEasing="ease-in-out"
               >
                 <defs>
                   <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#81D4FA" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#81D4FA" stopOpacity={0.1}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                 <XAxis dataKey="time" stroke="#666" />
                 <YAxis stroke="#666" domain={[0, 100]} />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: 'white', 
                     borderRadius: '12px',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                     border: 'none'
                   }}
                   formatter={(value) => [`${value}%`, '云量覆盖率']}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="coverage" 
                   stroke="#039BE5" 
                   fillOpacity={1} 
                   fill="url(#cloudGradient)" 
                   name="云量覆盖率"
                   animationDuration={2000}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           
           <div className="grid grid-cols-3 gap-4 mt-4 text-center">
             <div className="p-3 bg-blue-50 rounded-lg">
               <p className="text-xs text-gray-500">平均云量</p>
               <p className="text-xl font-bold text-blue-600">58%</p>
             </div>
             <div className="p-3 bg-blue-50 rounded-lg">
               <p className="text-xs text-gray-500">最大云量</p>
               <p className="text-xl font-bold text-blue-600">92%</p>
             </div>
             <div className="p-3 bg-blue-50 rounded-lg">
               <p className="text-xs text-gray-500">最小云量</p>
               <p className="text-xl font-bold text-blue-600">15%</p>
             </div>
           </div>
         </div>
       )}
       
       {/* 气候韧性指标标签内容 */}
       {activeTab === 'resilience' && (
         <div className="p-4">
           <h4 className="text-sm font-medium text-gray-700 mb-4">气候韧性农业指标</h4>
           
           <div className="space-y-4">
             {resilienceMetrics.map((metric, index) => (
               <div key={index}>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-700">{metric.name}</span>
                   <span className="font-medium">{metric.value}%</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div 
                     className="h-2.5 rounded-full bg-green-600" 
                     style={{ width: `${metric.value}%` }}
                   ></div>
                 </div>
               </div>
             ))}
             
             <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
               <h5 className="font-medium text-blue-800 flex items-center">
                 <i className="fa-solid fa-lightbulb mr-2"></i> 气候适应建议
               </h5>
               <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc list-inside">
                 <li>根据降雨预测，调整灌溉计划，预计可节水15%</li>
                 <li>近期温度波动较大，建议覆盖地膜保持地温稳定</li>
                 <li>下一阶段可能出现虫害高峰，提前准备生物防治措施</li>
               </ul>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}