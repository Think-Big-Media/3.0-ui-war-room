/**
 * War Room Platform - Main Application
 * Clean, functional implementation
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Pages
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import CampaignControl from './pages/CampaignControl';
import IntelligenceHub from './pages/IntelligenceHub';
import AlertCenter from './pages/AlertCenter';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

// Components
import { ErrorBoundary } from './components/ErrorBoundary';
import TickerTape from './components/TickerTape';

// Styles
import './warroom.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Core Navigation Routes */}
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/real-time-monitoring" element={<RealTimeMonitoring />} />
          <Route path="/campaign-control" element={<CampaignControl />} />
          <Route path="/intelligence-hub" element={<IntelligenceHub />} />
          <Route path="/alert-center" element={<AlertCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Global Components */}
        <TickerTape />
      </ErrorBoundary>
    </Router>
  );
}

export default App;