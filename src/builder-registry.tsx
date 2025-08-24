/**
 * Builder.io Component Registry
 * Clean registration of War Room components
 */

import { Builder } from '@builder.io/react';

// Page Components
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import CampaignControl from './pages/CampaignControl';
import IntelligenceHub from './pages/IntelligenceHub';
import AlertCenter from './pages/AlertCenter';
import SettingsPage from './pages/SettingsPage';

// Initialize Builder with API key
Builder.init(import.meta.env.VITE_BUILDER_IO_KEY || '8686f311497044c0932b7d2247296478');

// Register main pages for Builder.io visual editing
Builder.registerComponent(CommandCenter, {
  name: 'CommandCenter',
  description: 'War Room command center dashboard',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(Dashboard, {
  name: 'Dashboard',
  description: 'Main War Room dashboard',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(RealTimeMonitoring, {
  name: 'RealTimeMonitoring',
  description: 'Live monitoring of campaigns and mentions',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(CampaignControl, {
  name: 'CampaignControl',
  description: 'Campaign management and control center',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(IntelligenceHub, {
  name: 'IntelligenceHub',
  description: 'Intelligence gathering and analysis',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(AlertCenter, {
  name: 'AlertCenter',
  description: 'Alert management and crisis response',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(SettingsPage, {
  name: 'SettingsPage',
  description: 'User and organization settings',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

// Export for use in the app
export { Builder };
