// Sentiment Breakdown Component

import type React from 'react';
import Card from '../shared/Card';
import { type SentimentData } from '../../types/monitoring';
import { getSentimentWidth } from './utils';

interface SentimentBreakdownProps {
  sentimentData: SentimentData;
}

const SentimentBreakdown: React.FC<SentimentBreakdownProps> = ({
  sentimentData,
}) => {
  return (
    <Card padding="md" variant="glass">
      <h3
        className="text-xl font-semibold text-white/40 mb-4 font-condensed tracking-wide ml-1.5"
        style={{
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontKerning: 'normal',
          textSizeAdjust: '100%',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        SENTIMENT BREAKDOWN
      </h3>
      <div className="space-y-4 px-1.5 pb-7">
        <div className="flex items-center justify-between">
          <span className="text-white/80">Positive</span>
          <span className="text-green-400 font-medium">
            {sentimentData.positive}%
          </span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2">
          <div
            className={`bg-green-400 h-2 rounded-full ${getSentimentWidth(sentimentData.positive)}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/80">Neutral</span>
          <span className="text-gray-400 font-medium">
            {sentimentData.neutral}%
          </span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2">
          <div
            className={`bg-gray-400 h-2 rounded-full ${getSentimentWidth(sentimentData.neutral)}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/80">Negative</span>
          <span className="text-red-400 font-medium">
            {sentimentData.negative}%
          </span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2">
          <div
            className={`bg-red-400 h-2 rounded-full ${getSentimentWidth(sentimentData.negative)}`}
          />
        </div>
      </div>
    </Card>
  );
};

export default SentimentBreakdown;
