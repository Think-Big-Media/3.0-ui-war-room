/**
 * War Room Platform - Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

/**
 * ⚡ BUILDER.IO FRONTEND CONFIGURATION ⚡
 * 
 * 🎯 ACTIVE: HomePage.tsx (Builder.io Integration)
 * - Dynamic content from Builder.io CMS
 * - Visual editing capabilities
 * - Navigation with icons from Builder
 * - Responsive design components
 * 
 * ❌ NOT IN USE:
 * - AppBrandBOS.tsx (static version without Builder)
 * - App.tsx (legacy with Supabase auth)
 * - AppNoAuth.tsx (testing only)
 * 
 * 🔍 Visual Check: You should see icons in top navigation
 * 📊 Dashboard: Builder.io managed content
 * 🧭 Navigation: Icons + text from Builder CMS
 * 
 * ⚠️ Builder.io API Key: VITE_BUILDER_IO_KEY must be set
 */
import HomePage from './pages/HomePage';

// Builder.io App Component
const App = () => <HomePage />;

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
