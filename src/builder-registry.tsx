/**
 * Builder.io Component Registry
 * Registers War Room components for visual editing in Builder
 */

import { Builder } from '@builder.io/react';
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AutomationDashboard from './pages/AutomationDashboard';
import DocumentIntelligence from './pages/DocumentIntelligence';
import SettingsPage from './pages/SettingsPage';

// Import layout components
import { MainLayout } from './components/layout/MainLayout';

// Set your Builder.io API key
Builder.init(import.meta.env.VITE_BUILDER_IO_KEY || 'YOUR_BUILDER_IO_API_KEY');

// Register page components
Builder.registerComponent(Dashboard, {
  name: 'Dashboard',
  description: 'Main War Room dashboard with overview metrics',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(AnalyticsDashboard, {
  name: 'AnalyticsDashboard',
  description: 'Campaign analytics and performance metrics',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(AutomationDashboard, {
  name: 'AutomationDashboard',
  description: 'Workflow automation and campaign rules',
  inputs: [],
  defaultStyles: {
    minHeight: '100vh',
  },
});

Builder.registerComponent(DocumentIntelligence, {
  name: 'DocumentIntelligence',
  description: 'AI-powered document analysis and insights',
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

// Register layout components
Builder.registerComponent(MainLayout, {
  name: 'MainLayout',
  description: 'Main application layout with sidebar and navbar',
  inputs: [],
  canHaveChildren: true,
  defaultStyles: {
    minHeight: '100vh',
  },
});

// Additional component registrations can be added here as they are built

// Export for use in the app
export { Builder };