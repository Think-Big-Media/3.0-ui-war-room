/**
 * War Room Main Dashboard
 * Minimal version for debugging
 */

import type React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">
          War Room Dashboard
        </h1>
        <p className="text-white/70">
          Dashboard is working! This is the minimal version.
        </p>
        
        <div className="mt-8 bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl text-white mb-2">Test Card</h2>
          <p className="text-white/60">
            If you can see this, the routing and basic component structure is working.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
