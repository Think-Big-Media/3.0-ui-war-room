import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usaPoliticalMap from '../../assets/usa-political-map.svg';

interface StateData {
  name: string;
  abbreviation: string;
  polling: string;
  party: 'D' | 'R' | 'TOSS UP';
  electoralVotes: number;
  demographics: string;
  keyIssues: string[];
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  data: StateData | null;
}

const InteractivePoliticalMap: React.FC = () => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });

  // Mock data for key swing states
  const stateData: Record<string, StateData> = {
    pennsylvania: {
      name: 'Pennsylvania',
      abbreviation: 'PA',
      polling: '+2.3% D',
      party: 'D',
      electoralVotes: 20,
      demographics: '67% White, 12% Black, 8% Hispanic',
      keyIssues: ['Economy', 'Healthcare', 'Manufacturing']
    },
    michigan: {
      name: 'Michigan',
      abbreviation: 'MI',
      polling: '-1.2% R',
      party: 'R',
      electoralVotes: 16,
      demographics: '75% White, 14% Black, 5% Hispanic',
      keyIssues: ['Auto Industry', 'Environment', 'Jobs']
    },
    wisconsin: {
      name: 'Wisconsin',
      abbreviation: 'WI',
      polling: 'TOSS UP',
      party: 'TOSS UP',
      electoralVotes: 10,
      demographics: '81% White, 6% Black, 7% Hispanic',
      keyIssues: ['Agriculture', 'Healthcare', 'Education']
    },
    arizona: {
      name: 'Arizona',
      abbreviation: 'AZ',
      polling: '+0.8% R',
      party: 'R',
      electoralVotes: 11,
      demographics: '54% White, 5% Black, 32% Hispanic',
      keyIssues: ['Immigration', 'Healthcare', 'Economy']
    },
    georgia: {
      name: 'Georgia',
      abbreviation: 'GA',
      polling: '+1.5% D',
      party: 'D',
      electoralVotes: 16,
      demographics: '51% White, 32% Black, 10% Hispanic',
      keyIssues: ['Voting Rights', 'Economy', 'Healthcare']
    },
    nevada: {
      name: 'Nevada',
      abbreviation: 'NV',
      polling: 'TOSS UP',
      party: 'TOSS UP',
      electoralVotes: 6,
      demographics: '49% White, 10% Black, 29% Hispanic',
      keyIssues: ['Tourism', 'Housing', 'Water Rights']
    }
  };

  const handleStateClick = (stateKey: string, event: React.MouseEvent) => {
    const state = stateData[stateKey];
    if (state) {
      navigate(`/intelligence-hub?location=${state.name}`);
    }
  };

  const handleStateHover = (stateKey: string, event: React.MouseEvent) => {
    const state = stateData[stateKey];
    if (state) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: state
      });
    }
  };

  const handleStateLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      data: null
    });
  };

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'D': return 'text-blue-400 border-blue-500/50 bg-blue-500/20';
      case 'R': return 'text-red-400 border-red-500/50 bg-red-500/20';
      case 'TOSS UP': return 'text-purple-400 border-purple-500/50 bg-purple-500/20';
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/20';
    }
  };

  return (
    <div className="relative w-full h-full">
      <img 
        src={usaPoliticalMap}
        alt="USA Political Map"
        className="w-full h-full object-contain"
        style={{
          filter: 'invert(1) brightness(0.8) contrast(1.2)'
        }}
      />
      
      {/* Clickable overlay regions for key swing states */}
      {/* Pennsylvania */}
      <div 
        className="absolute cursor-pointer hover:bg-blue-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '35%', left: '78%', width: '6%', height: '8%' }}
        onClick={(e) => handleStateClick('pennsylvania', e)}
        onMouseEnter={(e) => handleStateHover('pennsylvania', e)}
        onMouseLeave={handleStateLeave}
        title="Pennsylvania"
      />
      
      {/* Michigan */}
      <div 
        className="absolute cursor-pointer hover:bg-red-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '28%', left: '67%', width: '8%', height: '10%' }}
        onClick={(e) => handleStateClick('michigan', e)}
        onMouseEnter={(e) => handleStateHover('michigan', e)}
        onMouseLeave={handleStateLeave}
        title="Michigan"
      />
      
      {/* Wisconsin */}
      <div 
        className="absolute cursor-pointer hover:bg-purple-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '32%', left: '60%', width: '6%', height: '8%' }}
        onClick={(e) => handleStateClick('wisconsin', e)}
        onMouseEnter={(e) => handleStateHover('wisconsin', e)}
        onMouseLeave={handleStateLeave}
        title="Wisconsin"
      />
      
      {/* Arizona */}
      <div 
        className="absolute cursor-pointer hover:bg-red-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '55%', left: '25%', width: '7%', height: '8%' }}
        onClick={(e) => handleStateClick('arizona', e)}
        onMouseEnter={(e) => handleStateHover('arizona', e)}
        onMouseLeave={handleStateLeave}
        title="Arizona"
      />
      
      {/* Georgia */}
      <div 
        className="absolute cursor-pointer hover:bg-blue-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '55%', left: '75%', width: '6%', height: '8%' }}
        onClick={(e) => handleStateClick('georgia', e)}
        onMouseEnter={(e) => handleStateHover('georgia', e)}
        onMouseLeave={handleStateLeave}
        title="Georgia"
      />
      
      {/* Nevada */}
      <div 
        className="absolute cursor-pointer hover:bg-purple-500/20 transition-all duration-200 rounded-sm"
        style={{ top: '45%', left: '15%', width: '5%', height: '8%' }}
        onClick={(e) => handleStateClick('nevada', e)}
        onMouseEnter={(e) => handleStateHover('nevada', e)}
        onMouseLeave={handleStateLeave}
        title="Nevada"
      />

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
          }}
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white font-barlow">{tooltip.data.name}</h4>
              <div className={`px-2 py-1 rounded text-xs border ${getPartyColor(tooltip.data.party)}`}>
                {tooltip.data.polling}
              </div>
            </div>
            <div className="space-y-1 text-xs text-white/80">
              <div className="font-jetbrains">
                Electoral Votes: <span className="text-orange-400 font-bold">{tooltip.data.electoralVotes}</span>
              </div>
              <div className="text-white/60">{tooltip.data.demographics}</div>
              <div>
                <span className="text-blue-300">Key Issues:</span> {tooltip.data.keyIssues.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePoliticalMap;