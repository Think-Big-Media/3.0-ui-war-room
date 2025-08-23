// Trending Topics Component

import type React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../shared/Card';
import { type TrendingTopic } from '../../types/monitoring';
import { getTrendColor, formatNumber } from './utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TrendingTopics');

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics }) => {
  const handleViewMentions = (topic: TrendingTopic) => {
    logger.info('View mentions for topic:', topic.keyword);
    // Handle viewing mentions for topic
  };

  const handleDraftResponse = (topic: TrendingTopic) => {
    logger.info('Draft response for topic:', topic.keyword);
    // Handle drafting response for topic
  };

  return (
    <Card padding="md" variant="glass">
      <h3 className="text-xl font-semibold text-white/80 mb-4 font-condensed tracking-wide">
        TRENDING TOPICS (Issue Spike Detector)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ scale: 1.02 }}
            className="bg-black/20 rounded-lg p-4 border border-white/10 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white/95">{topic.keyword}</h4>
              <div className={`flex items-center space-x-1 ${getTrendColor(topic.change)}`}>
                {topic.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {topic.change > 0 ? '+' : ''}
                  {topic.change}%
                </span>
              </div>
            </div>
            <div className="text-sm text-white/70 mb-2">
              {formatNumber(topic.mentions)} mentions
            </div>
            <div className="flex items-center justify-between text-xs text-white/60 font-mono">
              <span>{topic.region}</span>
              <span>Last {topic.timeframe}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => handleViewMentions(topic)}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono"
              >
                View mentions
              </button>
              <button
                onClick={() => handleDraftResponse(topic)}
                className="text-xs text-white/70 hover:text-white font-mono"
              >
                Draft response
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default TrendingTopics;
