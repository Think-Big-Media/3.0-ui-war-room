/**
 * War Room Platform - Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

/**
 * ⚡ SINGLE SOURCE OF TRUTH ⚡
 * 
 * 🎯 ACTIVE: App.tsx (ONLY app entry point)
 * - Command Center dashboard 
 * - Full routing system
 * - All components working
 * - NO MORE AppBrandBOS confusion
 */
import App from './App';

// Static options (FALLBACK ONLY):
// import App from './AppBrandBOS'; // Static version without Builder
// import App from './App';         // Old version with Supabase auth
// import App from './AppNoAuth';   // Testing version without auth
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
