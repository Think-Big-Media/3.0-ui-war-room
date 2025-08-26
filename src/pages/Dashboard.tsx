/**
 * War Room Main Dashboard
 * Transformed V2 dashboard following War Room UI Style Guide
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
  Radio,
  Signal,
  Satellite,
  Target,
  Mail,
  Clock,
  ArrowRight,
} from 'lucide-react';

import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Card } from '../components/shared/Card';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { CampaignHealth } from '../components/dashboard/CampaignHealth';
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
              <div className="w-2 h-2 bg-[var(--accent-dashboard)] rounded-full animate-pulse" />
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

// Header component with War Room design
const DashboardHeader: React.FC<{ user: any }> = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-4"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="section-header">
          CAMPAIGN OPERATIONS
        </h1>
        <p className="content-subtitle mt-1">
          Welcome back, {user?.email?.split('@')[0]}. Operational status: ACTIVE
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Status indicator */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-900/30 border border-green-500/50 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="status-indicator text-green-300">All Systems Operational</span>
        </div>

        {/* Settings button */}
        <button className="p-2 hoverable bg-black/20 rounded-lg transition-colors border border-[#8B956D]/30 hover:border-[var(--accent-dashboard)]">
          <Settings className="w-5 h-5 text-[#C5C1A8]" />
        </button>
      </div>
    </div>
  </motion.div>
);

// Quick actions component with War Room styling
const QuickActions: React.FC = () => (
  <Card variant="glass" className="mb-4">
    <div className="p-5">
      <h3 className="section-header mb-4 ml-1.5">
        QUICK ACTIONS
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-1.5">
        <button className="btn-secondary-action group">
          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Add Campaign</span>
        </button>

        <button className="btn-secondary-neutral group">
          <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>View Analytics</span>
        </button>

        <button className="btn-secondary-alert group">
          <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Security Check</span>
        </button>
      </div>
    </div>
  </Card>
);

// Recent activity component with War Room styling
const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, action: 'Campaign launched', target: 'Summer Operations 2025', time: '2 minutes ago', type: 'success' },
    { id: 2, action: 'Budget updated', target: 'Q1 Operations', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'Alert resolved', target: 'High Resource Warning', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'Report generated', target: 'Weekly Performance', time: '2 hours ago', type: 'info' },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'info': return 'bg-blue-400';
      default: return 'bg-[#C5C1A8]';
    }
  };

  return (
    <Card variant="glass">
      <div className="p-5">
        <h3 className="section-header mb-4 ml-1.5">
          RECENT ACTIVITY
        </h3>
        <div className="space-y-4 px-1.5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.type)}`} />
              <div className="flex-1">
                <p className="content-title">{activity.action}</p>
                <p className="text-[var(--accent-dashboard)] hover:text-[var(--accent-dashboard)]/80 cursor-pointer text-sm">
                  {activity.target}
                </p>
                <p className="content-subtitle mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Performance chart component with War Room styling
const PerformanceChart: React.FC = () => (
  <Card variant="glass">
    <div className="p-5">
      <h3 className="section-header mb-4 ml-1.5">
        PERFORMANCE OVERVIEW
      </h3>
      <div className="h-64 flex items-center justify-center bg-black/20 rounded-lg border border-[#8B956D]/30 mx-1">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-[var(--accent-dashboard)] mx-auto mb-3" />
          <p className="content-title">Chart visualization will be here</p>
          <p className="content-subtitle">Interactive performance metrics</p>
        </div>
      </div>
    </div>
  </Card>
);

// Main Dashboard component
const Dashboard: React.FC = () => {
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
      <div className="min-h-screen bg-black/20 flex items-center justify-center">
        <CamoBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dashboard)] mx-auto mb-4" />
          <p className="content-title">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-route="dashboard">
      {/* SEO Meta Tags */}
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

      <div className="p-6 space-y-4">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Personnel"
              value={2847}
              change={12.5}
              trend="up"
              icon={Users}
              color="blue"
              sparklineData={generateSparklineData()}
              loading={isLoading}
            />

            <MetricCard
              title="Total Budget"
              value={124560}
              change={8.2}
              trend="up"
              icon={DollarSign}
              color="green"
              format="currency"
              sparklineData={generateSparklineData()}
              loading={isLoading}
            />

            <MetricCard
              title="Mission Success Rate"
              value={3.24}
              change={-2.1}
              trend="down"
              icon={Target}
              color="orange"
              format="percentage"
              sparklineData={generateSparklineData()}
              loading={isLoading}
            />

            <MetricCard
              title="Intelligence Reports"
              value={89472}
              change={15.3}
              trend="up"
              icon={Eye}
              color="purple"
              sparklineData={generateSparklineData()}
              loading={isLoading}
            />
          </div>
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Alert Response Time"
              value={42.3}
              change={5.7}
              trend="down"
              icon={Activity}
              color="red"
              format="percentage"
              loading={isLoading}
            />

            <MetricCard
              title="Average Mission Duration"
              value="4:32"
              change={12.8}
              trend="up"
              icon={Clock}
              color="blue"
              loading={isLoading}
            />

            <MetricCard
              title="New Recruits"
              value={1249}
              change={18.4}
              trend="up"
              icon={Users}
              color="green"
              loading={isLoading}
            />
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Campaign Health */}
            <CampaignHealth compact={true} />

            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Actions Card */}
            <Card variant="glass">
              <div className="p-5">
                <h3 className="section-header mb-4 ml-1.5">
                  MISSION CONTROL
                </h3>
                <div className="space-y-3 px-1.5">
                  <button className="w-full flex items-center justify-between p-3 hoverable bg-black/20 rounded-xl border border-[#8B956D]/30 hover:border-[var(--accent-dashboard)] transition-colors">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-[var(--accent-dashboard)]" />
                      <span className="content-title">Launch Operation</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C5C1A8]" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 hoverable bg-black/20 rounded-xl border border-[#8B956D]/30 hover:border-[var(--accent-dashboard)] transition-colors">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[var(--accent-dashboard)]" />
                      <span className="content-title">Send Briefing</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C5C1A8]" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 hoverable bg-black/20 rounded-xl border border-[#8B956D]/30 hover:border-[var(--accent-dashboard)] transition-colors">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-[var(--accent-dashboard)]" />
                      <span className="content-title">Schedule Mission</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C5C1A8]" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
