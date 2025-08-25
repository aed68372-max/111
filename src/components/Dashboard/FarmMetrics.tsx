import { useNavigate } from 'react-router-dom';

interface CropMetric {
  id: number;
  name: string;
  quantity: number;
  healthRate: number;
  growthStage: string;
  yieldPrediction: string;
}

interface FarmMetricsProps {
  metrics: CropMetric[];
}

export function FarmMetrics({ metrics }: FarmMetricsProps) {
  const navigate = useNavigate();
  
  // 根据健康率确定显示颜色和状态文本
  const getHealthIndicator = (rate: number) => {
    if (rate >= 90) {
      return { color: 'bg-green-100 text-green-800', status: '优秀', bgColor: '#4CAF50' };
    } else if (rate >= 70) {
      return { color: 'bg-yellow-100 text-yellow-800', status: '良好', bgColor: '#FFC107' };
    } else if (rate >= 50) {
      return { color: 'bg-orange-100 text-orange-800', status: '一般', bgColor: '#FF9800' };
    } else {
      return { color: 'bg-red-100 text-red-800', status: '较差', bgColor: '#F44336' };
    }
  };
  
  // 查看作物详情
  const viewCropDetails = (cropId: number, cropName: string) => {
    navigate(`/crops/${cropId}`, { state: { name: cropName } });
  };

  return ( 
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">作物详情</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作物类型</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">健康状况</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生长阶段</th> 
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预估产量</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr> 
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {metrics.map((metric) => {
              const health = getHealthIndicator(metric.healthRate);
              return (
                <tr 
                  key={metric.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => viewCropDetails(metric.id, metric.name)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <i className="fa-solid fa-seedling text-green-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{metric.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{metric.quantity} 株</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${metric.healthRate}%`,
                            backgroundColor: health.bgColor
                          }}
                        ></div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${health.color}`}>
                        {health.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{metric.growthStage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{metric.yieldPrediction}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-700">
                      查看详情 <i className="fa-solid fa-angle-right ml-1"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-center text-green-600 hover:text-green-700 text-sm font-medium">
          查看所有作物 <i className="fa-solid fa-angle-right ml-1"></i>
        </button>
      </div>
    </div>
  );
}