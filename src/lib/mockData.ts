import { toast } from 'sonner';

// 定义数据类型
export interface FarmData {
  totalCrops: number;
  healthRate: number;
  alertCount: number;
  yieldPrediction: number;
  cropsTrend: 'up' | 'down' | 'stable';
  healthTrend: 'up' | 'down' | 'stable';
  alertTrend: 'up' | 'down' | 'stable';
  yieldTrend: 'up' | 'down' | 'stable';
  recentAlerts: Alert[];
  recentActivities: Activity[];
  healthyPlants: number;
  concernPlants: number;
  unhealthyPlants: number;
  soilConditions: SoilCondition[];
  cropMetrics: CropMetric[];
}

export interface Alert {
  id: number;
  title: string;
  type: 'warning' | 'alert' | 'info';
  time: string;
  description: string;
  affectedArea: string;
}

export interface Activity { 
  id: number;
  title: string;
  icon: string;
  date: string;
  description: string; 
  cropType: string;
  duration: string;
}

export interface SoilCondition {
  area: string;
  ph: number;
  moisture: number;
}

export interface CropMetric {
  id: number;
  name: string;
  quantity: number;
  healthRate: number;
  growthStage: string;
  yieldPrediction: string;
}

export interface CropHealthData {
  date: string;
  healthIndex: number;
}

export interface EnvironmentalData {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

// 模拟点击查看详情的函数
export function viewAlertDetails(alert: Alert) {
  toast.info(`查看${alert.title}详情`, {
    description: alert.description,
    duration: 5000,
  });
}

// 获取农场概况数据
export function getFarmData(): FarmData {
  return {
    totalCrops: 84500,  // 调整为更合理的作物总数（单位：株）
    healthRate: 86.2,   // 健康率调整为更实际的86.2%
    alertCount: 5,      // 增加预警数量
    yieldPrediction: 8.7, // 产量预估调整为8.7吨/亩（更符合实际）
    cropsTrend: 'up',
    healthTrend: 'up',
    alertTrend: 'down',
    yieldTrend: 'up',
    healthyPlants: 72839, // 健康作物数量
    concernPlants: 8946,  // 需要关注的作物数量
    unhealthyPlants: 2715, // 不健康作物数量

    recentAlerts: [
      {
        id: 1,
        title: '强降雨预警',
        type: 'warning',
        time: '今天 14:30',
        description: '未来24小时将有强降雨（预计降雨量50-80mm），可能导致农田积水，建议提前做好排水准备，检查排水系统。',
        affectedArea: '所有区域'
      },
      {
        id: 2,
        title: '虫害监测',
        type: 'alert',
        time: '昨天 09:15',
        description: 'A区玉米发现蚜虫聚集（密度约15头/株），达到防治阈值，建议立即采取生物防治措施或喷洒低毒杀虫剂。',
        affectedArea: 'A区玉米田'
      },
      {
        id: 3,
        title: '干旱预警',
        type: 'warning',
        time: '3天前',
        description: 'D区土壤湿度低于40%，达到干旱预警阈值，启动二级抗旱响应，调整灌溉计划。',
        affectedArea: 'D区'
      },
      {
        id: 4,
        title: '低温预警',
        type: 'warning',
        time: '2天前',
        description: '夜间温度将降至5℃以下，可能对幼苗造成影响，请采取覆盖保温措施。',
        affectedArea: 'B区、C区' 
      },
      {
        id: 5,
        title: '大风预警',
        type: 'alert',
        time: '1天前',
        description: '预计将出现6-7级大风，可能导致高秆作物倒伏，建议及时加固或提前收获成熟作物。',
        affectedArea: 'A区、E区'
      }
    ],

    recentActivities: [
      { 
        id: 1, 
        title: '精准施肥', 
        icon: 'fa-fertilizer', 
        date: '今天', 
        description: '对B区小麦进行了春季追肥，使用氮磷钾复合肥(N:P:K=20:10:15)，用量15kg/亩。', 
        cropType: '小麦', 
        duration: '4小时' 
      },
      { 
        id: 2, 
        title: '病虫害绿色防治', 
        icon: 'fa-bug', 
        date: '昨天', 
        description: '对A区玉米采用生物防治方法控制蚜虫，释放蚜茧蜂，密度为3000头/亩。', 
        cropType: '玉米', 
        duration: '3小时' 
      },
      { 
        id: 3, 
        title: '智能灌溉', 
        icon: 'fa-tint', 
        date: '2天前', 
        description: '根据土壤墒情数据，对C区水稻进行了智能滴灌，用水量30m³/亩，土壤湿度维持在65-70%。', 
        cropType: '水稻', 
        duration: '5小时' 
      },
      { 
        id: 4, 
        title: '气候适应性种植调整', 
        icon: 'fa-sun', 
        date: '3天前', 
        description: '根据长期天气预报，调整了E区种植结构，增加耐旱品种比例至30%。', 
        cropType: '多种作物', 
        duration: '8小时' 
      }
    ],

    soilConditions: [
      { area: 'A区', ph: 6.8, moisture: 65 },
      { area: 'B区', ph: 7.2, moisture: 58 },
      { area: 'C区', ph: 6.5, moisture: 72 },
      { area: 'D区', ph: 7.0, moisture: 38 },  // 显示干旱情况
      { area: 'E区', ph: 6.7, moisture: 52 }
    ],

    cropMetrics: [
       { id: 1, name: '小麦', quantity: 12000, healthRate: 92, growthStage: '抽穗期', yieldPrediction: '520公斤/亩' },
       { id: 2, name: '玉米', quantity: 8500, healthRate: 88, growthStage: '灌浆期', yieldPrediction: '580公斤/亩' },
       { id: 3, name: '水稻', quantity: 15000, healthRate: 90, growthStage: '分蘖期', yieldPrediction: '650公斤/亩' },
       { id: 4, name: '大豆', quantity: 6000, healthRate: 76, growthStage: '开花期', yieldPrediction: '180公斤/亩' },
        { id: 5, name: '高粱', quantity: 4500, healthRate: 85, growthStage: '拔节期', yieldPrediction: '480公斤/亩' }
    ]
  };
}

// 气候韧性农业指标数据
export function getClimateResilienceData() {
  return {
    resilienceScore: 87,  // 气候韧性指数
    droughtResistance: 82, // 抗旱能力指数
    floodResistance: 78,   // 抗涝能力指数
    temperatureAdaptation: 90, // 温度适应性指数
    pestResistance: 85,    // 病虫害抵抗能力指数
    
    climateEvents: [
      { year: '2020', events: 12, losses: 15.2 },
      { year: '2021', events: 15, losses: 12.8 },
      { year: '2022', events: 18, losses: 9.5 },
      { year: '2023', events: 20, losses: 6.3 },
      { year: '2024', events: 22, losses: 4.1 }
    ],
    
    adaptationMeasures: [
      { measure: '耐旱品种推广', implementation: 75, effectiveness: 85 },
      { measure: '节水灌溉系统', implementation: 90, effectiveness: 92 },
      { measure: '土壤改良', implementation: 65, effectiveness: 78 },
      { measure: '生态沟渠建设', implementation: 80, effectiveness: 88 },
      { measure: '病虫害绿色防控', implementation: 85, effectiveness: 90 }
    ]
  };
}

// 个人版数据同步函数
export function syncPersonalData() {
  // 模拟从个人版同步数据
  return {
    status: 'success',
    lastSync: '2025-08-24 09:32',
    syncedItems: {
      fieldNotes: 24,
      photos: 156,
      personalObservations: 37,
      customCropData: 5
    }
  };
}

// 获取作物健康数据
export function getCropHealthData(): CropHealthData[] {
  return [
    { date: '5/1', healthIndex: 85 },
    { date: '5/8', healthIndex: 88 },
    { date: '5/15', healthIndex: 86 },
    { date: '5/22', healthIndex: 90 },
    { date: '5/29', healthIndex: 91 },
    { date: '6/5', healthIndex: 93 },
    { date: '6/12', healthIndex: 92 },
  ];
}

// 获取环境监测数据
export function getEnvironmentalData(): EnvironmentalData[] {
  return [
    { time: '6:00', temperature: 18, humidity: 75, light: 2000, rainfall: 0, cloudCover: 60 },
    { time: '9:00', temperature: 22, humidity: 65, light: 8000, rainfall: 0, cloudCover: 40 },
    { time: '12:00', temperature: 28, humidity: 50, light: 15000, rainfall: 0, cloudCover: 20 },
    { time: '15:00', temperature: 30, humidity: 45, light: 12000, rainfall: 5, cloudCover: 70 },
    { time: '18:00', temperature: 24, humidity: 60, light: 3000, rainfall: 12, cloudCover: 90 },
    { time: '21:00', temperature: 20, humidity: 70, light: 0, rainfall: 3, cloudCover: 80 },
  ];
}

 // 云量分布数据 - 带时间序列的云量变化数据
 export function getCloudCoverData() {
   return [
     { time: '00:00', coverage: 85 },
     { time: '03:00', coverage: 90 },
     { time: '06:00', coverage: 75 },
     { time: '09:00', coverage: 60 },
     { time: '12:00', coverage: 45 },
     { time: '15:00', coverage: 30 },
     { time: '18:00', coverage: 55 },
     { time: '21:00', coverage: 70 },
   ];
 }
 
 // 区域雨量分布数据 - 包含预测降雨量
 export function getRainfallDistributionData() {
   return [
     { region: 'A区', rainfall: 65, predicted: 72 },
     { region: 'B区', rainfall: 42, predicted: 45 },
     { region: 'C区', rainfall: 78, predicted: 68 },
     { region: 'D区', rainfall: 28, predicted: 35 },
     { region: 'E区', rainfall: 55, predicted: 50 },
   ];
 }