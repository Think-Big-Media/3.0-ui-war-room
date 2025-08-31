import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { useGeographicMentions } from '../../hooks/useMentionlytics';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface StateData {
  id: string;
  name: string;
  mentions: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  sentimentScore: number;
  topKeywords: string[];
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  data: StateData | null;
}

const MentionlyticsPoliticalMap: React.FC = () => {
  const navigate = useNavigate();
  const { data: mentionlyticsData, loading, dataMode } = useGeographicMentions();
  
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });

  // Convert Mentionlytics data to state lookup
  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateData>();
    
    if (mentionlyticsData) {
      mentionlyticsData.forEach(locationData => {
        const totalMentions = locationData.sentiment.positive + locationData.sentiment.negative + locationData.sentiment.neutral;
        const sentimentScore = totalMentions > 0 
          ? ((locationData.sentiment.positive - locationData.sentiment.negative) / totalMentions) * 100
          : 0;
          
        map.set(locationData.state, {
          id: locationData.state,
          name: locationData.state,
          mentions: locationData.mentions,
          sentiment: locationData.sentiment,
          sentimentScore,
          topKeywords: locationData.topKeywords
        });
      });
    }
    
    return map;
  }, [mentionlyticsData]);

  // Create color scale based on sentiment scores
  const colorScale = useMemo(() => {
    const sentimentScores = Array.from(stateDataMap.values()).map(state => state.sentimentScore);
    
    if (sentimentScores.length === 0) {
      return scaleQuantize().domain([-50, 50]).range(['#dc2626', '#ef4444', '#6b7280', '#22c55e', '#16a34a']);
    }
    
    const minScore = Math.min(...sentimentScores);
    const maxScore = Math.max(...sentimentScores);
    
    return scaleQuantize()
      .domain([Math.min(minScore, -20), Math.max(maxScore, 20)])
      .range(['#dc2626', '#ef4444', '#6b7280', '#22c55e', '#16a34a']);
  }, [stateDataMap]);

  const handleStateClick = (geo: any) => {
    const stateName = geo.properties.name;
    navigate(`/intelligence-hub?location=${stateName}`);
  };

  const handleStateHover = (geo: any, event: React.MouseEvent) => {
    const stateName = geo.properties.name;
    const stateData = stateDataMap.get(stateName);
    
    if (stateData) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: stateData
      });
    }
  };

  const handleStateLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  };

  const getStateFill = (geo: any) => {
    const stateName = geo.properties.name;
    const stateData = stateDataMap.get(stateName);
    
    if (stateData) {
      return colorScale(stateData.sentimentScore);
    }
    
    return '#374151'; // Default gray for states without data
  };

  return (
    <div className="relative w-full h-full bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/10 p-2 pt-2">
      {/* Data Mode Indicator - positioned absolute */}
      <div className="absolute top-2 right-2 z-10">
        <div className={`px-2 py-1 rounded text-xs font-bold ${ 
          dataMode === 'MOCK' 
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {loading ? 'Loading...' : dataMode}
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: '240px' }}>
        <ComposableMap
          projection="geoAlbersUsa"
          width={460}
          height={240}
          projectionConfig={{
            scale: 500,
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateFill(geo)}
                    stroke="#64748b"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        fill: '#ffffff40',
                        outline: 'none',
                        cursor: 'pointer'
                      },
                      pressed: { outline: 'none' }
                    }}
                    onClick={() => handleStateClick(geo)}
                    onMouseEnter={(event) => handleStateHover(geo, event)}
                    onMouseLeave={handleStateLeave}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed z-[70] pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
          }}
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white font-barlow">{tooltip.data.name}</h4>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                tooltip.data.sentimentScore > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {tooltip.data.sentimentScore > 0 ? '+' : ''}{tooltip.data.sentimentScore.toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-white/80">
              <div className="font-jetbrains">
                Mentions: <span className="text-blue-400 font-bold">{tooltip.data.mentions.toLocaleString()}</span>
                {dataMode === 'MOCK' && <span className="text-yellow-400 ml-1">(MOCK)</span>}
              </div>
              
              <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                <div className="text-green-400">
                  +{tooltip.data.sentiment.positive}
                </div>
                <div className="text-red-400">
                  -{tooltip.data.sentiment.negative}
                </div>
                <div className="text-gray-400">
                  ={tooltip.data.sentiment.neutral}
                </div>
              </div>
              
              <div className="text-xs">
                <span className="text-cyan-300">Trending:</span> {tooltip.data.topKeywords.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentionlyticsPoliticalMap;