import React from 'react';

const TickerTapeSimple: React.FC = () => {
  // Hard-coded test data to eliminate service dependency
  const testItems = [
    "Healthcare Policy Debate - New legislation gaining bipartisan support",
    "Crisis Response Needed - Opposition attack ad trending",
    "Optimize Healthcare Messaging - 35% better response on weekends",
    "New Volunteer Sign-ups - 47 new volunteers registered in District 3",
    "Budget Reallocation Opportunity - Consider reallocating budget to District 7",
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white border-t-2 border-yellow-400 overflow-hidden"
      style={{
        height: '48px',
        backgroundColor: 'rgb(220, 38, 38)', // Force red background for visibility
      }}
    >
      <div className="h-12 flex items-center">
        <style>{`
          @keyframes ticker-scroll-simple {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .ticker-content-simple {
            animation: ticker-scroll-simple 60s linear infinite !important;
            animation-duration: 60s !important;
            will-change: transform;
            display: flex;
            align-items: center;
            white-space: nowrap;
            gap: 3rem;
            width: max-content;
            height: 48px;
            padding: 0;
          }

          /* Force animation even with reduced motion preference for this specific ticker */
          @media (prefers-reduced-motion: reduce) {
            .ticker-content-simple {
              animation: ticker-scroll-simple 60s linear infinite !important;
              animation-duration: 60s !important;
            }
          }

          .ticker-content-simple:hover {
            animation-play-state: paused;
          }

          .ticker-item-simple {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            font-weight: bold;
          }
        `}</style>
        <div className="ticker-content-simple">
          {/* Repeat items 8 times for absolutely seamless loop */}
          {[...testItems, ...testItems, ...testItems, ...testItems, ...testItems, ...testItems, ...testItems, ...testItems].map((item, index) => (
            <div
              key={`simple-ticker-${index}`}
              className="ticker-item-simple"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Debug indicator */}
      <div className="absolute top-0 left-4 text-xs text-yellow-300 bg-black px-2 py-1">
        SIMPLE TICKER TEST - {testItems.length} items
      </div>
    </div>
  );
};

export default TickerTapeSimple;
