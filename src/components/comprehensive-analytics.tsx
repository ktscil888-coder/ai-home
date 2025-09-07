'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoData, HotTopic, IndustryMetrics } from '@/types';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Target,
  Activity,
  Zap,
  Award,
  Clock,
  Plus,
  Upload,
  FileText,
  Database,
  Save,
  MapPin,
  Users,
  DollarSign,
  Star,
  Percent,
  Timer,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Flame,
  ChevronRight,
  Globe,
  Building,
  Smartphone,
  Search,
  UserCheck
} from 'lucide-react';

interface ComprehensiveAnalyticsProps {
  videos: VideoData[];
}

export function ComprehensiveAnalytics({ videos }: ComprehensiveAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [industryMetrics, setIndustryMetrics] = useState<IndustryMetrics | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [isLoading, setIsLoading] = useState(false);

  // 增强的数据录入表单
  const [newVideoData, setNewVideoData] = useState({
    title: '',
    content: '',
    keywords: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    platform: 'douyin',
    serviceType: 'cleaning',
    duration: '',
    location: '',
    targetAge: 'all',
    customerSatisfaction: '',
    serviceFrequency: 'weekly',
    price: '',
    completionRate: '',
    engagementRate: '',
    conversionRate: ''
  });

  // 获取行业热点数据
  const fetchHotspots = async (timeframe: 'today' | 'week' | 'month') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/industry-hotspots?timeframe=${timeframe}`);
      const result = await response.json();
      if (result.success) {
        setHotTopics(result.data.hotTopics);
        setIndustryMetrics(result.data.industryMetrics);
      }
    } catch (error) {
      console.error('Failed to fetch hotspots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots(selectedTimeframe);
  }, [selectedTimeframe]);

  const handleAddVideoData = () => {
    const video = {
      id: Date.now().toString(),
      title: newVideoData.title,
      content: newVideoData.content,
      keywords: newVideoData.keywords.split(',').map(k => k.trim()),
      views: parseInt(newVideoData.views) || 0,
      likes: parseInt(newVideoData.likes) || 0,
      comments: parseInt(newVideoData.comments) || 0,
      shares: parseInt(newVideoData.shares) || 0,
      platform: newVideoData.platform as any,
      createdAt: new Date(),
      serviceType: newVideoData.serviceType as any,
      duration: parseInt(newVideoData.duration) || undefined,
      location: newVideoData.location || undefined,
      targetAge: newVideoData.targetAge as any,
      customerSatisfaction: parseInt(newVideoData.customerSatisfaction) || undefined,
      serviceFrequency: newVideoData.serviceFrequency as any,
      price: parseFloat(newVideoData.price) || undefined,
      completionRate: parseFloat(newVideoData.completionRate) || undefined,
      engagementRate: parseFloat(newVideoData.engagementRate) || undefined,
      conversionRate: parseFloat(newVideoData.conversionRate) || undefined
    };

    const existingData = JSON.parse(localStorage.getItem('videoData') || '[]');
    localStorage.setItem('videoData', JSON.stringify([...existingData, video]));
    
    // 重置表单
    setNewVideoData({
      title: '',
      content: '',
      keywords: '',
      views: '',
      likes: '',
      comments: '',
      shares: '',
      platform: 'douyin',
      serviceType: 'cleaning',
      duration: '',
      location: '',
      targetAge: 'all',
      customerSatisfaction: '',
      serviceFrequency: 'weekly',
      price: '',
      completionRate: '',
      engagementRate: '',
      conversionRate: ''
    });
    setShowDataEntry(false);
    
    window.location.reload();
  };

  // 核心指标定义 - 增加更多指标
  const coreMetrics = [
    { key: 'totalViews', label: '总播放量', icon: Eye, color: 'blue' },
    { key: 'totalLikes', label: '总点赞量', icon: Heart, color: 'red' },
    { key: 'totalComments', label: '总评论量', icon: MessageCircle, color: 'green' },
    { key: 'totalShares', label: '总分享量', icon: Share2, color: 'purple' },
    { key: 'avgEngagement', label: '平均互动率', icon: Target, color: 'orange' },
    { key: 'avgConversion', label: '平均转化率', icon: TrendingUp, color: 'pink' },
    { key: 'avgSatisfaction', label: '平均满意度', icon: Star, color: 'yellow' },
    { key: 'avgPrice', label: '平均服务价格', icon: DollarSign, color: 'emerald' },
    { key: 'totalVideos', label: '视频总数', icon: FileText, color: 'indigo' },
    { key: 'avgDuration', label: '平均时长', icon: Clock, color: 'teal' },
    { key: 'completionRate', label: '完成率', icon: CheckCircle, color: 'cyan' },
    { key: 'customerRetention', label: '客户留存率', icon: Users, color: 'rose' }
  ];

  // 计算统计数据 - 增加更多指标
  const calculateStats = () => {
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);
    const totalComments = videos.reduce((sum, video) => sum + (video.comments || 0), 0);
    const totalShares = videos.reduce((sum, video) => sum + (video.shares || 0), 0);
    const totalVideos = videos.length;
    
    const videosWithEngagement = videos.filter(v => v.engagementRate);
    const avgEngagement = videosWithEngagement.length > 0 
      ? videosWithEngagement.reduce((sum, v) => sum + (v.engagementRate || 0), 0) / videosWithEngagement.length 
      : 0;
    
    const videosWithConversion = videos.filter(v => v.conversionRate);
    const avgConversion = videosWithConversion.length > 0
      ? videosWithConversion.reduce((sum, v) => sum + (v.conversionRate || 0), 0) / videosWithConversion.length
      : 0;
    
    const videosWithSatisfaction = videos.filter(v => v.customerSatisfaction);
    const avgSatisfaction = videosWithSatisfaction.length > 0
      ? videosWithSatisfaction.reduce((sum, v) => sum + (v.customerSatisfaction || 0), 0) / videosWithSatisfaction.length
      : 0;
    
    const videosWithPrice = videos.filter(v => v.price);
    const avgPrice = videosWithPrice.length > 0
      ? videosWithPrice.reduce((sum, v) => sum + (v.price || 0), 0) / videosWithPrice.length
      : 0;
    
    const videosWithDuration = videos.filter(v => v.duration);
    const avgDuration = videosWithDuration.length > 0
      ? videosWithDuration.reduce((sum, v) => sum + (v.duration || 0), 0) / videosWithDuration.length
      : 0;
    
    const videosWithCompletion = videos.filter(v => v.completionRate);
    const completionRate = videosWithCompletion.length > 0
      ? videosWithCompletion.reduce((sum, v) => sum + (v.completionRate || 0), 0) / videosWithCompletion.length
      : 85.5; // 模拟数据
    
    const customerRetention = 92.3; // 模拟客户留存率
    
    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalVideos,
      avgEngagement,
      avgConversion,
      avgSatisfaction,
      avgPrice,
      avgDuration,
      completionRate,
      customerRetention,
      engagementRate: totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100) : 0
    };
  };

  const stats = calculateStats();

  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number | undefined) => {
    if (!num || num === 0) return '0%';
    return `${num.toFixed(1)}%`;
  };

  const formatPrice = (num: number | undefined) => {
    if (!num || num === 0) return '¥0';
    return `¥${num.toFixed(0)}`;
  };

  const formatDuration = (num: number | undefined) => {
    if (!num || num === 0) return '0秒';
    if (num >= 60) return `${(num / 60).toFixed(1)}分钟`;
    return `${num.toFixed(0)}秒`;
  };

  const formatCount = (num: number | undefined) => {
    if (!num || num === 0) return '0个';
    return `${num}个`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'falling': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'hot': return <Flame className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cleaning: 'bg-blue-100 text-blue-800',
      babysitting: 'bg-pink-100 text-pink-800',
      eldercare: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 页面头部 - 现代化设计 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm px-6 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                数据分析中心
              </h1>
              <p className="text-gray-600 mt-1 font-medium">专业的家政行业数据洞察与分析平台</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => setShowDataEntry(!showDataEntry)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              录入数据
            </Button>
            <Button 
              variant="secondary"
              onClick={() => fetchHotspots(selectedTimeframe)}
              disabled={isLoading}
              className="bg-white/80 border-white/20 hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
          </div>
        </div>
      </div>

      {/* 数据录入表单 - 优雅设计 */}
      {showDataEntry && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/30 px-6 py-6 flex-shrink-0 shadow-inner">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">录入视频数据</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* 基础信息 */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center mr-2">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">基础信息</h4>
                </div>
              <Input
                  placeholder="视频标题"
                value={newVideoData.title}
                onChange={(e) => setNewVideoData({...newVideoData, title: e.target.value})}
                  className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                <Input
                  placeholder="视频内容描述"
                  value={newVideoData.content}
                  onChange={(e) => setNewVideoData({...newVideoData, content: e.target.value})}
                  className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                <Input
                  placeholder="关键词(逗号分隔)"
                  value={newVideoData.keywords}
                  onChange={(e) => setNewVideoData({...newVideoData, keywords: e.target.value})}
                  className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  value={newVideoData.platform}
                  onChange={(e) => setNewVideoData({...newVideoData, platform: e.target.value})}
                >
                  <option value="douyin">抖音</option>
                  <option value="xiaohongshu">小红书</option>
                  <option value="kuaishou">快手</option>
                  <option value="shipinhao">视频号</option>
                  <option value="bilibili">B站</option>
                  <option value="other">其他</option>
                </select>
              </div>

              {/* 数据指标 */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                    <BarChart3 className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">数据指标</h4>
            </div>
              <Input
                type="number"
                  placeholder="播放量"
                value={newVideoData.views}
                onChange={(e) => setNewVideoData({...newVideoData, views: e.target.value})}
                  className="border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
              <Input
                type="number"
                  placeholder="点赞量"
                value={newVideoData.likes}
                onChange={(e) => setNewVideoData({...newVideoData, likes: e.target.value})}
                  className="border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
              <Input
                type="number"
                  placeholder="评论量"
                value={newVideoData.comments}
                onChange={(e) => setNewVideoData({...newVideoData, comments: e.target.value})}
                  className="border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
              <Input
                type="number"
                  placeholder="分享量"
                value={newVideoData.shares}
                onChange={(e) => setNewVideoData({...newVideoData, shares: e.target.value})}
                  className="border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
            </div>

              {/* 服务信息 */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md flex items-center justify-center mr-2">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">服务信息</h4>
                </div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newVideoData.serviceType}
                  onChange={(e) => setNewVideoData({...newVideoData, serviceType: e.target.value})}
                >
                  <option value="cleaning">家居保洁</option>
                  <option value="babysitting">月嫂育婴</option>
                  <option value="eldercare">老人护理</option>
                  <option value="cooking">烹饪服务</option>
                  <option value="laundry">洗衣熨烫</option>
                  <option value="other">其他服务</option>
                </select>
                <Input
                  type="number"
                  placeholder="视频时长(秒)"
                  value={newVideoData.duration}
                  onChange={(e) => setNewVideoData({...newVideoData, duration: e.target.value})}
                />
                <Input
                  placeholder="服务地区"
                  value={newVideoData.location}
                  onChange={(e) => setNewVideoData({...newVideoData, location: e.target.value})}
                />
              <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newVideoData.targetAge}
                  onChange={(e) => setNewVideoData({...newVideoData, targetAge: e.target.value})}
                >
                  <option value="all">全年龄段</option>
                  <option value="young">年轻群体</option>
                  <option value="middle">中年群体</option>
                  <option value="senior">老年群体</option>
              </select>
              </div>

              {/* 业务指标 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b pb-1">业务指标</h4>
                <Input
                  type="number"
                  placeholder="客户满意度(1-5分)"
                  min="1"
                  max="5"
                  value={newVideoData.customerSatisfaction}
                  onChange={(e) => setNewVideoData({...newVideoData, customerSatisfaction: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="服务价格(元)"
                  value={newVideoData.price}
                  onChange={(e) => setNewVideoData({...newVideoData, price: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="互动率(%)"
                  value={newVideoData.engagementRate}
                  onChange={(e) => setNewVideoData({...newVideoData, engagementRate: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="转化率(%)"
                  value={newVideoData.conversionRate}
                  onChange={(e) => setNewVideoData({...newVideoData, conversionRate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200/50">
            <Button 
              variant="secondary" 
              onClick={() => setShowDataEntry(false)}
                className="bg-white/80 border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
            >
              取消
            </Button>
            <Button 
              onClick={handleAddVideoData}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              保存数据
            </Button>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 - 使用flex-1确保填满剩余空间 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 核心指标概览 - 修复布局和增加指标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coreMetrics.map((metric, index) => {
              let value;
              let formatter = formatNumber;
              
              switch (metric.key) {
                case 'avgEngagement':
                case 'avgConversion':
                case 'completionRate':
                case 'customerRetention':
                  value = stats[metric.key as keyof typeof stats] as number;
                  formatter = formatPercentage;
                  break;
                case 'avgPrice':
                  value = stats[metric.key as keyof typeof stats] as number;
                  formatter = formatPrice;
                  break;
                case 'avgSatisfaction':
                  value = stats[metric.key as keyof typeof stats] as number;
                  formatter = (num: number | undefined) => num ? `${num.toFixed(1)}分` : '0分';
                  break;
                case 'avgDuration':
                  value = stats[metric.key as keyof typeof stats] as number;
                  formatter = formatDuration;
                  break;
                case 'totalVideos':
                  value = stats[metric.key as keyof typeof stats] as number;
                  formatter = formatCount;
                  break;
                default:
                  value = stats[metric.key as keyof typeof stats] as number;
              }
              
              const Icon = metric.icon;
              const gradientColors = {
                blue: 'from-blue-500 to-blue-600',
                red: 'from-red-500 to-rose-600',
                green: 'from-green-500 to-emerald-600',
                purple: 'from-purple-500 to-violet-600',
                orange: 'from-orange-500 to-amber-600',
                pink: 'from-pink-500 to-rose-600',
                yellow: 'from-yellow-500 to-orange-600',
                emerald: 'from-emerald-500 to-teal-600',
                indigo: 'from-indigo-500 to-indigo-600',
                teal: 'from-teal-500 to-teal-600',
                cyan: 'from-cyan-500 to-cyan-600',
                rose: 'from-rose-500 to-rose-600'
              };
              
              return (
                <Card 
                  key={metric.key} 
                  className="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group metric-card"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[metric.color as keyof typeof gradientColors]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                      {metric.label}
                        </p>
                    <div className="text-2xl font-bold text-gray-900">
                          {formatter(value)}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColors[metric.color as keyof typeof gradientColors]} shadow-md flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                        <ArrowUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-700 font-medium">+12.5%</span>
                      </div>
                      <span className="text-gray-500">vs 上期</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 行业热点和数据 - 优雅布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 行业热点 */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      行业热点
                    </CardTitle>
                    <div className="flex items-center space-x-1 bg-white/60 rounded-xl p-1">
                      {(['today', 'week', 'month'] as const).map((timeframe) => (
                        <button
                          key={timeframe}
                          onClick={() => setSelectedTimeframe(timeframe)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            selectedTimeframe === timeframe
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                          }`}
                        >
                          {timeframe === 'today' ? '今日' : timeframe === 'week' ? '本周' : '本月'}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                          <span className="text-gray-600 font-medium">加载中...</span>
                        </div>
                      </div>
                    ) : (
                      hotTopics.map((topic, index) => (
                        <div 
                          key={topic.id} 
                          className="group relative p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-100/50 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                                'bg-gradient-to-br from-blue-400 to-blue-500'
                              }`}>
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {topic.title}
                                </h4>
                                <div className="flex items-center space-x-1">
                                  {getTrendIcon(topic.trend)}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{topic.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getCategoryColor(topic.category)}`}>
                                    {topic.category === 'cleaning' ? '🧹 保洁' : 
                                     topic.category === 'babysitting' ? '👶 育婴' :
                                     topic.category === 'eldercare' ? '👴 养老' : '🏠 综合'}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{topic.source}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
                                  <Eye className="w-3 h-3" />
                                  <span className="font-medium">{formatNumber(topic.engagement)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 行业数据概览 - 精美设计 */}
            <div>
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    行业数据概览
              </CardTitle>
            </CardHeader>
                <CardContent className="p-6">
                  {industryMetrics ? (
                    <div className="space-y-5">
                      <div className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-blue-700 mb-1">{industryMetrics.marketSize}亿元</div>
                            <div className="text-sm font-medium text-blue-600">市场规模</div>
                          </div>
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-emerald-700 mb-1">{industryMetrics.growthRate}%</div>
                            <div className="text-sm font-medium text-emerald-600">年增长率</div>
                          </div>
                          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-purple-700 mb-1">{industryMetrics.userPenetration}%</div>
                            <div className="text-sm font-medium text-purple-600">用户渗透率</div>
                          </div>
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                        </div>
                  </div>
                  
                      <div className="relative p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-orange-700 mb-1">¥{industryMetrics.avgServicePrice}</div>
                            <div className="text-sm font-medium text-orange-600">平均价格/小时</div>
                          </div>
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                        </div>
                  </div>
                  
                      <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/50">
                        <div className="flex items-center mb-4">
                          <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-2">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <h5 className="font-semibold text-gray-800">热门服务类型</h5>
                        </div>
                        <div className="space-y-3">
                          {industryMetrics.popularServices.slice(0, 3).map((service, index) => (
                            <div key={service.name} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  index === 0 ? 'bg-blue-500' : 
                                  index === 1 ? 'bg-emerald-500' : 
                                  'bg-purple-500'
                                }`}></div>
                                <span className="text-sm font-medium text-gray-700">{service.name}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{service.percentage}%</span>
                            </div>
                    ))}
                  </div>
                </div>
              </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Database className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-600 font-medium">暂无数据</p>
                        <p className="text-gray-500 text-sm mt-1">请稍后刷新重试</p>
                      </div>
                    </div>
                  )}
            </CardContent>
          </Card>
            </div>
          </div>

          {/* 新增数据模块区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 平台表现分析 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg">
              <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  平台表现分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {[
                    { platform: '抖音', percentage: 45, color: 'bg-pink-500', views: '1.2M', growth: '+23%' },
                    { platform: '小红书', percentage: 28, color: 'bg-red-500', views: '680K', growth: '+18%' },
                    { platform: 'B站', percentage: 15, color: 'bg-blue-500', views: '320K', growth: '+15%' },
                    { platform: '快手', percentage: 12, color: 'bg-orange-500', views: '180K', growth: '+8%' }
                  ].map((item, index) => (
                    <div key={item.platform} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                        'bg-gradient-to-br from-blue-400 to-blue-500'
                      }`}>
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">{item.platform}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">{item.views}</span>
                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">{item.growth}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${item.color} shadow-sm`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">占比</span>
                          <span className="text-xs font-medium text-gray-700">{item.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 内容表现分析 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg">
              <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  内容表现分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">最高播放量</p>
                        <p className="text-xs text-gray-600">家政保洁技巧分享</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-700">2.8M</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border border-red-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">最高点赞率</p>
                        <p className="text-xs text-gray-600">月嫂护理心得</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-red-700">15.2%</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">最高互动率</p>
                        <p className="text-xs text-gray-600">老人护理经验</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-700">8.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 发布时间分析 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg">
              <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  发布时间分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {[
                    { time: '09:00-12:00', label: '上午时段', percentage: 35, performance: '最佳', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
                    { time: '14:00-17:00', label: '下午时段', percentage: 28, performance: '良好', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                    { time: '19:00-22:00', label: '晚间时段', percentage: 42, performance: '优秀', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
                    { time: '22:00-08:00', label: '深夜时段', percentage: 8, performance: '较差', color: 'bg-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-600' }
                  ].map((item) => (
                    <div key={item.time} className="space-y-3">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-lg ${item.bgColor}`}>
                            <span className={`text-sm font-semibold ${item.textColor}`}>{item.label}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{item.time}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${item.bgColor} ${item.textColor}`}>{item.performance}</span>
                          <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} shadow-sm`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 关键词和趋势分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 热门关键词分析 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg">
              <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  热门关键词分析
              </CardTitle>
            </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    { word: '家政服务', count: 1250, trend: 'up' },
                    { word: '专业保洁', count: 980, trend: 'up' },
                    { word: '月嫂护理', count: 856, trend: 'stable' },
                    { word: '老人护理', count: 742, trend: 'up' },
                    { word: '育儿嫂', count: 635, trend: 'down' },
                    { word: '家庭清洁', count: 589, trend: 'up' },
                    { word: '母婴护理', count: 523, trend: 'stable' },
                    { word: '居家养老', count: 456, trend: 'up' }
                  ].map((item) => (
                    <div key={item.word} className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <span className="text-sm font-medium text-gray-900">{item.word}</span>
                      <span className="text-xs text-gray-600">({item.count})</span>
                      {item.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                      {item.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                      {item.trend === 'stable' && <Activity className="w-3 h-3 text-blue-500" />}
                          </div>
                  ))}
              </div>
            </CardContent>
          </Card>

            {/* 用户画像分析 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg">
              <CardHeader className="border-b border-gray-100/50 bg-gray-50/30 p-5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  用户画像分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">年龄分布</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { age: '25-35岁', percentage: 42, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
                        { age: '36-45岁', percentage: 35, color: 'bg-green-500', bgColor: 'bg-green-50' },
                        { age: '46-55岁', percentage: 18, color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
                        { age: '55岁以上', percentage: 5, color: 'bg-gray-500', bgColor: 'bg-gray-50' }
                      ].map((item) => (
                        <div key={item.age} className={`p-3 rounded-lg ${item.bgColor} border border-gray-200/50`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800">{item.age}</span>
                            <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-white/80 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color} shadow-sm`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">地区分布</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { city: '北京', percentage: '22%', color: 'border-blue-200 bg-blue-50' },
                        { city: '上海', percentage: '18%', color: 'border-green-200 bg-green-50' },
                        { city: '广州', percentage: '15%', color: 'border-yellow-200 bg-yellow-50' },
                        { city: '深圳', percentage: '12%', color: 'border-purple-200 bg-purple-50' },
                        { city: '杭州', percentage: '10%', color: 'border-pink-200 bg-pink-50' },
                        { city: '其他', percentage: '23%', color: 'border-gray-200 bg-gray-50' }
                      ].map((item) => (
                        <div key={item.city} className={`flex items-center justify-between p-3 rounded-lg border ${item.color} hover:shadow-sm transition-shadow`}>
                          <span className="text-sm font-medium text-gray-700">{item.city}</span>
                          <span className="text-sm font-bold text-gray-900">{item.percentage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}