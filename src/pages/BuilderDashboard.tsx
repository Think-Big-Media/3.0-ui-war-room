/**
 * War Room Dashboard - Builder.io Integration
 * This renders the War Room dashboard from Builder.io
 */

import React, { useEffect } from 'react';
import { Builder, builder } from '@builder.io/react';

// Initialize Builder with API key
builder.init('8686f311497044c0932b7d2247296478');

const BuilderDashboard: React.FC = () => {
  useEffect(() => {
    // Ensure Builder is initialized
    if (!builder.apiKey) {
      builder.init('8686f311497044c0932b7d2247296478');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#2a2e3a]">
      {/* War Room Dashboard Content - Matching Builder.io design */}
      <header className="bg-[#1f232b] border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold">⚔️ WarRoom</span>
          </div>
          <nav className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#4a5568] text-white rounded-lg flex items-center space-x-2">
              <span>🏠</span>
              <span>Command Center</span>
            </button>
            <button className="px-4 py-2 text-gray-300 hover:bg-[#4a5568] rounded-lg flex items-center space-x-2">
              <span>📊</span>
              <span>Real-Time Monitoring</span>
            </button>
            <button className="px-4 py-2 text-gray-300 hover:bg-[#4a5568] rounded-lg flex items-center space-x-2">
              <span>🎯</span>
              <span>Campaign Control</span>
            </button>
            <button className="px-4 py-2 text-gray-300 hover:bg-[#4a5568] rounded-lg flex items-center space-x-2">
              <span>🧠</span>
              <span>Intelligence Hub</span>
            </button>
            <button className="px-4 py-2 text-gray-300 hover:bg-[#4a5568] rounded-lg flex items-center space-x-2">
              <span>🚨</span>
              <span>Alert Center</span>
            </button>
            <button className="px-4 py-2 text-gray-300 hover:bg-[#4a5568] rounded-lg flex items-center space-x-2">
              <span>⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center">2</span>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2a2e3a] rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">7</div>
            <div className="text-gray-400 text-sm uppercase">Real-Time Alerts</div>
            <div className="text-gray-500 text-xs mt-1">Active crisis detections</div>
          </div>

          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2a2e3a] rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">$47.2K</div>
            <div className="text-gray-400 text-sm uppercase">Ad Spend Today</div>
            <div className="text-gray-500 text-xs mt-1">Meta + Google Ads (+12% vs yesterday)</div>
          </div>

          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2a2e3a] rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">2,847</div>
            <div className="text-gray-400 text-sm uppercase">Mention Volume</div>
            <div className="text-gray-500 text-xs mt-1">Mentions across platforms</div>
          </div>

          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2a2e3a] rounded-lg">
                <span className="text-2xl">😊</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">74%</div>
            <div className="text-gray-400 text-sm uppercase">Sentiment Score</div>
            <div className="text-gray-500 text-xs mt-1">Positive sentiment</div>
          </div>
        </div>

        {/* Campaign Operations and Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Campaign Operations Hub */}
          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-[#2a2e3a] rounded-lg mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-xl font-bold text-white uppercase">Campaign Operations Hub</h2>
            </div>

            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm uppercase mb-3">🔧 Active Projects</h3>
                <div className="space-y-3">
                  <div className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">Crisis Response Protocol</div>
                        <div className="text-green-400 text-sm">Live · Active</div>
                      </div>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                  <div className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">Ad Campaign Optimization</div>
                        <div className="text-gray-400 text-sm">Running · Today</div>
                      </div>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                  <div className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">Voter Outreach Strategy</div>
                        <div className="text-yellow-400 text-sm">Planning · Next Week</div>
                      </div>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm uppercase mb-3">📁 Content Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700 hover:bg-[#3a3e4a] transition">
                    <div className="text-white font-semibold mb-1">Alert Response</div>
                    <div className="text-gray-500 text-xs">Crisis Management</div>
                  </button>
                  <button className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700 hover:bg-[#3a3e4a] transition">
                    <div className="text-white font-semibold mb-1">Campaign Message</div>
                    <div className="text-gray-500 text-xs">Political Ads</div>
                  </button>
                  <button className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700 hover:bg-[#3a3e4a] transition">
                    <div className="text-white font-semibold mb-1">Field Report</div>
                    <div className="text-gray-500 text-xs">Intelligence</div>
                  </button>
                  <button className="bg-[#2a2e3a] rounded-lg p-4 border border-gray-700 hover:bg-[#3a3e4a] transition">
                    <div className="text-white font-semibold mb-1">Voter Engagement</div>
                    <div className="text-gray-500 text-xs">Outreach</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-[#2a2e3a] rounded-lg mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-xl font-bold text-white uppercase">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button className="bg-gradient-to-br from-pink-900 to-pink-700 rounded-xl p-6 hover:from-pink-800 hover:to-pink-600 transition">
                <div className="text-3xl mb-3">📈</div>
                <div className="text-white font-semibold">Viral Opps</div>
              </button>
              <button className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 hover:from-blue-800 hover:to-blue-600 transition">
                <div className="text-3xl mb-3">🔍</div>
                <div className="text-white font-semibold">Trend Opps</div>
              </button>
              <button className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6 hover:from-green-800 hover:to-green-600 transition">
                <div className="text-3xl mb-3">📊</div>
                <div className="text-white font-semibold">Live Monitor</div>
              </button>
              <button className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-xl p-6 hover:from-yellow-800 hover:to-yellow-600 transition">
                <div className="text-3xl mb-3">📝</div>
                <div className="text-white font-semibold">Make Content</div>
              </button>
              <button className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-6 hover:from-purple-800 hover:to-purple-600 transition">
                <div className="text-3xl mb-3">⚡</div>
                <div className="text-white font-semibold">Quick Campaign</div>
              </button>
              <button className="bg-gradient-to-br from-orange-900 to-orange-700 rounded-xl p-6 hover:from-orange-800 hover:to-orange-600 transition">
                <div className="text-3xl mb-3">📱</div>
                <div className="text-white font-semibold">Social Media</div>
              </button>
            </div>

            <div className="mt-6 text-right">
              <span className="text-gray-400 text-sm uppercase">Quick access to key features</span>
              <span className="ml-4 text-green-400 text-sm">Ready</span>
            </div>
          </div>
        </div>

        {/* Intelligence Dashboard */}
        <div className="bg-[#1f232b] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-[#2a2e3a] rounded-lg mr-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-white uppercase">Intelligence Dashboard</h2>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-white mb-1">2.3s</div>
              <div className="text-gray-400 text-sm">Alert Response Time</div>
              <div className="text-green-400 text-xs mt-1">+15% ↑</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">287%</div>
              <div className="text-gray-400 text-sm">Campaign ROI</div>
              <div className="text-green-400 text-xs mt-1">+42% ↑</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">23/100</div>
              <div className="text-gray-400 text-sm">Threat Level Score</div>
              <div className="text-yellow-400 text-xs mt-1">Low</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">68.4%</div>
              <div className="text-gray-400 text-sm">Voter Engagement Rate</div>
              <div className="text-green-400 text-xs mt-1">+12% ↑</div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ask War Room about your campaign status..."
              className="w-full bg-[#2a2e3a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 pr-32"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button className="p-2 hover:bg-[#3a3e4a] rounded">📎</button>
              <button className="p-2 hover:bg-[#3a3e4a] rounded">🎤</button>
              <button className="p-2 hover:bg-[#3a3e4a] rounded">➤</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuilderDashboard;