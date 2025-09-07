export interface VideoData {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  platform: 'douyin' | 'xiaohongshu' | 'kuaishou' | 'shipinhao' | 'bilibili' | 'other';
  createdAt: Date;
  // 新增维度
  serviceType?: 'cleaning' | 'babysitting' | 'eldercare' | 'cooking' | 'laundry' | 'other';
  duration?: number; // 视频时长(秒)
  location?: string; // 地理位置
  targetAge?: 'young' | 'middle' | 'senior' | 'all';
  customerSatisfaction?: number; // 客户满意度评分 1-5
  serviceFrequency?: 'daily' | 'weekly' | 'monthly' | 'occasional';
  price?: number; // 服务价格
  completionRate?: number; // 完成率 0-100
  engagementRate?: number; // 互动率
  conversionRate?: number; // 转化率
}

export interface HotTopic {
  id: string;
  title: string;
  description: string;
  category: 'cleaning' | 'babysitting' | 'eldercare' | 'general';
  trend: 'rising' | 'hot' | 'stable' | 'falling';
  engagement: number;
  timeframe: 'today' | 'week' | 'month';
  source: string;
  createdAt: Date;
}

export interface IndustryMetrics {
  marketSize: number;
  growthRate: number;
  userPenetration: number;
  avgServicePrice: number;
  popularServices: Array<{
    name: string;
    percentage: number;
  }>;
  regionalData: Array<{
    region: string;
    demand: number;
    supply: number;
  }>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalysisResult {
  title: string;
  content: string;
  keywords: string[];
  script: {
    scenes: {
      description: string;
      visual: string;
      tone: string;
      state: string;
    }[];
  };
}