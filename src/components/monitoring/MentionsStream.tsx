// Mentions Stream Component

import type React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Globe, BarChart3, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';
import CustomDropdown from '../shared/CustomDropdown';
import { type Mention, type MonitoringFilters } from '../../types/monitoring';
import { getPlatformIcon, getSentimentIcon } from './utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('MentionsStream');

interface MentionsStreamProps {
  mentions: Mention[];
  filters: MonitoringFilters;
  onFiltersChange: (filters: MonitoringFilters) => void;
}

const MentionsStream: React.FC<MentionsStreamProps> = ({
  mentions,
  filters,
  onFiltersChange,
}) => {
  const handleAddToAlert = (mention: Mention) => {
    logger.info('Add mention to alert:', mention.username);
    // Handle adding mention to alert system
  };

  const handleGenerateResponse = (mention: Mention) => {
    logger.info('Generate response for mention:', mention.username);
    // Handle generating response to mention
  };

  // Dropdown options
  const sourceOptions = [
    { value: 'all', label: 'All Sources', icon: <Globe className="w-4 h-4" /> },
    { value: 'twitter', label: 'Twitter', icon: getPlatformIcon('twitter') },
    { value: 'facebook', label: 'Facebook', icon: getPlatformIcon('facebook') },
    { value: 'reddit', label: 'Reddit', icon: getPlatformIcon('reddit') },
    { value: 'news', label: 'News', icon: getPlatformIcon('news') },
  ];

  const sentimentOptions = [
    {
      value: 'all',
      label: 'All Sentiment',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      value: 'positive',
      label: 'Positive',
      icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    },
    {
      value: 'negative',
      label: 'Negative',
      icon: getSentimentIcon('negative'),
    },
    { value: 'neutral', label: 'Neutral', icon: getSentimentIcon('neutral') },
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions', icon: <Globe className="w-4 h-4" /> },
    {
      value: 'District 3',
      label: 'District 3',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      value: 'District 7',
      label: 'District 7',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      value: 'Statewide',
      label: 'Statewide',
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  return (
    <Card padding="md" variant="glass">
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xl font-semibold text-white/40 font-condensed tracking-wide ml-2"
          style={{
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            fontKerning: 'normal',
            textSizeAdjust: '100%'
          }}
        >
          LIVE MENTIONS STREAM
        </h3>
        <div className="flex items-center space-x-2">
          <CustomDropdown
            value={filters.source}
            onChange={(value) => onFiltersChange({ ...filters, source: value })}
            options={sourceOptions}
            className="min-w-[140px]"
          />
          <CustomDropdown
            value={filters.sentiment}
            onChange={(value) =>
              onFiltersChange({ ...filters, sentiment: value })
            }
            options={sentimentOptions}
            className="min-w-[140px]"
          />
          <CustomDropdown
            value={filters.region}
            onChange={(value) => onFiltersChange({ ...filters, region: value })}
            options={regionOptions}
            className="min-w-[140px]"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scroll-fade">
        {mentions.map((mention) => (
          <motion.div
            key={mention.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getPlatformIcon(mention.platform)}
                <span className="text-white/90 font-medium">
                  {mention.username}
                </span>
                <span className="text-white/60 text-sm font-mono">
                  {mention.timestamp}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getSentimentIcon(mention.sentiment)}
                <span className="text-white/70 text-sm font-mono">
                  Influence: {mention.influence}
                </span>
              </div>
            </div>
            <p className="text-white/80 mb-3">{mention.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-white/60 font-mono">
                <span className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{mention.engagement}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{mention.region}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToAlert(mention)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                >
                  Add to Alert
                </button>
                <button
                  onClick={() => handleGenerateResponse(mention)}
                  className="text-xs text-white/70 hover:text-white font-mono"
                >
                  Generate Response
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default MentionsStream;
