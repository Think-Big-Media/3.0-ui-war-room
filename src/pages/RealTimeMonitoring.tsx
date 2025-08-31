'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import PageLayout from '../components/shared/PageLayout';
import MonitoringControls from '../components/monitoring/MonitoringControls';
import MentionsStream from '../components/monitoring/MentionsStream';
import TrendingTopics from '../components/monitoring/TrendingTopics';
import SentimentBreakdown from '../components/monitoring/SentimentBreakdown';
import PlatformPerformance from '../components/monitoring/PlatformPerformance';
import InfluencerTracker from '../components/monitoring/InfluencerTracker';
import MonitoringAlert from '../components/monitoring/MonitoringAlert';
import { type MonitoringFilters } from '../types/monitoring';
import {
  mockMentions,
  mockTrendingTopics,
  mockInfluencers,
  mockSentimentData,
  mockPlatformPerformance,
} from '../data/monitoringData';
import { 
  useLiveMentionsFeed, 
  useTrendingTopics, 
  useTopInfluencers, 
  useSentimentAnalysis,
  useMentionlyticsMode
} from '../hooks/useMentionlytics';
import { createLogger } from '../utils/logger';

const logger = createLogger('RealTimeMonitoring');

const RealTimeMonitoring: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [filters, setFilters] = useState<MonitoringFilters>({
    source: 'all',
    sentiment: 'all',
    region: 'all',
  });
  
  // Get Mentionlytics data
  const { mentions: liveMentions, loading: mentionsLoading } = useLiveMentionsFeed(20);
  const { data: trendingData, loading: trendsLoading } = useTrendingTopics();
  const { data: influencerData, loading: influencersLoading } = useTopInfluencers(5);
  const { data: sentimentData, loading: sentimentLoading } = useSentimentAnalysis();
  const { mode: dataMode } = useMentionlyticsMode();
  
  // Use live data if available, fallback to mock
  const mentions = useMemo(() => {
    if (liveMentions && liveMentions.length > 0) {
      // Convert Mentionlytics format to our format
      return liveMentions.map(mention => ({
        id: mention.id,
        platform: mention.source || 'twitter',
        author: mention.author,
        content: mention.text,
        sentiment: mention.sentiment as 'positive' | 'negative' | 'neutral',
        timestamp: mention.timestamp,
        reach: mention.reach || 0,
        engagement: mention.engagement || 0,
        region: 'all', // Mentionlytics doesn't provide region in mentions
        verified: mention.influence > 1000,
      }));
    }
    return mockMentions;
  }, [liveMentions]);
  
  const trendingTopics = trendingData || mockTrendingTopics;
  const influencers = influencerData || mockInfluencers;
  
  // Convert sentiment data for the breakdown component
  const sentimentBreakdown = useMemo(() => {
    if (sentimentData) {
      return {
        positive: sentimentData.positive,
        negative: sentimentData.negative,
        neutral: sentimentData.neutral,
        total: sentimentData.total,
      };
    }
    return mockSentimentData;
  }, [sentimentData]);

  // Event handlers
  const handleToggleLive = () => {
    setIsLive(!isLive);
    logger.info('Monitoring live status:', !isLive);
  };

  const handleAlertAction = () => {
    logger.info('Alert action triggered');
    // Handle alert response action
  };

  // Filter functions
  const filteredMentions = mentions.filter((mention) => {
    const matchesSource =
      filters.source === 'all' || mention.platform === filters.source;
    const matchesSentiment =
      filters.sentiment === 'all' || mention.sentiment === filters.sentiment;
    const matchesRegion =
      filters.region === 'all' || mention.region === filters.region;
    return matchesSource && matchesSentiment && matchesRegion;
  });

  return (
    <div className="page-monitoring" data-route="live-monitoring">
      <PageLayout
        pageTitle="Live Monitoring"
        placeholder="Ask War Room about monitoring data..."
      >
        {/* Data Mode Indicator */}
        <div className="fixed top-20 right-4 z-40">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm ${
            dataMode === 'MOCK' 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {dataMode} DATA
          </div>
        </div>

        {/* Dynamic Alert Banner - Moved to top */}
        <MonitoringAlert onAction={handleAlertAction} />

        {/* Live Status & Controls */}
        <MonitoringControls isLive={isLive} onToggleLive={handleToggleLive} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Live Feed */}
          <div className="lg:col-span-2 space-y-4">
            <MentionsStream
              mentions={filteredMentions}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <TrendingTopics topics={trendingTopics} />
          </div>

          {/* Right Column - Visual Dashboards */}
          <div className="space-y-4">
            <SentimentBreakdown sentimentData={sentimentBreakdown} />
            <PlatformPerformance platformData={mockPlatformPerformance} />
            <InfluencerTracker influencers={influencers} />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default RealTimeMonitoring;
