'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoData } from '@/types';
import { useVideoData } from '@/hooks/useLocalStorage';
import { ProfessionalDashboard } from '@/components/professional-dashboard';
import { ComprehensiveAnalytics } from '@/components/comprehensive-analytics';
import { PremiumAIChat } from '@/components/premium-ai-chat';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus,
  Brain,
  BarChart3,
  Users,
  Target
} from 'lucide-react';

export default function Home() {
  const { addVideo, getVideoStats, videos } = useVideoData();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const stats = getVideoStats();

  
  const renderDashboard = () => (
    <ProfessionalDashboard videos={videos} stats={stats} />
  );

  const renderAnalytics = () => (
    <ComprehensiveAnalytics videos={videos} />
  );

  const renderAIChat = () => (
    <PremiumAIChat videos={videos} />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="stat-card">
        <CardHeader>
          <CardTitle>系统设置</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">设置功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex">
        <Sidebar videos={videos} stats={stats} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'analytics' && renderAnalytics()}
            {activeSection === 'ai-chat' && renderAIChat()}
            {activeSection === 'settings' && renderSettings()}
          </div>
        </main>
      </div>
    </div>
  );
}