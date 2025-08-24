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
import { BRAND_TOKENS } from '../tokens/colors'; main

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accentKey: keyof typeof BRAND_TOKENS;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      icon: Zap,
      label: 'Quick Campaign',
      accentKey: 'dashboard',
    },
    {
      icon: Activity,
      label: 'Live Monitor',
      accentKey: 'liveMonitoring',
    },
    {
      icon: FileText,
      label: 'Make Content',
      accentKey: 'warRoom',
    },
    {
      icon: Search,
      label: 'Trend Opps',
      accentKey: 'intelligence',
    },
    {
      icon: Share2,
      label: 'Social Media',
      accentKey: 'settings',
    },
    {
      icon: TrendingUp,
      label: 'Alert Center',
      accentKey: 'alertCenter',
=======
      icon: TrendingUp,
      label: 'Analytics',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      hoverBorderColor: 'hover:border-blue-400/50',
      hoverShadowColor: '',
    },
    {
      icon: Search,
      label: 'Research',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      hoverBorderColor: 'hover:border-purple-400/50',
      hoverShadowColor: '',
    },
    {
      icon: Activity,
      label: 'Monitor',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      hoverBorderColor: 'hover:border-green-400/50',
      hoverShadowColor: '',
    },
    {
      icon: FileText,
      label: 'Content',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      hoverBorderColor: 'hover:border-orange-400/50',
      hoverShadowColor: '',
    },
    {
      icon: Zap,
      label: 'Campaign',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      hoverBorderColor: 'hover:border-yellow-400/50',
      hoverShadowColor: '',
    },
    {
      icon: Share2,
      label: 'Social',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      hoverBorderColor: 'hover:border-pink-400/50',
      hoverShadowColor: '',
>>>>>>> main
    },
  ];

  return (
<<<<<<< HEAD
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="group hoverable hover:bg-black/25"
      padding="md"
      variant="glass"
    >
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 lg:p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 hoverable transition-all duration-300">
            <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white/95" />
          </div>
          <h3 className="text-xl lg:text-2xl section-header tracking-wide">
            QUICK ACTIONS
          </h3>
        </div>
=======
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Quick Actions
        </h3>
        <p className="text-slate-400 text-sm">Access key features and tools instantly</p>
>>>>>>> main
      </div>

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
            className={`bg-black/20 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/20 hover:bg-black/25 hoverable transition-all duration-300 flex flex-col items-center space-y-2 quick-action-${action.accentKey}`}
          >
            <action.icon className="w-6 h-6 lg:w-8 lg:h-8 quick-action-icon" />
            <span className="content-title text-white/90">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 lg:mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <span className="footer-text text-white/75">
            Quick access to key features
          </span>
          <span className="footer-text status-active">Ready</span>
        </div>
      </div>
    </Card>
=======
            className={`${action.bgColor} backdrop-blur-sm rounded-lg p-4 border ${action.borderColor} ${action.hoverBorderColor} hover:bg-slate-700/50 transition-all duration-300 flex flex-col items-center space-y-2`}
          >
            <action.icon className={`w-6 h-6 ${action.color}`} />
            <span className="text-xs font-medium text-white">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
>>>>>>> main
  );
};

export default QuickActions;
