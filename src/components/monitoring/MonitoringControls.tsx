// Monitoring Controls Component

import type React from 'react';
import { Play, Pause } from 'lucide-react';
import Card from '../shared/Card';

interface MonitoringControlsProps {
  isLive: boolean;
  onToggleLive: () => void;
  lastUpdated?: string;
  totalMentions?: number;
}

const MonitoringControls: React.FC<MonitoringControlsProps> = ({
  isLive,
  onToggleLive,
  lastUpdated = '30 seconds ago',
  totalMentions = 12847,
}) => {
  return (
    <Card padding="sm" variant="glass" className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="text-white/90 font-medium">
              {isLive ? 'Live Monitoring' : 'Monitoring Paused'}
            </span>
          </div>
          <button
            onClick={onToggleLive}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {isLive ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isLive ? 'Pause' : 'Start'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-white/70 font-mono">
          <span>Last updated: {lastUpdated}</span>
          <span>Total mentions: {totalMentions.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default MonitoringControls;
