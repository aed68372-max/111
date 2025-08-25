import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WeatherMonitoring() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    stationName: '',
    stationAddress: '',
    monitoringTime: '',
    weatherFactor: 'temperature',
    deviceId: '',
    deviceBrand: '',
    weatherValue: '',
    unit: 'celsius',
    accuracy: 'high',
    anomalyDescription: '',
    dataImage: null,
    dataReport: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form data:', formData);
    alert('气象数据监测表单已提交');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">气象数据监测</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <i className="fa-solid fa-search text-lg"></i>      
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <i className="fa-solid fa-bell text-lg"></i>
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <i className="fa-solid fa-user-circle text-lg"></i>
            </button>
            <button className="text-gray-600 hover:text-gray-900">      
              <i className="fa-solid fa-cog text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">      
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monitoring Station Name */}
                <div>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">
                    监测站点名称
                  </label>
                  <input
                    type="text"
                    name="stationName"      
                    id="stationName"      
                    value={formData.stationName}
                    onChange={handleInputChange}      
                    placeholder="请输入监测站点名称"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Monitoring Station Address */}
                <div>
                  <label htmlFor="stationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    监测站点地址
                  </label>      
                  <input
                    type="text"
                    name="stationAddress"      
                    id="stationAddress"
                    value={formData.stationAddress}
                    onChange={handleInputChange}      
                    placeholder="请输入监测站点地址"      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />
                </div>

                {/* Monitoring Time */}
                <div>
                  <label htmlFor="monitoringTime" className="block text-sm font-medium text-gray-700 mb-1">
                    监测时间
                  </label>
                  <input
                    type="datetime-local"
                    name="monitoringTime"
                    id="monitoringTime"      
                    value={formData.monitoringTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />      
                </div>      
      
                {/* Weather Factor Type */}      
                <div>      
                  <label htmlFor="weatherFactor" className="block text-sm font-medium text-gray-700 mb-1">
                    气象要素类型
                  </label>      
                  <select      
                    id="weatherFactor"      
                    name="weatherFactor"      
                    value={formData.weatherFactor}      
                    onChange={handleInputChange}      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  >      
                    <option value="temperature">温度</option>      
                    <option value="humidity">湿度</option>      
                    <option value="precipitation">降水量</option>      
                    <option value="windSpeed">风速</option>      
                    <option value="windDirection">风向</option>      
                    <option value="pressure">气压</option>      
                    <option value="radiation">辐射</option>      
                  </select>      
                </div>      
      
                {/* Monitoring Device ID */}      
                <div>      
                  <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                    监测设备编号      
                  </label>      
                  <input      
                    type="text"      
                    name="deviceId"      
                    id="deviceId"      
                    value={formData.deviceId}      
                    onChange={handleInputChange}      
                    placeholder="请输入监测设备编号"      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />      
                </div>      
      
                {/* Monitoring Device Brand */}      
                <div>      
                  <label htmlFor="deviceBrand" className="block text-sm font-medium text-gray-700 mb-1">      
                    监测设备品牌      
                  </label>      
                  <input      
                    type="text"      
                    name="deviceBrand"      
                    id="deviceBrand"      
                    value={formData.deviceBrand}      
                    onChange={handleInputChange}      
                    placeholder="请输入监测设备品牌"      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />      
                </div>      
      
                {/* Weather Data Value */}      
                <div>      
                  <label htmlFor="weatherValue" className="block text-sm font-medium text-gray-700 mb-1">      
                    气象数据值      
                  </label>      
                  <input      
                    type="number"      
                    step="0.01"      
                    name="weatherValue"      
                    id="weatherValue"      
                    value={formData.weatherValue}      
                    onChange={handleInputChange}      
                    placeholder="请输入气象数据值"      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />      
                </div>      
      
                {/* Unit */}      
                <div>      
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">      
                    数据单位      
                  </label>      
                  <select      
                    id="unit"      
                    name="unit"      
                    value={formData.unit}      
                    onChange={handleInputChange}      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  >      
                    <option value="celsius">摄氏度</option>      
                    <option value="fahrenheit">华氏度</option>      
                    <option value="percent">百分比</option>      
                    <option value="mm">毫米</option>      
                    <option value="m/s">米/秒</option>      
                    <option value="hpa">百帕</option>      
                  </select>      
                </div>      
      
                {/* Data Accuracy */}      
                <div>      
                  <label htmlFor="accuracy" className="block text-sm font-medium text-gray-700 mb-1">      
                    数据准确性      
                  </label>      
                  <select      
                    id="accuracy"      
                    name="accuracy"      
                    value={formData.accuracy}      
                    onChange={handleInputChange}      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  >      
                    <option value="high">高</option>      
                    <option value="medium">中</option>      
                    <option value="low">低</option>      
                  </select>      
                </div>      
              </div>      
      
              {/* Anomaly Description */}      
              <div>      
                <label htmlFor="anomalyDescription" className="block text-sm font-medium text-gray-700 mb-1">      
                  数据异常说明      
                </label>      
                <textarea      
                  id="anomalyDescription"      
                  name="anomalyDescription"      
                  rows={4}      
                  value={formData.anomalyDescription}      
                  onChange={handleInputChange}      
                  placeholder="请输入数据异常说明"      
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                ></textarea>      
              </div>      
      
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">      
                {/* Data Image */}      
                <div>      
                  <label htmlFor="dataImage" className="block text-sm font-medium text-gray-700 mb-1">      
                    监测数据图片      
                  </label>      
                  <input      
                    type="file"      
                    id="dataImage"      
                    name="dataImage"      
                    accept="image/*"      
                    onChange={handleFileChange}      
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"      
                  />      
                </div>      
      
                {/* Data Report */}      
                <div>      
                  <label htmlFor="dataReport" className="block text-sm font-medium text-gray-700 mb-1">      
                    监测数据报告      
                  </label>      
                  <div className="flex items-center justify-between">      
                    <input      
                      type="file"      
                      id="dataReport"      
                      name="dataReport"      
                      accept=".pdf,.doc,.docx,.xls,.xlsx"      
                      onChange={handleFileChange}      
                      className="hidden"      
                      id="dataReportInput"      
                    />      
                    <button      
                      type="button"      
                      onClick={() => document.getElementById('dataReportInput').click()}      
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"      
                    >      
                      选择文件      
                    </button>      
                    <span className="text-sm text-gray-500">      
                      {formData.dataReport ? formData.dataReport.name : '未选择文件'}      
                    </span>      
                  </div>      
                </div>      
              </div>      
      
              {/* Submit Buttons */}      
              <div className="flex justify-end space-x-3 pt-4">      
                <button      
                  type="button"      
                  onClick={() => navigate('/')}      
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"      
                >      
                  取消      
                </button>      
                <button      
                  type="submit"      
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"      
                >      
                  提交      
                </button>      
              </div>      
            </form>      
          </div>      
        </div>      
      </main>      
      
      {/* Footer */}      
      <footer className="bg-white border-t border-gray-200 py-4">      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">      
          Copyright © 2025. All rights reserved.      
        </div>      
      </footer>      
    </div>      
  );      
}      