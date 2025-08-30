import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
    x: 250,
    y: 100,
    intensity: 0.6,
    label: 'Customer Service Issues',
    timestamp: new Date(),
    sentiment: -0.5,
    source: 'Reviews'
  }, {
    id: '3',
    type: 'weakness',
    x: 280,
    y: 140,
    intensity: 0.5,
    label: 'Technical Debt Accumulation',
    timestamp: new Date(),
    sentiment: -0.4,
    source: 'Internal Audit'
  }, {
    id: '4',
    type: 'opportunity',
    x: 120,
    y: 230,
    intensity: 0.9,
    label: 'Emerging Market Expansion',
    timestamp: new Date(),
    sentiment: 0.8,
    source: 'News'
  }, {
    id: '5',
    type: 'opportunity',
    x: 90,
    y: 280,
    intensity: 0.75,
    label: 'Partnership Opportunities',
    timestamp: new Date(),
    sentiment: 0.65,
    source: 'Business Development'
  }, {
    id: '6',
    type: 'threat',
    x: 260,
    y: 250,
    intensity: 0.7,
    label: 'Competitor Launch',
    timestamp: new Date(),
    sentiment: -0.6,
    source: 'Industry Reports'
  }, {
    id: '7',
    type: 'threat',
    x: 290,
    y: 290,
    intensity: 0.8,
    label: 'Regulatory Changes',
    timestamp: new Date(),
    sentiment: -0.7,
    source: 'Legal Analysis'
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

  const handleCategoryNavigation = (category: string) => {
    navigate(`/intelligence-hub?category=${category}`);
  };

  const handleSweepHit = (point: SWOTDataPoint, canvasX: number, canvasY: number) => {
    setActiveLabel({
      point,
      x: canvasX,
      y: canvasY
    });
    setTimeout(() => setActiveLabel(null), 1500); // Fade out after 1.5 seconds
  };
  
  const handleBlobClick = (point: SWOTDataPoint) => {
    // Navigate to intelligence hub with the specific category
    navigate(`/intelligence-hub?category=${point.type}&item=${point.id}`);
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
      {/* Left Section - SWOT Radar Only - Square Container */}
      <div className="flex-none" style={{ width: '350px', height: '350px' }}>
        {/* SWOT Radar Container - Clean square, no padding, no rounded corners */}
        <div className="relative overflow-hidden w-full h-full">
          <RadarCanvas dataPoints={dataPoints} onSweepHit={handleSweepHit} onBlobClick={handleBlobClick} />
          
          {/* Active Label - Simple white text that fades in/out */}
          {activeLabel && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-none z-[1060]"
              style={{
                left: Math.min(Math.max(10, activeLabel.x - 60), 280), // Keep within container
                top: Math.min(Math.max(10, activeLabel.y - 20), 320), // Keep within container
              }}
            >
              <div className="text-white text-xs font-medium drop-shadow-lg">
                {activeLabel.point.label}
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