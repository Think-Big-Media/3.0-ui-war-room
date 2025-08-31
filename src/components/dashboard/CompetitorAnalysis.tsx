import React from 'react';
import Card from '../shared/Card';
import { TrendingUp, TrendingDown, Users, MessageSquare } from 'lucide-react';
import { mockShareOfVoice } from '../../services/mentionlytics/mockData';

export const CompetitorAnalysis: React.FC = () => {
  const competitors = mockShareOfVoice;

  return (
    <Card variant="glass" padding="sm" className="competitor-analysis hoverable hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-barlow font-semibold text-white text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          Competitor Analysis
        </h3>
        <div className="text-xs font-mono text-amber-400">
          MOCK DATA
        </div>
      </div>

      <div className="space-y-2">
        {competitors.map((competitor, index) => {
          const isLeading = index === 0;
          const growth = Math.floor(Math.random() * 30) - 10; // Random growth for demo
          
          return (
            <div key={competitor.brand} className={`relative p-2 rounded border ${
              isLeading ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'
            } hover:bg-white/10 transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isLeading ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs font-semibold text-white">
                    {competitor.brand}
                  </span>
                  {isLeading && (
                    <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase">
                      Leading
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{competitor.percentage}%</div>
                    <div className="text-[9px] text-white/60">share</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-cyan-400">{(competitor.reach / 1000).toFixed(0)}K</div>
                    <div className="text-[9px] text-white/60">reach</div>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    growth > 0 ? 'text-green-400' : growth < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {growth > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : growth < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <div className="w-3 h-3"></div>
                    )}
                    <span className="text-[9px] font-semibold">
                      {growth > 0 ? '+' : ''}{growth}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Mini metrics row */}
              <div className="flex items-center justify-end gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-blue-400" />
                  <span className="text-[9px] text-white/60">{competitor.mentions.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-purple-400" />
                  <span className="text-[9px] text-white/60">{(competitor.engagement / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <div className="flex justify-between text-center">
          <div>
            <div className="text-sm font-bold text-white">4</div>
            <div className="text-[9px] text-white/60 uppercase">Tracked</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-400">
              {competitors[0]?.percentage || 35}%
            </div>
            <div className="text-[9px] text-white/60 uppercase">Leading</div>
          </div>
          <div>
            <div className="text-sm font-bold text-cyan-400">
              {competitors.reduce((sum, c) => sum + c.mentions, 0).toLocaleString()}
            </div>
            <div className="text-[9px] text-white/60 uppercase">Total</div>
          </div>
        </div>
      </div>
    </Card>
  );
};