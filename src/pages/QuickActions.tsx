import type React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Search,
  Activity,
  FileText,
  Zap,
  Share2,
} from 'lucide-react';
import Card from '../components/shared/Card';
import { BRAND_ACCENTS } from '../tokens/colors';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accentColor: string;
  accentKey: keyof typeof BRAND_ACCENTS;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      icon: TrendingUp,
      label: 'Viral Opps',
      accentColor: BRAND_ACCENTS.warRoom,
      accentKey: 'warRoom',
    },
    {
      icon: Search,
      label: 'Trend Opps',
      accentColor: BRAND_ACCENTS.intelligence,
      accentKey: 'intelligence',
    },
    {
      icon: Activity,
      label: 'Live Monitor',
      accentColor: BRAND_ACCENTS.liveMonitoring,
      accentKey: 'liveMonitoring',
    },
    {
      icon: FileText,
      label: 'Make Content',
      accentColor: BRAND_ACCENTS.alertCenter,
      accentKey: 'alertCenter',
    },
    {
      icon: Zap,
      label: 'Quick Campaign',
      accentColor: BRAND_ACCENTS.dashboard,
      accentKey: 'dashboard',
    },
    {
      icon: Share2,
      label: 'Social Media',
      accentColor: BRAND_ACCENTS.settings,
      accentKey: 'settings',
    },
  ];

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      className="group hover:border-orange-400/50 hover:bg-black/25"
      padding="md"
      variant="glass"
    >
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 lg:p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-400/20 group-hover:border-orange-400/30 group-hover:shadow-lg group-hover:shadow-purple-400/10 transition-all duration-300">
            <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white/95" />
          </div>
          <h3 className="text-xl lg:text-2xl section-header tracking-wide">
            QUICK ACTIONS
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${action.bgColor} backdrop-blur-sm rounded-xl p-4 lg:p-5 border ${action.borderColor} ${action.hoverBorderColor} hover:bg-black/25 ${action.hoverShadowColor} transition-all duration-300 flex flex-col items-center space-y-2`}
          >
            <action.icon
              className={`w-6 h-6 lg:w-8 lg:h-8 ${action.color}`}
              style={
                action.label === 'Live Monitor'
                  ? { color: 'rgba(126, 211, 33, 1)' }
                  : {}
              }
            />
            <span className="content-title text-white/90">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 lg:mt-6 pt-4 border-t border-purple-400/20">
        <div className="flex items-center justify-between text-sm">
          <span className="footer-text text-white/75">
            Quick access to key features
          </span>
          <span className="footer-text status-active">Ready</span>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;
