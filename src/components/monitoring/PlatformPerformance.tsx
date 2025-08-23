// Platform Performance Component

import type React from 'react';
import { MessageSquare, Users, Globe, BarChart3 } from 'lucide-react';
import Card from '../shared/Card';
import { type PlatformPerformance as PlatformPerformanceType } from '../../types/monitoring';

interface PlatformPerformanceProps {
  platformData: PlatformPerformanceType[];
  insights?: string;
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({
  platformData,
  insights = 'Twitter mentions down 32% - Opposition now dominant platform',
}) => {
  const getPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-orange-500" />;
      case 'BarChart3':
        return <BarChart3 className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card padding="md" variant="glass">
      <h3 className="text-xl font-semibold text-white/60 mb-4 font-condensed tracking-wide" style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' }}>PLATFORM PERFORMANCE</h3>
      <div className="space-y-3">
        {platformData.map((platform, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getPlatformIcon(platform.icon)}
              <span className="text-white/80">{platform.platform}</span>
            </div>
            <span className="text-white/90 font-medium">{platform.percentage}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-black/20 rounded-lg">
        <p className="text-xs text-white/70 font-mono">
          <span className="text-blue-400">{insights}</span>
        </p>
      </div>
    </Card>
  );
};

export default PlatformPerformance;
