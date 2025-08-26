import type React from 'react';
import { useState } from 'react';
import PageLayout from '../components/shared/PageLayout';
import PoliticalMap from '../components/political/PoliticalMap';
import SWOTRadar from '../components/political/SWOTRadar';
import IntelligenceFeed from '../components/political/IntelligenceFeed';
import PoliticalMetrics from '../components/political/PoliticalMetrics';

const XDashboard: React.FC = () => {
  const [highlightedFeedId, setHighlightedFeedId] = useState<string | null>(null);

  const handleRadarBlobClick = (feedId: string) => {
    setHighlightedFeedId(feedId);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedFeedId(null);
    }, 3000);
  };

  return (
    <div className="page-dashboard" data-route="x-dashboard">
      <PageLayout
        pageTitle="Political Intelligence Dashboard"
        placeholder="Ask War Room about political intelligence..."
      >
        {/* Dark gradient background matching existing pages */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 -z-10" />

        {/* Main Content with proper spacing */}
        <div className="space-y-4">
          
          {/* Top Row - Political Metrics */}
          <PoliticalMetrics />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Column */}
            <div className="space-y-4">
              {/* Political Map */}
              <PoliticalMap />
              
              {/* SWOT Radar */}
              <SWOTRadar onBlobClick={handleRadarBlobClick} />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Intelligence Feed */}
              <IntelligenceFeed highlightedFeedId={highlightedFeedId} />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default XDashboard;
