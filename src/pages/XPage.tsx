import type React from 'react';
import { useState, useEffect } from 'react';
import PageLayout from '../components/shared/PageLayout';

const XPage: React.FC = () => {
  const [highlightedFeedId, setHighlightedFeedId] = useState<string | null>(null);

  const handleBlobClick = (feedId: string) => {
    setHighlightedFeedId(feedId);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedFeedId(null);
    }, 3000);
  };

  const feedItems = [
    { id: 'wisconsin-opens', type: 'info', content: 'Wisconsin voter registration up 34%.' },
    { id: null, type: 'warning', content: 'Major news outlet published critical article.' },
    { id: 'fl-suburbs', type: 'info', content: 'Positive sentiment in Florida suburbs +12%.' },
    { id: 'viral-negative', type: 'critical', content: 'Viral negative mention detected. 12K retweets in PA.' },
    { id: 'competitor-launch', type: 'warning', content: 'Competitor launched $250K ad campaign.' },
    { id: 'youth-engagement', type: 'info', content: 'Youth voter engagement up 23% in Michigan.' },
    { id: null, type: 'info', content: 'Meta ads performing 52% above benchmark.' },
    { id: 'ad-fatigue', type: 'warning', content: 'Ad fatigue detected in target demographics.' },
    { id: 'brand-recognition', type: 'info', content: 'Brand recognition increased 18% this week.' },
    { id: null, type: 'critical', content: 'Opposition video trending #1 on Twitter.' },
  ];

  const phraseItems = [
    'Trump leads GOP primary polling by 42 points nationwide',
    'Healthcare costs surge 23% in critical swing states',
    'Economy shows mixed signals ahead of Fed meeting',
    'Medicare expansion gains bipartisan support',
    'Trump defense fund raises $47M post-indictment',
    'Inflation eases but remains top voter priority',
    'Border security bill passes House committee',
    'Trump rallies Iowa base before caucus deadline',
    'Prescription drug costs hit unprecedented highs',
    'Global market volatility impacts US outlook',
  ];

  const socialThumbnails = [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', likes: '2.3K', shares: '847' },
    { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', likes: '5.1K', shares: '1.2K' },
    { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', likes: '923', shares: '145' },
    { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', likes: '7.8K', shares: '2.9K' },
    { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', likes: '3.4K', shares: '562' },
    { gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', likes: '8.9K', shares: '2.1K' },
  ];

  return (
    <div className="page-dashboard" data-route="x-dashboard">
      <PageLayout
        pageTitle="X Dashboard"
        placeholder="Ask War Room about political intelligence..."
      >
        {/* Dark gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 -z-10" />

        {/* Main Dashboard Content */}
        <div className="max-w-screen-2xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Column */}
            <div className="space-y-4">
              
              {/* Political Map */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-3">
                  <div className="bg-slate-900/50 rounded p-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://p129.p0.n0.cdn.zight.com/items/BluAK9rN/cb190d20-eec7-4e05-8969-259b1dbd9d69.png?source=client&v=6826eb6cb151acf76bf79d55b23b9628"
                      alt="Political Map"
                      className="w-full h-auto max-h-[280px] object-contain"
                    />
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">SWING STATES</div>
                    <div className="space-y-1 text-slate-300">
                      <div>• Pennsylvania: +2.3% D</div>
                      <div>• Michigan: -1.2% R</div>
                      <div>• Wisconsin: TOSS UP</div>
                      <div>• Arizona: +0.8% R</div>
                      <div>• Georgia: +1.5% D</div>
                      <div>• Nevada: TOSS UP</div>
                      <div>• Florida: +3.2% R</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SWOT Radar + Live Intelligence */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-3">
                  
                  {/* SWOT Radar */}
                  <div className="space-y-3">
                    <div className="relative w-full h-[436px] bg-gradient-radial from-emerald-500/5 to-transparent border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
                      {/* Radar Sweep */}
                      <div className="absolute w-1/2 h-0.5 bg-gradient-to-r from-emerald-500/80 to-transparent left-1/2 top-1/2 origin-left animate-spin" 
                           style={{ animationDuration: '12s' }} />
                      
                      {/* Quadrant Labels */}
                      <div className="absolute top-4 right-4 text-xs text-emerald-400 font-medium">STRENGTHS</div>
                      <div className="absolute top-4 left-4 text-xs text-emerald-400 font-medium">WEAKNESSES</div>
                      <div className="absolute bottom-4 right-4 text-xs text-emerald-400 font-medium">OPPORTUNITIES</div>
                      <div className="absolute bottom-4 left-4 text-xs text-emerald-400 font-medium">THREATS</div>
                      
                      {/* Radar Blobs */}
                      <div 
                        className="absolute w-6 h-6 cursor-pointer group"
                        style={{ top: '25%', right: '30%' }}
                        onClick={() => handleBlobClick('brand-recognition')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-green-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Brand Recognition +18%
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-5 h-5 cursor-pointer group"
                        style={{ top: '35%', right: '20%' }}
                        onClick={() => handleBlobClick('youth-engagement')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-green-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Youth Engagement +23%
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-5 h-5 cursor-pointer group"
                        style={{ top: '30%', left: '25%' }}
                        onClick={() => handleBlobClick('ad-fatigue')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-red-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Ad Fatigue Detected
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-7 h-7 cursor-pointer group"
                        style={{ bottom: '35%', right: '35%' }}
                        onClick={() => handleBlobClick('wisconsin-opens')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-blue-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Wisconsin Opens +34%
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-5 h-5 cursor-pointer group"
                        style={{ bottom: '25%', right: '22%' }}
                        onClick={() => handleBlobClick('fl-suburbs')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-blue-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          FL Suburbs +12%
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-6 h-6 cursor-pointer group"
                        style={{ bottom: '30%', left: '30%' }}
                        onClick={() => handleBlobClick('competitor-launch')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Competitor $250K Launch
                        </div>
                      </div>
                      
                      <div 
                        className="absolute w-4 h-4 cursor-pointer group"
                        style={{ bottom: '40%', left: '20%' }}
                        onClick={() => handleBlobClick('viral-negative')}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/80 to-transparent animate-pulse" />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Viral Negative 12K RT
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-400 px-3">
                      Active Threats: 2 • Opportunities: 4 • Risk Level: Medium<br />
                      Radar Sweep: 12s • Detection Rate: 97%
                    </div>
                  </div>

                  {/* Live Intelligence */}
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">LIVE INTELLIGENCE</div>
                    <div className="h-[440px] relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-800/50 to-transparent z-10" />
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-800/50 to-transparent z-10" />
                      
                      <div className="space-y-3 animate-scroll-feed">
                        {feedItems.map((item, index) => (
                          <div
                            key={index}
                            className={`bg-slate-900/50 p-3 rounded border-l-2 text-xs min-h-[60px] flex items-center transition-all duration-300 ${
                              item.type === 'critical' ? 'border-red-400' :
                              item.type === 'warning' ? 'border-amber-400' :
                              'border-blue-400'
                            } ${
                              highlightedFeedId === item.id ? 'bg-slate-700/70 scale-105 shadow-lg z-10 relative' : ''
                            }`}
                          >
                            <span className="text-slate-300">
                              <strong className="font-semibold">
                                {item.type === 'critical' ? 'CRITICAL:' :
                                 item.type === 'warning' ? 'WARNING:' :
                                 item.type === 'info' ? 'INFO:' : 'UPDATE:'}
                              </strong> {item.content}
                            </span>
                          </div>
                        ))}
                        {/* Duplicate for continuous scroll */}
                        {feedItems.map((item, index) => (
                          <div
                            key={`duplicate-${index}`}
                            className={`bg-slate-900/50 p-3 rounded border-l-2 text-xs min-h-[60px] flex items-center transition-all duration-300 ${
                              item.type === 'critical' ? 'border-red-400' :
                              item.type === 'warning' ? 'border-amber-400' :
                              'border-blue-400'
                            }`}
                          >
                            <span className="text-slate-300">
                              <strong className="font-semibold">
                                {item.type === 'critical' ? 'CRITICAL:' :
                                 item.type === 'warning' ? 'WARNING:' :
                                 item.type === 'info' ? 'INFO:' : 'UPDATE:'}
                              </strong> {item.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              {/* Phrase Cloud */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 h-[250px]">
                <div className="grid grid-cols-[90px_1fr] gap-2 h-full">
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-slate-400 font-semibold mb-2">KEYWORDS</div>
                      <div className="text-slate-500 space-y-1">
                        <div>• Economy</div>
                        <div>• Healthcare</div>
                        <div>• Donald Trump</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold mb-2">RELATED</div>
                      <div className="text-slate-500 space-y-1">
                        <div>• Inflation</div>
                        <div>• Medicare</div>
                        <div>• GOP Primary</div>
                        <div>• Tax Policy</div>
                        <div>• Border Security</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden flex items-center justify-center" style={{ perspective: '300px' }}>
                    <div className="absolute inset-0 w-[110%] -left-[5%]" style={{ transformStyle: 'preserve-3d' }}>
                      {phraseItems.map((phrase, index) => (
                        <div
                          key={index}
                          className="absolute w-full left-0 top-1/2 text-center flex items-center justify-center font-medium text-slate-400 px-2 animate-elliptical-rotate"
                          style={{
                            animationDelay: `${index * -3}s`,
                            animationDuration: '30s',
                            transformOrigin: 'center',
                            backfaceVisibility: 'visible',
                          }}
                        >
                          {phrase}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Boxes */}
              <div className="grid grid-cols-4 gap-3 h-[130px]">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-red-400">7</div>
                  <div className="text-xs text-slate-400 uppercase text-center mt-2">Real-Time<br />Alerts</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-blue-400">$47.2K</div>
                  <div className="text-xs text-slate-400 uppercase text-center mt-2">Ad Spend</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-emerald-400">2,847</div>
                  <div className="text-xs text-slate-400 uppercase text-center mt-2">Mention<br />Volume</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-emerald-400">74%</div>
                  <div className="text-xs text-slate-400 uppercase text-center mt-2">Sentiment<br />Score</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden h-[215px]">
                <div className="bg-slate-900/50 px-3 py-2 border-b border-white/10">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Quick Actions</div>
                </div>
                <div className="grid grid-cols-3 grid-rows-2 h-[calc(100%-40px)]">
                  {[
                    'Quick Campaign',
                    'Live Monitor', 
                    'Make Content',
                    'Trend Ops',
                    'Social Media',
                    'Alert Center'
                  ].map((action, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 border-r border-b border-slate-900/50 flex items-center justify-center text-xs cursor-pointer hover:bg-slate-600/50 transition-colors last:border-r-0 [&:nth-child(3)]:border-r-0 [&:nth-child(n+4)]:border-b-0"
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 h-[215px]">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">Performance Metrics</div>
                <div className="grid grid-cols-3 gap-2 h-[calc(100%-32px)]">
                  {[
                    { label: 'Alert Response', value: '45s', trend: 'up', change: '12%' },
                    { label: 'Campaign ROI', value: '3.2x', trend: 'up', change: '8%' },
                    { label: 'Threat Score', value: '32', trend: 'down', change: '5%' },
                    { label: 'Voter Rate', value: '67%', trend: 'neutral', change: '0%' },
                    { label: 'Media Reach', value: '2.4M', trend: 'up', change: '23%' },
                    { label: 'Sentiment', value: '+18', trend: 'up', change: '3%' },
                  ].map((metric, index) => (
                    <div key={index} className="bg-slate-900/50 rounded p-2 flex flex-col justify-center items-center text-center">
                      <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
                      <div className="text-lg font-semibold text-slate-200">{metric.value}</div>
                      <div className={`text-xs mt-1 ${
                        metric.trend === 'up' ? 'text-emerald-400' :
                        metric.trend === 'down' ? 'text-red-400' :
                        'text-slate-400'
                      }`}>
                        {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '—'} {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Post Thumbnails - Full Width */}
            <div className="col-span-full bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 h-[165px]">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">Social Post Thumbnails</div>
              <div className="relative overflow-hidden h-[120px]">
                <div className="flex gap-3 animate-scroll-left">
                  {[...socialThumbnails, ...socialThumbnails].map((thumb, index) => (
                    <div
                      key={index}
                      className="relative w-[180px] h-[120px] flex-shrink-0 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div 
                        className="w-full h-full"
                        style={{ background: thumb.gradient }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex gap-2 text-xs text-white">
                          <span>❤️ {thumb.likes}</span>
                          <span>🔄 {thumb.shares}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker Tape */}
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-slate-900/90 backdrop-blur-sm border-t border-white/10 overflow-hidden z-50">
          <div className="flex items-center h-full animate-ticker-scroll whitespace-nowrap">
            <span className="inline-flex items-center px-5 text-xs text-red-400">⚠️ CRITICAL: Pennsylvania sentiment -15% in 24hrs</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Meta CPM: $12.45 ↑3.2%</span>
            <span className="inline-flex items-center px-5 text-xs text-emerald-400">• Michigan youth engagement +23%</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Google CTR: 2.8% ↓0.4%</span>
            <span className="inline-flex items-center px-5 text-xs text-red-400">• Competitor ad spend increased 45%</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Wisconsin: TOSS UP</span>
            <span className="inline-flex items-center px-5 text-xs text-emerald-400">• Florida early voting +12%</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Twitter mentions: 14.2K/hr</span>
            <span className="inline-flex items-center px-5 text-xs text-red-400">• Crisis detected: Viral video 89K shares</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Ad fatigue warning: Creative refresh needed</span>
            <span className="inline-flex items-center px-5 text-xs text-emerald-400">• Donor engagement +18%</span>
            <span className="inline-flex items-center px-5 text-xs text-slate-400">• Media coverage: 234 articles today</span>
          </div>
        </div>

        {/* Bottom spacer for ticker */}
        <div className="h-8" />
      </PageLayout>

    </div>
  );
};

export default XPage;
