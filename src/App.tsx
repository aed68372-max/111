import { Routes, Route } from "react-router-dom";
import { useContext } from 'react';
import Home from "@/pages/Home"; 
import CropDetail from "@/pages/CropDetail";
import NotificationPage from "@/pages/NotificationPage";
import ProfilePage from "@/pages/ProfilePage";
import WeatherMonitoring from "@/pages/WeatherMonitoring";
import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { setIsAuthenticated } = useContext(AuthContext);
  
  // 表单验证
  const validateForm = () => {
    if (!username.trim()) {
      return '用户名不能为空';
    }
    if (!password.trim()) {
      return '密码不能为空';
    }
    if (password.length < 6) {
      return '密码长度不能少于6位';
    }
    return null;
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      setFormSuccess('');
      return;
    }
    
    setIsLoading(true);
    setFormError('');
    setFormSuccess('');
    
    // 模拟登录请求
    setTimeout(() => {
      // 模拟API调用
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        setFormSuccess('登录成功，正在重定向...');
        toast.success('登录成功！欢迎使用智慧农业助手');
        
        // 延迟重定向以显示成功状态
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setFormError('用户名或密码错误，请重试');
        // 添加输入框抖动动画
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
          input.classList.add('animate-shake');
          setTimeout(() => input.classList.remove('animate-shake'), 500);
        });
      }
      setIsLoading(false);
    }, 1500);
  };
  
  // 密码强度检测
  const getPasswordStrength = () => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* 登录卡片 */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-500 hover:shadow-2xl border border-gray-100">
        {/* 顶部品牌区域 */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-4">
            <i className="fa-solid fa-leaf text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold mb-1">智慧农业助手</h1>
          <p className="text-green-100 text-sm">企业级农场管理系统</p>
        </div>
        
        {/* 表单区域 */}
        <div className="p-6">
          {/* 状态消息 */}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center animate-fade-in">
              <i className="fa-solid fa-exclamation-circle mr-2"></i>
              {formError}
            </div>
          )}
          
          {formSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm flex items-center animate-fade-in">
              <i className="fa-solid fa-check-circle mr-2"></i>
              {formSuccess}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* 用户名输入 */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
              <div className={`relative ${usernameFocused || username ? 'focus-within:border-green-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="请输入用户名"
                  autoComplete="username"
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => setUsername('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="fa-solid fa-times-circle"></i>
                  </button>
                )}
              </div>
            </div>
            
            {/* 密码输入 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
                {password && (
                  <span className={`text-xs ${
                    getPasswordStrength() === 'weak' ? 'text-red-500' : 
                    getPasswordStrength() === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {getPasswordStrength() === 'weak' ? '弱密码' : 
                     getPasswordStrength() === 'medium' ? '中等强度' : '强密码'}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="请输入密码"
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
              
              {/* 密码强度指示器 */}
              {password && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      getPasswordStrength() === 'weak' ? 'bg-red-500 w-1/3' : 
                      getPasswordStrength() === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
              )}
            </div>
            
            {/* 选项 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-700 transition-colors">
                  忘记密码?
                </a>
              </div>
            </div>
            
            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-sign-in-alt mr-2"></i>
                  <span>登录系统</span>
                </>
              )}
            </button>
          </form>
          
          {/* 演示账号信息 */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">演示账号</p>
              <div className="flex justify-center space-x-3">
                <div className="bg-gray-100 px-3 py-1 rounded text-xs font-mono">admin</div>
                <div className="bg-gray-100 px-3 py-1 rounded text-xs font-mono">password</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部注册提示 */}
        <div className="bg-gray-50 px-6 py-4 text-center text-sm border-t border-gray-100">
          <span className="text-gray-600">还没有账号? </span>
          <a href="#" className="font-medium text-green-600 hover:text-green-700 transition-colors">
            联系管理员创建账号
          </a>
        </div>
      </div>
      
      {/* 页脚版权信息 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        <p>© 2025 智慧农业助手. 保留所有权利.</p>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟验证登录状态
    setTimeout(() => {
      // 这里可以从localStorage或其他地方检查登录状态
      const savedAuth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(savedAuth === 'true');
      setLoading(false);
    }, 1000);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    // 登录成功后重定向到主页
    window.location.href = '/';
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <i className="fa-solid fa-leaf text-green-600 text-2xl animate-pulse"></i>
          </div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated: login, logout }}
    >
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/crops/:id" element={isAuthenticated ? <CropDetail /> : <Login />} /> 
        <Route path="/notifications" element={isAuthenticated ? <NotificationPage /> : <Login />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Login />} />
        <Route path="/weather-monitoring" element={isAuthenticated ? <WeatherMonitoring /> : <Login />} />
          <Route path="/weather-monitoring" element={isAuthenticated ? <WeatherMonitoring /> : <Login />} />
          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          {/* 404页面 - 客户端路由支持 */}
          <Route path="*" element={isAuthenticated ? <Home /> : <Login />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;