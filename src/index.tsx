/**
 * War Room Platform - Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

/**
 * ⚡ PRODUCTION FRONTEND CONFIGURATION ⚡
 * 
 * 🎯 ACTIVE: AppBrandBOS.tsx
 * - Purple/blue gradient theme
 * - CommandCenter dashboard
 * - Glassmorphic cards
 * - Top navigation with WR logo
 * 
 * ❌ NOT IN USE:
 * - App.tsx (legacy with Supabase auth)
 * - AppNoAuth.tsx (testing only)
 * 
 * 🔍 Visual Check: You should see purple/blue gradients
 * 📊 Dashboard: CommandCenter, not Dashboard
 * 🧭 Navigation: Top bar, not sidebar
 * 
 * ⚠️ DO NOT CHANGE THIS IMPORT unless migrating the entire frontend architecture
 */
import App from './App';  // ← INTEGRATED FRONTEND

// Legacy options (DO NOT USE):
// import App from './App';        // Old version with Supabase auth
// import App from './AppNoAuth';  // Testing version without auth
import { ErrorBoundary } from './components/ErrorBoundary';

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
);
