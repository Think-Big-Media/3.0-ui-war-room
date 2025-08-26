/**
 * War Room V2 Dashboard
 * Sophisticated analytics dashboard using existing components
 */

import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GeographicMap } from '../components/analytics/GeographicMap';
import { DashboardChart } from '../components/analytics/DashboardChart';
import { VolunteerGrowthChart } from '../components/analytics/VolunteerGrowthChart';
import { EventAttendanceChart } from '../components/analytics/EventAttendanceChart';
import { DonationChart } from '../components/analytics/DonationChart';
import { ActivityFeed } from '../components/analytics/ActivityFeed';
import { Loader2, AlertCircle, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

// Mock data for metrics
const mockMetrics = {
  volunteers: { value: 2847, change: 12.5, trend: 'up' as const },
  events: { value: 156, change: 8.2, trend: 'up' as const },
  donations: { value: 124560, change: -2.1, trend: 'down' as const },
  reach: { value: 89472, change: 15.3, trend: 'up' as const },
};

// Loading skeleton
const DashboardSkeleton: React.FC = () => (
  <div className="animate-pulse p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-32" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <div className="bg-gray-200 rounded-lg h-64" />
      <div className="bg-gray-200 rounded-lg h-64" />
    </div>
  </div>
);

// Error fallback
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Dashboard Error
      </h3>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  </div>
);

// Metric card component
const MetricCard: React.FC<{
  title: string;
  metric: keyof typeof mockMetrics;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, metric, icon: Icon, color }) => {
  const data = mockMetrics[metric];
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  }[color] || 'text-gray-600 bg-gray-50';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {metric === 'donations' ? `$${data.value.toLocaleString()}` : data.value.toLocaleString()}
          </p>
          <p className={`text-sm ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.trend === 'up' ? '+' : ''}{data.change}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  War Room Analytics Dashboard V2
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Campaign insights and performance metrics
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Live indicator */}
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  <span className="text-sm text-gray-600">Live Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<DashboardSkeleton />}>
            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Active Volunteers"
                metric="volunteers"
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Events Hosted"
                metric="events"
                icon={Calendar}
                color="green"
              />
              <MetricCard
                title="Donations Raised"
                metric="donations"
                icon={DollarSign}
                color="yellow"
              />
              <MetricCard
                title="Total Reach"
                metric="reach"
                icon={TrendingUp}
                color="purple"
              />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Volunteer growth chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Volunteer Growth</h3>
                <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
                  <VolunteerGrowthChart />
                </Suspense>
              </div>

              {/* Event attendance chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Event Attendance</h3>
                <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
                  <EventAttendanceChart />
                </Suspense>
              </div>

              {/* Donation breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Donation Sources</h3>
                <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
                  <DonationChart />
                </Suspense>
              </div>

              {/* Geographic distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Geographic Reach</h3>
                <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
                  <GeographicMap />
                </Suspense>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse" />}>
                <ActivityFeed />
              </Suspense>
            </div>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
