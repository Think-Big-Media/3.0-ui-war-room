import {type ReactNode} from 'react';
import type React from 'react';
import TopNavigation from '../generated/SidebarNavigation';
import FloatingChatBar from '../FloatingChatBar';
import GlobalFooter from './GlobalFooter';
import { createLogger } from '../../utils/logger';

const logger = createLogger('PageLayout');

type PageLayoutProps = {
  children: ReactNode;
  pageTitle: string; // For accessibility or meta
  placeholder: string; // For chat bar
};

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  pageTitle,
  placeholder,
}) => {
  logger.debug(`PageLayout rendering for: ${pageTitle}`);

  const handleSendMessage = (message: string) => {
    logger.info(`Message from ${pageTitle}:`, { message });
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Theme-independent layout - each page sets its own gradient background */}
      <div className="min-h-screen w-full flex flex-col relative z-10">
        {/* Fixed Top Nav */}
        <TopNavigation />

        {/* Scrollable Main Content with Padding */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: '67px', // 64px navbar height + 3px spacing above submenus (halved)
            paddingBottom: '201px', // Reduced by 15px from underneath submenus
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            {children}
            <GlobalFooter />
          </div>
        </main>

        {/* Fixed Bottom Elements */}
        <div className="fixed bottom-16 left-0 right-0 z-50 px-4 lg:px-6">
          <FloatingChatBar
            onSendMessage={handleSendMessage}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
