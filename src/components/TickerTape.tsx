import React from 'react';

const TickerTape: React.FC = () => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 h-12 bg-black/90 border-t border-white/20 overflow-hidden"
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes tickerMove {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ticker-moving {
          animation: tickerMove 15s linear infinite;
          white-space: nowrap;
          display: flex;
          align-items: center;
          height: 48px;
        }
      `}</style>
      
      <div className="ticker-moving">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '48px',
          color: 'white',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '14px',
          textTransform: 'uppercase',
          gap: '3rem'
        }}>
          <span>🔥 BREAKING: Healthcare Policy Update</span>
          <span>⚡ Election Security Enhanced</span>
          <span>📈 Economic Indicators Rising</span>
          <span>🗳️ Voter Registration Increases</span>
          <span>💡 Campaign Strategy Alert</span>
          <span>⭐ Bipartisan Support Growing</span>
          <span>🎯 District Analytics Updated</span>
          <span>📊 Performance Metrics Available</span>
        </div>
      </div>
    </div>
  );
};

export default TickerTape;
