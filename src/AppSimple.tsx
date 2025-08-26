import "./index.css";

import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages directly
import Dashboard from "./pages/Dashboard";
import XDashboard from "./pages/XDashboard";
import CommandCenter from "./pages/CommandCenter";
import NotFound from "./pages/NotFound";

// Import providers
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { DataToggleButton } from './components/DataToggleButton';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <DataToggleButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/x" element={<XDashboard />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

export default App;
