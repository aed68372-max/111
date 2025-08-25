import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 个人资料页面组件
export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '惠民路211号农场主',
    email: 'admin@smartfarm.com',
    phone: '13800138000',
    role: '管理员',
    farmName: '智慧生态农场',
    farmSize: '265亩',
    joinDate: '2023-03-15',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Farmer%20avatar%2C%20middle-aged%20male%2C%20smiling%2C%20wearing%20straw%20hat%2C%20professional%20portrait%20photography&sign=9d664b9d687e74492c3ff14265b2cd6c'
  });
  
  // 个人资料表单状态
  const [formData, setFormData] = useState(profileData);
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 保存个人资料更改
  const saveProfileChanges = () => {
    setProfileData(formData);
    setIsEditing(false);
    // 这里可以添加保存到本地存储或API调用的逻辑
    alert('个人资料更新成功！');
  };
  
  // 返回首页
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button 
              onClick={goBack}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="text-xl font-bold text-green-800">个人中心</h1>
          </div>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={saveProfileChanges}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                保存
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
            >
              <i className="fa-solid fa-edit mr-1"></i> 编辑资料
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* 个人资料卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6 text-center">
          <div className="relative inline-block">
            <img 
               src="https://lf-code-agent.coze.cn/obj/x-ai-cn/270397475074/attachment/{19D82F8A-B5C7-9AF2-3D14-AAD9E6EF29B1}_20250825102537.jpg" 
              alt="用户头像" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition-colors">
                <i className="fa-solid fa-camera"></i>
              </button>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{profileData.name}</h2>
          <p className="text-green-600 text-sm mt-1">{profileData.role}</p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <p className="text-2xl font-bold text-green-700">{profileData.farmSize}</p>
              <p className="text-xs text-gray-500 mt-1">农场面积</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-green-700">5</p>
              <p className="text-xs text-gray-500 mt-1">管理作物</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-green-700">12</p>
              <p className="text-xs text-gray-500 mt-1">智能设备</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-green-700">48</p>
              <p className="text-xs text-gray-500 mt-1">活动记录</p>
            </div>
          </div>
        </div>
        
        {/* 用户信息表单/卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800">基本信息</h3>
          </div>
          
          <div className="p-5 space-y-4">
            {/* 姓名 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">姓名</p>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.name}</p>   
                )}
              </div>
            </div>
            
            {/* 电子邮箱 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">电子邮箱</p>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.email}</p>   
                )}
              </div>
            </div>
            
            {/* 手机号码 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">手机号码</p>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.phone}</p>   
                )}
              </div>
            </div>
            
            {/* 农场名称 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">农场名称</p>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.farmName}</p>   
                )}
              </div>
            </div>
            
            {/* 农场规模 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">农场规模</p>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (   
                  <p className="text-gray-800">{profileData.farmSize}</p>
                )}
              </div>
            </div>
            
            {/* 加入日期 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-gray-500">加入日期</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-800">{profileData.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能菜单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800">系统功能</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-cog text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">系统设置</p>
                  <p className="text-sm text-gray-500">个性化您的使用体验</p>
                </div>
              </div>
              <i className="fa-solid fa-angle-right text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-question-circle text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">帮助与支持</p>
                  <p className="text-sm text-gray-500">获取使用帮助和技术支持</p>
                </div>
              </div>
              <i className="fa-solid fa-angle-right text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-file-text text-purple-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">使用条款</p>
                  <p className="text-sm text-gray-500">查看服务条款和隐私政策</p>
                </div>
              </div>
              <i className="fa-solid fa-angle-right text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors text-red-600">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <i className="fa-solid fa-sign-out-alt text-red-600"></i>
                </div>
                <div>
                  <p className="font-medium">退出登录</p>
                  <p className="text-sm text-gray-500">安全退出当前账户</p>
                </div>
              </div>
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}