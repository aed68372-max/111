import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// 模拟数据分析数据
const yieldData = [
  { name: '1月', 小麦: 4.2, 玉米: 5.1, 水稻: 4.8 },
  { name: '2月', 小麦: 4.5, 玉米: 5.3, 水稻: 5.0 },
  { name: '3月', 小麦: 4.7, 玉米: 5.5, 水稻: 5.2 },
  { name: '4月', 小麦: 4.9, 玉米: 5.7, 水稻: 5.4 },
  { name: '5月', 小麦: 5.2, 玉米: 6.0, 水稻: 5.7 },
  { name: '6月', 小麦: 5.5, 玉米: 6.3, 水稻: 6.0 },
];

const resourceAllocationData = [
  { name: '肥料', value: 35 },
  { name: '农药', value: 15 },
  { name: '灌溉', value: 25 },
  { name: '设备', value: 15 },
  { name: '人力', value: 10 },];

const efficiencyData = [
  { name: 'A区', 效率: 92 },
  { name: 'B区', 效率: 85 },
  { name: 'C区', 效率: 88 },
  { name: 'D区', 效率: 90 },
];

const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

interface AnalyticsMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

// 分析指标卡片组件
function AnalyticsMetricCard({ title, value, change, trend, icon }: AnalyticsMetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
          <div className="flex items-center mt-2 text-xs">
            <i className={`fa-solid fa-arrow-${trend} ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}></i>
            <span className={`ml-1 font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change} 相比上月
            </span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <i className={`fa-solid ${icon} text-green-600 text-lg`}></i>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">农场数据分析</h2>
          <p className="text-gray-500">深入分析农场运营数据与趋势</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <i className="fa-solid fa-download mr-1"></i> 导出报告
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <i className="fa-solid fa-refresh mr-1"></i> 刷新数据
          </button>
        </div>
      </div>
      
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard 
          title="总产量" 
          value="24.6 吨" 
          change="+5.2%" 
          trend="up" 
          icon="fa-chart-line" 
        />
        <AnalyticsMetricCard 
          title="资源效率" 
          value="89.2%" 
          change="+2.1%" 
          trend="up" 
          icon="fa-bolt" 
        />
        <AnalyticsMetricCard 
          title="生产成本" 
          value="¥12,580" 
          change="-3.7%" 
          trend="down" 
          icon="fa-yen-sign" 
        />
        <AnalyticsMetricCard 
          title="预测收益" 
          value="¥48,920" 
          change="+8.3%" 
          trend="up" 
          icon="fa-chart-pie" 
        />
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 产量趋势图表 */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">作物产量趋势</h3>
            <div className="flex space-x-2">
              <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">月度</button>
              <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">季度</button>
              <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">年度</button>
            </div>
          </div>
          <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }} 
                  cursor={{ fill: 'rgba(76, 175, 80, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="小麦" fill="#4CAF50" radius={[4, 4, 0, 0]} animationDuration={1500} />
                <Bar dataKey="玉米" fill="#8BC34A" radius={[4, 4, 0, 0]} animationDuration={1500} animationBegin={300} />
                <Bar dataKey="水稻" fill="#CDDC39" radius={[4, 4, 0, 0]} animationDuration={1500} animationBegin={600} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 资源分配图表 */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">资源分配比例</h3>
            <button className="text-xs text-green-600 hover:text-green-700">
              <i className="fa-solid fa-ellipsis-v"></i>
            </button>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {resourceAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '占比']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 效率分析图表 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">区域生产效率</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={efficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="效率" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                name="生产效率 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
         
         <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
           <div className="p-3 bg-green-50 rounded-lg">
             <p className="text-sm text-gray-500">平均效率</p>
             <p className="text-xl font-bold text-green-600">88.7%</p> 
           </div>
           <div className="p-3 bg-gray-50 rounded-lg">
             <p className="text-sm text-gray-500">最高效率</p>
             <p className="text-xl font-bold text-gray-700">92%</p>
           </div>
           <div className="p-3 bg-gray-50 rounded-lg">
             <p className="text-sm text-gray-500">最低效率</p>
             <p className="text-xl font-bold text-gray-700">85%</p>
           </div>
           <div className="p-3 bg-gray-50 rounded-lg">
             <p className="text-sm text-gray-500">目标效率</p>
             <p className="text-xl font-bold text-gray-700">95%</p>
           </div>
         </div>
       </div>
       
       {/* 作物生长条件雷达图 */}
       <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mt-6">
         <h3 className="font-semibold text-lg text-gray-800 mb-4">作物生长条件分析</h3>
         
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
               { subject: '温度', A: 80, B: 65, fullMark: 100 },
               { subject: '湿度', A: 65, B: 90, fullMark: 100 },
               { subject: '光照', A: 90, B: 75, fullMark: 100 },
               { subject: '土壤pH', A: 75, B: 85, fullMark: 100 },
               { subject: '养分', A: 85, B: 70, fullMark: 100 },
               { subject: '水分', A: 70, B: 85, fullMark: 100 },
             ]}>
               <Radar
                 name="小麦"
                 dataKey="A"
                 stroke="#4CAF50"
                 fill="#4CAF50"
                 fillOpacity={0.3}
               />
               <Radar
                 name="玉米"
                 dataKey="B"
                 stroke="#FFC107"
                 fill="#FFC107"
                 fillOpacity={0.3}
               />
               <Tooltip 
                 contentStyle={{ 
                   backgroundColor: 'white', 
                   borderRadius: '12px',
                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                   border: 'none'
                 }} 
               />
               <Legend />
               <PolarGrid stroke="#e0e0e0" />
               <PolarAngleAxis dataKey="subject" />
               <PolarRadiusAxis angle={30} domain={[0, 100]} />
             </RadarChart>
           </ResponsiveContainer>
         </div>
       </div>
     </div>
  );
}

export default AnalyticsDashboard;