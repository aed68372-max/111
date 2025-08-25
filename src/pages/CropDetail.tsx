import { useParams } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getFarmData } from '@/lib/mockData';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts'; 

// 模拟作物生长数据
const growthData = [ 
    { week: '第1周', height: 10, health: 95 },
    { week: '第2周', height: 18, health: null },
    { week: '第3周', height: 25, health: null },
    { week: '第4周', height: 35, health: null },
    { week: '第5周', height: null, health: 92 },
    { week: '第6周', height: 50, health: null },
    { week: '第7周', height: 65, health: null },
    { week: '第8周', height: null , health: null },
];

export default function CropDetail() {
    const { id } = useParams<{ id: string }>();
    const [cropData, setCropData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => { 
        // 获取农场数据并找到匹配ID的作物
        const farmData = getFarmData();
        const foundCrop = farmData.cropMetrics.find(
            crop => crop.id === parseInt(id || '0')
        );
        
        setCropData(foundCrop);
        setLoading(false);
    }, [id]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                        <i className="fa-solid fa-seedling text-green-600 text-2xl animate-pulse"></i>
                    </div>
                    <p className="text-gray-600">加载作物数据中...</p>
                </div>
            </div>
        );
    }
    
    if (!cropData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 text-center">
                    <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                        <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">作物未找到</h2>
                    <p className="text-gray-500 mb-6">没有找到ID为 {id} 的作物信息</p>
                    <a 
                        href="/" 
                        className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        返回首页
                    </a>
                </div>
            </div>
        );
    }
    
    // 根据健康率确定显示颜色
    const getHealthColor = () => {
        if (cropData.healthRate >= 90) return 'text-green-600';
        if (cropData.healthRate >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <a href="/" className="text-green-600">
                            <i className="fa-solid fa-arrow-left"></i>
                        </a>
                        <h1 className="text-xl font-bold text-green-800">{cropData.name} 详情</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            <i className="fa-solid fa-edit mr-1"></i> 编辑
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 作物基本信息 */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <i className="fa-solid fa-seedling text-green-600 text-3xl"></i>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">{cropData.name}</h2>
                                <p className="text-gray-500">{cropData.growthStage}</p>
                                
                                <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    健康率: <span className={`font-bold ${getHealthColor()}`}>{cropData.healthRate}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">作物信息</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">种植数量</p>
                                    <p className="text-xl font-bold text-gray-800">{cropData.quantity} 株</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">预估产量</p>
                                    <p className="text-xl font-bold text-gray-800">{cropData.yieldPrediction}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">种植区域</p>
                                    <p className="text-xl font-bold text-gray-800">A区</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">种植日期</p>
                                    <p className="text-xl font-bold text-gray-800">2023-05-15</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 作物生长数据 */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">生长趋势</h3>
                            
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="week" stroke="#666" />
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
                                            dataKey="height" 
                                            stroke="#4CAF50" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="高度 (cm)"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="health" 
                                            stroke="#FF9800" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="健康指数"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">近期活动</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start p-3 border border-gray-100 rounded-lg">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        <i className="fa-solid fa-fertilizer text-green-600"></i>
                                    </div>
                                    <div>
                                        <div className="flex justify-between">
                                            <h4 className="font-medium text-gray-800">施肥作业</h4>
                                            <span className="text-sm text-gray-500">昨天</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">对{cropData.name}进行了春季追肥，使用氮磷钾复合肥。</p>
                                    </div> 
                                </div>
                                
                                <div className="flex items-start p-3 border border-gray-100 rounded-lg">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <i className="fa-solid fa-tint text-blue-600"></i>
                                    </div>
                                    <div>
                                        <div className="flex justify-between">
                                            <h4 className="font-medium text-gray-800">灌溉作业</h4>
                                            <span className="text-sm text-gray-500">3天前</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">对{cropData.name}进行了滴灌，土壤湿度已达到65%。</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-4 py-2 text-center text-green-600 hover:text-green-700 text-sm font-medium">
                                查看所有活动 <i className="fa-solid fa-angle-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}