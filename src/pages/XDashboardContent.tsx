import type React from 'react';
import { useState } from 'react';
import PoliticalMap from '../components/political/PoliticalMap';
import SWOTRadar from '../components/political/SWOTRadar';
import IntelligenceFeed from '../components/political/IntelligenceFeed';
import PoliticalMetrics from '../components/political/PoliticalMetrics';

const XDashboardContent: React.FC = () => {
  const [highlightedFeedId, setHighlightedFeedId] = useState<string | null>(null);

  const handleRadarBlobClick = (feedId: string) => {
    setHighlightedFeedId(feedId);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedFeedId(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800" data-route="x-dashboard">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Political Intelligence Dashboard</h1>
          <div className="flex space-x-4">
            <a href="/" className="text-white/70 hover:text-white px-3 py-1 rounded transition-colors">Dashboard</a>
            <a href="/x" className="text-white bg-white/20 px-3 py-1 rounded">X</a>
            <a href="/command-center" className="text-white/70 hover:text-white px-3 py-1 rounded transition-colors">Command Center</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Top Row - Political Metrics */}
        <PoliticalMetrics />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Political Map */}
            <PoliticalMap />
            
            {/* SWOT Radar */}
            <SWOTRadar onBlobClick={handleRadarBlobClick} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Intelligence Feed */}
            <IntelligenceFeed highlightedFeedId={highlightedFeedId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default XDashboardContent;
