import type React from 'react';
import { Shield, Users, DollarSign, Target, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      {/* Fixed Header */}
      <div className="text-center mb-12 relative z-20">
        <h1 className="text-5xl font-bold text-white mb-4">
          WAR ROOM DASHBOARD V2
        </h1>
        <p className="text-xl text-white/80">
          Campaign Operations - Status: OPERATIONAL
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/90 font-mono text-lg">ALL SYSTEMS GO</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-blue-400" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">2,847</div>
                <div className="text-sm text-green-400">+12.5%</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Active Personnel</h3>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-green-400" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">$124K</div>
                <div className="text-sm text-green-400">+8.2%</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Total Budget</h3>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-orange-400" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">94.2%</div>
                <div className="text-sm text-green-400">+3.1%</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Mission Success</h3>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-10 h-10 text-purple-400" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">89K</div>
                <div className="text-sm text-green-400">+15.3%</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Intel Reports</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-6 rounded-xl transition-all border border-blue-500/30 hover:border-blue-500/50">
              <Target className="w-8 h-8 mb-3" />
              <div className="text-lg font-semibold">LAUNCH OPERATION</div>
              <div className="text-sm text-blue-300">Start new campaign</div>
            </button>

            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-6 rounded-xl transition-all border border-green-500/30 hover:border-green-500/50">
              <BarChart3 className="w-8 h-8 mb-3" />
              <div className="text-lg font-semibold">VIEW ANALYTICS</div>
              <div className="text-sm text-green-300">Review performance</div>
            </button>

            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-6 rounded-xl transition-all border border-red-500/30 hover:border-red-500/50">
              <Shield className="w-8 h-8 mb-3" />
              <div className="text-lg font-semibold">SECURITY CHECK</div>
              <div className="text-sm text-red-300">Run diagnostics</div>
            </button>
          </div>
        </div>

        {/* Status Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">SYSTEM STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Network Status</span>
                <span className="text-green-400 font-bold text-xl">SECURE</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">DEFCON Level</span>
                <span className="text-yellow-400 font-bold text-xl">3</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Active Ops</span>
                <span className="text-blue-400 font-bold text-xl">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
