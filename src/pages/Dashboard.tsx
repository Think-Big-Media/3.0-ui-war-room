/**
 * War Room V2 Dashboard
 * Uses sophisticated analytics dashboard components without auth requirements
 */

import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DashboardLayout } from '../components/analytics/DashboardLayout';
import { Loader2, AlertCircle } from 'lucide-react';

// Loading fallback
const DashboardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-32" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-red-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-red-700 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Dashboard;
