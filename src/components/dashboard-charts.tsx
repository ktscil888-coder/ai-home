'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { VideoData } from '@/types';

interface DashboardChartsProps {
  videos: VideoData[];
}

export function DashboardCharts({ videos }: DashboardChartsProps) {
  // 平台数据统计
  const platformData = videos.reduce((acc, video) => {
    const platform = video.platform;
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformChartData = Object.entries(platformData).map(([platform, count]) => ({
    name: getPlatformName(platform),
    value: count,
    platform,
  }));

  // 表现最好的视频数据
  const topVideos = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map(video => ({
      title: video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title,
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      shares: video.shares,
    }));

  // 关键词频率统计
  const keywordData = videos.reduce((acc, video) => {
    video.keywords.forEach(keyword => {
      const normalizedKeyword = keyword.trim().toLowerCase();
      if (normalizedKeyword) {
        acc[normalizedKeyword] = (acc[normalizedKeyword] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const topKeywords = Object.entries(keywordData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword: keyword.length > 15 ? keyword.substring(0, 15) + '...' : keyword,
      count,
    }));

  const COLORS = ['#FFD700', '#FFA500', '#FF6347', '#FF4500', '#8B4513'];

  function getPlatformName(platform: string) {
    const names = {
      douyin: '抖音',
      xiaohongshu: '小红书',
      kuaishou: '快手',
      shipinhao: '视频号',
      other: '其他',
    };
    return names[platform as keyof typeof names] || platform;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>暂无数据，请先添加视频数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 平台分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-primary p-6">
          <h3 className="text-lg font-semibold text-white mb-4">平台分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 关键词频率 */}
        <div className="card-primary p-6">
          <h3 className="text-lg font-semibold text-white mb-4">热门关键词</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topKeywords}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="keyword" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 热门视频表现 */}
      <div className="card-primary p-6">
        <h3 className="text-lg font-semibold text-white mb-4">热门视频表现</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topVideos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="title" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="views" fill="#FFD700" name="播放量" />
              <Bar dataKey="likes" fill="#FF6347" name="点赞量" />
              <Bar dataKey="comments" fill="#87CEEB" name="评论量" />
              <Bar dataKey="shares" fill="#DDA0DD" name="分享量" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}