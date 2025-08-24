import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
// Use lazy-loaded components for better performance
import {
  CommandCenter,
  RealTimeMonitoring,
  CampaignControl,
  IntelligenceHub,
  AlertCenter,
  SettingsPage,
  ContentCalendarPage,
  ContentEnginePage,
} from './components/LazyComponents';
import ErrorBoundary from './pages/ErrorBoundary';
import NotFound from './pages/NotFound';
import TickerTape from './components/TickerTape';
import './brand-bos.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/CommandCenter" element={<CommandCenter />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route
            path="/real-time-monitoring"
            element={<RealTimeMonitoring />}
          />
          <Route path="/campaign-control" element={<CampaignControl />} />
          <Route path="/CampaignControl" element={<CampaignControl />} />
          <Route path="/intelligence-hub" element={<IntelligenceHub />} />
          <Route path="/IntelligenceHub" element={<IntelligenceHub />} />
          <Route path="/alert-center" element={<AlertCenter />} />
          <Route path="/AlertCenter" element={<AlertCenter />} />
          {/* <Route path="/information-center" element={<InformationCenter />} /> */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/content-calendar" element={<ContentCalendarPage />} />
          <Route path="/content-engine" element={<ContentEnginePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Ticker runs independently at app level */}
        <TickerTape />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
