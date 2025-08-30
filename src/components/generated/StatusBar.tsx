import React from 'react';
import { SystemHealthIndicators } from './SystemHealthIndicators';
import { TimeAndMetrics } from './TimeAndMetrics';

// @component: StatusBar
export const StatusBar = () => {
  // @return
  return <div className="fixed top-0 left-0 w-full h-16 bg-gray-900 border-b border-gray-700 z-fixed">
      <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `
            linear-gradient(90deg, transparent 24px, rgba(255,255,255,0.03) 25px, rgba(255,255,255,0.03) 26px, transparent 27px),
            linear-gradient(rgba(255,255,255,0.03) 24px, transparent 25px, transparent 26px, rgba(255,255,255,0.03) 27px)
          `,
      backgroundSize: '25px 25px'
    }} />
      
      <div className="relative h-full flex items-center justify-between px-6">
        <div className="flex-1" />
        
        <div className="hidden lg:flex items-center justify-center flex-1 gap-8">
          <SystemHealthIndicators />
        </div>
        
        <div className="hidden lg:block mx-8">
          <span className="text-gray-500" style={{
          textShadow: '0 0 4px rgba(255,255,255,0.2)'
        }}>
            |
          </span>
        </div>
        
        <div className="flex-1 flex justify-end">
          <TimeAndMetrics />
        </div>
      </div>
    </div>;
};