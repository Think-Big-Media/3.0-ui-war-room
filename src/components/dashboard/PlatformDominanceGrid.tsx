import React from 'react';
import Card from '../shared/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const PlatformDominanceGrid: React.FC = () => {
  const platformData = [
    {
      platform: 'TWITTER/X',
      value: '3,847',
      growth: '+23%',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      trending: 'up',
    },
    {
      platform: 'FACEBOOK',
      value: '2,156',
      growth: '+12%',
      color: 'from-orange-500 to-yellow-500',
      textColor: 'text-orange-400',
      trending: 'up',
    },
    {
      platform: 'INSTAGRAM',
      value: '1,893',
      growth: '+45%',
      color: 'from-blue-400 to-purple-500',
      textColor: 'text-purple-400',
      trending: 'up',
    },
  ];

  return (
    <Card
      variant="glass"
      padding="sm"
      className="platform-dominance hoverable hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-barlow font-semibold text-white text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          Platform Dominance
        </h3>
        <div className="text-xs font-mono text-amber-400">MOCK DATA</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {platformData.map((platform) => (
          <div
            key={platform.platform}
            className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${platform.color} p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}
          >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                {platform.platform}
              </div>

              <div className="text-xl font-bold text-white mb-1">{platform.value}</div>

              <div className="flex items-center justify-between">
                <div
                  className={`text-sm font-semibold ${platform.textColor} flex items-center gap-1`}
                >
                  {platform.trending === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {platform.growth}
                </div>

                {/* Mini sparkline effect */}
                <div className="flex items-end gap-0.5 h-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/30 rounded-t"
                      style={{
                        height: `${Math.random() * 24 + 8}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtle animated border */}
            <div className="absolute inset-0 border border-white/20 rounded-lg group-hover:border-white/40 transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* Bottom metrics row */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">8.9K</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Total Reach</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">+31%</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Growth Rate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400">4.2</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Avg. Engagement</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
