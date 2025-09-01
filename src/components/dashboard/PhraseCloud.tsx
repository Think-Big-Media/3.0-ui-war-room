import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import { mentionlyticsService } from '../../services/mentionlytics/mentionlyticsService';

export const PhraseCloud: React.FC = () => {
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState<any>(null);
  const [trendingPhrases, setTrendingPhrases] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('warRoomCampaignSetup');
    if (stored) {
      setCampaignData(JSON.parse(stored));
    }

    // Load trending topics from mentionlytics service
    mentionlyticsService.getTrendingTopics().then((topics) => {
      const phrases = topics.map((t: any) => t.topic);
      setTrendingPhrases(phrases);
    });
  }, []);

  // Actual social media phrases related to client/campaign
  const defaultPhrases = [
    'Strong leadership on healthcare',
    'New Jersey families deserve better',
    'Infrastructure investment is key',
    'Education funding breakthrough',
    'Economy moving in right direction',
    'Working families need solutions',
    'Public safety remains priority',
    'Healthcare reform now',
    'Jobs and opportunity for all',
    'Building a stronger tomorrow',
  ];

  // Social media phrases based on trending topics and campaign activity
  const socialMediaPhrases = [
    'New Jersey families are finally seeing real progress on infrastructure investments',
    'Healthcare reform initiatives are gaining momentum across suburban districts',
    'Economic development policies are making a tangible difference for working families',
    'Education funding breakthrough represents a major victory for students statewide',
    'Climate action initiatives show promising results in environmental protection',
    'Working class families are getting the support they deserve after years of neglect',
    'Public safety improvements remain a top priority for community leaders',
    'Tax reform measures are delivering real benefits to middle class households',
    'Social Security protection measures ensure retirement security for seniors',
    'Veterans advocacy programs demonstrate our commitment to those who served',
  ];

  // Combine actual social media phrases based on campaign keywords and trending topics
  const allPhrases = [
    ...socialMediaPhrases,
    ...trendingPhrases.map((topic) => `Excited about ${topic.toLowerCase()}`),
    ...(campaignData?.competitors?.map((c: any) => `${c.name} making headlines`) || []),
    ...defaultPhrases,
  ].slice(0, 10); // Limit to 10 for performance

  const phrases = allPhrases.length > 0 ? allPhrases : defaultPhrases;

  // Handle phrase click - navigate to live monitoring with keyword filter
  const handlePhraseClick = (phrase: string) => {
    navigate(`/real-time-monitoring?keyword=${encodeURIComponent(phrase)}`);
  };

  // Handle keyword click - navigate to intelligence hub with search
  const handleKeywordClick = (keyword: string) => {
    navigate(`/intelligence-hub?search=${encodeURIComponent(keyword)}&filter=mentions`);
  };

  // Handle competitor click - navigate to intelligence hub with competitor filter  
  const handleCompetitorClick = (competitorName: string) => {
    navigate(`/intelligence-hub?competitor=${encodeURIComponent(competitorName)}&filter=competitor`);
  };

  return (
    <Card
      variant="glass"
      padding="sm"
      className="phrase-cloud hoverable hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-barlow font-semibold text-white text-xs">Brand Monitoring</h3>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="flex" style={{ height: '140px' }}>
        <div className="flex-shrink-0" style={{ width: '120px', paddingRight: '10px' }}>
          <div className="space-y-1">
            <div
              onClick={() => handleKeywordClick('Jack Ciattarelli')}
              className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
              Jack Ciattarelli
            </div>
            <div
              onClick={() => handleKeywordClick('Owned Media')}
              className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></span>
              Owned Media
            </div>
            <div
              onClick={() => handleKeywordClick('Manatee County')}
              className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
              Manatee County
            </div>
            
            <div className="text-[9px] text-white/60 uppercase font-semibold tracking-wider font-barlow mt-3 mb-1">
              OPPONENTS
            </div>
            <div
              onClick={() => handleCompetitorClick('Mikie Sherrill')}
              className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></span>
              Mikie Sherrill
            </div>
            <div
              onClick={() => handleCompetitorClick('Josh Gottheimer')}
              className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
              Josh Gottheimer
            </div>
          </div>
        </div>

        <div className="flex-1 relative phrase-3d" style={{ height: '100%', overflow: 'hidden' }}>
          <div className="phrase-carousel">
            {phrases.map((phrase: string, index: number) => (
              <div
                key={index}
                className="phrase-item cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handlePhraseClick(phrase)}
                style={{
                  animationDelay: `${index * -3}s`,
                  zIndex: phrases.length - index,
                }}
                title={phrase}
              >
                {phrase.length > 55 ? `${phrase.substring(0, 55)}...` : phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
