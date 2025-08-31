import React, { useState, useEffect, memo } from 'react';
import Card from '../shared/Card';
import { MessageCircle, Heart, Share2, TrendingUp, Clock } from 'lucide-react';

interface SocialPost {
  id: string;
  text: string;
  author: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'news' | 'tiktok';
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  timestamp: string;
  isBreaking?: boolean;
}

export const LiveIntelligence: React.FC = memo(() => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      text: 'Great to see strong leadership on healthcare reform initiatives. This is exactly what New Jersey families need right now.',
      author: 'Maria Rodriguez',
      platform: 'twitter',
      sentiment: 'positive',
      engagement: 847,
      timestamp: '2 min ago',
      isBreaking: true,
    },
    {
      id: '2',
      text: 'The infrastructure investment plan announcement has been well received across the business community in Newark.',
      author: 'NJ Business Daily',
      platform: 'news',
      sentiment: 'positive',
      engagement: 1203,
      timestamp: '7 min ago',
    },
    {
      id: '3',
      text: 'Disappointed with the recent economic policy statements. New Jersey deserves clearer solutions for working families.',
      author: 'Tom Mitchell',
      platform: 'facebook',
      sentiment: 'negative',
      engagement: 432,
      timestamp: '12 min ago',
    },
    {
      id: '4',
      text: "Interesting perspective shared at today's town hall meeting in Camden. Looking forward to seeing how this develops.",
      author: 'Local News 7',
      platform: 'news',
      sentiment: 'neutral',
      engagement: 678,
      timestamp: '18 min ago',
    },
    {
      id: '5',
      text: 'The education funding proposal is a game-changer for our public schools. This investment will transform our communities.',
      author: 'Teachers Union NJ',
      platform: 'twitter',
      sentiment: 'positive',
      engagement: 956,
      timestamp: '23 min ago',
    },
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-l-emerald-400 bg-emerald-400/5';
      case 'negative':
        return 'border-l-rose-400 bg-rose-400/5';
      default:
        return 'border-l-slate-400 bg-slate-400/5';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return '🐦';
      case 'facebook':
        return '👥';
      case 'instagram':
        return '📸';
      case 'news':
        return '📰';
      case 'tiktok':
        return '🎵';
      default:
        return '💬';
    }
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update engagement numbers to simulate live activity
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          engagement: post.engagement + Math.floor(Math.random() * 10),
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      variant="glass"
      padding="sm"
      className="live-intelligence hoverable hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-barlow font-semibold text-white text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          Live Intelligence
        </h3>
        <div className="flex items-center gap-1 text-xs text-emerald-400">
          <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
          LIVE
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`relative p-2 rounded-lg border-l-2 ${getSentimentColor(post.sentiment)} hover:bg-white/5 transition-all duration-200`}
          >
            {post.isBreaking && (
              <div className="absolute top-1 right-1">
                <span className="text-[8px] bg-rose-400/20 text-rose-400 border border-rose-400/30 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">
                  BREAKING
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getPlatformIcon(post.platform)}</span>
                <div>
                  <span className="text-xs font-semibold text-white">{post.author}</span>
                  <div className="flex items-center gap-2 text-[9px] text-white/60">
                    <Clock className="w-2.5 h-2.5" />
                    {post.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[9px] text-sky-400">
                <TrendingUp className="w-2.5 h-2.5" />
                {post.engagement.toLocaleString()}
              </div>
            </div>

            <p className="text-[10px] text-white/80 leading-relaxed line-clamp-2">{post.text}</p>

            <div className="flex items-center justify-between mt-1">
              <div
                className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                  post.sentiment === 'positive'
                    ? 'bg-emerald-400/20 text-emerald-400'
                    : post.sentiment === 'negative'
                      ? 'bg-rose-400/20 text-rose-400'
                      : 'bg-slate-400/20 text-slate-400'
                }`}
              >
                {post.sentiment}
              </div>

              <div className="flex items-center gap-2 text-white/40">
                <div className="flex items-center gap-1 text-[8px]">
                  <MessageCircle className="w-2 h-2" />
                  {Math.floor(post.engagement * 0.3)}
                </div>
                <div className="flex items-center gap-1 text-[8px]">
                  <Heart className="w-2 h-2" />
                  {Math.floor(post.engagement * 0.6)}
                </div>
                <div className="flex items-center gap-1 text-[8px]">
                  <Share2 className="w-2 h-2" />
                  {Math.floor(post.engagement * 0.1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-center">
        <div>
          <div className="text-xs font-bold text-white">{posts.length}</div>
          <div className="text-[9px] text-white/60 uppercase">Active</div>
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400">
            {posts.filter((p) => p.sentiment === 'positive').length}
          </div>
          <div className="text-[9px] text-white/60 uppercase">Positive</div>
        </div>
        <div>
          <div className="text-xs font-bold text-sky-400">
            {posts.reduce((sum, p) => sum + p.engagement, 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-white/60 uppercase">Total Reach</div>
        </div>
      </div>
    </Card>
  );
});

LiveIntelligence.displayName = 'LiveIntelligence';
