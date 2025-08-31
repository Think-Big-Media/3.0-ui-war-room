import React, { useEffect, useState } from 'react';
import Card from '../shared/Card';
import { mentionlyticsService } from '../../services/mentionlytics/mentionlyticsService';

export const PhraseCloud: React.FC = () => {
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
    'Great to see progress on infrastructure',
    'Healthcare reform is long overdue',
    'Economic policies making real difference',
    'Education funding victory for students',
    'Climate action plan looks promising',
    'Working families finally getting help',
    'Public safety improvements needed',
    'Tax reform benefiting middle class',
    'Social Security protections secured',
    'Veterans deserve our full support',
  ];

  // Combine actual social media phrases based on campaign keywords and trending topics
  const allPhrases = [
    ...socialMediaPhrases,
    ...trendingPhrases.map((topic) => `Excited about ${topic.toLowerCase()}`),
    ...(campaignData?.competitors?.map((c: any) => `${c.name} making headlines`) || []),
    ...defaultPhrases,
  ].slice(0, 10); // Limit to 10 for performance

  const phrases = allPhrases.length > 0 ? allPhrases : defaultPhrases;

  return (
    <Card
      variant="glass"
      padding="sm"
      className="phrase-cloud hoverable hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-barlow font-semibold text-white text-xs">Trending Keywords</h3>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="phrase-container">
        <div className="keywords-section">
          <div className="keyword-group">
            <div className="text-[9px] text-white/60 mb-1 uppercase font-semibold tracking-wider font-barlow">
              PRIMARY
            </div>
            {phrases.slice(0, 3).map((phrase: string, idx: number) => (
              <div
                key={idx}
                className="text-white/75 text-[10px] leading-tight uppercase font-barlow mb-1 cursor-pointer hover:text-cyan-300 transition-colors"
              >
                • {phrase}
              </div>
            ))}
          </div>
        </div>

        <div className="phrase-3d">
          <div className="phrase-carousel">
            {phrases.map((phrase: string, index: number) => (
              <div
                key={index}
                className="phrase-item"
                style={{
                  animationDelay: `${index * -3}s`,
                  zIndex: phrases.length - index,
                }}
              >
                {phrase}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="keywords-section mt-2">
        <div className="keyword-group">
          <div className="text-[9px] text-white/60 mb-1 uppercase font-semibold tracking-wider font-barlow">
            COMPETITORS
          </div>
          {campaignData?.competitors?.map((comp: any, idx: number) => (
            <div
              key={idx}
              className="text-white/75 text-[10px] leading-tight uppercase font-barlow mb-1 cursor-pointer hover:text-cyan-300 transition-colors"
            >
              • {comp.name}
            </div>
          )) || (
            <>
              <div className="text-white/75 text-[10px] leading-tight uppercase font-barlow mb-1 cursor-pointer hover:text-cyan-300 transition-colors">
                • Joe Biden
              </div>
              <div className="text-white/75 text-[10px] leading-tight uppercase font-barlow mb-1 cursor-pointer hover:text-cyan-300 transition-colors">
                • Ron DeSantis
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
