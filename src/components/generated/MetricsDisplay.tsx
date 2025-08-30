import React from 'react';
const METRICS_DATA = [{
  label: 'Mentions',
  value: 236,
  color: 'text-gray-200',
  glow: 'rgba(255,255,255,0.4)'
}, {
  label: 'Alerts',
  value: 9,
  color: 'text-orange-400',
  glow: '#fb923c'
}, {
  label: 'Opportunities',
  value: 18,
  color: 'text-green-400',
  glow: '#4ade80'
}, {
  label: 'Threats',
  value: 3,
  color: 'text-red-400',
  glow: '#f87171'
}] as any[];

// @component: MetricsDisplay
export const MetricsDisplay = () => {
  // @return
  return <div className="flex items-center gap-4">
      {METRICS_DATA.map((metric, index) => <div key={metric.label} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-500 mx-2" style={{
        textShadow: '0 0 4px rgba(255,255,255,0.2)'
      }}>
              |
            </span>}
          
          <span className={`text-sm font-mono ${metric.color}`} style={{
        textShadow: `0 0 8px ${metric.glow}`,
        fontFamily: 'JetBrains Mono, monospace'
      }}>
            {metric.value}
          </span>
          
          <span className="text-sm font-mono text-gray-400" style={{
        textShadow: '0 0 6px rgba(255,255,255,0.2)',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
            {metric.label}
          </span>
        </div>)}
    </div>;
};