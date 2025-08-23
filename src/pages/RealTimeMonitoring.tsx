'use client';

import type React from 'react';
import { useState } from 'react';
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
import { createLogger } from '../utils/logger';

const logger = createLogger('RealTimeMonitoring');

const RealTimeMonitoring: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [filters, setFilters] = useState<MonitoringFilters>({
    source: 'all',
    sentiment: 'all',
    region: 'all',
  });

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
  const filteredMentions = mockMentions.filter((mention) => {
    const matchesSource =
      filters.source === 'all' || mention.platform === filters.source;
    const matchesSentiment =
      filters.sentiment === 'all' || mention.sentiment === filters.sentiment;
    const matchesRegion =
      filters.region === 'all' || mention.region === filters.region;
    return matchesSource && matchesSentiment && matchesRegion;
  });


  return (
    <PageLayout
      pageTitle="Real-Time Monitoring"
      placeholder="Ask War Room about monitoring data..."
    >
      {/* Slate gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 -z-10" />

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
          <TrendingTopics topics={mockTrendingTopics} />
        </div>

        {/* Right Column - Visual Dashboards */}
        <div className="space-y-4">
          <SentimentBreakdown sentimentData={mockSentimentData} />
          <PlatformPerformance platformData={mockPlatformPerformance} />
          <InfluencerTracker influencers={mockInfluencers} />
        </div>
      </div>

      {/* Dynamic Alert Banner */}
      <MonitoringAlert onAction={handleAlertAction} />
    </PageLayout>
  );
};

export default RealTimeMonitoring;
