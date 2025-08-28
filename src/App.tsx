/**
 * War Room Platform - Clean Application Component
 * Single source of truth - No legacy code
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Pages
import CommandCenter from './pages/CommandCenter';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import CampaignControl from './pages/CampaignControl';
import IntelligenceHub from './pages/IntelligenceHub';
import AlertCenter from './pages/AlertCenter';
import SettingsPage from './pages/SettingsPage';

// Additional Pages
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AutomationDashboard from './pages/AutomationDashboard';
import DocumentIntelligence from './pages/DocumentIntelligence';
import ContentCalendarPage from './pages/ContentCalendarPage';
import ContentEnginePage from './pages/ContentEnginePage';
import InformationCenter from './pages/InformationCenter';
import DebugDashboard from './pages/DebugDashboard';
import NotFound from './pages/NotFound';

// V2 Dashboard with SWOT Radar
import DashboardV2 from './pages/v2-dashboard/DashboardV2';
import TestDashboard from './pages/v2-dashboard/TestDashboard';
import SimpleRadar from './pages/v2-dashboard/SimpleRadar';
import BasicTest from './pages/v2-dashboard/BasicTest';
import MinimalTest from './pages/v2-dashboard/MinimalTest';
import StaticRadar from './pages/v2-dashboard/StaticRadar';

// Builder.io Integration
import BuilderPage from './pages/BuilderPage';
// import './builder-registry'; // Temporarily disabled - causing Builder.init error

// Components
import { ErrorBoundary } from './components/ErrorBoundary';
import TickerTape from './components/TickerTape';
import { DataToggleButton } from './components/DataToggleButton';

// Styles
import './warroom.css';

function App() {
  return (
    <>
      {/* Data Toggle - Always visible for development */}
      <DataToggleButton />
      
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Test route FIRST */}
            <Route path="/v2-dashboard" element={<StaticRadar />} />
            
            {/* Main Navigation Routes */}
            <Route path="/" element={<CommandCenter />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/real-time-monitoring" element={<RealTimeMonitoring />} />
            <Route path="/campaign-control" element={<CampaignControl />} />
            <Route path="/intelligence-hub" element={<IntelligenceHub />} />
            <Route path="/alert-center" element={<AlertCenter />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Additional Dashboard Routes */}
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/automation" element={<AutomationDashboard />} />
            <Route path="/documents" element={<DocumentIntelligence />} />
            <Route path="/information-center" element={<InformationCenter />} />
            
            {/* V2 Dashboard with SWOT Radar - Additional routes */}
            <Route path="/v2-test" element={<TestDashboard />} />
            <Route path="/v2-simple" element={<SimpleRadar />} />
            
            {/* Content Management Routes */}
            <Route path="/content-calendar" element={<ContentCalendarPage />} />
            <Route path="/content-engine" element={<ContentEnginePage />} />
            
            {/* Builder.io Routes */}
            <Route path="/builder/*" element={<BuilderPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            
            {/* Development Routes */}
            {import.meta.env.DEV && (
              <Route path="/debug" element={<DebugDashboard />} />
            )}
            
            {/* Legacy Route Support */}
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/CommandCenter" element={<CommandCenter />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Components */}
          <TickerTape />
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
