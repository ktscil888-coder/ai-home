'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, VideoData } from '@/types';
import { Send, Bot, User, ArrowDown } from 'lucide-react';

interface ChatInterfaceProps {
  videos: VideoData[];
}

export function ChatInterface({ videos }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (force = false) => {
    setTimeout(() => {
      const container = messagesContainerRef.current;
      if (!container) return;
      
      if (force) {
        container.scrollTop = container.scrollHeight;
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 添加滚动检测
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 100; // 增加阈值
      const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
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
      
      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI调用失败:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，AI分析服务暂时不可用，请稍后再试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <Card className="flex flex-col min-h-[400px] max-h-[600px] bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3 bg-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Bot className="w-5 h-5 text-blue-600" />
          AI智能分析助手
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col relative p-3 pt-0">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-3 mb-3 p-3 bg-gray-50 rounded-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 min-h-[200px] max-h-[350px]"
        >
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <p className="mb-2 font-medium text-gray-900">👋 您好！我是您的AI内容分析助手</p>
              <p className="text-sm text-gray-600">我可以帮您：</p>
              <ul className="text-sm mt-2 space-y-1 text-gray-600">
                <li>• 分析视频数据表现</li>
                <li>• 生成爆款标题和文案</li>
                <li>• 优化关键词和内容策略</li>
                <li>• 提供创作建议</li>
              </ul>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words max-h-48 overflow-y-auto message-content">
                  {message.content}
                </div>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* 滚动到底部按钮 */}
        {showScrollButton && (
          <Button
            type="button"
            size="sm"
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-16 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg z-10"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
          <Input
            placeholder="输入您的问题或需求..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}