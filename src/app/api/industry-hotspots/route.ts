import { NextRequest, NextResponse } from 'next/server';
import { HotTopic, IndustryMetrics } from '@/types';

// 标记为动态路由
export const dynamic = 'force-dynamic';

// 模拟家政行业热点数据 (实际项目中可以集成真实API)
const generateHotTopics = (timeframe: 'today' | 'week' | 'month'): HotTopic[] => {
  const topics = {
    today: [
      {
        id: '1',
        title: '春节期间家政服务需求激增，预订量同比增长300%',
        description: '随着春节临近，深度清洁、年夜饭制作等服务需求大幅增长',
        category: 'cleaning' as const,
        trend: 'rising' as const,
        engagement: 8500,
        timeframe: 'today' as const,
        source: '家政行业报告',
        createdAt: new Date()
      },
      {
        id: '2',
        title: '智能家政设备市场突破，AI辅助服务成新趋势',
        description: '扫地机器人、智能清洁工具等设备与传统家政服务结合',
        category: 'general' as const,
        trend: 'hot' as const,
        engagement: 12300,
        timeframe: 'today' as const,
        source: '科技资讯',
        createdAt: new Date()
      },
      {
        id: '3',
        title: '月嫂服务价格上涨20%，高端育婴师供不应求',
        description: '专业月嫂和育婴师需求持续增长，服务价格稳步上升',
        category: 'babysitting' as const,
        trend: 'rising' as const,
        engagement: 6800,
        timeframe: 'today' as const,
        source: '母婴行业周刊',
        createdAt: new Date()
      }
    ],
    week: [
      {
        id: '4',
        title: '居家养老服务成热门赛道，专业护理员缺口达50万',
        description: '老龄化社会推动居家养老服务快速发展，专业人才紧缺',
        category: 'eldercare' as const,
        trend: 'hot' as const,
        engagement: 15600,
        timeframe: 'week' as const,
        source: '养老产业观察',
        createdAt: new Date()
      },
      {
        id: '5',
        title: '家政O2O平台融资热潮，头部企业估值突破百亿',
        description: '多家家政平台完成新一轮融资，行业整合加速',
        category: 'general' as const,
        trend: 'stable' as const,
        engagement: 9200,
        timeframe: 'week' as const,
        source: '投资界',
        createdAt: new Date()
      },
      {
        id: '6',
        title: '绿色清洁产品需求增长，环保家政服务受青睐',
        description: '消费者环保意识提升，无毒清洁产品和服务成为新宠',
        category: 'cleaning' as const,
        trend: 'rising' as const,
        engagement: 7400,
        timeframe: 'week' as const,
        source: '环保资讯',
        createdAt: new Date()
      }
    ],
    month: [
      {
        id: '7',
        title: '家政行业标准化进程加速，服务质量认证体系完善',
        description: '国家推出家政服务标准化指导意见，行业规范化发展',
        category: 'general' as const,
        trend: 'stable' as const,
        engagement: 18900,
        timeframe: 'month' as const,
        source: '政策解读',
        createdAt: new Date()
      },
      {
        id: '8',
        title: '95后成为家政服务主力消费群体，线上预订占比超70%',
        description: '年轻消费者偏好便捷的线上预订方式，推动行业数字化转型',
        category: 'general' as const,
        trend: 'hot' as const,
        engagement: 22100,
        timeframe: 'month' as const,
        source: '消费趋势报告',
        createdAt: new Date()
      },
      {
        id: '9',
        title: '家政服务员职业技能培训体系升级，专业化水平提升',
        description: '政府加大培训投入，家政服务员技能水平和收入待遇双提升',
        category: 'general' as const,
        trend: 'rising' as const,
        engagement: 13500,
        timeframe: 'month' as const,
        source: '职业教育网',
        createdAt: new Date()
      }
    ]
  };

  return topics[timeframe] || [];
};

// 模拟行业数据指标
const getIndustryMetrics = (): IndustryMetrics => {
  return {
    marketSize: 10149, // 亿元
    growthRate: 15.2, // %
    userPenetration: 93.8, // %
    avgServicePrice: 120, // 元/小时
    popularServices: [
      { name: '家居保洁', percentage: 64.8 },
      { name: '月嫂育婴', percentage: 23.5 },
      { name: '老人护理', percentage: 18.7 },
      { name: '烹饪服务', percentage: 12.3 },
      { name: '洗衣熨烫', percentage: 8.9 }
    ],
    regionalData: [
      { region: '北京', demand: 95, supply: 78 },
      { region: '上海', demand: 92, supply: 85 },
      { region: '广州', demand: 88, supply: 82 },
      { region: '深圳', demand: 90, supply: 75 },
      { region: '杭州', demand: 85, supply: 80 }
    ]
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') as 'today' | 'week' | 'month' || 'today';
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const hotTopics = generateHotTopics(timeframe);
    const industryMetrics = getIndustryMetrics();
    
    return NextResponse.json({
      success: true,
      data: {
        hotTopics,
        industryMetrics,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Industry hotspots API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取行业热点数据失败' 
      },
      { status: 500 }
    );
  }
}

// 如果需要集成真实API，可以使用以下代码结构：
/*
async function fetchRealHotspots(timeframe: string) {
  try {
    // 示例：使用NewsAPI获取家政行业相关新闻
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=家政服务&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();
    
    // 处理和转换数据格式
    return data.articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description,
      category: 'general',
      trend: 'hot',
      engagement: Math.floor(Math.random() * 10000),
      timeframe,
      source: article.source.name,
      createdAt: new Date(article.publishedAt)
    }));
  } catch (error) {
    console.error('Failed to fetch real hotspots:', error);
    return [];
  }
}
*/
