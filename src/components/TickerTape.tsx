import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { informationService } from '../services/informationService';
import { type InformationItem } from '../types/information';

const TickerTape: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<InformationItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickerItems = () => {
      const items = informationService.getTickerItems(20);
      setTickerItems(items);
    };

    loadTickerItems();
    const interval = setInterval(() => {
      informationService.refreshData();
      loadTickerItems();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = (item: InformationItem) => {
    informationService.markAsRead(item.id);
    navigate(item.deepLink);
  };

  if (tickerItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 border-t border-white/20 h-12 overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
      
      <div className="ticker-scroll flex items-center h-12 whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            onClick={() => handleItemClick(item)}
            className="inline-flex items-center px-6 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="text-white/90 text-sm font-mono uppercase">
              {item.title}
            </span>
            <span className="text-white/60 text-xs font-mono ml-2 max-w-xs truncate">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;
