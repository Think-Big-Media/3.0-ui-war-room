import React, { useState, useEffect } from 'react';
import { MetricsDisplay } from './MetricsDisplay';

// @component: TimeAndMetrics
export const TimeAndMetrics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'America/New_York'
    };
    return date.toLocaleDateString('en-US', options).toUpperCase() + ' EST';
  };

  // @return
  return <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <MetricsDisplay />
      </div>
      
      <span className="text-gray-500 hidden md:block" style={{
      textShadow: '0 0 4px rgba(255,255,255,0.2)'
    }}>
        |
      </span>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-200" style={{
        textShadow: '0 0 8px rgba(255,255,255,0.4)',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
          {formatTime(currentTime)}
        </span>
        
        <span className="text-sm text-gray-400" style={{
        textShadow: '0 0 6px rgba(255,255,255,0.2)'
      }}>
          •
        </span>
        
        <span className="text-sm font-mono text-gray-300 whitespace-nowrap" style={{
        textShadow: '0 0 8px rgba(255,255,255,0.3)',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
          {formatDate(currentTime)}
        </span>
      </div>
    </div>;
};