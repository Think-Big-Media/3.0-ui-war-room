import React from 'react';

console.log('🎫 SIMPLE TickerTape: Module loading');

const TickerTapeSimple: React.FC = () => {
  console.log('🎫 SIMPLE TickerTape: Component rendering');
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 h-12 bg-red-500 flex items-center justify-center"
      style={{
        backgroundColor: '#ef4444',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold'
      }}
    >
      <div style={{
        animation: 'slide 5s linear infinite',
        whiteSpace: 'nowrap'
      }}>
        🎫 SIMPLE TICKER TEST - MOVING TEXT
      </div>
      
      <style>{`
        @keyframes slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default TickerTapeSimple;
