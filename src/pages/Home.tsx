import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { NavigationTabs } from '@/components/Dashboard/NavigationTabs';
import { toast } from 'sonner';
import { DashboardCard } from '@/components/Dashboard/DashboardCard'; 
import { FarmMetrics } from '@/components/Dashboard/FarmMetrics'; 
import { WeatherAlert } from '@/components/Dashboard/WeatherAlert';
import { getFarmData, getCropHealthData, getEnvironmentalData } from '@/lib/mockData';
  
// 定义仪表盘类型
import { syncPersonalData } from '@/lib/mockData';
type DashboardView = 'overview' | 'climate-resilience' | 'weather-monitoring' | 'alert-publishing' | 'alert-history' | 'decision' | 'risk-assessment' | 'weather-model' | 'agri-info' | 'statistics' | 'feedback' | 'crops' | 'environment' | 'activities';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  
  // 当activeView为weather-monitoring时导航到对应页面
  useEffect(() => {
    if (activeView === 'weather-monitoring') {
      navigate('/weather-monitoring');
    }
  }, [activeView, navigate]);
  
// 获取模拟数据 
const farmData = getFarmData();
const cropHealthData = getCropHealthData(); 
const environmentalData = getEnvironmentalData();

// 定义图表颜色主题 - 绿色为主色调的自然色系
const chartColors = {
  primary: '#4CAF50',      // main green
  secondary: '#8BC34A',    // light green 
  accent: '#CDDC39',       // lime green
  tertiary: '#FFC107',     // warning yellow
  danger: '#F44336',       // alert red 
};

return (
  <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
  {/* Header */}
  <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm transition-all duration-300">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <i className="fa-solid fa-leaf text-green-600 text-2xl transform transition-transform duration-500 hover:rotate-12"></i> 
        <h1 className="text-xl font-bold text-green-800">天气智农（企业端）</h1> 
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="hidden md:flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          onClick={() => {
            const syncResult = syncPersonalData();
            toast.success('个人版数据同步成功', {
              description: `上次同步: ${syncResult.lastSync}`,
            });
          }}
        >
          <i className="fa-solid fa-sync"></i>
          <span>个人版同步</span>
        </button>
        <button 
          className="p-2 rounded-full hover:bg-green-50 transition-colors relative group"
          onClick={() => navigate('/notifications')}
        > 
          <i className="fa-solid fa-bell text-green-600 group-hover:scale-110 transition-transform duration-300"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            通知中心
          </span>
        </button>
        <button 
          className="p-2 rounded-full hover:bg-green-50 transition-colors group"
          onClick={() => navigate('/profile')}
        >
          <i className="fa-solid fa-user text-green-600 group-hover:scale-110 transition-transform duration-300"></i>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            个人中心
          </span>
        </button>
      </div>
    </div>
      
      {/* Navigation Tabs */}
       <NavigationTabs activeView={activeView} setActiveView={setActiveView} />
       
       {/* 个人版同步状态 */}
       <div className="bg-blue-50 border-t border-blue-100 py-2 px-4 text-sm hidden md:block">
         <div className="flex items-center justify-between">
           <div className="flex items-center text-blue-800">
             <i className="fa-solid fa-info-circle mr-2"></i>
             <span>个人版数据已同步，上次同步时间: 2025-08-24 09:32</span>
           </div>
           <button className="text-blue-600 hover:text-blue-800 font-medium">查看详情</button>
         </div>
       </div>
    </header>
    
     <main className="max-w-[1200px] mx-auto px-4 py-6 min-h-[750px]">
      {/* Dashboard Views */}
       {activeView === 'weather-monitoring' ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <i className="fa-solid fa-cloud text-green-600 text-3xl animate-pulse"></i>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">正在导航至气象数据监测页面...</p>
            <p className="text-gray-500">请稍候</p>
          </div>
        </div>
      ) : activeView === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards with Enhanced Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="作物总数" 
              value={farmData.totalCrops} 
              icon="fa-seedling" 
              trend={farmData.cropsTrend}
              color={chartColors.primary}
            />
            <DashboardCard 
              title="健康率" 
              value={`${farmData.healthRate}%`} 
              icon="fa-heart" 
              trend={farmData.healthTrend}
              color={chartColors.secondary}
            />
            <DashboardCard 
              title="预警次数" 
              value={farmData.alertCount} 
              icon="fa-exclamation-triangle" 
              trend={farmData.alertTrend}
              color={chartColors.tertiary}
            />
            <DashboardCard 
              title="产量预估" 
              value={`${farmData.yieldPrediction}吨`} 
              icon="fa-chart-line" 
              trend={farmData.yieldTrend}
              color={chartColors.accent}
            />
          </div>
          
          {/* Environmental Monitoring Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
                <i className="fa-solid fa-temperature-half text-orange-500 mr-2"></i>环境参数监测
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={environmentalData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF9800" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis yAxisId="left" orientation="left" stroke="#FF9800" />
                    <YAxis yAxisId="right" orientation="right" stroke={chartColors.secondary} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#FF9800" 
                      fillOpacity={1} 
                      fill="url(#tempGradient)" 
                      name="温度 (°C)"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke={chartColors.secondary} 
                      fillOpacity={1} 
                      fill="url(#humidityGradient)" 
                      name="湿度 (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
                <i className="fa-solid fa-cloud-rain text-blue-500 mr-2"></i>气象趋势分析
                
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { period: '当前', temperature: 26.5, rainfall: 12.3, humidity: 68 },
                    { period: '1周后', temperature: 28.2, rainfall: 8.5, humidity: 62 },
                    { period: '2周后', temperature: 27.8, rainfall: 15.7, humidity: 72 },
                    { period: '3周后', temperature: 25.3, rainfall: 22.1, humidity: 78 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="period" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="temperature" fill="#FF9800" radius={[4, 4, 0, 0]} name="温度 (°C)" />
                    <Bar dataKey="rainfall" fill="#42A5F5" radius={[4, 4, 0, 0]} name="降雨量 (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
                <i className="fa-solid fa-soil text-amber-700 mr-2"></i>土壤质量指标
              </h2>
              <div className="space-y-5">
                {farmData.soilConditions.slice(0, 3).map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{area.area}</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          pH: {area.ph}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          湿度: {area.moisture}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600" 
                        style={{ width: `${area.moisture}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-2 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">土壤健康评分</h3>
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                      86
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-700">整体土壤状况良好</p>
                      <p className="text-xs text-gray-500 mt-1">D区湿度偏低，建议关注</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Weather Map with Interactive Elements */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-green-800 flex items-center">
                <i className="fa-solid fa-map-marked-alt text-blue-600 mr-2"></i>区域气象地图
              </h2>
              <div className="flex space-x-2">
                <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                  温度
                </button>
                <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                  湿度
                </button>
                <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                  云量
                </button>
              </div>
            </div>
            <div className="relative h-80">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Weather%20map%20showing%20temperature%20and%20precipitation%20patterns%2C%20agricultural%20regions%2C%20professional%20meteorological%20visualization%2C%20highly%20detailed%2C%20modern%20UI&sign=199e5cc022fdfdee0744f561e0be0cda" 
                alt="区域气象参数分布图" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40"></div>
              
              {/* Interactive Map Controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-800">实时气象数据可视化</p>
                    <p className="text-sm text-gray-600">温度、湿度、云量等气象参数空间分布</p>
                  </div>
                  <div className="flex space-x-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <i className="fa-solid fa-refresh mr-1"></i> 更新数据
                    </button>
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center">
                      <i className="fa-solid fa-expand mr-1"></i> 全屏查看
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Weather Alert Markers */}
              <div className="absolute top-1/4 left-1/3 animate-pulse">
                <div className="w-4 h-4 bg-red-500 rounded-full relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-full blur animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-1/3 right-1/4 animate-pulse">
                <div className="w-4 h-4 bg-yellow-500 rounded-full relative">
                  <div className="absolute -inset-1 bg-yellow-500 rounded-full blur animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Crop Growth and Weather Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
                <i className="fa-solid fa-chart-pie text-purple-600 mr-2"></i>作物生长阶段
              </h2>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '发芽期', value: 15 },
                        { name: '生长期', value: 40 },
                        { name: '开花期', value: 25 },
                        { name: '结果期', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="#4CAF50" />
                      <Cell fill="#8BC34A" />
                      <Cell fill="#CDDC39" />
                      <Cell fill="#FFC107" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                      formatter={(value) => [`${value}%`, '占比']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                    /> 
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 lg:col-span-2">
              <WeatherAlert alerts={farmData.recentAlerts} />
            </div>
          </div>
          
          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-tint text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-green-800">灌溉计划</h3>
                  <p className="text-xs text-green-700 mt-1">查看今日灌溉安排</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-calendar-check text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">农事活动</h3>
                  <p className="text-xs text-blue-700 mt-1">查看今日待办事项</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-leaf text-yellow-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">生长报告</h3>
                  <p className="text-xs text-yellow-700 mt-1">查看作物生长状态</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-chart-line text-purple-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-purple-800">产量分析</h3>
                  <p className="text-xs text-purple-700 mt-1">查看产量预测报告</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Crops Dashboard */}
      {activeView === 'crops' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-green-800">作物管理</h2>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-green-800">作物健康分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '健康', value: farmData.healthyPlants, color: chartColors.primary },
                      { name: '需关注', value: farmData.concernPlants, color: chartColors.tertiary },
                      { name: '不健康', value: farmData.unhealthyPlants, color: chartColors.danger },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[chartColors.primary, chartColors.tertiary, chartColors.danger].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <FarmMetrics metrics={farmData.cropMetrics} />
        </div>
      )}
      
       {/* Environment Dashboard with Advanced Weather Visualizations */}
      {activeView === 'environment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-green-800">环境监测与气象分析</h2>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-sync-alt mr-1"></i> 更新数据
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <i className="fa-solid fa-expand mr-1"></i> 全屏查看
              </button>
            </div>
          </div>
          
          {/* 高级云量动态图表 */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-800">云量变化趋势分析</h3>
              <div className="flex space-x-2">
                <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">今日</button>
                <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">本周</button>
                <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">本月</button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={[
                    { time: '00:00', coverage: 85, type: '积雨云' },
                    { time: '03:00', coverage: 90, type: '积雨云' },
                    { time: '06:00', coverage: 75, type: '层积云' },
                    { time: '09:00', coverage: 60, type: '层积云' },
                    { time: '12:00', coverage: 45, type: '高积云' },
                    { time: '15:00', coverage: 30, type: '晴' },
                    { time: '18:00', coverage: 55, type: '层积云' },
                    { time: '21:00', coverage: 70, type: '积雨云' },
                  ]} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  animationDuration={2000}
                >
                  <defs>
                    <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#42A5F5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: '云量覆盖率 (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 12 }
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px 15px'
                    }}
                    formatter={(value) => [`${value}%`, '覆盖率']}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3">
                            <p className="font-medium">{payload[0].payload.time} 云量数据</p>
                            <div className="flex items-center mt-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span>覆盖率: {payload[0].value}%</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              云类型: {payload[0].payload.type}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="coverage" 
                    stroke="#1976D2" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#cloudGradient)" 
                    name="云量覆盖率"
                    animationDuration={2000}
                    animationBegin={300}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#1976D2' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">平均云量</p>
                <p className="text-xl font-bold text-blue-600">58%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">最大云量</p>
                <p className="text-xl font-bold text-blue-600">90%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">最小云量</p>
                <p className="text-xl font-bold text-blue-600">30%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">日照小时数</p>
                <p className="text-xl font-bold text-blue-600">6.8h</p>
              </div>
            </div>
          </div>
          
          {/* 高级雨量动态图表 */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-800">区域雨量分布与预测</h3>
              <div className="flex space-x-2">
                <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">近7天</button>
                <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">近30天</button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { region: 'A区', rainfall: 65, predicted: 72, trend: 'up' },
                    { region: 'B区', rainfall: 42, predicted: 45, trend: 'stable' },
                    { region: 'C区', rainfall: 78, predicted: 68, trend: 'down' },
                    { region: 'D区', rainfall: 28, predicted: 35, trend: 'up' },
                    { region: 'E区', rainfall: 55, predicted: 50, trend: 'stable' },
                  ]} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="region" 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: '降雨量 (mm)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 12 }
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none'
                    }}
                    formatter={(value) => [`${value} mm`, '降雨量']}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ paddingTop: 0 }}
                  />
                  <Bar 
                    dataKey="rainfall" 
                    fill="#42A5F5" 
                    radius={[4, 4, 0, 0]} 
                    name="实际降雨量"
                    animationDuration={1500}
                    animationBegin={300}
                    barSize={40}
                  />
                  <Bar 
                    dataKey="predicted" 
                    fill="#90CAF9" 
                    radius={[4, 4, 0, 0]} 
                    name="预测降雨量"
                    animationDuration={1500}
                    animationBegin={600}
                    barSize={40}
                  />
                  {/* 趋势指示器 */}
                   {/* 趋势指示器 - 修复了TypeError错误 */}
                    {[
                      { region: 'A区', rainfall: 65, predicted: 72, trend: 'up' },
                      { region: 'B区', rainfall: 42, predicted: 45, trend: 'stable' },
                      { region: 'C区', rainfall: 78, predicted: 68, trend: 'down' },
                      { region: 'D区', rainfall: 28, predicted: 35, trend: 'up' },
                      { region: 'E区', rainfall: 55, predicted: 50, trend: 'stable' },
                    ].map((regionData, i) => (
                     <Line 
                       key={`trend-${i}`}
                       type="monotone" 
                       dataKey="trend" 
                       stroke={
                         regionData.trend === 'up' ? '#4CAF50' : 
                         regionData.trend === 'down' ? '#F44336' : '#9E9E9E'
                       } 
                       strokeWidth={2}
                       dot={false}
                       activeDot={false}
                       isAnimationActive={false}
                       data={[{trend: null}, {trend: regionData.trend === 'up' ? 1 : regionData.trend === 'down' ? -1 : 0}]}
                     />
                   ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 flex items-center">
                <i className="fa-solid fa-lightbulb mr-2"></i> 灌溉建议
              </h4>
              <p className="mt-2 text-sm text-blue-700">
                根据云量和降雨预测，D区未来2天降雨量较小，建议增加灌溉量15%。C区预计有持续降雨，可减少灌溉并做好排水准备。
              </p>
              <button className="text-blue-600 text-sm mt-2 hover:text-blue-800 font-medium">
                查看详细灌溉计划 <i className="fa-solid fa-angle-right ml-1"></i>
              </button>
            </div>
          </div>
          
          {/* 环境参数监测面板 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-green-800">温湿度实时监测</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={environmentalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis yAxisId="left" orientation="left" stroke="#FF9800" />
                    <YAxis yAxisId="right" orientation="right" stroke={chartColors.secondary} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }} 
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#FF9800" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="温度 (°C)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke={chartColors.secondary} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="湿度 (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-green-800">土壤状况监测</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={farmData.soilConditions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="area" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }} 
                    />
                    <Bar dataKey="ph" fill={chartColors.primary} radius={[4, 4, 0, 0]} name="土壤pH值" />
                    <Bar dataKey="moisture" fill={chartColors.accent} radius={[4, 4, 0, 0]} name="土壤湿度 (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
       {/* Activities Dashboard with Enhanced Visualizations */}
      {activeView === 'activities' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-green-800">农事活动管理</h2>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <i className="fa-solid fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <select className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>最近7天</option>
                  <option>最近30天</option>
                  <option>本月</option>
                  <option>上月</option>
                  <option>自定义</option>
                </select>
              </div>
              <div className="relative">
                <i className="fa-solid fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <select className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>所有活动类型</option>
                  <option>灌溉作业</option>
                  <option>施肥作业</option>
                  <option>病虫害防治</option>
                  <option>收获作业</option>
                </select>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
                <i className="fa-solid fa-plus mr-1"></i> 记录活动
              </button>
            </div>
          </div>
          
          {/* Activity Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总活动数</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">24</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <i className="fa-solid fa-list-checks text-blue-600 text-xl"></i> 
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <i className="fa-solid fa-arrow-up mr-1"></i> 较上月增长 12%
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">已完成活动</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">19</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <i className="fa-solid fa-check-circle text-green-600 text-xl"></i> 
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-gray-700 font-medium">完成率: 79.2%</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">进行中活动</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">5</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <i className="fa-solid fa-spinner text-yellow-600 text-xl"></i> 
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-yellow-600 font-medium">2项即将逾期</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">平均活动时长</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">4.2h</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <i className="fa-solid fa-clock text-purple-600 text-xl"></i> 
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <i className="fa-solid fa-arrow-down mr-1"></i> 较上月减少 0.8h
                </span>
              </div>
            </div>
          </div>
          
          {/* Activity Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">活动趋势分析</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { 日期: '1月', 活动数: 12 },
                    { 日期: '2月', 活动数: 15 },
                    { 日期: '3月', 活动数: 18 },
                    { 日期: '4月', 活动数: 22 },
                    { 日期: '5月', 活动数: 19 },
                    { 日期: '6月', 活动数: 24 },
                  ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="日期" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }} 
                      formatter={(value) => [`${value} 项`, '活动数']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="活动数" 
                      stroke="#4CAF50" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="月度活动数量"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">活动类型分布</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '灌溉作业', value: 35, color: '#42A5F5' },
                        { name: '施肥作业', value: 25, color: '#4CAF50' },
                        { name: '病虫害防治', value: 20, color: '#FFC107' },
                        { name: '收获作业', value: 10, color: '#FF9800' },
                        { name: '其他作业', value: 10, color: '#9E9E9E' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        '#42A5F5', '#4CAF50', '#FFC107', 
                        '#FF9800', '#9E9E9E'
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }} 
                      formatter={(value) => [`${value}%`, '占比']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                    /> 
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Activity List with Enhanced Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">近期活动</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">排序方式:</span>
                <select className="text-sm border-none bg-transparent focus:outline-none focus:ring-0">
                  <option>最近更新</option>
                  <option>最早创建</option>
                  <option>活动类型</option>
                </select>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {farmData.recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className={`p-2 rounded-full mr-3 transform transition-all duration-300 group-hover:scale-110 ${
                    activity.icon.includes('fertilizer') ? 'bg-green-100 text-green-600' :
                    activity.icon.includes('bug') ? 'bg-purple-100 text-purple-600' :
                    activity.icon.includes('tint') ? 'bg-blue-100 text-blue-600' :
                    activity.icon.includes('sun') ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <i className={`fa-solid ${activity.icon}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between gap-2">
                      <h4 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">{activity.title}</h4>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 whitespace-nowrap">{activity.date}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {activity.cropType}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                    <div className="flex flex-wrap items-center mt-3 text-xs gap-2">
                      <span className="flex items-center text-gray-500">
                        <i className="fa-solid fa-clock mr-1"></i> {activity.duration}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <i className="fa-solid fa-user mr-1"></i> 农场管理员
                      </span>
                      <button className="ml-auto text-green-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fa-solid fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))} 
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full text-center text-green-600 hover:text-green-700 text-sm font-medium">
                查看全部活动 <i className="fa-solid fa-angle-down ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Climate Resilience Dashboard */}
       {activeView === 'climate' && (
         <div className="space-y-6">
           <div className="flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-bold text-green-800">气候韧性农业</h2>
               <p className="text-gray-500">监测和提升农场对气候变化的适应能力</p>
             </div>
             <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
               <i className="fa-solid fa-file-export mr-1"></i> 导出报告
             </button>
           </div>
           
           {/* 气候韧性指标卡片 */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-500">综合气候韧性指数</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">87.5</h3>
                 </div>
                 <div className="p-3 bg-blue-100 rounded-lg">
                   <i className="fa-solid fa-shield-alt text-blue-600 text-xl"></i> 
                 </div>
               </div>
               <div className="mt-4 text-sm">
                 <span className="text-green-600 font-medium flex items-center">
                   <i className="fa-solid fa-arrow-up mr-1"></i> 较上季度提升 3.2%
                 </span>
               </div>
             </div>
             
             <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-500">灾害损失减少</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">68%</h3>
                 </div>
                 <div className="p-3 bg-green-100 rounded-lg">
                   <i className="fa-solid fa-chart-line-down text-green-600 text-xl"></i> 
                 </div>
               </div>
               <div className="mt-4 text-sm">
                 <span className="text-gray-600 font-medium">较去年同期</span>
               </div>
             </div>
             
             <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-500">水资源利用效率</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">89%</h3>
                 </div>
                 <div className="p-3 bg-cyan-100 rounded-lg">
                   <i className="fa-solid fa-tint text-cyan-600 text-xl"></i> 
                 </div>
               </div>
               <div className="mt-4 text-sm">
                 <span className="text-green-600 font-medium flex items-center">
                   <i className="fa-solid fa-arrow-up mr-1"></i> 提升 12%
                 </span>
               </div>
             </div>
             
             <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-500">气候智能品种占比</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">65%</h3>
                 </div>
                 <div className="p-3 bg-purple-100 rounded-lg">
                   <i className="fa-solid fa-seedling text-purple-600 text-xl"></i> 
                 </div>
               </div>
               <div className="mt-4 text-sm">
                 <span className="text-gray-600 font-medium">目标: 80% (2026年)</span>
               </div>
             </div>           
           </div>
           
           {/* 气候适应性措施效果 */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
             <h3 className="font-semibold text-lg text-gray-800 mb-6">气候适应性措施效果分析</h3>
             
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { year: '2020', 传统种植: 12.5, 气候智能种植: null },
                   { year: '2021', 传统种植: 11.8, 气候智能种植: 13.2 },
                   { year: '2022', 传统种植: 9.5, 气候智能种植: 12.8 },
                   { year: '2023', 传统种植: 10.2, 气候智能种植: 14.5 },
                   { year: '2024', 传统种植: 8.8, 气候智能种植: 15.2 },
                 ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                   <XAxis dataKey="year" stroke="#666" />
                   <YAxis stroke="#666" label={{ value: '产量 (吨/公顷)', angle: -90, position: 'insideLeft' }} />
                   <Tooltip 
                     contentStyle={{ 
                       backgroundColor: 'white', 
                       borderRadius: '12px',
                       boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       border: 'none'
                     }} 
                   />
                   <Legend />
                   <Bar dataKey="传统种植" fill="#FF9800" radius={[4, 4, 0, 0]} name="传统种植模式" />
                   <Bar dataKey="气候智能种植" fill="#4CAF50" radius={[4, 4, 0, 0]} name="气候智能种植模式" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             
             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 bg-green-50 rounded-lg">
                 <h4 className="text-sm font-medium text-gray-700 mb-2">主要措施</h4>
                 <ul className="text-sm text-gray-700 space-y-1">
                   <li className="flex items-center"><i className="fa-solid fa-check text-green-600 mr-2"></i> 耐旱品种推广</li>
                   <li className="flex items-center"><i className="fa-solid fa-check text-green-600 mr-2"></i> 精准灌溉系统</li>
                   <li className="flex items-center"><i className="fa-solid fa-check text-green-600 mr-2"></i> 土壤改良技术</li>
                 </ul>
               </div>
               
               <div className="p-4 bg-blue-50 rounded-lg">
                 <h4 className="text-sm font-medium text-gray-700 mb-2">经济效益</h4>
                 <p className="text-gray-800">通过气候适应性措施，近三年累计减少损失约¥128,500，投入产出比达1:4.3。</p>
               </div>
               
               <div className="p-4 bg-purple-50 rounded-lg">
                 <h4 className="text-sm font-medium text-gray-700 mb-2">未来计划</h4>
                 <p className="text-gray-800">计划扩大气候智能农业技术应用面积至85%，引入物联网气象监测网络。</p>
               </div>
             </div>
           </div>
           
           {/* 气候风险地图 */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
             <h3 className="font-semibold text-lg text-gray-800 mb-4">农场气候风险分布图</h3>
             <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
               <img 
                 src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Farm%20map%20with%20climate%20risk%20zones%2C%20agricultural%20fields%2C%20weather%20stations%2C%20irrigation%20systems%2C%20satellite%20view%2C%20professional%20map%20style&sign=369da113bfee79131fd9d02ae9235081" 
                 alt="农场气候风险分布图" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md">
                 <div className="flex items-center space-x-3 text-sm">
                   <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> 高风险区</div>
                   <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> 中风险区</div>
                   <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> 低风险区</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </main>
  </div>
);
}