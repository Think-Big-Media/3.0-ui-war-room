/**
 * War Room Platform - Single Application Entry Point
 * Enterprise Standard: ONE App component, configuration-driven
 * REPLACES: All legacy app variants with single source of truth
 */

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import CommandCenter from './pages/CommandCenter';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import CampaignControl from './pages/CampaignControl';
import IntelligenceHub from './pages/IntelligenceHub';
import AlertCenter from './pages/AlertCenter';
import SettingsPage from './pages/SettingsPage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import ContentEnginePage from './pages/ContentEnginePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import TickerTape from './components/TickerTape';
import './warroom.css';

/**
 * Single Application Component - FINAL VERSION
 * This is the ONLY app entry point - no more confusion
 * Single application component - enterprise standard
 */
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/real-time-monitoring" element={<RealTimeMonitoring />} />
          <Route path="/campaign-control" element={<CampaignControl />} />
          <Route path="/intelligence-hub" element={<IntelligenceHub />} />
          <Route path="/alert-center" element={<AlertCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/content-calendar" element={<ContentCalendarPage />} />
          <Route path="/content-engine" element={<ContentEnginePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TickerTape />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
