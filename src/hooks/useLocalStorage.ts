'use client';

import { useState, useEffect } from 'react';
import { VideoData } from '@/types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useVideoData() {
  const [videos, setVideos] = useLocalStorage<VideoData[]>('videoData', []);
  
  const addVideo = (video: Omit<VideoData, 'id' | 'createdAt'>) => {
    const newVideo: VideoData = {
      ...video,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setVideos([...videos, newVideo]);
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const updateVideo = (id: string, updates: Partial<VideoData>) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  const getVideoStats = () => {
    const stats = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      averageViews: 0,
      averageLikes: 0,
      averageComments: 0,
      averageShares: 0,
    };

    if (videos.length === 0) return stats;

    videos.forEach(video => {
      stats.totalViews += video.views;
      stats.totalLikes += video.likes;
      stats.totalComments += video.comments;
      stats.totalShares += video.shares;
    });

    const count = videos.length;
    stats.averageViews = Math.round(stats.totalViews / count);
    stats.averageLikes = Math.round(stats.totalLikes / count);
    stats.averageComments = Math.round(stats.totalComments / count);
    stats.averageShares = Math.round(stats.totalShares / count);

    return stats;
  };

  return {
    videos,
    addVideo,
    deleteVideo,
    updateVideo,
    getVideoStats,
  };
}