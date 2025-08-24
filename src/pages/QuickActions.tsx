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

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  hoverShadowColor: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
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
    },
  ];

  return (
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Quick Actions
        </h3>
        <p className="text-slate-400 text-sm">Access key features and tools instantly</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
  );
};

export default QuickActions;
