import type React from 'react';
import { Hash } from 'lucide-react';

interface PhraseCloudWord {
  text: string;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  mentions: number;
}

interface PhraseCloudProps {
  words: PhraseCloudWord[];
  title?: string;
}

const PhraseCloud: React.FC<PhraseCloudProps> = ({ 
  words, 
  title = "Trending Phrases" 
}) => {
  // Calculate font size based on weight (normalized between 1-4)
  const getFontSize = (weight: number, maxWeight: number) => {
    const normalized = weight / maxWeight;
    return Math.max(1, Math.min(4, normalized * 3 + 1));
  };

  // Get color based on trend and weight
  const getWordColor = (trend: string, weight: number, maxWeight: number) => {
    const intensity = Math.max(0.4, weight / maxWeight);
    
    switch (trend) {
      case 'up':
        return `rgba(34, 197, 94, ${intensity})`; // Green
      case 'down':
        return `rgba(239, 68, 68, ${intensity})`; // Red
      default:
        return `rgba(156, 163, 175, ${intensity})`; // Gray
    }
  };

  const maxWeight = Math.max(...words.map(w => w.weight));

  return (
    <div className="bg-black/20 rounded-2xl border border-[#8B956D]/30 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#E8E4D0] flex items-center space-x-2">
          <Hash className="w-5 h-5 text-[#A0956B]" />
          <span>{title}</span>
        </h3>
        <span className="text-xs text-[#C5C1A8] bg-black/30 px-2 py-1 rounded-full">
          {words.length} phrases
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[120px] p-4">
        {words.map((word, index) => (
          <span
            key={index}
            className="cursor-pointer transition-all duration-300 hover:scale-110 select-none"
            style={{
              fontSize: `${getFontSize(word.weight, maxWeight)}rem`,
              color: getWordColor(word.trend, word.weight, maxWeight),
              fontWeight: word.weight > maxWeight * 0.7 ? 'bold' : 'medium',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
            title={`${word.text}: ${word.mentions} mentions, ${word.trend === 'up' ? '↗' : word.trend === 'down' ? '↘' : '→'}`}
          >
            {word.text}
          </span>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-[#A0956B]">
          Phrase size reflects mention volume • Color indicates trend direction
        </p>
      </div>
    </div>
  );
};

export default PhraseCloud;
