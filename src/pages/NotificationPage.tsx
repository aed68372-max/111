import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Clock, Filter, Search, Settings, X } from 'lucide-react';

// 模拟通知数据
const NOTIFICATIONS = [
  {
    id: 1,
    title: '系统更新通知',
    message: '智慧农业助手已更新至最新版本v2.3.0，新增气候韧性分析功能',
    time: '今天 08:30',
    read: false,
    type: 'system'
  },
  {
    id: 2,
    title: '灌溉提醒',
    message: 'A区小麦田今日需要灌溉，建议在上午10点前完成',
    time: '昨天 15:45',
    read: true,
    type: 'reminder'
  },
  {
    id: 3,
    title: '异常天气预警',
    message: '未来24小时将有强降雨，预计降雨量50-80mm，请提前做好排水准备',
    time: '昨天 09:12',
    read: true,
    type: 'warning'
  },
  {
    id: 4,
    title: '土壤监测报告',
    message: 'D区土壤湿度低于阈值，已自动调整灌溉计划',
    time: '2天前',
    read: true,
    type: 'report'
  },
  {
    id: 5,
    title: '设备维护提醒',
    message: '智能灌溉系统过滤器需要清洁，请安排维护人员处理',
    time: '3天前',
    read: true,
    type: 'maintenance'
  }
];

// 通知类型配置
const notificationTypes = [
  { id: 'all', name: '全部通知' },
  { id: 'warning', name: '预警通知' },
  { id: 'reminder', name: '提醒事项' },
  { id: 'report', name: '数据报告' },
  { id: 'system', name: '系统通知' },
  { id: 'maintenance', name: '设备维护' }
];

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 导航到不同页面
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // 过滤通知
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = activeFilter === 'all' || notification.type === activeFilter;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // 标记通知为已读 
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification 
      ) 
    ); 
}; 

  // 标记所有通知为已读 
  const markAllAsRead = () => { 
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true })) 
    ); 
  }; 
  
  // 删除通知 
  const deleteNotification = (id: number) => { 
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id) 
    ); 
}; 

  // 获取未读通知数量 
  const unreadCount = notifications.filter(notification => !notification.read).length; 
  
// 获取通知类型对应的图标和样式 
const getNotificationIcon = (type: string) => { 
switch(type) { 
case 'warning': 
return <div className="bg-amber-100 p-2 rounded-full text-amber-600"><i className="fa-solid fa-exclamation-triangle"></i></div>; 
case 'reminder': 
return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><i className="fa-solid fa-bell"></i></div>; 
case 'report': 
return <div className="bg-green-100 p-2 rounded-full text-green-600"><i className="fa-solid fa-chart-line"></i></div>; 
case 'maintenance': 
return <div className="bg-purple-100 p-2 rounded-full text-purple-600"><i className="fa-solid fa-wrench"></i></div>; 
default: 
return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><i className="fa-solid fa-info-circle"></i></div>; 
} 
}; 

return ( 
<div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800"> 
{/* Header */} 
<header className="sticky top-0 z-10 bg-white shadow-sm"> 
<div className="container mx-auto px-4 py-4 flex justify-between items-center"> 
<div className="flex items-center space-x-2"> 
<button 
onClick={() => navigate('/')} 
className="text-green-600 hover:text-green-700 transition-colors" 
> 
<i className="fa-solid fa-arrow-left"></i> 
</button> 
<h1 className="text-xl font-bold text-green-800 flex items-center"> 
<i className="fa-solid fa-bell text-green-600 mr-2"></i> 
通知中心 
{unreadCount >0 && ( 
<span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"> 
{unreadCount} 
</span> 
)} 
</h1> 
</div> 
<div className="flex space-x-2"> 
<button className="p-2 rounded-full hover:bg-gray-100 transition-colors"> 
<i className="fa-solid fa-cog text-gray-600"></i> 
</button> 
</div> 
</div> 
</header> 

<main className="container mx-auto px-4 py-6"> 
{/* 搜索和过滤栏 */} 
<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6"> 
<div className="relative"> 
<i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i> 
<input 
type="text" 
placeholder="搜索通知..." 
className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
value={searchQuery} 
onChange={(e) => setSearchQuery(e.target.value)} 
/> 
{searchQuery && ( 
<button 
className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" 
onClick={() => setSearchQuery('')} 
> 
<i className="fa-solid fa-times"></i> 
</button> 
)} 
</div> 

<div className="mt-4 flex justify-between items-center"> 
<button 
onClick={() => setShowFilters(!showFilters)} 
className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors" 
> 
<i className="fa-solid fa-filter mr-1"></i> 
筛选 
<i className={`fa-solid fa-chevron-down ml-1 text-xs transition-transform ${showFilters ? 'transform rotate-180' : ''}`}></i> 
</button> 

{unreadCount >0 && ( 
<button 
onClick={markAllAsRead} 
className="text-sm text-green-600 hover:text-green-700 transition-colors" 
> 
<i className="fa-solid fa-check-circle mr-1"></i> 
全部标为已读 
</button> 
)} 
</div> 

{/* 筛选选项 */} 
{showFilters && ( 
<div className="mt-4 flex flex-wrap gap-2"> 
{notificationTypes.map(type => ( 
<button 
key={type.id} 
onClick={() => setActiveFilter(type.id)} 
className={`px-3 py-1 rounded-full text-xs transition-all ${ 
activeFilter === type.id 
? 'bg-green-600 text-white' 
: 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
}`} 
> 
{type.name} 
</button> 
))} 
</div> 
)} 
</div> 

{/* 通知列表 */} 
{filteredNotifications.length ===0 ? ( 
<div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center"> 
<div className="bg-gray-100 p-4 rounded-full inline-flex mb-4"> 
<i className="fa-solid fa-inbox text-gray-400 text-xl"></i> 
</div> 
<h3 className="text-lg font-medium text-gray-800 mb-1">没有找到通知</h3> 
<p className="text-gray-500">尝试调整筛选条件或搜索其他关键词</p> 
</div> 
) : ( 
<div className="space-y-3"> 
{filteredNotifications.map(notification => ( 
<div 
key={notification.id} 
className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all duration-300 hover:shadow-md ${ 
!notification.read ? 'border-l-4 border-green-500' : '' 
} cursor-pointer group`} 
onClick={() => !notification.read && markAsRead(notification.id)} 
> 
<div className="flex justify-between items-start"> 
<div className="flex items-start space-x-3"> 
{getNotificationIcon(notification.type)} 
<div className="flex-1 min-w-0"> 
<div className="flex justify-between items-start"> 
<h3 className={`font-medium ${!notification.read ? 'text-green-800' : 'text-gray-700'}`}> 
{notification.title} 
</h3> 
<span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span> 
</div> 
<p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p> 
</div> 
</div> 

<div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"> 
<button 
className="p-1.5 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors" 
onClick={(e) => { 
e.stopPropagation(); 
markAsRead(notification.id); 
}} 
title={notification.read ? "标记为未读" : "标记为已读"} 
> 
{notification.read ? ( 
<i className="fa-regular fa-circle"></i> 
) : ( 
<i className="fa-solid fa-check-circle text-green-500"></i> 
)} 
</button> 

<button 
className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" 
onClick={(e) => { 
e.stopPropagation(); 
deleteNotification(notification.id); 
}} 
title="删除通知" 
> 
<i className="fa-solid fa-trash"></i> 
</button> 

<button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"> 
<i className="fa-solid fa-ellipsis-v"></i> 
</button> 
</div> 
</div> 
</div> 
))} 
</div> 
)} 

{/* 加载更多 */} 
{filteredNotifications.length >0 && ( 
<div className="mt-6 text-center"> 
<button className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"> 
<span>加载更多</span> 
<i className="fa-solid fa-chevron-down ml-1 text-xs"></i> 
</button> 
</div> 
)} 
</main> 

{/* 底部操作栏 - 在移动设备上显示 */} 
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-around shadow-lg"> 
<button 
className="flex flex-col items-center text-green-600 hover:opacity-80 transition-opacity" 
onClick={() => navigateTo('/')} 
> 
<i className="fa-solid fa-home text-lg"></i> 
<span className="text-xs mt-1">首页</span> 
</button> 
<button 
className="flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors" 
onClick={() => navigateTo('/schedule')} 
> 
<i className="fa-solid fa-calendar text-lg"></i> 
<span className="text-xs mt-1">日程</span> 
</button> 
<button 
className="flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors" 
onClick={() => navigateTo('/data')} 
> 
<i className="fa-solid fa-chart-line text-lg"></i> 
<span className="text-xs mt-1">数据</span> 
</button> 
<button 
className="flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors" 
onClick={() => navigateTo('/profile')} 
> 
<i className="fa-solid fa-user text-lg"></i> 
<span className="text-xs mt-1">我的</span> 
</button> 
</div> 
</div> 
); 
}