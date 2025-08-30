import React, { useState, useEffect } from 'react';

const CommandStatusBar: React.FC = () => {
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
      second: '2-digit',
      timeZone: 'America/New_York'
    }) + ' EST';
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="relative h-14 flex items-center justify-center px-6 border-t border-b border-white/20">
            {/* Left of center - Platform indicators */}
            <div className="flex items-baseline gap-3 mr-4">
              <div className="flex items-baseline gap-2 bg-green-500/20 px-3 py-1.5 rounded-md border border-green-500/30">
                <span className="text-xs text-green-400 leading-none">●</span>
                <span className="text-xs text-green-300 font-medium font-barlow leading-none">Meta</span>
              </div>
              <div className="flex items-baseline gap-2 bg-blue-500/20 px-3 py-1.5 rounded-md border border-blue-500/30">
                <span className="text-xs text-blue-400 leading-none">●</span>
                <span className="text-xs text-blue-300 font-medium font-barlow leading-none">Google</span>
              </div>
              <div className="flex items-baseline gap-2 bg-purple-500/20 px-3 py-1.5 rounded-md border border-purple-500/30">
                <span className="text-xs text-purple-400 leading-none">●</span>
                <span className="text-xs text-purple-300 font-medium font-barlow leading-none">Social</span>
              </div>
              <div className="flex items-baseline gap-2 bg-orange-500/20 px-3 py-1.5 rounded-md border border-orange-500/30">
                <span className="text-xs text-orange-400 leading-none">●</span>
                <span className="text-xs text-orange-300 font-medium font-barlow leading-none">Analytics</span>
              </div>
            </div>
            
            {/* Center separator */}
            <div className="h-6 w-px bg-gray-600"></div>
            
            {/* Right of center - Metrics */}
            <div className="flex items-baseline gap-3 ml-4">
              <div className="bg-gray-700/50 px-3 py-1.5 rounded-md border border-gray-600/50 flex items-baseline">
                <span className="text-xs font-bold text-white font-jetbrains leading-none">236</span>
                <span className="text-xs text-gray-400 ml-1.5 font-barlow leading-none">Mentions</span>
              </div>
              
              <div className="bg-orange-500/20 px-3 py-1.5 rounded-md border border-orange-500/30 flex items-baseline">
                <span className="text-xs font-bold text-orange-400 font-jetbrains leading-none">9</span>
                <span className="text-xs text-orange-300 ml-1.5 font-barlow leading-none">Alerts</span>
              </div>
              
              <div className="bg-green-500/20 px-3 py-1.5 rounded-md border border-green-500/30 hidden lg:flex items-baseline">
                <span className="text-xs font-bold text-green-400 font-jetbrains leading-none">18</span>
                <span className="text-xs text-green-300 ml-1.5 font-barlow leading-none">Opportunities</span>
              </div>
              
              <div className="bg-red-500/20 px-3 py-1.5 rounded-md border border-red-500/30 hidden xl:flex items-baseline">
                <span className="text-xs font-bold text-red-400 font-jetbrains leading-none">3</span>
                <span className="text-xs text-red-300 ml-1.5 font-barlow leading-none">Threats</span>
              </div>
            </div>
            
            {/* Far right - Time display */}
            <div className="absolute right-6 flex items-center gap-4">
              {/* Vertical separator */}
              <div className="h-6 w-px bg-gray-600"></div>
              
              {/* Time display - no container, white text */}
              <span className="text-sm font-mono font-bold text-white">
                {formatTime(currentTime)}
              </span>
            </div>
      </div>
    </div>
  );
};

export default CommandStatusBar;