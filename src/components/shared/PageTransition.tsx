/**
 * Luxurious Page Transition Component
 * Provides smooth, premium transitions between pages
 * Special handling for War Room transitions
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentBg, setCurrentBg] = useState('bg-dashboard');
  const { logOptimizationTips } = usePerformanceMonitor('PageTransition');

  // Route to background mapping
  const getBackgroundClass = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'bg-dashboard';
      case '/real-time-monitoring':
        return 'bg-live-monitoring';
      case '/campaign-control':
        return 'bg-war-room';
      case '/intelligence-hub':
        return 'bg-intelligence';
      case '/alert-center':
        return 'bg-alert-center';
      case '/settings':
        return 'bg-settings';
      default:
        return 'bg-dashboard';
    }
  };

  // Check if transitioning to/from War Room
  const isWarRoomTransition = (pathname: string): boolean => {
    return pathname === '/campaign-control';
  };

  // Get transition classes based on route
  const getTransitionClasses = (): string => {
    const baseClasses = ['page-transition-container'];

    if (isWarRoomTransition(location.pathname)) {
      baseClasses.push('war-room-enter');
    } else {
      baseClasses.push('page-enter');
    }

    if (isTransitioning) {
      if (isWarRoomTransition(location.pathname)) {
        baseClasses.push('war-room-enter-active');
      } else {
        baseClasses.push('page-enter-active');
      }
    }

    return baseClasses.join(' ');
  };

  // Handle route changes with transitions
  useEffect(() => {
    setIsTransitioning(true);

    // Update background class
    const newBg = getBackgroundClass(location.pathname);
    setCurrentBg(newBg);

    // Add stagger effect to cards
    const cards = document.querySelectorAll(
      '[class*="Card"], .card, [class*="card"]'
    );
    cards.forEach((card, index) => {
      if (card instanceof HTMLElement) {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('cards-stagger');
        card.classList.add('fade-in');
      }
    });

    // Complete transition
    const transitionDuration = isWarRoomTransition(location.pathname)
      ? 1200
      : 800;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Log performance optimizations in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logOptimizationTips();
    }
  }, [logOptimizationTips]);

  return (
    <>
      {/* Dynamic background */}
      <div className={`background-transition ${currentBg}`} />

      {/* Page content with transitions */}
      <div className={getTransitionClasses()}>{children}</div>
    </>
  );
};

export default PageTransition;
