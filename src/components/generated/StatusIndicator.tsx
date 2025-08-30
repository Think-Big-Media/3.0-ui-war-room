import React from 'react';
import { motion } from 'framer-motion';
interface StatusIndicatorProps {
  name: string;
  status: string;
  type: 'success' | 'warning' | 'error';
}

// @component: StatusIndicator
export const StatusIndicator = ({
  name,
  status,
  type
}: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-orange-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };
  const getDotColor = () => {
    switch (type) {
      case 'success':
        return '#4ade80';
      case 'warning':
        return '#fb923c';
      case 'error':
        return '#f87171';
      default:
        return '#4ade80';
    }
  };

  // @return
  return <div className="flex items-center gap-1">
      <motion.div className="flex items-center gap-1" animate={{
      opacity: [0.4, 1, 0.4]
    }} transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        <motion.span className="text-lg leading-none" animate={{
        textShadow: ['0 0 0px transparent', `0 0 5px ${getDotColor()}`, '0 0 0px transparent'],
        filter: ['drop-shadow(0 0 0px transparent)', `drop-shadow(0 0 2px ${getDotColor()})`, 'drop-shadow(0 0 0px transparent)']
      }} transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }} style={{
        color: getDotColor()
      }}>
          ●
        </motion.span>
      </motion.div>
      
      <span className="text-sm font-mono text-gray-300" style={{
      textShadow: '0 0 8px rgba(255,255,255,0.3)',
      fontFamily: 'JetBrains Mono, monospace'
    }}>
        {name}
      </span>
    </div>;
};