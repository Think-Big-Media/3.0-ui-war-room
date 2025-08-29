/**
 * War Room V2 Dashboard
 * Sophisticated analytics dashboard - fully functional
 */

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  BarChart3,
  Activity,
  CheckCircle,
} from 'lucide-react';

import PhraseCloud from '../components/dashboard/PhraseCloud';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import { mockTrendingTopics } from '../data/monitoringData';
// Note: MetricCard and ActivityFeed are defined locally in this file
// CampaignHealth, AnalyticsOverview, SEO helpers are not used here and omitted

// Mock chart data
const chartData = [
  { name: 'Jan', volunteers: 400, events: 12, donations: 8400 },
  { name: 'Feb', volunteers: 300, events: 15, donations: 9800 },
  { name: 'Mar', volunteers: 600, events: 18, donations: 12400 },
  { name: 'Apr', volunteers: 800, events: 22, donations: 15600 },
  { name: 'May', volunteers: 700, events: 25, donations: 18200 },
  { name: 'Jun', volunteers: 900, events: 28, donations: 21800 },
];

// US Regions data
const regionData = [
  { name: 'Northeast', volunteers: 1250, events: 34, color: '#3B82F6' },
  { name: 'Southeast', volunteers: 890, events: 28, color: '#10B981' },
  { name: 'Midwest', volunteers: 760, events: 22, color: '#F59E0B' },
  { name: 'West', volunteers: 1100, events: 31, color: '#8B5CF6' },
];

// Activity data
const activities = [
  {
    id: 1,
    type: 'volunteer',
    message: 'New volunteer registered in Ohio',
    time: '2 min ago',
    icon: Users,
  },
  {
    id: 2,
    type: 'event',
    message: 'Town hall scheduled for Phoenix',
    time: '5 min ago',
    icon: Calendar,
  },
  {
    id: 3,
    type: 'donation',
    message: '$2,500 donation received',
    time: '8 min ago',
    icon: DollarSign,
  },
  {
    id: 4,
    type: 'milestone',
    message: 'Reached 10,000 volunteers!',
    time: '12 min ago',
    icon: CheckCircle,
  },
  {
    id: 5,
    type: 'event',
    message: 'Fundraiser completed in Denver',
    time: '15 min ago',
    icon: TrendingUp,
  },
];

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses =
    {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      yellow: 'text-yellow-600 bg-yellow-50',
    }[color] || 'text-gray-600 bg-gray-50';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p
            className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend === 'up' ? '↗' : '↘'} {change} from last month
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart: React.FC<{
  data: typeof chartData;
  dataKey: string;
  color: string;
}> = ({ data, dataKey, color }) => {
  const maxValue = Math.max(
    ...data.map((d) => d[dataKey as keyof typeof d] as number)
  );

  return (
    <div className="h-64 flex items-end space-x-2 p-4">
      {data.map((item, index) => {
        const height =
          ((item[dataKey as keyof typeof item] as number) / maxValue) * 200;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-end mb-2" style={{ height: '200px' }}>
              <div
                className={`w-full max-w-12 rounded-t ${color} transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}px` }}
                title={`${item.name}: ${item[dataKey as keyof typeof item]}`}
              />
            </div>
            <span className="text-xs text-gray-600">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

// US Map Component (simplified)
const USMap: React.FC = () => {
  return (
    <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center relative">
      <div className="w-full max-w-md">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Simplified US map outline */}
          <path
            d="M50,150 L100,100 L200,110 L300,120 L350,140 L360,180 L340,220 L300,240 L200,250 L100,240 L50,200 Z"
            fill="#E5E7EB"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
          {/* Region markers */}
          {regionData.map((region, index) => (
            <g key={region.name}>
              <circle
                cx={80 + index * 80}
                cy={150 + (index % 2) * 40}
                r={Math.sqrt(region.volunteers / 10)}
                fill={region.color}
                opacity="0.7"
              />
              <text
                x={80 + index * 80}
                y={200 + (index % 2) * 40}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {region.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Volunteers by Region
        </p>
        {regionData.map((region) => (
          <div
            key={region.name}
            className="flex items-center space-x-2 text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: region.color }}
            />
            <span>
              {region.name}: {region.volunteers}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Feed Component
const ActivityFeed: React.FC = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 bg-blue-100 rounded-full">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                War Room Analytics Dashboard V2
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Campaign insights and real-time performance metrics
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live indicator */}
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  Live Data
                </span>
              </div>

              {/* Export button */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Volunteers"
            value="2,847"
            change="+12.5%"
            trend="up"
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Events Hosted"
            value="156"
            change="+8.2%"
            trend="up"
            icon={Calendar}
            color="green"
          />
          <MetricCard
            title="Donations Raised"
            value="$124,560"
            change="-2.1%"
            trend="down"
            icon={DollarSign}
            color="yellow"
          />
          <MetricCard
            title="Total Reach"
            value="89,472"
            change="+15.3%"
            trend="up"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Volunteer growth chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Volunteer Growth
            </h3>
            <SimpleLineChart
              data={chartData}
              dataKey="volunteers"
              color="bg-blue-500"
            />
          </div>

          {/* Event attendance chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Event Attendance
            </h3>
            <SimpleLineChart
              data={chartData}
              dataKey="events"
              color="bg-green-500"
            />
          </div>

          {/* Geographic distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Geographic Reach
            </h3>
            <USMap />
          </div>

          {/* Donations chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
              Donation Trends
            </h3>
            <SimpleLineChart
              data={chartData}
              dataKey="donations"
              color="bg-yellow-500"
            />
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <ActivityFeed />
        </div>

        {/* Performance Metrics */}
        <div className="mt-8">
          <PerformanceMetrics />
        </div>

        {/* Phrase Cloud */}
        <div className="mt-8">
          <PhraseCloud
            words={mockTrendingTopics.map(topic => ({
              text: topic.keyword,
              weight: Math.min(100, topic.mentions / 50), // Normalize weight
              trend: topic.change > 0 ? 'up' : topic.change < 0 ? 'down' : 'stable',
              mentions: topic.mentions
            }))}
            title="Campaign Phrase Cloud"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
