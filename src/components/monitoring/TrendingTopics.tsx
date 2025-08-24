// Trending Topics Component

import type React from 'react';
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
 <Card padding="md" variant="glass" className="hoverable">
 <h3 className="section-header mb-4 tracking-wide ml-2">
 TRENDING TOPICS (Issue Spike Detector)
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {topics.map((topic) => (
 <div
 key={topic.id}
 className="bg-black/20 rounded-lg p-6 hoverable cursor-pointer"
 >
 <div className="flex items-center justify-between mb-2 -mt-2">
 <h4 className="font-medium text-white/95">{topic.keyword}</h4>
 <div
 className={`flex items-center space-x-1 ${getTrendColor(topic.change)}`}
 >
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
 <div className="text-sm text-white/70 mb-2 font-mono uppercase">
 {formatNumber(topic.mentions)} MENTIONS
 </div>
 <div className="flex items-center justify-between text-xs text-white/60 font-mono uppercase">
 <span>{topic.region}</span>
 <span>LAST {topic.timeframe}</span>
 </div>
 <div className="flex items-center space-x-2 mt-4 -ml-2">
 <button
 onClick={() => handleViewMentions(topic)}
 className="btn-secondary-action"
 >
 View mentions
 </button>
 <button
 onClick={() => handleDraftResponse(topic)}
 className="btn-secondary-neutral"
 >
 Draft response
 </button>
 </div>
 </div>
 ))}
 </div>
 </Card>
 );
};

export default TrendingTopics;
