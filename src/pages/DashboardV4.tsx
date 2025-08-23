/**
 * Dashboard V4 - CleanMyMac-Inspired Modern Design
 * Professional, clean interface with excellent information hierarchy
 */

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  Calendar,
  Activity,
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  Shield,
  Zap,
  Settings,
} from 'lucide-react';

import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { MetricDisplay, MetricGrid } from '../components/ui/MetricDisplay';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { DashboardHead, DashboardStructuredData } from '../components/SEO';

// Header component with clean design
const DashboardHeader: React.FC<{ user: any }> = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.email?.split('@')[0]}. Here's what's happening with your campaigns.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Status indicator */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">All Systems Operational</span>
        </div>

        {/* Settings button */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </motion.div>
);

// Quick actions component
const QuickActions: React.FC = () => (
  <Card variant="clean" className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Zap className="w-5 h-5 text-blue-600" />
        <span>Quick Actions</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group">
          <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-blue-700">Add Campaign</span>
        </button>

        <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group">
          <BarChart3 className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-green-700">View Analytics</span>
        </button>

        <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors group">
          <Shield className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-purple-700">Security Check</span>
        </button>
      </div>
    </CardContent>
  </Card>
);

// Recent activity component
const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, action: 'Campaign launched', target: 'Summer Sale 2025', time: '2 minutes ago', type: 'success' },
    { id: 2, action: 'Budget updated', target: 'Q1 Marketing', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'Alert resolved', target: 'High CPC Warning', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'Report generated', target: 'Weekly Performance', time: '2 hours ago', type: 'info' },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card variant="clean">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gray-700" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={cn('w-2 h-2 rounded-full mt-2', getStatusColor(activity.type))} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  {activity.target}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Performance chart component
const PerformanceChart: React.FC = () => (
  <Card variant="elevated">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <span>Performance Overview</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Chart visualization will be here</p>
          <p className="text-sm text-gray-500">Interactive performance metrics</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Utility function
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Main Dashboard component
const DashboardV4: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation
  const generateSparklineData = () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 50);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <DashboardHead
        url="https://war-room-oa9t.onrender.com/dashboard-v4"
        canonicalUrl="https://war-room-oa9t.onrender.com/dashboard"
      />
      <DashboardStructuredData />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <MetricGrid columns={4} gap="md">
            <MetricDisplay
              label="Active Users"
              value={2847}
              change={12.5}
              trend="up"
              icon={Users}
              format="number"
              accent="blue"
              sparklineData={generateSparklineData()}
              subtitle="Last 30 days"
              loading={isLoading}
            />

            <MetricDisplay
              label="Total Revenue"
              value={124560}
              change={8.2}
              trend="up"
              icon={DollarSign}
              format="currency"
              accent="green"
              sparklineData={generateSparklineData()}
              subtitle="This month"
              loading={isLoading}
            />

            <MetricDisplay
              label="Conversion Rate"
              value={3.24}
              change={-2.1}
              trend="down"
              icon={MousePointer}
              format="percentage"
              accent="orange"
              sparklineData={generateSparklineData()}
              subtitle="This week"
              loading={isLoading}
            />

            <MetricDisplay
              label="Page Views"
              value={89472}
              change={15.3}
              trend="up"
              icon={Eye}
              format="number"
              accent="purple"
              sparklineData={generateSparklineData()}
              subtitle="Last 7 days"
              loading={isLoading}
            />
          </MetricGrid>
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <MetricGrid columns={3} gap="md">
            <MetricDisplay
              label="Bounce Rate"
              value={42.3}
              change={5.7}
              trend="down"
              icon={Activity}
              format="percentage"
              accent="red"
              size="sm"
              loading={isLoading}
            />

            <MetricDisplay
              label="Session Duration"
              value="4:32"
              change={12.8}
              trend="up"
              icon={Calendar}
              size="sm"
              accent="blue"
              loading={isLoading}
            />

            <MetricDisplay
              label="New Visitors"
              value={1249}
              change={18.4}
              trend="up"
              icon={Users}
              format="number"
              accent="green"
              size="sm"
              loading={isLoading}
            />
          </MetricGrid>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardV4;
