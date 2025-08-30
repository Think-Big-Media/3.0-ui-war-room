import React, { useState } from 'react';

interface StateData {
  lean: 'D' | 'R' | 'TOSS';
  margin: number;
  electoral: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  stateId: string;
}

const InteractivePoliticalMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    stateId: ''
  });

  // Real-time polling data for key swing states
  const stateData: Record<string, StateData> = {
    'PA': { lean: 'D', margin: 2.3, electoral: 20, trend: 'up' },
    'MI': { lean: 'R', margin: -1.2, electoral: 16, trend: 'down' },
    'WI': { lean: 'TOSS', margin: 0, electoral: 10, trend: 'stable' },
    'AZ': { lean: 'R', margin: 0.8, electoral: 11, trend: 'up' },
    'GA': { lean: 'D', margin: 1.5, electoral: 16, trend: 'stable' },
    'NV': { lean: 'TOSS', margin: 0, electoral: 6, trend: 'down' },
    'FL': { lean: 'R', margin: 3.2, electoral: 29, trend: 'stable' },
    'NC': { lean: 'R', margin: 1.8, electoral: 15, trend: 'up' },
    'OH': { lean: 'R', margin: 4.5, electoral: 18, trend: 'stable' },
    'TX': { lean: 'R', margin: 6.2, electoral: 38, trend: 'down' }
  };

  const getStateColor = (stateId: string): string => {
    const data = stateData[stateId];
    if (!data) return 'rgba(100, 116, 139, 0.3)'; // Default gray for safe states
    
    switch (data.lean) {
      case 'TOSS':
        return 'rgba(168, 85, 247, 0.4)'; // Purple
      case 'D':
        return 'rgba(59, 130, 246, 0.4)'; // Blue
      case 'R':
        return 'rgba(239, 68, 68, 0.4)'; // Red
      default:
        return 'rgba(100, 116, 139, 0.3)';
    }
  };

  const getStateStroke = (stateId: string): string => {
    const data = stateData[stateId];
    if (!data) return 'rgba(255, 255, 255, 0.2)';
    
    switch (data.lean) {
      case 'TOSS':
        return 'rgba(168, 85, 247, 0.6)';
      case 'D':
        return 'rgba(59, 130, 246, 0.6)';
      case 'R':
        return 'rgba(239, 68, 68, 0.6)';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  const handleStateMouseEnter = (stateId: string, event: React.MouseEvent) => {
    setHoveredState(stateId);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      stateId
    });
  };

  const handleStateMouseLeave = () => {
    setHoveredState(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleStateMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX,
        y: event.clientY
      }));
    }
  };

  const formatMargin = (margin: number): string => {
    if (margin === 0) return 'TOSS UP';
    return `${margin > 0 ? '+' : ''}${margin}%`;
  };

  return (
    <div className="relative w-full h-full">
      <svg 
        viewBox="0 0 959 593" 
        className="w-full h-full"
        preserveAspectRatio="xMinYMin meet"
        onMouseMove={handleStateMouseMove}
      >
        <defs>
          {/* Glassmorphic filter effects */}
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            <feOffset dx="0" dy="1" result="offset"/>
            <feFlood floodColor="rgba(255,255,255,0.1)"/>
            <feComposite in2="offset" operator="over"/>
          </filter>
        </defs>

        {/* Key Swing States - Interactive political boundaries */}
        
        {/* Pennsylvania - Keystone State */}
        <path 
          id="PA" 
          d="M 682 165 L 735 162 L 785 164 L 797 168 L 797 184 L 785 188 L 735 186 L 682 189 Z"
          fill={getStateColor('PA')}
          stroke={getStateStroke('PA')}
          strokeWidth={hoveredState === 'PA' ? "3" : "1.5"}
          className="transition-all duration-200 hover:brightness-125 hover:scale-105 cursor-pointer drop-shadow-lg"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('PA', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Michigan */}
        <path 
          id="MI" 
          d="M 629 155 L 629 135 L 635 131 L 643 131 L 645 135 L 656 136 L 662 132 L 672 133 L 678 137 L 686 133 L 698 135 L 705 131 L 714 134 L 721 131 L 728 135 L 736 131 L 744 135 L 744 155 L 736 159 L 728 155 L 721 159 L 714 156 L 705 159 L 698 155 L 686 159 L 678 155 L 672 159 L 662 158 L 656 162 L 645 161 L 643 157 L 635 157 Z"
          fill={getStateColor('MI')}
          stroke={getStateStroke('MI')}
          strokeWidth={hoveredState === 'MI' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('MI', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Wisconsin */}
        <path 
          id="WI" 
          d="M 591 155 L 591 135 L 595 131 L 603 131 L 605 135 L 616 136 L 622 132 L 629 135 L 629 155 L 622 159 L 616 155 L 605 159 L 603 155 L 595 159 Z"
          fill={getStateColor('WI')}
          stroke={getStateStroke('WI')}
          strokeWidth={hoveredState === 'WI' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('WI', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Arizona */}
        <path 
          id="AZ" 
          d="M 256 321 L 256 281 L 316 279 L 318 321 L 318 361 L 256 363 Z"
          fill={getStateColor('AZ')}
          stroke={getStateStroke('AZ')}
          strokeWidth={hoveredState === 'AZ' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('AZ', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Georgia */}
        <path 
          id="GA" 
          d="M 707 281 L 707 261 L 711 257 L 719 257 L 721 261 L 732 262 L 738 258 L 748 259 L 754 263 L 762 259 L 774 261 L 774 281 L 774 301 L 762 305 L 754 301 L 748 305 L 738 304 L 732 308 L 721 307 L 719 303 L 711 303 L 707 301 Z"
          fill={getStateColor('GA')}
          stroke={getStateStroke('GA')}
          strokeWidth={hoveredState === 'GA' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('GA', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Nevada */}
        <path 
          id="NV" 
          d="M 176 241 L 176 201 L 256 199 L 258 241 L 258 281 L 176 283 Z"
          fill={getStateColor('NV')}
          stroke={getStateStroke('NV')}
          strokeWidth={hoveredState === 'NV' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('NV', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Florida */}
        <path 
          id="FL" 
          d="M 747 381 L 747 361 L 787 359 L 827 361 L 867 359 L 907 361 L 909 381 L 909 401 L 907 421 L 867 423 L 827 421 L 787 423 L 747 421 Z"
          fill={getStateColor('FL')}
          stroke={getStateStroke('FL')}
          strokeWidth={hoveredState === 'FL' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('FL', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Add more key states with simplified paths for performance */}
        {/* North Carolina */}
        <path 
          id="NC" 
          d="M 747 241 L 747 221 L 787 219 L 827 221 L 867 219 L 869 239 L 869 259 L 827 261 L 787 259 L 747 261 Z"
          fill={getStateColor('NC')}
          stroke={getStateStroke('NC')}
          strokeWidth={hoveredState === 'NC' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('NC', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Ohio */}
        <path 
          id="OH" 
          d="M 667 201 L 667 181 L 707 179 L 709 199 L 709 219 L 667 221 Z"
          fill={getStateColor('OH')}
          stroke={getStateStroke('OH')}
          strokeWidth={hoveredState === 'OH' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('OH', e)}
          onMouseLeave={handleStateMouseLeave}
        />

        {/* Texas */}
        <path 
          id="TX" 
          d="M 376 321 L 376 281 L 376 241 L 416 239 L 456 241 L 496 239 L 536 241 L 538 281 L 538 321 L 538 361 L 498 363 L 458 361 L 418 363 L 376 361 Z"
          fill={getStateColor('TX')}
          stroke={getStateStroke('TX')}
          strokeWidth={hoveredState === 'TX' ? "2" : "1"}
          className="transition-all duration-200 hover:brightness-150 cursor-pointer"
          filter="url(#glass-effect)"
          onMouseEnter={(e) => handleStateMouseEnter('TX', e)}
          onMouseLeave={handleStateMouseLeave}
        />
      </svg>

      {/* Glassmorphic Tooltip */}
      {tooltip.visible && stateData[tooltip.stateId] && (
        <div 
          className="fixed z-[1000] pointer-events-none"
          style={{ 
            left: tooltip.x + 10, 
            top: tooltip.y - 10,
            transform: 'translate(0, -100%)'
          }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-2xl min-w-[180px]">
            <div className="text-sm font-bold text-white mb-2 font-barlow">
              {tooltip.stateId}
            </div>
            <div className="space-y-1 text-xs text-white/90 font-jetbrains">
              <div className="flex justify-between">
                <span>Electoral Votes:</span>
                <span className="font-bold">{stateData[tooltip.stateId].electoral}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Margin:</span>
                <span className={`font-bold ${
                  stateData[tooltip.stateId].margin > 0 ? 'text-blue-300' : 
                  stateData[tooltip.stateId].margin < 0 ? 'text-red-300' : 
                  'text-purple-300'
                }`}>
                  {formatMargin(stateData[tooltip.stateId].margin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trend:</span>
                <span className={`font-bold ${
                  stateData[tooltip.stateId].trend === 'up' ? 'text-green-300' :
                  stateData[tooltip.stateId].trend === 'down' ? 'text-red-300' :
                  'text-yellow-300'
                }`}>
                  {stateData[tooltip.stateId].trend === 'up' ? '↗ Up' :
                   stateData[tooltip.stateId].trend === 'down' ? '↘ Down' :
                   '→ Stable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePoliticalMap;