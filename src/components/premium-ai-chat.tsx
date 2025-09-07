'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, VideoData } from '@/types';
import { 
  Send, 
  Bot, 
  User, 
  ArrowDown, 
  Sparkles,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  FileText,
  BarChart3,
  MessageSquare,
  Plus,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface PremiumAIChatProps {
  videos: VideoData[];
}

export function PremiumAIChat({ videos }: PremiumAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [quickActionsFloated, setQuickActionsFloated] = useState(false); // 🆕 控制快捷操作是否已飘落
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (force = false) => {
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (!container) return;
      
      if (force) {
        container.scrollTop = container.scrollHeight;
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      // 延迟滚动，确保DOM完全渲染
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 100;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // 🆕 如果是第一次发送消息，触发快捷操作飘落动画
    if (messages.length === 0) {
      setTimeout(() => {
        setQuickActionsFloated(true);
      }, 500); // 延迟500ms让用户消息先显示
    }
    
    // 🆕 立即创建AI消息占位符，提供即时反馈
    const aiMessageId = Date.now().toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          videos: videos,
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI服务响应失败');
      }
      
      // 🆕 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      let accumulatedContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'start') {
                // 🚀 收到开始信号，立即更新AI消息状态（不影响用户消息）
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId && msg.role === 'assistant'
                    ? { ...msg, content: '🤖 正在为您分析...' }
                    : msg
                ));
                accumulatedContent = '';
              } else if (data.type === 'chunk') {
                accumulatedContent += data.content;
                
                // 🆕 实时更新AI消息内容
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId && msg.role === 'assistant'
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
                
                if (data.isComplete) {
                  break;
                }
              } else if (data.type === 'error') {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId && msg.role === 'assistant'
                    ? { ...msg, content: data.content }
                    : msg
                ));
                break;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
    } catch (error) {
      console.error('AI调用失败:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId && msg.role === 'assistant'
          ? { ...msg, content: '抱歉，AI分析服务暂时不可用，请稍后再试。' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    await generateAIResponse(input);
  };

  const quickActions = [
    { 
      icon: TrendingUp, 
      label: '综合分析', 
      prompt: '请根据我上传的所有数据（包括视频标题、内容、关键词、播放量、点赞量、评论量、转发量等）进行综合分析。先了解我的创作习惯、地区特色、口语风格、常用词汇等个人特征，然后给出专业的数据洞察和优化建议。' 
    },
    { 
      icon: Lightbulb, 
      label: '一键生成', 
      prompt: '请根据我上传的所有数据，深入了解我的创作风格、地区口音、常用表达方式后，一键生成至少3个爆款标题和对应的3个完整内容脚本，以及精准的关键词标签。要求内容接地气、口语化，能够立即执行拍摄。' 
    },
    { 
      icon: Zap, 
      label: '追踪热点', 
      prompt: '请结合我上传的所有数据和今日最新热点新闻，了解我的创作习惯和地区特色后，生成3个追热点的标题、完整内容脚本和关键词。要求紧跟时事、符合我的口语风格，内容要接地气且具有话题性。' 
    },
    { 
      icon: Target, 
      label: '定制创作', 
      prompt: '我有具体的创作需求或关键词想法，请根据我上传的所有数据，深入了解我的个人风格、地区特色、口语习惯后，针对我的具体需求生成定制化的标题、内容和关键词。请先询问我的具体需求。' 
    },
  ];

  const insights = [
    { 
      icon: Brain, 
      title: '智能分析', 
      description: '深度解析您的创作风格、用户画像和内容偏好，提供个性化优化方案',
      type: 'optimization' 
    },
    { 
      icon: Sparkles, 
      title: '内容生成', 
      description: '基于您的历史数据和个人特色，自动生成接地气的爆款标题和内容',
      type: 'insight' 
    },
    { 
      icon: TrendingUp, 
      title: '热点追踪', 
      description: '实时结合最新热点，为您定制符合个人风格的追热点内容策略',
      type: 'suggestion' 
    },
  ];

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* 欢迎区域 - 固定高度，防止拉长 */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-start justify-center p-6 min-h-0">
          <div className="text-center max-w-5xl w-full">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                AI智能分析助手
              </h2>
              <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                🎯 基于您的创作数据，深度了解个人风格，生成接地气的爆款内容
              </p>
            </div>

            {/* 快捷操作 - 重新设计，添加飘落动画 */}
            <div 
              className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 transition-all duration-1000 ${
                quickActionsFloated ? 'opacity-0 transform translate-y-[-50px] pointer-events-none' : 'opacity-100 transform translate-y-0'
              }`}
            >
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colors = [
                  'from-blue-500 to-cyan-600',
                  'from-green-500 to-emerald-600', 
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600'
                ];
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(action.prompt);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                      }, 100);
                    }}
                    className="group p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white"
                    style={{
                      transitionDelay: quickActionsFloated ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <div className={`w-10 h-10 mx-auto mb-3 bg-gradient-to-br ${colors[index]} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{action.label}</p>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* 消息区域 - 固定高度，独立滚动 */}
      {messages.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto space-y-6 p-6 bg-gradient-to-b from-gray-50/50 to-white/50 rounded-2xl border border-gray-200/30 min-h-0"
            style={{ scrollBehavior: 'smooth' }}
          >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-5 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.role === 'assistant' && (message.content === '' || message.content === '🤖 正在为您分析...') ? (
                    // 🆕 等待状态显示思考动画
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{message.content || '正在连接AI助手'}</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.content}
                      {message.role === 'assistant' && message.content && isLoading && (
                        // 🆕 正在输入的光标效果
                        <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-1 animate-pulse"></span>
                      )}
                    </>
                  )}
                </div>
                <p className={`text-xs mt-3 ${
                  message.role === 'user' ? 'text-indigo-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* 输入区域 - 固定在底部 */}
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200/30">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="💭 输入您的问题或需求，AI助手将为您提供专业分析..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="pr-12 py-3 text-sm bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl shadow-sm focus:shadow-md focus:border-indigo-300 transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* 🆕 飘落后的快捷操作 - 显示在输入框下方 */}
        {quickActionsFloated && (
          <div 
            className={`mt-4 grid grid-cols-4 gap-2 transition-all duration-1000 ease-out transform ${
              quickActionsFloated ? 'translate-y-0 opacity-100' : 'translate-y-[-200px] opacity-0'
            }`}
            style={{
              animation: quickActionsFloated ? 'floatDown 1s ease-out forwards' : 'none'
            }}
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = [
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600', 
                'from-purple-500 to-pink-600',
                'from-orange-500 to-red-600'
              ];
              return (
                <button
                  key={`floated-${index}`}
                  onClick={() => {
                    setInput(action.prompt);
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                    }, 100);
                  }}
                  className="group p-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-white"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: quickActionsFloated ? `floatDown 1s ease-out ${index * 150}ms forwards` : 'none'
                  }}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${colors[index]} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900 text-center">{action.label}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const cardColors = [
            'from-blue-50 to-indigo-50 border-blue-200/50',
            'from-purple-50 to-pink-50 border-purple-200/50',
            'from-green-50 to-emerald-50 border-green-200/50'
          ];
          const iconColors = [
            'from-blue-500 to-indigo-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-emerald-600'
          ];
          const buttonColors = [
            'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
            'text-purple-600 hover:text-purple-700 hover:bg-purple-50',
            'text-green-600 hover:text-green-700 hover:bg-green-50'
          ];
          return (
            <Card key={index} className={`group bg-gradient-to-br ${cardColors[index]} border shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${iconColors[index]} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {insight.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${buttonColors[index]} rounded-xl font-semibold transition-all duration-200`}
                    >
                      了解更多 →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50 p-6">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            📊 数据洞察报告
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🔍</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">关键发现</h4>
              </div>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">您的家政服务类内容用户参与度高于行业平均水平32%</span>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">周末发布的视频表现比工作日好45%</span>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">带有"实用技巧"标签的内容分享率最高</span>
                </li>
              </ul>
            </div>
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💡</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">优化建议</h4>
              </div>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">增加前后对比内容，提升用户信任感</span>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">在黄金时段发布，获得更多曝光</span>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">优化标题关键词，提高搜索排名</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">📋 对话历史</h3>
        </div>
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border-indigo-200 rounded-xl"
        >
          <FileText className="w-4 h-4 mr-2" />
          导出记录
        </Button>
      </div>
      
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">暂无对话记录</h4>
          <p className="text-gray-500">开始与AI助手对话，记录将显示在这里</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="group p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="font-semibold text-gray-900">
                    {message.role === 'user' ? '👤 您' : '🤖 AI助手'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {message.timestamp.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed group-hover:line-clamp-none transition-all duration-200">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 backdrop-blur-sm border border-gray-200/60 shadow-2xl ${
      isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : 'h-[800px] rounded-2xl'
    }`}>
      {/* 头部 - 重新设计 */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  🤖 AI智能分析助手
                </h2>
                <p className="text-sm text-gray-600">专业数据分析 · 智能洞察 · 个性化建议</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hover:bg-gray-100/80"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100/80">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 标签页 - 重新设计 */}
        <div className="flex space-x-1 px-5 pb-4">
          {[
            { id: 'chat', label: '💬 智能对话', icon: MessageSquare },
            { id: 'insights', label: '💡 数据洞察', icon: Lightbulb },
            { id: 'history', label: '📋 对话历史', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 h-[calc(100%-180px)]">
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* 滚动到底部按钮 */}
      {showScrollButton && activeTab === 'chat' && (
        <Button
          type="button"
          size="sm"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg z-10"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}