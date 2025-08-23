// Activity Feed Component

import type React from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { type CampaignActivityItem } from '../../types/campaign';
import { getActivityIcon } from './utils';

interface ActivityFeedProps {
  activities: CampaignActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card padding="md" variant="glass">
        <h3 className="text-xl font-semibold text-white/20 mb-4 font-condensed tracking-wide" style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' }}>
          RECENT ACTIVITY
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 bg-black/20 rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="text-white/90 text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-white/70"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {activity.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;
