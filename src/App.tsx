import React from 'react';
import { Routes, Route } from "react-router-dom";

// Import pages directly
import Dashboard from "./pages/Dashboard";
import CommandCenter from "./pages/CommandCenter";
import NotFound from "./pages/NotFound";

// Import providers
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';

const App = () => (
  <SupabaseAuthProvider>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/command-center" element={<CommandCenter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </SupabaseAuthProvider>
);

export default App;
