import type React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, MessageSquare, Target, Bell, Users, Activity, Calendar, Award } from 'lucide-react';

const BrandBOSDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Top Navigation Header */}
      <header className="bg-gradient-to-r from-purple-800 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-purple-200 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-800" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Brand BOS</span>
            </div>

            {/* Top Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="#" className="text-purple-200 hover:text-white px-3 py-2 text-sm font-medium">Analytics</a>
              <a href="#" className="text-purple-200 hover:text-white px-3 py-2 text-sm font-medium">Campaigns</a>
              <a href="#" className="text-purple-200 hover:text-white px-3 py-2 text-sm font-medium">Content</a>
              <a href="#" className="text-purple-200 hover:text-white px-3 py-2 text-sm font-medium">Reports</a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-purple-200">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Brand BOS</h1>
          <p className="text-purple-200">Professional Authority Platform Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Authority Score</p>
                <p className="text-3xl font-bold text-white">94</p>
                <p className="text-green-400 text-sm">+12% this month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Content Pieces</p>
                <p className="text-3xl font-bold text-white">247</p>
                <p className="text-green-400 text-sm">+23 this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Engagement</p>
                <p className="text-3xl font-bold text-white">89%</p>
                <p className="text-green-400 text-sm">+5.2% today</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Leads Generated</p>
                <p className="text-3xl font-bold text-white">142</p>
                <p className="text-green-400 text-sm">+18 this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Authority Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Authority Performance</h3>
            <div className="h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              <p className="text-purple-200">Performance Chart Placeholder</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                Create Content
              </button>
              <button className="w-full bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all border border-white/20">
                View Analytics
              </button>
              <button className="w-full bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all border border-white/20">
                Manage Campaigns
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">New testimonial processed</p>
                <p className="text-purple-200 text-sm">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Authority score increased</p>
                <p className="text-purple-200 text-sm">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">3 new leads generated</p>
                <p className="text-purple-200 text-sm">1 hour ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BrandBOSDashboard;
