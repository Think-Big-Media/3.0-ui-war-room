/**
 * War Room Main Dashboard  
 * Visible version for debugging
 */

import type React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B7B47] via-[#8B956D] to-[#A0956B] p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Status Bar */}
        <div className="bg-black/20 rounded-lg p-4 mb-6 border border-[#8B956D]/30">
          <h2 className="text-lg font-bold text-[#E8E4D0] tracking-wider mb-2">
            COMMAND STATUS
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-[#C5C1A8] font-mono">OPERATIONAL</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E8E4D0] mb-2">
            CAMPAIGN OPERATIONS
          </h1>
          <p className="text-[#C5C1A8] text-lg">
            War Room Dashboard V2 - Operational Status: ACTIVE
          </p>
        </div>
        
        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/20 p-6 rounded-lg border border-[#8B956D]/30">
            <h3 className="text-[#E8E4D0] font-semibold mb-2">Active Personnel</h3>
            <p className="text-2xl font-bold text-green-400">2,847</p>
            <p className="text-[#C5C1A8] text-sm">+12.5% this month</p>
          </div>

          <div className="bg-black/20 p-6 rounded-lg border border-[#8B956D]/30">
            <h3 className="text-[#E8E4D0] font-semibold mb-2">Total Budget</h3>
            <p className="text-2xl font-bold text-blue-400">$124,560</p>
            <p className="text-[#C5C1A8] text-sm">+8.2% this month</p>
          </div>

          <div className="bg-black/20 p-6 rounded-lg border border-[#8B956D]/30">
            <h3 className="text-[#E8E4D0] font-semibold mb-2">Mission Success</h3>
            <p className="text-2xl font-bold text-orange-400">94.2%</p>
            <p className="text-[#C5C1A8] text-sm">+3.1% this month</p>
          </div>

          <div className="bg-black/20 p-6 rounded-lg border border-[#8B956D]/30">
            <h3 className="text-[#E8E4D0] font-semibold mb-2">Intel Reports</h3>
            <p className="text-2xl font-bold text-purple-400">89,472</p>
            <p className="text-[#C5C1A8] text-sm">+15.3% this month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/20 rounded-lg p-6 border border-[#8B956D]/30">
          <h3 className="text-xl font-semibold text-[#E8E4D0] mb-4">
            QUICK ACTIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors font-mono text-sm uppercase">
              Launch Operation
            </button>
            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors font-mono text-sm uppercase">
              View Analytics
            </button>
            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors font-mono text-sm uppercase">
              Security Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
