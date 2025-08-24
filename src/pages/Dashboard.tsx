/**
 * War Room Main Dashboard
 * Military-themed design with command status bar and real-time metrics
 */

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  ArrowRight,
  Zap,
  Mail,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  Shield,
  Radio,
  Signal,
  Satellite,
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { CampaignHealth } from '../components/dashboard/CampaignHealth';
import { AnalyticsOverview } from '../components/dashboard/AnalyticsOverview';
import {
  DashboardHead,
  DashboardStructuredData,
  OrganizationStructuredData,
} from '../components/SEO';

// Type definitions for military status bar
interface StatusIndicator {
  label: string;
  value: string | number;
  status: 'active' | 'warning' | 'critical' | 'normal';
  icon: React.ComponentType<{ className?: string }>;
}

// Camouflage texture background component
const CamoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6B7B47] via-[#8B956D] to-[#A0956B]" />

      {/* Camouflage pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(107, 123, 71, 0.8) 15%, transparent 16%),
            radial-gradient(circle at 60% 70%, rgba(139, 149, 109, 0.6) 12%, transparent 13%),
            radial-gradient(circle at 80% 20%, rgba(160, 149, 107, 0.7) 18%, transparent 19%),
            radial-gradient(circle at 40% 80%, rgba(132, 126, 102, 0.5) 14%, transparent 15%),
            radial-gradient(circle at 90% 60%, rgba(107, 123, 71, 0.6) 16%, transparent 17%),
            radial-gradient(circle at 10% 90%, rgba(160, 149, 107, 0.8) 13%, transparent 14%)
          `,
          backgroundSize:
            '120px 120px, 80px 80px, 100px 100px, 90px 90px, 110px 110px, 70px 70px',
          backgroundPosition:
            '0 0, 40px 40px, 80px 20px, 20px 80px, 60px 60px, 100px 10px',
        }}
      />

      {/* Subtle fiber texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.1) 50%, transparent 60%)
          `,
          backgroundSize: '3px 3px, 3px 3px',
        }}
      />
    </div>
  );
};

// Military Status Bar Component
const StatusBar: React.FC = () => {
  const statusIndicators: StatusIndicator[] = [
    {
      label: 'DEFCON',
      value: '3',
      status: 'warning',
      icon: Shield,
    },
    {
      label: 'Active Ops',
      value: 7,
      status: 'active',
      icon: Radio,
    },
    {
      label: 'Network',
      value: 'SECURE',
      status: 'normal',
      icon: Signal,
    },
    {
      label: 'Satellites',
      value: '4/4',
      status: 'normal',
      icon: Satellite,
    },
    {
      label: 'Personnel',
      value: 23,
      status: 'active',
      icon: Users,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-300 bg-red-900/30 border-red-500/50';
      case 'warning':
        return 'text-amber-300 bg-amber-900/30 border-amber-500/50';
      case 'active':
        return 'text-green-300 bg-green-900/30 border-green-500/50';
      default:
        return 'text-slate-300 bg-slate-800/30 border-slate-500/50';
    }
  };

  return (
    <section className="bg-black/20 border-b border-[#8B956D]/30 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h2 className="text-lg font-bold text-[#E8E4D0] tracking-wider">
              COMMAND STATUS
            </h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-[#C5C1A8] font-mono">
                OPERATIONAL
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {statusIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <motion.div
                  key={indicator.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(indicator.status)}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold">
                    {indicator.label}: {indicator.value}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="text-right">
            <div className="text-sm text-[#C5C1A8] font-mono">
              {new Date().toLocaleTimeString('en-US', {
                hour12: false,
                timeZoneName: 'short',
              })}
            </div>
            <div className="text-xs text-[#A0956B]">ZULU TIME</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock sparkline data
  const generateSparkline = () => {
    return Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 100) + 20
    );
  };

  // Loading effect with error handling
  useEffect(() => {
    console.log('Dashboard mounted, starting loading timer...');
    const timer = setTimeout(() => {
      console.log('Setting loading to false');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Debug render
  console.log('Dashboard rendering, isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags and Structured Data */}
      <DashboardHead
        url="https://war-room-oa9t.onrender.com/dashboard"
        canonicalUrl="https://war-room-oa9t.onrender.com/dashboard"
      />
      <DashboardStructuredData />
      <OrganizationStructuredData />

      {/* Global Camouflage Background */}
      <CamoBackground />

      {/* Military Status Bar */}
      <StatusBar />

      {/* Main Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8E4D0]">
              Campaign Dashboard
            </h1>
            <p className="mt-1 text-[#C5C1A8]">
              Welcome back, {user?.email?.split('@')[0]}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 bg-black/20 rounded-lg border border-[#8B956D]/30 p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-[#8B956D] text-[#E8E4D0]'
                    : 'text-[#C5C1A8] hover:text-[#E8E4D0] hover:bg-black/20'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Volunteers"
            value={2847}
            change={12.5}
            trend="up"
            icon={Users}
            color="blue"
            sparklineData={generateSparkline()}
            loading={isLoading}
          />
          <MetricCard
            title="Total Donations"
            value={124560}
            change={8.2}
            trend="up"
            icon={DollarSign}
            color="green"
            format="currency"
            sparklineData={generateSparkline()}
            loading={isLoading}
          />
          <MetricCard
            title="Upcoming Events"
            value={18}
            change={-5.3}
            trend="down"
            icon={Calendar}
            color="purple"
            sparklineData={generateSparkline()}
            loading={isLoading}
          />
          <MetricCard
            title="Engagement Rate"
            value={73.2}
            change={3.1}
            trend="up"
            icon={Activity}
            color="orange"
            format="percentage"
            sparklineData={generateSparkline()}
            loading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 rounded-2xl border border-[#8B956D]/30 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#E8E4D0]">
                  Recent Activity
                </h2>
                <button className="text-sm text-[#8B956D] hover:text-[#A0956B] font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <ActivityFeed limit={8} showTimestamps={true} />
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="space-y-6">
            {/* Campaign Health */}
            <CampaignHealth compact={true} />

            {/* Quick Actions */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full" />

              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 transform hover:scale-[1.01] will-change-transform">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5" />
                      <span className="font-medium">Launch Campaign</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 transform hover:scale-[1.01] will-change-transform">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Send Broadcast</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all hover:scale-[1.02]">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Schedule Event</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-black/20 rounded-2xl border border-[#8B956D]/30 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#E8E4D0] flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#A0956B]" />
                  <span>Upcoming Tasks</span>
                </h3>
                <span className="text-xs text-[#C5C1A8] bg-black/30 px-2 py-1 rounded-full">
                  3 pending
                </span>
              </div>
              <div className="space-y-3">
                <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 animate-pulse" />
                    <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full mt-1.5 animate-ping" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#E8E4D0] group-hover:text-[#8B956D]">
                      Review donor report
                    </p>
                    <p className="text-xs text-[#A0956B]">Due in 2 hours</p>
                  </div>
                </div>
                <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#E8E4D0] group-hover:text-[#8B956D]">
                      Call volunteer leads
                    </p>
                    <p className="text-xs text-[#A0956B]">
                      Due today at 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#E8E4D0] group-hover:text-[#8B956D]">
                      Prepare town hall slides
                    </p>
                    <p className="text-xs text-[#A0956B]">Due tomorrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#E8E4D0] flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-[#A0956B]" />
              <span>Analytics Overview</span>
            </h2>
            <button className="text-sm text-[#8B956D] hover:text-[#A0956B] font-medium flex items-center space-x-1">
              <span>View Full Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <AnalyticsOverview timeRange={selectedTimeRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
