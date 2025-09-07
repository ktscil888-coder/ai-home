'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/types';
import { PaymentModal } from '@/components/payment-modal';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Target,
  Users,
  User,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Star,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  Quote,
  Zap,
  Crown,
  Rocket,
  TrendingDown,
  FileText,
  Download,
  Play,
  ExternalLink
} from 'lucide-react';

interface ProfessionalDashboardProps {
  videos: VideoData[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    averageViews: number;
    averageLikes: number;
    averageComments: number;
    averageShares: number;
  };
}

export function ProfessionalDashboard({ videos, stats }: ProfessionalDashboardProps) {
  // 轮播图状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 成功案例轮播状态管理
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  
  // 用户评价轮播状态管理
  const [reviewScrollPosition, setReviewScrollPosition] = useState(0);
  
  // 家政服务相关成功案例数据
  const successCases = [
    {
      icon: Rocket,
      iconBg: "from-blue-500 to-blue-600",
      title: "幸福家政服务公司",
      description: "通过AI内容营销提升品牌知名度，客户咨询量增长320%，服务预约转化率提升45%",
      metrics: [
        { label: "咨询量增长", value: "+320%" },
        { label: "转化率提升", value: "+45%" }
      ]
    },
    {
      icon: Crown,
      iconBg: "from-purple-500 to-purple-600",
      title: "宝贝月子中心",
      description: "利用AI分析优化月子餐宣传视频，妈妈群体关注度提升280%，品牌信任度显著增强",
      metrics: [
        { label: "关注度提升", value: "+280%" },
        { label: "信任度提升", value: "+65%" }
      ]
    },
    {
      icon: Zap,
      iconBg: "from-green-500 to-green-600",
      title: "专业月嫂服务中心",
      description: "AI驱动的精准内容营销，月嫂服务预订量增长450%，客户满意度达到98%",
      metrics: [
        { label: "预订量增长", value: "+450%" },
        { label: "客户满意度", value: "98%" }
      ]
    },
    {
      icon: Users,
      iconBg: "from-orange-500 to-orange-600",
      title: "温馨母婴护理",
      description: "通过AI内容分析优化产后护理服务展示，新客户获取成本降低35%，复购率提升60%",
      metrics: [
        { label: "获客成本降低", value: "-35%" },
        { label: "复购率提升", value: "+60%" }
      ]
    },
    {
      icon: Heart,
      iconBg: "from-red-500 to-red-600",
      title: "爱家家政平台",
      description: "AI智能推荐系统提升服务匹配效率，保洁服务订单增长380%，用户留存率提升75%",
      metrics: [
        { label: "订单增长", value: "+380%" },
        { label: "留存率提升", value: "+75%" }
      ]
    },
    {
      icon: Star,
      iconBg: "from-yellow-500 to-yellow-600",
      title: "金牌月嫂联盟",
      description: "AI内容营销策略打造专业形象，高端月嫂服务需求增长520%，品牌溢价能力大幅提升",
      metrics: [
        { label: "需求增长", value: "+520%" },
        { label: "品牌溢价", value: "+85%" }
      ]
    }
  ];
  
  // 家政服务相关用户评价数据
  const customerReviews = [
    {
      name: "王女士",
      role: "月子中心负责人",
      avatar: "from-pink-500 to-pink-600",
      rating: 5,
      comment: "AI助手帮我们分析月子餐视频内容，妈妈们的咨询量增加了280%，服务质量满意度达到98%！",
      company: "温馨月子会所",
      time: "1个月前"
    },
    {
      name: "刘经理", 
      role: "家政公司创始人",
      avatar: "from-blue-500 to-blue-600",
      rating: 5,
      comment: "通过AI内容营销优化，我们的保洁服务预约量增长了320%，客户推荐率大幅提升！",
      company: "洁净家政服务",
      time: "2个月前"
    },
    {
      name: "陈总监",
      role: "月嫂服务机构主管", 
      avatar: "from-green-500 to-green-600",
      rating: 5,
      comment: "AI分析帮我们精准定位产妇需求，月嫂服务预订量增长450%，服务质量显著提升！",
      company: "金牌月嫂中心",
      time: "3周前"
    },
    {
      name: "赵女士",
      role: "育儿嫂服务经理",
      avatar: "from-purple-500 to-purple-600", 
      rating: 5,
      comment: "AI内容策略让我们的育儿服务更具专业性，客户信任度提升65%，续约率达到90%！",
      company: "专业育儿服务",
      time: "1个月前"
    },
    {
      name: "孙总",
      role: "母婴护理中心CEO",
      avatar: "from-orange-500 to-orange-600",
      rating: 5, 
      comment: "AI驱动的营销策略让我们的产后修复服务知名度迅速提升，新客户增长380%！",
      company: "爱心母婴护理",
      time: "2个月前"
    },
    {
      name: "周经理",
      role: "家政平台运营总监",
      avatar: "from-red-500 to-red-600",
      rating: 5,
      comment: "AI智能推荐系统大幅提升了服务匹配效率，平台订单量增长520%，用户满意度极高！",
      company: "优家家政平台",
      time: "3个月前"
    },
    {
      name: "吴女士",
      role: "月子餐配送创始人",
      avatar: "from-yellow-500 to-yellow-600",
      rating: 5,
      comment: "AI内容分析让我们的月子餐更科学合理，妈妈群体认可度提升300%，复购率85%！",
      company: "营养月子餐",
      time: "1个月前"
    },
    {
      name: "马总监", 
      role: "月嫂培训学校校长",
      avatar: "from-indigo-500 to-indigo-600",
      rating: 5,
      comment: "AI辅助的培训内容让月嫂专业技能提升，学员就业率达到95%，行业口碑极佳！",
      company: "技能培训基地",
      time: "2个月前"
    }
  ];
  
  // 自动轮播效果
  useEffect(() => {
    const caseInterval = setInterval(() => {
      setCurrentCaseIndex((prev) => (prev + 1) % successCases.length);
    }, 3000);
    
    // 用户评价自动滚动效果
    const reviewInterval = setInterval(() => {
      setReviewScrollPosition((prev) => (prev + 1) % customerReviews.length);
    }, 3000);
    
    return () => {
      clearInterval(caseInterval);
      clearInterval(reviewInterval);
    };
  }, []);
  
  // 支付模态框状态管理
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: string;
    amount: number;
    description: string;
  } | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  
  // 价值主张轮播内容
  const valuePropositions = [
    {
      title: "AI驱动的智能内容营销",
      subtitle: "让数据为您的业务增长赋能",
      description: "通过先进的AI分析技术，我们帮助企业在短视频时代实现内容营销的智能化转型",
      metrics: ["300%+ 播放量增长", "85%+ 转化率提升", "5.2x 投资回报率"]
    },
    {
      title: "精准定位目标受众",
      subtitle: "让每一个内容都击中人心",
      description: "深度分析用户行为和偏好，为您的内容策略提供数据驱动的精准指导",
      metrics: ["95% 受众精准度", "250% 注册量增长", "400% 销售转化"]
    },
    {
      title: "全方位内容优化",
      subtitle: "从创意到数据的完整解决方案",
      description: "提供从内容策划、制作优化到效果分析的全流程AI助手服务",
      metrics: ["24/7 智能分析", "实时数据监控", "定制化报告"]
    }
  ];

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % valuePropositions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [valuePropositions.length]);

  // 微信支付处理函数
  const handlePayment = (planType: string, amount: number) => {
    const planDescriptions = {
      monthly: '月度版',
      quarterly: '季度版',
      yearly: '年度版'
    };
    
    setSelectedPlan({
      type: planType,
      amount: amount,
      description: planDescriptions[planType as keyof typeof planDescriptions] || '订阅服务'
    });
    
    setShowPaymentModal(true);
  };

  // 关闭支付模态框
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  // 计算额外指标
  const totalVideos = videos.length;
  const engagementRate = stats.totalViews > 0 ? ((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalViews * 100).toFixed(2) : '0';
  const topPerformingVideo = videos.reduce((prev, current) => 
    (prev.views > current.views) ? prev : current, videos[0]);
  
  const platformDistribution = videos.reduce((acc, video) => {
    acc[video.platform] = (acc[video.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentGrowth = [
    { metric: '播放量', value: '+12.5%', trend: 'up', icon: Eye },
    { metric: '点赞量', value: '+8.2%', trend: 'up', icon: Heart },
    { metric: '评论量', value: '+15.7%', trend: 'up', icon: MessageCircle },
    { metric: '分享量', value: '+22.1%', trend: 'up', icon: Share2 },
  ];

  const keyMetrics = [
    {
      title: '总播放量',
      value: stats.totalViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '较上月增长'
    },
    {
      title: '互动率',
      value: `${engagementRate}%`,
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '用户参与度'
    },
    {
      title: '视频总数',
      value: totalVideos.toString(),
      change: '+5',
      trend: 'up',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '本月新增'
    },
    {
      title: '平均表现',
      value: stats.averageViews.toLocaleString(),
      change: '+7.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '单视频平均播放'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 价值主张轮播图 */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
        {/* 轮播内容 */}
        <div className="relative z-10 p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {valuePropositions[currentSlide].title}
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              {valuePropositions[currentSlide].subtitle}
            </p>
            <p className="text-lg mb-8 text-blue-50 max-w-2xl mx-auto">
              {valuePropositions[currentSlide].description}
            </p>
            
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {valuePropositions[currentSlide].metrics.map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-2">{metric}</div>
                  <div className="text-sm text-blue-100">客户成果</div>
                </div>
              ))}
            </div>
            
            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                立即开始
              </Button>
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600">
                了解更多
              </Button>
            </div>
          </div>
        </div>
        
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {valuePropositions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* 手动切换按钮 */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + valuePropositions.length) % valuePropositions.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % valuePropositions.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ›
        </button>
      </div>

      {/* 成功案例展示 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Crown className="w-6 h-6 mr-2 text-yellow-600" />
            成功案例
          </h2>
          <Button variant="secondary" size="sm">
            查看全部案例
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* 成功案例轮播 */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {successCases.map((caseItem, index) => {
              const IconComponent = caseItem.icon;
              const isVisible = index === currentCaseIndex;
              const isNext = index === (currentCaseIndex + 1) % successCases.length;
              const isPrev = index === (currentCaseIndex - 1 + successCases.length) % successCases.length;
              
              return (
                <Card 
                  key={index}
                  className={`stat-card transition-all duration-1000 ease-in-out ${
                    isVisible 
                      ? 'opacity-100 transform scale-100 shadow-xl' 
                      : isNext || isPrev 
                        ? 'opacity-50 transform scale-95' 
                        : 'opacity-30 transform scale-90'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${caseItem.iconBg} rounded-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {caseItem.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {caseItem.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex}>
                          <p className="font-medium text-gray-900">{metric.value}</p>
                          <p className="text-gray-500">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* 轮播指示器 */}
          <div className="flex justify-center mt-6 space-x-2">
            {successCases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCaseIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentCaseIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 用户评价 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-600" />
            用户评价
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-sm text-gray-600">4.9/5.0 (1,234 评价)</span>
          </div>
        </div>
        
        {/* 用户评价自动轮播 */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${reviewScrollPosition * 100}%)` }}
          >
            {customerReviews.map((review, index) => (
              <div 
                key={index}
                className="w-full flex-shrink-0 px-3"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 主要评价卡片 */}
                  <Card className="stat-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${review.avatar} rounded-full flex items-center justify-center`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <p className="text-xs text-gray-500">{review.role}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, starIndex) => (
                                <Star key={starIndex} className="w-4 h-4 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            "{review.comment}"
                          </p>
                          <p className="text-xs text-gray-500">{review.company} · {review.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 补充信息卡片 */}
                  <Card className="stat-card bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">服务成果</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">客户满意度</span>
                            <span className="font-medium text-green-600">98%+</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">服务响应速度</span>
                            <span className="font-medium text-blue-600">&lt;15分钟</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">专业认证</span>
                            <span className="font-medium text-purple-600">100%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
          
          {/* 滚动指示器 */}
          <div className="flex justify-center mt-6 space-x-2">
            {customerReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setReviewScrollPosition(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === reviewScrollPosition
                    ? 'bg-yellow-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 产品定价 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            产品定价
          </h2>
          <Button variant="secondary" size="sm">
            查看详细定价
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 月度版 */}
          <Card 
            className={`stat-card transition-all duration-300 cursor-pointer ${
              hoveredPlan === 'monthly' || selectedPlan?.type === 'monthly' 
                ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                : 'border border-gray-200 hover:border-blue-300'
            }`}
            onMouseEnter={() => setHoveredPlan('monthly')}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => handlePayment('monthly', 199)}
          >
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">月度版</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">¥199</p>
                <p className="text-sm text-gray-500">/月</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">基础数据分析</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">50个视频管理</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">AI智能建议</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">在线客服支持</span>
                </li>
              </ul>
              <Button 
                className={`w-full transition-colors ${
                  hoveredPlan === 'monthly' || selectedPlan?.type === 'monthly'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {selectedPlan?.type === 'monthly' ? '已选择' : '立即购买'}
              </Button>
            </CardContent>
          </Card>

          {/* 季度版 */}
          <Card 
            className={`stat-card transition-all duration-300 cursor-pointer relative ${
              hoveredPlan === 'quarterly' || selectedPlan?.type === 'quarterly' 
                ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                : 'border-2 border-blue-500 hover:border-blue-600'
            }`}
            onMouseEnter={() => setHoveredPlan('quarterly')}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => handlePayment('quarterly', 499)}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              限时100名
            </div>
            <div className="absolute -top-3 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              省¥98
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">季度版</h3>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-3xl font-bold text-blue-600">¥499</p>
                  <p className="text-sm text-gray-500">/3个月</p>
                </div>
                <p className="text-xs text-gray-400 line-through">原价 ¥597</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">高级数据分析</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">无限视频管理</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">智能AI助手</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">优先技术支持</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">定制月度报告</span>
                </li>
              </ul>
              <Button 
                className={`w-full transition-colors ${
                  hoveredPlan === 'quarterly' || selectedPlan?.type === 'quarterly'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {selectedPlan?.type === 'quarterly' ? '已选择' : '立即购买'}
              </Button>
            </CardContent>
          </Card>

          {/* 年度版 */}
          <Card 
            className={`stat-card transition-all duration-300 cursor-pointer relative ${
              hoveredPlan === 'yearly' || selectedPlan?.type === 'yearly' 
                ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                : 'border border-gray-200 hover:border-blue-300'
            }`}
            onMouseEnter={() => setHoveredPlan('yearly')}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => handlePayment('yearly', 1999)}
          >
            <div className="absolute -top-3 right-4 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              省¥389
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">年度版</h3>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-3xl font-bold text-blue-600">¥1,999</p>
                  <p className="text-sm text-gray-500">/年</p>
                </div>
                <p className="text-xs text-gray-400 line-through">原价 ¥2,388</p>
                <p className="text-xs text-green-600 font-medium">仅需 ¥166/月</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">企业级分析</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">无限视频管理</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">专属AI助手</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">24/7专属支持</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">定制开发服务</span>
                </li>
              </ul>
              <Button 
                className={`w-full transition-colors ${
                  hoveredPlan === 'yearly' || selectedPlan?.type === 'yearly'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {selectedPlan?.type === 'yearly' ? '已选择' : '立即购买'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 支付模态框 */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          planType={selectedPlan.type}
          amount={selectedPlan.amount}
          description={selectedPlan.description}
        />
      )}
    </div>
  );
}