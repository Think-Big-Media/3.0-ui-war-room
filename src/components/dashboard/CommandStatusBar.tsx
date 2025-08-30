import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2, Clock, Cpu, Database, Globe, Zap } from 'lucide-react';

interface StatusMetric {
  label: string;
  value: string | number;
  status: 'success' | 'warning' | 'error' | 'neutral';
  icon?: React.ReactNode;
}

interface CommandStatus {
  activeProcesses: number;
  systemHealth: 'healthy' | 'degraded' | 'critical';
  apiLatency: number;
  dbConnections: number;
  activeUsers: number;
  lastUpdate: Date;
}

const CommandStatusBar: React.FC = () => {
  const [status, setStatus] = useState<CommandStatus>({
    activeProcesses: 12,
    systemHealth: 'healthy',
    apiLatency: 45,
    dbConnections: 8,
    activeUsers: 247,
    lastUpdate: new Date()
  });

  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStatus(prev => ({
        activeProcesses: Math.max(5, prev.activeProcesses + Math.floor(Math.random() * 5 - 2)),
        systemHealth: Math.random() > 0.9 ? 'degraded' : 'healthy',
        apiLatency: Math.max(20, Math.min(200, prev.apiLatency + Math.floor(Math.random() * 20 - 10))),
        dbConnections: Math.max(3, Math.min(20, prev.dbConnections + Math.floor(Math.random() * 3 - 1))),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 10 - 5)),
        lastUpdate: new Date()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4" />;
      case 'degraded': return <AlertCircle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const metrics: StatusMetric[] = [
    {
      label: 'System Health',
      value: status.systemHealth.toUpperCase(),
      status: status.systemHealth === 'healthy' ? 'success' : status.systemHealth === 'degraded' ? 'warning' : 'error',
      icon: getHealthIcon(status.systemHealth)
    },
    {
      label: 'Active Processes',
      value: status.activeProcesses,
      status: status.activeProcesses > 20 ? 'warning' : 'success',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      label: 'API Latency',
      value: `${status.apiLatency}ms`,
      status: status.apiLatency > 100 ? 'warning' : status.apiLatency > 150 ? 'error' : 'success',
      icon: <Zap className="w-4 h-4" />
    },
    {
      label: 'DB Connections',
      value: `${status.dbConnections}/20`,
      status: status.dbConnections > 15 ? 'warning' : 'success',
      icon: <Database className="w-4 h-4" />
    },
    {
      label: 'Active Users',
      value: status.activeUsers.toLocaleString(),
      status: 'neutral',
      icon: <Globe className="w-4 h-4" />
    }
  ];

  const getStatusColor = (status: StatusMetric['status']) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-300 bg-gray-400/5 border-gray-400/10';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl">
      <div className="max-w-full mx-auto px-4 py-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(status.systemHealth)} animate-pulse`} />
                <div className={`absolute inset-0 w-2 h-2 rounded-full ${getHealthColor(status.systemHealth)} animate-ping`} />
              </div>
              <span className="text-sm font-medium text-gray-300">Command Center Status</span>
            </div>
            <span className="text-xs text-gray-500">|</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {status.lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Live/Mock Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              isLive 
                ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
            }`}
          >
            {isLive ? 'LIVE' : 'MOCK'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`
                relative group cursor-pointer
                px-3 py-2.5 rounded-lg border backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-lg
                ${getStatusColor(metric.status)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                  <div className="text-lg font-bold tracking-tight">{metric.value}</div>
                </div>
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  {metric.icon}
                </div>
              </div>
              
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Command Line Preview */}
        <div className="mt-3 p-2 bg-black/40 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xs font-mono">$</span>
            <span className="text-gray-400 text-xs font-mono flex-1">
              war-room status --monitor --interval=3s
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandStatusBar;