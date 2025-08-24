import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const TickerTape: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<InformationItem[]>([]);
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
    // Load ticker items from information service
    const loadTickerItems = () => {
      const items = informationService.getTickerItems(20);
      setTickerItems(items);
    };

    loadTickerItems();

    // Refresh ticker items every 30 seconds
    const interval = setInterval(() => {
      informationService.refreshData();
      loadTickerItems();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = (item: InformationItem, index: number) => {
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



  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 overflow-hidden contain-layout"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        minHeight: '48px'
      }}
    >

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
            animation: ticker-scroll 90s linear infinite !important;
            animation-duration: 90s !important;
            animation-timing-function: linear !important;
            animation-iteration-count: infinite !important;
            will-change: transform;
            display: flex !important;
            align-items: center !important;
            white-space: nowrap !important;
            gap: 2rem !important;
            width: max-content !important;
          }

          /* Override reduced motion for ticker - it's essential functionality */
          @media (prefers-reduced-motion: reduce) {
            .ticker-content {
              animation: ticker-scroll 90s linear infinite !important;
              animation-duration: 90s !important;
              animation-timing-function: linear !important;
              animation-iteration-count: infinite !important;
            }
          }

          .ticker-content:hover {
            animation-play-state: paused !important;
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
        <div className="ticker-content">
          {/* Create seamless continuous loop */}
          {Array.from({ length: 30 }, (_, setIndex) =>
            tickerItems.map((item, itemIndex) => {
              const IconComponent = getIcon(item);
              const uniqueIndex = setIndex * tickerItems.length + itemIndex;
              return (
                <div
                  key={`ticker-${item.id}-${setIndex}-${itemIndex}`}
                  className={`ticker-item flex items-center space-x-3 px-4 py-1 cursor-pointer rounded-lg ${getPriorityOpacity(item.priority)}`}
                  onClick={() => handleItemClick(item, uniqueIndex)}
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
                </div>
              );
            })
          ).flat()}
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

    </div>
  );
};

export default TickerTape;
