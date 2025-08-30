import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RadarCanvas } from './RadarCanvas';
import { IntelligencePanel } from './IntelligencePanel';
export interface SWOTDataPoint {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  x: number;
  y: number;
  intensity: number;
  label: string;
  timestamp: Date;
  sentiment: number;
  source: string;
}
export interface CrisisAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
}

// @component: SWOTRadarDashboard
export const SWOTRadarDashboard = () => {
  // Unique instance tracking
  const instanceId = useRef(`swot-dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  
  console.log(`🔷 [GENERATED SWOTRadarDashboard] RENDER #${renderCountRef.current} - Instance: ${instanceId.current}`);
  
  // StrictMode detection
  const strictModeRef = useRef(false);
  useEffect(() => {
    if (strictModeRef.current) {
      console.warn('⚠️ REACT STRICTMODE DOUBLE MOUNT DETECTED!');
    }
    strictModeRef.current = true;
  });
  const [dataPoints, setDataPoints] = useState<SWOTDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  // REMOVED sweepAngle state - animation now handled internally in RadarCanvas
  const [activeLabel, setActiveLabel] = useState<{
    point: SWOTDataPoint;
    x: number;
    y: number;
  } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sweepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for demonstration - use useMemo to prevent re-creation on every render
  const mockDataPoints: SWOTDataPoint[] = useMemo(() => [{
    id: '1',
    type: 'strength',
    x: 150,
    y: 120,
    intensity: 0.8,
    label: 'Strong Brand Recognition',
    timestamp: new Date(),
    sentiment: 0.7,
    source: 'Twitter'
  }, {
    id: '2',
    type: 'weakness',
    x: 450,
    y: 180,
    intensity: 0.6,
    label: 'Customer Service Issues',
    timestamp: new Date(),
    sentiment: -0.5,
    source: 'Reviews'
  }, {
    id: '3',
    type: 'opportunity',
    x: 180,
    y: 420,
    intensity: 0.9,
    label: 'Emerging Market Expansion',
    timestamp: new Date(),
    sentiment: 0.8,
    source: 'News'
  }, {
    id: '4',
    type: 'threat',
    x: 480,
    y: 450,
    intensity: 0.7,
    label: 'Competitor Launch',
    timestamp: new Date(),
    sentiment: -0.6,
    source: 'Industry Reports'
  }], []);

  // Sweep animation removed - now handled internally in RadarCanvas with requestAnimationFrame

  // Initialize mock data
  useEffect(() => {
    console.log('📝 Setting initial mock data');
    setDataPoints(mockDataPoints);
    setIsConnected(true);

    // Mock crisis alert
    setCrisisAlerts([{
      id: 'alert-1',
      message: 'Negative sentiment spike detected in customer service mentions',
      severity: 'high',
      timestamp: new Date(),
      source: 'Social Media'
    }]);
  }, []);
  const handleSweepHit = (point: SWOTDataPoint, canvasX: number, canvasY: number) => {
    setActiveLabel({
      point,
      x: canvasX,
      y: canvasY
    });
    setTimeout(() => setActiveLabel(null), 3000);
  };
  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      dataPoints,
      crisisAlerts,
      summary: {
        strengths: dataPoints.filter(p => p.type === 'strength').length,
        weaknesses: dataPoints.filter(p => p.type === 'weakness').length,
        opportunities: dataPoints.filter(p => p.type === 'opportunity').length,
        threats: dataPoints.filter(p => p.type === 'threat').length
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swot-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // @return - 2/3 SWOT radar, 1/3 live intelligence with compact proportions
  return (
    <div className="w-full flex gap-4" style={{ height: '350px' }}>
      {/* Left Section (2/3) - SWOT Radar Only */}
      <div className="flex-[2] flex flex-col">
        {/* SWOT Radar Container - Clean square, no padding, no rounded corners */}
        <div className="relative overflow-hidden" style={{ height: '350px', aspectRatio: '1/1' }}>
          <RadarCanvas dataPoints={dataPoints} onSweepHit={handleSweepHit} />
          
          {/* Active Label Tooltip */}
          {activeLabel && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bg-slate-800/95 backdrop-blur-md border border-slate-600/60 rounded-lg p-3 shadow-2xl z-[1060] max-w-xs"
              style={{
                left: activeLabel.x + 10,
                top: activeLabel.y - 10,
                transform: 'translate(0, -100%)'
              }}
            >
              <div className="text-sm font-medium text-white mb-2">
                {activeLabel.point.label}
              </div>
              <div className="text-xs text-gray-300 mb-1">
                Source: {activeLabel.point.source}
              </div>
              <div className="text-xs text-gray-300">
                Sentiment: {(activeLabel.point.sentiment * 100).toFixed(0)}%
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Right Section (1/3) - Intelligence Panel */}
      <div className="flex-1">
        <IntelligencePanel 
          isConnected={isConnected} 
          dataPoints={dataPoints} 
          crisisAlerts={crisisAlerts} 
          onExport={exportData} 
        />
      </div>
    </div>
  );
};