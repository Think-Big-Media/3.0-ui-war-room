import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '../utils/logger';

console.log('🎫 TICKER MODULE: TickerTape.tsx loading...');

const logger = createLogger('TickerTape');
import {
  TrendingUp,
  Zap,
  Target,
  Users,
  BarChart3,
  CheckCircle,
  Lightbulb,
  Globe,
  DollarSign,
  Calendar,
  Activity,
  Award,
  Video,
  AlertCircle,
  Shield,
  Bell,
} from 'lucide-react';
import { informationService } from '../services/informationService';
import { type InformationItem } from '../types/information';

// Test service at module level
try {
  const testItems = informationService.getTickerItems(5);
  console.log('🎫 TICKER MODULE: Service test successful:', testItems.length, 'items');
} catch (error) {
  console.error('🎫 TICKER MODULE: Service test failed:', error);
}

const TickerTape: React.FC = () => {
  console.log('🎫 TICKER: Component function executing');
  const [tickerItems, setTickerItems] = useState<InformationItem[]>([]);
  console.log('🎫 TICKER: Current tickerItems:', tickerItems.length, tickerItems);
  const navigate = useNavigate();

  // Icon mapping for information items
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp,
    DollarSign,
    Lightbulb,
    Globe,
    Activity,
    BarChart3,
    Calendar,
    Target,
    Users,
    Zap,
    Award,
    Video,
    CheckCircle,
    AlertCircle,
    Shield,
    Bell,
  };

  useEffect(() => {
    console.log('🎫 TICKER: useEffect running');

    // Load ticker items from information service
    const loadTickerItems = () => {
      console.log('🎫 TICKER: Loading items from service...');
      try {
        const items = informationService.getTickerItems(20);
        console.log('🎫 TICKER: Service returned:', items.length, 'items', items);
        setTickerItems(items);
        console.log('🎫 TICKER: State updated with items');
      } catch (error) {
        console.error('🎫 TICKER: Error loading items:', error);
      }
    };

    loadTickerItems();

    // Refresh ticker items every 30 seconds
    const interval = setInterval(() => {
      console.log('🎫 TICKER: Interval refresh...');
      informationService.refreshData();
      loadTickerItems();
    }, 30000);

    return () => {
      console.log('🎫 TICKER: Cleanup interval');
      clearInterval(interval);
    };
  }, []);

  const handleItemClick = (item: InformationItem, index: number) => {
    logger.debug(`Ticker item clicked: ${item.title}`);

    // Mark as read
    informationService.markAsRead(item.id);

    // Navigate to deep link
    navigate(item.deepLink);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'political-news':
        return 'text-blue-400';
      case 'smart-recommendations':
        return 'text-orange-400';
      case 'team-alerts':
        return 'text-red-400';
      default:
        return 'text-white/70';
    }
  };

  const getPriorityOpacity = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'opacity-100';
      case 'high':
        return 'opacity-90';
      case 'medium':
        return 'opacity-80';
      case 'low':
        return 'opacity-70';
      default:
        return 'opacity-80';
    }
  };

  const getIcon = (item: InformationItem) => {
    if (item.icon && iconMap[item.icon]) {
      return iconMap[item.icon];
    }

    // Fallback icons based on category
    switch (item.category) {
      case 'political-news':
        return Globe;
      case 'smart-recommendations':
        return Target;
      case 'team-alerts':
        return Bell;
      default:
        return Activity;
    }
  };

  console.log('🎫 TICKER: About to render. Items length:', tickerItems.length);

  // ALWAYS render something to test if component mounts
  if (tickerItems.length === 0) {
    console.log('🎫 TICKER: No items - rendering fallback');
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-red-500 border-t border-white/20 h-12 flex items-center justify-center">
        <span className="text-white font-mono text-sm">🎫 TICKER LOADING (NO DATA)</span>
      </div>
    );
  }

  console.log('🎫 TICKER: Rendering with', tickerItems.length, 'items');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 border-t border-white/20 overflow-hidden contain-layout">
      <div className="h-12 flex items-center">
        <style>{`
          @keyframes ticker-scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .ticker-content {
            animation: ticker-scroll 30s linear infinite;
            will-change: transform;
            contain: layout style paint;
          }

          .ticker-item {
            transition: transform 0.2s ease, background-color 0.2s ease;
            contain: layout style;
          }

          .ticker-item:hover {
            transform: scale(1.02) translateZ(0);
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}</style>
        <div className="ticker-content flex items-center space-x-8 whitespace-nowrap">
          {/* Repeat items multiple times to ensure seamless loop */}
          {[...tickerItems, ...tickerItems, ...tickerItems].map(
            (item, index) => {
              const IconComponent = getIcon(item);
              return (
                <div
                  key={`ticker-${item.id}-${index}`}
                  className={`ticker-item flex items-center space-x-3 px-4 py-1 cursor-pointer rounded-lg ${getPriorityOpacity(item.priority)}`}
                  onClick={() => handleItemClick(item, index)}
                  title={`${item.category.replace('-', ' ')} - ${item.priority} priority`}
                >
                  <div
                    className={`p-1.5 rounded-full bg-black/20 ${getCategoryColor(item.category)}`}
                  >
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col py-1 space-y-0">
                    <span className="text-white/90 text-sm font-medium font-mono uppercase">
                      {item.title}
                    </span>
                    <span className="text-white/60 text-xs font-mono max-w-md truncate uppercase">
                      {item.text}
                    </span>
                  </div>
                  {/* Category indicator */}
                  <div
                    className={`w-1 h-4 rounded-full ${getCategoryColor(item.category).replace('text-', 'bg-')}`}
                  />
                  {/* Priority indicator */}
                  {item.priority === 'critical' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {index < tickerItems.length * 3 - 1 && (
                    <div className="w-1 h-1 bg-white/30 rounded-full ml-8" />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Quick access to Information Center */}
      <div className="absolute top-0 right-4 h-12 flex items-center">
        <button
          onClick={() => navigate('/alert-center')}
          className="text-white/50 hover:text-white/80 transition-colors text-xs font-mono uppercase"
          title="Open Alert Center"
        >
          View All →
        </button>
      </div>

      {/* Debug info (only in development) */}
      {import.meta.env.DEV && (
        <div className="absolute top-0 left-4 text-xs text-white/50">
          {tickerItems.length} items • Mixed feed
        </div>
      )}
    </div>
  );
};

export default TickerTape;
