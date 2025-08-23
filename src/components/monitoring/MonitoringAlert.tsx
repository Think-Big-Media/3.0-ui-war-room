// Monitoring Alert Component

import type React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { createLogger } from '../../utils/logger';

const logger = createLogger('MonitoringAlert');

interface MonitoringAlertProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const MonitoringAlert: React.FC<MonitoringAlertProps> = ({
  title = 'Alert:',
  message = 'Negative mentions about crime policy up 234% in last 12h — trending in District 8',
  actionText = 'Respond Now',
  onAction,
}) => {
  const handleAction = () => {
    logger.info('Alert action triggered:', message);
    onAction?.();
  };

  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3"
      >
        <AlertCircle className="w-5 h-5 text-red-400" />
        <div>
          <span className="text-red-400 font-medium">{title} </span>
          <span className="text-white/90">{message}</span>
        </div>
        {actionText && (
          <button
            onClick={handleAction}
            className="ml-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            {actionText}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MonitoringAlert;
