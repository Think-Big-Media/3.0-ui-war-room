import React from 'react';
import { Routes, Route } from "react-router-dom";

// Import pages directly
import Dashboard from "./pages/Dashboard";
import XDashboard from "./pages/XDashboard";
import CommandCenter from "./pages/CommandCenter";
import NotFound from "./pages/NotFound";

// Import providers
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { DataToggleButton } from './components/DataToggleButton';

const App = () => (
  <SupabaseAuthProvider>
    <DataToggleButton />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/x" element={<XDashboard />} />
      <Route path="/command-center" element={<CommandCenter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </SupabaseAuthProvider>
);

export default App;
