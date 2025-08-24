import type React from 'react';
// Animation imports removed to prevent flashing
import { Brain, TrendingUp, MessageSquare, Target, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuickActions from './QuickActions';
import Card from '../components/shared/Card';
import PageLayout from '../components/shared/PageLayout';
// PageHeader removed - no longer using headers on pages
import { createLogger } from '../utils/logger';

const logger = createLogger('CommandCenter');

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

interface ContentCluster {
  title: string;
  status: string;
  timeline: string;
  statusColor: string;
}

interface ContentTemplate {
  name: string;
  type: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  number,
  subtitle,
  icon: Icon,
  delay = 0,
  onClick,
  navigateTo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    logger.debug(`Dashboard card clicked: ${title}`);
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      logger.debug(`Navigating to: ${navigateTo}`);
      navigate(navigateTo);
    }
  };

  return (
    <Card
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: {
          duration: 0.2,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
      onClick={handleClick}
      className="group cursor-pointer bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 hover:border-slate-500/80 hover:bg-slate-700/60 transition-all duration-300 rounded-xl"
      padding="lg"
      variant="glass"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <Icon className="w-6 h-6 text-slate-300" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">
          {number}
        </div>
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    </Card>
  );
};

const IntelligenceDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    logger.debug('Intelligence Dashboard clicked - navigating to /intelligence-hub');
    navigate('/intelligence-hub');
  };

  const handleMetricClick = (metricLabel: string) => {
    logger.debug(`Metric clicked: ${metricLabel} - navigating to /intelligence-hub`);
    navigate('/intelligence-hub');
  };

  const metrics = [
    {
      label: 'Alert Response Time',
      value: '2.3s',
      trend: '↓15%',
    },
    {
      label: 'Campaign ROI',
      value: '287%',
      trend: '↑42%',
    },
    {
      label: 'Threat Level Score',
      value: '23/100',
      trend: 'Low',
    },
    {
      label: 'Voter Engagement Rate',
      value: '68.4%',
      trend: '↑12%',
    },
  ];

  return (
    <Card
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: 0.4,
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
      onClick={handleDashboardClick}
      className="group cursor-pointer hover:border-orange-400/50 hover:bg-black/25"
      padding="md"
      variant="glass"
    >
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 lg:p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 group-hover:border-orange-400/30 transition-all duration-300">
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white/95" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-white/95 uppercase">
            Intelligence Dashboard
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleMetricClick(metric.label);
            }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-purple-400/20 hover:border-orange-400/30 hover:bg-black/25 transition-all duration-300 cursor-pointer"
          >
            <div className="text-xl lg:text-2xl font-bold text-white/95 mb-2">
              {metric.value}
            </div>
            <div className="text-xs lg:text-sm text-white/75 mb-3 uppercase">
              {metric.label}
            </div>
            <div className="text-xs text-green-400 font-medium">
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 pt-6 border-t border-white/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/75">Last updated</span>
          <span className="text-white/90">30 seconds ago</span>
        </div>
      </div>
    </Card>
  );
};

const CampaignOperationsHub: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (projectTitle: string) => {
    logger.debug(`Project clicked: ${projectTitle} - navigating to /campaign-control`);
    navigate('/campaign-control');
  };

  const handleTemplateClick = (templateName: string) => {
    logger.debug(`Template clicked: ${templateName} - navigating to /campaign-control`);
    navigate('/campaign-control');
  };

  const activeProjects: ContentCluster[] = [
    {
      title: 'Crisis Response Protocol',
      status: 'Live',
      timeline: 'Active',
      statusColor: 'bg-red-500',
    },
    {
      title: 'Ad Campaign Optimization',
      status: 'Running',
      timeline: 'Today',
      statusColor: 'bg-green-500',
    },
    {
      title: 'Voter Outreach Strategy',
      status: 'Planning',
      timeline: 'Next Week',
      statusColor: 'bg-yellow-500',
    },
  ];

  const contentTemplates: ContentTemplate[] = [
    {
      name: 'Alert Response',
      type: 'Crisis Management',
    },
    {
      name: 'Campaign Message',
      type: 'Political Ads',
    },
    {
      name: 'Field Report',
      type: 'Intelligence',
    },
    {
      name: 'Voter Engagement',
      type: 'Outreach',
    },
  ];

  return (
    <Card
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: 0.3,
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
        },
      }}
      className="group"
      padding="md"
      variant="glass"
    >
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 lg:p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 group-hover:border-orange-400/30 transition-all duration-300">
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white/95" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-white/95 uppercase">
            Campaign Operations Hub
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* Active Projects */}
        <div className="space-y-2 lg:space-y-3">
          <h4 className="text-base lg:text-lg font-medium text-white/90 mb-3 uppercase">
            🔧 Active Projects
          </h4>
          <div className="space-y-1.5 lg:space-y-2">
            {activeProjects.map((cluster, index) => (
              <div
                key={index}
                onClick={() => handleProjectClick(cluster.title)}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/20 hover:border-orange-400/30 hover:bg-black/25 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white/95 text-xs lg:text-sm uppercase">
                    {cluster.title}
                  </h5>
                  <div
                    className={`w-2 h-2 rounded-full ${cluster.statusColor}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/75">{cluster.status}</span>
                  <span className="text-white/65">{cluster.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Templates */}
        <div className="space-y-2 lg:space-y-3">
          <h4 className="text-base lg:text-lg font-medium text-white/90 mb-3 uppercase">
            📄 Content Templates (Quick Actions)
          </h4>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {contentTemplates.map((template, index) => (
              <div
                key={index}
                onClick={() => handleTemplateClick(template.name)}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-purple-400/20 hover:border-orange-400/30 hover:bg-black/25 transition-all duration-300 text-center cursor-pointer"
              >
                <h5 className="font-medium text-white/95 text-xs lg:text-sm mb-1 uppercase">
                  {template.name}
                </h5>
                <p className="text-xs text-white/65 uppercase">{template.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const CommandCenter: React.FC = () => {
  console.error('🟢🟢🟢 COMMANDCENTER IS RENDERING! 🟢🟢🟢');
  logger.info('CommandCenter: Component mounting...');
  logger.debug('CommandCenter: Should show purple gradient background');
  logger.debug(
    'CommandCenter: Three main cards + Campaign Operations Hub + Intelligence Dashboard + Quick Actions',
  );

  return (
    <PageLayout
        pageTitle="War Room Command Center"
        placeholder="Ask War Room about your campaign status..."
      >
      {/* Dark slate gradient background to match Builder.io design */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black -z-10" />

      {/* Top Row - 4 Stats Cards exactly matching Builder.io design */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Real-time Alerts"
          number={7}
          subtitle="Active crisis detections"
          icon={Bell}
          delay={0.1}
          navigateTo="/alert-center"
        />
        <DashboardCard
          title="Ad Spend Today"
          number="$47.2K"
          subtitle="Meta + Google trending up"
          icon={TrendingUp}
          delay={0.2}
          navigateTo="/campaign-control"
        />
        <DashboardCard
          title="Mention Volume"
          number="2,847"
          subtitle="Mentions across platforms"
          icon={MessageSquare}
          delay={0.3}
          navigateTo="/real-time-monitoring"
        />
        <DashboardCard
          title="Sentiment Score"
          number="74%"
          subtitle="Positive sentiment gauge"
          icon={Brain}
          delay={0.4}
          navigateTo="/intelligence-hub"
        />
      </div>

      {/* Campaign Operations Section - Large card matching Builder.io */}
      <div className="mb-6">
        <CampaignOperationsHub />
      </div>

      {/* Quick Actions Section - 6 buttons in 2 rows of 3 */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Intelligence Dashboard - Bottom section with 4 metric cards */}
      <div className="mb-4">
        <IntelligenceDashboard />
      </div>
      </div>
      </PageLayout>
  );
};

export default CommandCenter;
