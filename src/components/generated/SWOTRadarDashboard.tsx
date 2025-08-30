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
  // Debug: Track renders
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  console.log(`🔷 SWOTRadarDashboard RENDER #${renderCountRef.current}`);
  const [dataPoints, setDataPoints] = useState<SWOTDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);
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

  // Initialize sweep animation
  useEffect(() => {
    console.log('🟣 SWOTRadarDashboard: Starting sweep interval');
    let updateCount = 0;
    sweepIntervalRef.current = setInterval(() => {
      setSweepAngle(prev => {
        updateCount++;
        if (updateCount % 30 === 0) { // Log every 30 updates (about 1 second)
          console.log(`📊 Sweep angle update #${updateCount}, angle: ${prev}`);
        }
        return (prev + 1) % 360;
      });
    }, 33.33); // 12-second cycle: 360 degrees / 12 seconds = 30 degrees/second, at 30fps = 1 degree per frame

    return () => {
      console.log('🟣 SWOTRadarDashboard: Clearing sweep interval');
      if (sweepIntervalRef.current) {
        clearInterval(sweepIntervalRef.current);
      }
    };
  }, []);

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

  // @return - 2/3 SWOT radar, 1/3 live intelligence with proper proportions
  return (
    <div className="w-full h-full flex gap-4">
      {/* Left Section (2/3) - SWOT Radar + Stats */}
      <div className="flex-[2] flex flex-col gap-0 justify-start">
        {/* SWOT Radar Container - Square with no rounded corners */}
        <div className="aspect-square relative bg-black overflow-hidden">
          <RadarCanvas dataPoints={dataPoints} sweepAngle={sweepAngle} onSweepHit={handleSweepHit} />
          
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
        
        {/* Bottom Stats Section - Outside radar container */}
        <div className="px-4 py-2 text-sm text-gray-400 bg-gray-900/50 rounded">
          Active Threats: {dataPoints.filter(p => p.type === 'threat').length} • Opportunities: {dataPoints.filter(p => p.type === 'opportunity').length}
          <br />
          Risk Level: Medium
        </div>
      </div>
      
      {/* Right Section (1/3) - Intelligence Panel */}
      <div className="flex-1 h-full">
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