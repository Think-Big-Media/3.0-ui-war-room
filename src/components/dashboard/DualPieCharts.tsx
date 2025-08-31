import React from 'react';
import Card from '../shared/Card';
import { useSentimentAnalysis } from '@/hooks/useMentionlytics';

export const DualPieCharts: React.FC = () => {
  const { data: sentimentData, dataMode } = useSentimentAnalysis();
  
  const sentimentPercentages = {
    positive: sentimentData ? Math.round((sentimentData.positive / sentimentData.total) * 100) : 33,
    negative: sentimentData ? Math.round((sentimentData.negative / sentimentData.total) * 100) : 48,
    neutral: sentimentData ? Math.round((sentimentData.neutral / sentimentData.total) * 100) : 19
  };

  const emotionData = {
    joy: 24,
    trust: 18,
    fear: 16,
    anger: 13,
    sadness: 15,
    surprise: 8,
    disgust: 6
  };

  const SentimentChart = () => (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(34, 197, 94)"
          strokeWidth="3"
          strokeDasharray={`${sentimentPercentages.positive} 100`}
          strokeDashoffset="25"
          className="transition-all duration-1000"
        />
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(239, 68, 68)"
          strokeWidth="3"
          strokeDasharray={`${sentimentPercentages.negative} 100`}
          strokeDashoffset={25 - sentimentPercentages.positive}
          className="transition-all duration-1000"
        />
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(156, 163, 175)"
          strokeWidth="3"
          strokeDasharray={`${sentimentPercentages.neutral} 100`}
          strokeDashoffset={25 - sentimentPercentages.positive - sentimentPercentages.negative}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-green-400">{sentimentPercentages.positive}%</div>
        <div className="text-xs text-white/60">Positive</div>
      </div>
    </div>
  );

  const EmotionChart = () => (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
        {/* Joy - Yellow */}
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(251, 191, 36)"
          strokeWidth="3"
          strokeDasharray={`${emotionData.joy} 100`}
          strokeDashoffset="25"
          className="transition-all duration-1000"
        />
        {/* Trust - Blue */}
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          strokeDasharray={`${emotionData.trust} 100`}
          strokeDashoffset={25 - emotionData.joy}
          className="transition-all duration-1000"
        />
        {/* Fear - Purple */}
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(147, 51, 234)"
          strokeWidth="3"
          strokeDasharray={`${emotionData.fear} 100`}
          strokeDashoffset={25 - emotionData.joy - emotionData.trust}
          className="transition-all duration-1000"
        />
        {/* Anger - Red */}
        <circle
          cx="21"
          cy="21"
          r="15.91549430918952"
          fill="transparent"
          stroke="rgb(239, 68, 68)"
          strokeWidth="3"
          strokeDasharray={`${emotionData.anger} 100`}
          strokeDashoffset={25 - emotionData.joy - emotionData.trust - emotionData.fear}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-yellow-400">{emotionData.joy}%</div>
        <div className="text-xs text-white/60">Joy</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Sentiment Analysis */}
      <Card variant="glass" padding="sm" className="sentiment-analysis hoverable hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-barlow font-semibold text-white text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Sentiment Analysis
          </h3>
          <div className="text-xs font-mono text-amber-400">
            {dataMode}
          </div>
        </div>
        

        <SentimentChart />
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Positive</div>
            <div className="text-sm font-semibold text-green-400">{sentimentData?.positive || 343}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Negative</div>
            <div className="text-sm font-semibold text-red-400">{sentimentData?.negative || 502}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Neutral</div>
            <div className="text-sm font-semibold text-gray-400">{sentimentData?.neutral || 194}</div>
          </div>
        </div>
      </Card>

      {/* Emotion Analysis */}
      <Card variant="glass" padding="sm" className="emotion-analysis hoverable hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-barlow font-semibold text-white text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
            Emotion Analysis
          </h3>
          <div className="text-xs font-mono text-amber-400">
            8 emotions
          </div>
        </div>

        <EmotionChart />
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Joy</div>
            <div className="text-sm font-semibold text-yellow-400">{emotionData.joy}%</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Trust</div>
            <div className="text-sm font-semibold text-blue-400">{emotionData.trust}%</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Fear</div>
            <div className="text-sm font-semibold text-purple-400">{emotionData.fear}%</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <div className="text-xs text-white/70">Anger</div>
            <div className="text-sm font-semibold text-red-400">{emotionData.anger}%</div>
          </div>
        </div>
      </Card>
    </div>
  );
};