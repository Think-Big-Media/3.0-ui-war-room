// Influencer Tracker Component

import type React from 'react';
import Card from '../shared/Card';
import { type Influencer } from '../../types/monitoring';
import { getPlatformIcon, getSentimentIcon, formatNumber } from './utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('InfluencerTracker');

interface InfluencerTrackerProps {
  influencers: Influencer[];
}

const InfluencerTracker: React.FC<InfluencerTrackerProps> = ({ influencers }) => {
  const handleAddToWatchlist = (influencer: Influencer) => {
    logger.info('Add influencer to watchlist:', influencer.username);
    // Handle adding influencer to watchlist
  };

  const handleAmplify = (influencer: Influencer) => {
    logger.info('Amplify influencer:', influencer.username);
    // Handle amplifying influencer content
  };

  return (
    <Card padding="md" variant="glass">
      <h3 className="text-lg font-semibold text-white/95 mb-4 font-condensed">Influencer Tracker</h3>
      <div className="space-y-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getPlatformIcon(influencer.platform)}
                <span className="text-white/90 font-medium text-sm">
                  {influencer.username}
                </span>
              </div>
              <span className="text-white/70 text-xs">{influencer.lastPost}</span>
            </div>
            <div className="text-xs text-white/60 mb-2 font-mono">
              {formatNumber(influencer.followers)} followers • Reach: {influencer.reach}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getSentimentIcon(influencer.sentiment)}
                <span className="text-xs text-white/70 font-mono">
                  Eng: {influencer.engagement}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToWatchlist(influencer)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                >
                  Add to Watchlist
                </button>
                <button
                  onClick={() => handleAmplify(influencer)}
                  className="text-xs text-white/70 hover:text-white font-mono"
                >
                  Amplify
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InfluencerTracker;
