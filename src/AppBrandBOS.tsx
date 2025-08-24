import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import CommandCenter from './pages/CommandCenter';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import CampaignControl from './pages/CampaignControl';
import IntelligenceHub from './pages/IntelligenceHub';
import AlertCenter from './pages/AlertCenter';
import SettingsPage from './pages/SettingsPage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import ContentEnginePage from './pages/ContentEnginePage';
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
          <Route
            path="/real-time-monitoring"
            element={<RealTimeMonitoring />}
          />
          <Route path="/campaign-control" element={<CampaignControl />} />
          <Route path="/intelligence-hub" element={<IntelligenceHub />} />
          <Route path="/alert-center" element={<AlertCenter />} />
          {/* <Route path="/information-center" element={<InformationCenter />} /> */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/content-calendar" element={<ContentCalendarPage />} />
          <Route path="/content-engine" element={<ContentEnginePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Ticker runs independently at app level */}
        <TickerTapeSimple />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
