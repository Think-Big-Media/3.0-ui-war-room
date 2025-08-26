import type React from 'react';
import { Shield, Users, DollarSign, Target, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/shared/Card';
import PageLayout from '../components/shared/PageLayout';
import { createLogger } from '../utils/logger';
import { getSectionTheme } from '../utils/sectionTheming';

const logger = createLogger('Dashboard');

interface DashboardCardProps {
  title: string;
  number: string | number;
  subtitle: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  delay?: number;
  onClick?: () => void;
  navigateTo?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  number,
  subtitle,
  icon: Icon,
  onClick,
  navigateTo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Card 
      variant="glass" 
      className="p-6 cursor-pointer hover:bg-white/20 transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-white/80" />
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{number}</div>
          <div className="text-sm text-white/60">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
    </Card>
  );
};

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}> = ({ title, description, icon: Icon, onClick }) => (
  <Card 
    variant="glass" 
    className="p-4 cursor-pointer hover:bg-white/20 transition-all duration-200"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-6 h-6 text-white/80" />
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getSectionTheme(location.pathname);

  logger.info('Dashboard component mounted');

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <PageLayout pageTitle="War Room Dashboard" placeholder="Ask about campaign operations...">
      <div className="space-y-6">
        {/* Status Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CAMPAIGN OPERATIONS
          </h1>
          <p className="text-white/70 text-lg">
            War Room Dashboard V2 - Operational Status: ACTIVE
          </p>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/80 font-mono">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Active Personnel"
            number="2,847"
            subtitle="+12.5% this month"
            icon={Users}
            onClick={() => handleNavigation('/campaign-control')}
          />
          <DashboardCard
            title="Total Budget"
            number="$124,560"
            subtitle="+8.2% this month"
            icon={DollarSign}
            onClick={() => handleNavigation('/analytics')}
          />
          <DashboardCard
            title="Mission Success"
            number="94.2%"
            subtitle="+3.1% this month"
            icon={Target}
            onClick={() => handleNavigation('/intelligence-hub')}
          />
          <DashboardCard
            title="Intel Reports"
            number="89,472"
            subtitle="+15.3% this month"
            icon={BarChart3}
            onClick={() => handleNavigation('/real-time-monitoring')}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Launch Operation"
              description="Start new campaign operations"
              icon={Target}
              onClick={() => handleNavigation('/campaign-control')}
            />
            <QuickActionCard
              title="View Analytics"
              description="Review performance metrics"
              icon={BarChart3}
              onClick={() => handleNavigation('/analytics')}
            />
            <QuickActionCard
              title="Security Check"
              description="Run system diagnostics"
              icon={Shield}
              onClick={() => handleNavigation('/alert-center')}
            />
          </div>
        </div>

        {/* Status Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Network Status</span>
                <span className="text-green-400 font-semibold">SECURE</span>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">DEFCON Level</span>
                <span className="text-yellow-400 font-semibold">3</span>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Active Operations</span>
                <span className="text-blue-400 font-semibold">7</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
