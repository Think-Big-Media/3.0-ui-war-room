import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/shared/PageLayout";
import Card from "../components/shared/Card";
import CommandStatusBar from "../components/dashboard/CommandStatusBar";
import InteractivePoliticalMap from "../components/political/InteractivePoliticalMap";
import SocialMediaPosts from "../components/dashboard/SocialMediaPosts";
import { ShareOfVoiceChart } from "../components/mentionlytics/ShareOfVoiceChart";
import { DualPieCharts } from "../components/mentionlytics/DualPieCharts";
import { MomentumIndicators } from "../components/mentionlytics/MomentumIndicators";
import { PlatformDominanceGrid } from "../components/mentionlytics/PlatformDominanceGrid";
import { InfluencerPowerMatrix } from "../components/mentionlytics/InfluencerPowerMatrix";
import { CampaignSetupModal } from "../components/mentionlytics/CampaignSetupModal";
import { Zap, Radio, PenTool, TrendingUp, Smartphone, AlertTriangle, Settings } from "lucide-react";
import "../main-dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  
  console.log('🏠 [DASHBOARD PAGE] Rendering at', window.location.pathname);
  console.log('🔄 [DASHBOARD] Component render at', performance.now());

  // Load campaign data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('warRoomCampaignSetup');
    if (stored) {
      setCampaignData(JSON.parse(stored));
    }
  }, []);

  const handleOpenSetup = () => {
    setShowSetupModal(true);
  };

  const handleSetupComplete = (data: any) => {
    setCampaignData(data);
    setShowSetupModal(false);
  };

  const handleQuickActionClick = (action: string) => {
    switch (action) {
      case 'quick-campaign':
        navigate('/campaign-control');
        break;
      case 'live-monitor':
        navigate('/real-time-monitoring');
        break;
      case 'make-content':
        navigate('/campaign-control');
        break;
      case 'trend-ops':
        navigate('/intelligence-hub');
        break;
      case 'social-media':
        navigate('/real-time-monitoring');
        break;
      case 'alert-center':
        navigate('/alert-center');
        break;
      default:
        break;
    }
  };

  const handlePhraseClick = (phrase: string) => {
    // Navigate to Intelligence Hub with the phrase as search parameter
    navigate(`/intelligence-hub?search=${encodeURIComponent(phrase)}`);
  };

  const handleMetricBoxClick = (metric: string) => {
    switch (metric) {
      case 'alerts':
        navigate('/alert-center');
        break;
      case 'ad-spend':
        navigate('/campaign-control');
        break;
      case 'mentions':
        navigate('/real-time-monitoring');
        break;
      case 'sentiment':
        navigate('/intelligence-hub?filter=sentiment');
        break;
      default:
        break;
    }
  };

  const handleIntelligenceFeedClick = (type: string, topic?: string) => {
    switch (type) {
      case 'strength':
        navigate('/intelligence-hub?category=strength&topic=' + encodeURIComponent(topic || 'social-media-engagement'));
        break;
      case 'opportunity':
        navigate('/intelligence-hub?category=opportunity&topic=' + encodeURIComponent(topic || 'trending-hashtags'));
        break;
      case 'weakness':
        navigate('/intelligence-hub?category=weakness&topic=' + encodeURIComponent(topic || 'engagement-issues'));
        break;
      case 'threat':
        navigate('/intelligence-hub?category=threat&topic=' + encodeURIComponent(topic || 'sentiment-alerts'));
        break;
      default:
        navigate('/intelligence-hub');
        break;
    }
  };
  
  // Mock data for Intelligence Panel - 15 total to fill taller container (added 3 more)
  const mockDataPoints = [
    { id: '1', type: 'strength' as const, x: 150, y: 120, intensity: 0.8, label: 'Strong Brand Recognition', timestamp: new Date(), sentiment: 0.7, source: 'Twitter' },
    { id: '2', type: 'strength' as const, x: 200, y: 150, intensity: 0.9, label: 'High Voter Engagement', timestamp: new Date(), sentiment: 0.8, source: 'Polls' },
    { id: '3', type: 'strength' as const, x: 180, y: 140, intensity: 0.7, label: 'Fundraising Success', timestamp: new Date(), sentiment: 0.6, source: 'Finance' },
    { id: '4', type: 'weakness' as const, x: 450, y: 180, intensity: 0.6, label: 'Customer Service Issues', timestamp: new Date(), sentiment: -0.5, source: 'Reviews' },
    { id: '5', type: 'weakness' as const, x: 480, y: 120, intensity: 0.7, label: 'Ad Fatigue Detected', timestamp: new Date(), sentiment: -0.4, source: 'Meta Analytics' },
    { id: '6', type: 'weakness' as const, x: 460, y: 160, intensity: 0.5, label: 'Message Consistency', timestamp: new Date(), sentiment: -0.3, source: 'Focus Groups' },
    { id: '7', type: 'opportunity' as const, x: 180, y: 420, intensity: 0.9, label: 'Emerging Market Expansion', timestamp: new Date(), sentiment: 0.8, source: 'News' },
    { id: '8', type: 'opportunity' as const, x: 220, y: 380, intensity: 0.8, label: 'Youth Voter Surge', timestamp: new Date(), sentiment: 0.7, source: 'Demographics' },
    { id: '9', type: 'opportunity' as const, x: 200, y: 400, intensity: 0.6, label: 'Social Media Growth', timestamp: new Date(), sentiment: 0.5, source: 'Analytics' },
    { id: '10', type: 'threat' as const, x: 480, y: 450, intensity: 0.7, label: 'Competitor Launch', timestamp: new Date(), sentiment: -0.6, source: 'Industry Reports' },
    { id: '11', type: 'threat' as const, x: 460, y: 430, intensity: 0.8, label: 'Economic Downturn', timestamp: new Date(), sentiment: -0.7, source: 'Economic Data' },
    { id: '12', type: 'threat' as const, x: 470, y: 440, intensity: 0.6, label: 'Regulatory Changes', timestamp: new Date(), sentiment: -0.5, source: 'Policy Watch' },
    { id: '13', type: 'strength' as const, x: 170, y: 130, intensity: 0.8, label: 'Grassroots Network Strong', timestamp: new Date(), sentiment: 0.8, source: 'Field Reports' },
    { id: '14', type: 'opportunity' as const, x: 210, y: 390, intensity: 0.7, label: 'Viral Content Momentum', timestamp: new Date(), sentiment: 0.6, source: 'TikTok Analytics' },
    { id: '15', type: 'weakness' as const, x: 470, y: 140, intensity: 0.6, label: 'Rural Outreach Gaps', timestamp: new Date(), sentiment: -0.4, source: 'Regional Data' }
  ];
  
  const mockCrisisAlerts = [
    { id: 'alert-1', message: 'Negative sentiment spike detected in customer service mentions', severity: 'high' as const, timestamp: new Date(), source: 'Social Media' }
  ];
  
  useEffect(() => {
    // Interactive SWOT radar to Live Intelligence connection
    const blobContainers = document.querySelectorAll(".radar-blob-container");
    const feedWrapper = document.getElementById("feedWrapper");
    let animationTimeout: NodeJS.Timeout | null = null;

    blobContainers.forEach((blob) => {
      blob.addEventListener("click", function (this: Element) {
        const feedId = this.getAttribute("data-feed-id");
        if (!feedId) return;

        // Clear any existing timeout
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }

        // Find matching feed item
        const feedItems = feedWrapper?.querySelectorAll(".feed-item");
        let targetItem: Element | null = null;

        feedItems?.forEach((item) => {
          item.classList.remove("highlighted");
          if (item.getAttribute("data-id") === feedId && !targetItem) {
            targetItem = item;
          }
        });

        if (targetItem && feedWrapper) {
          // Stop animation
          feedWrapper.classList.add("paused");
          (feedWrapper as HTMLElement).style.animationPlayState = "paused";

          // Scroll to put item at top
          (feedWrapper as HTMLElement).style.transition = "transform 0.5s ease";
          (feedWrapper as HTMLElement).style.transform =
            `translateY(-${(targetItem as HTMLElement).offsetTop}px)`;

          // Highlight after scroll
          setTimeout(() => {
            targetItem?.classList.add("highlighted");
          }, 200);
        }
      });

      blob.addEventListener("mouseleave", function () {
        animationTimeout = setTimeout(() => {
          const highlightedItem = feedWrapper?.querySelector(
            ".feed-item.highlighted",
          );
          if (highlightedItem) {
            highlightedItem.classList.remove("highlighted");
          }

          if (feedWrapper) {
            feedWrapper.classList.remove("paused");
            (feedWrapper as HTMLElement).style.animationPlayState = "";
            (feedWrapper as HTMLElement).style.transition = "";
            (feedWrapper as HTMLElement).style.transform = "";
          }
        }, 500);
      });
    });

    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, []);

  return (
    <PageLayout 
      pageTitle="Command Center" 
      placeholder="Ask about your campaign intelligence..."
    >
      {/* Command Status Bar - Compact format matching upload */}
      <CommandStatusBar />
      
      <div className="30-aug-dashboard war-room-dashboard font-barlow" style={{ paddingTop: '47px' }}>
      <div>
      {/* Main Dashboard Wrapper */}
      <div className="dashboard-wrapper">
        <div className="dashboard">
          {/* Left Column */}
          <div className="left-column">
            {/* Political Map - NO TITLE */}
            <Card variant="glass" padding="md" className="political-map hoverable hover:scale-[1.02] transition-all duration-200">
              <div className="map-container" style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '10px' }}>
                {/* Interactive Political Map - SVG-based with real-time data */}
                <div style={{ width: "460px", height: "280px", position: "relative" }}>
                  <InteractivePoliticalMap />
                </div>
                <div className="map-data" style={{ textAlign: "right", paddingRight: "10px" }}>
                  <div className="text-[9px] text-white/60 mb-1 text-right uppercase font-semibold tracking-wider truncate font-barlow">
                    SWING STATES
                  </div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Pennsylvania: <span className="font-jetbrains">+2.3%</span> D</div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Michigan: <span className="font-jetbrains">-1.2%</span> R</div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Wisconsin: <span className="font-jetbrains">TOSS UP</span></div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Arizona: <span className="font-jetbrains">+0.8%</span> R</div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Georgia: <span className="font-jetbrains">+1.5%</span> D</div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Nevada: <span className="font-jetbrains">TOSS UP</span></div>
                  <div className="text-white/75 text-[10px] leading-tight text-right uppercase truncate font-barlow">Florida: <span className="font-jetbrains">+3.2%</span> R</div>
                </div>
              </div>
            </Card>

            {/* Mentionlytics Share of Voice Chart */}
            <ShareOfVoiceChart campaignData={campaignData} />

            {/* Dual Pie Charts - Sentiment & Emotion */}
            <DualPieCharts />
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Momentum Indicators */}
            <MomentumIndicators />
            
            {/* Platform Dominance Grid */}
            <PlatformDominanceGrid />
            
            {/* Influencer Power Matrix */}
            <InfluencerPowerMatrix />

            {/* Quick Actions Grid - Moved above phrase cloud */}
            <Card variant="glass" padding="none" className="quick-actions hoverable hover:scale-[1.02] transition-all duration-200" style={{ overflow: "hidden" }}>
              <div className="bg-white/10 px-3 py-2 border-b border-white/30">
                <div className="text-xs text-white/60 uppercase font-semibold tracking-wider font-barlow">
                  Quick Actions
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  height: "calc(100% - 40px)",
                }}
              >
                <div 
                  onClick={() => handleQuickActionClick('quick-campaign')}
                  className="bg-white/5 border-r border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Campaign
                </div>
                <div 
                  onClick={() => handleQuickActionClick('live-monitor')}
                  className="bg-white/5 border-r border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <Radio className="w-4 h-4 text-green-400" />
                  Live Monitor
                </div>
                <div 
                  onClick={handleOpenSetup}
                  className="bg-black/10 border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <Settings className="w-4 h-4 text-blue-400" />
                  Campaign Setup
                </div>
                <div 
                  onClick={() => handleQuickActionClick('trend-ops')}
                  className="bg-black/10 border-r border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Trend Ops
                </div>
                <div 
                  onClick={() => handleQuickActionClick('social-media')}
                  className="bg-black/10 border-r border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Social Media
                </div>
                <div 
                  onClick={() => handleQuickActionClick('alert-center')}
                  className="bg-white/5 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Alert Center
                </div>
              </div>
            </Card>

            {/* Phrase Cloud - Moved below Quick Actions */}
            <Card variant="glass" padding="md" className="phrase-cloud hoverable hover:scale-[1.02] transition-all duration-200">
              <div className="phrase-container">
                <div className="keywords-section">
                  <div className="keyword-group">
                    <div className="text-[9px] text-white/60 mb-1 uppercase font-semibold tracking-wider truncate font-barlow">
                      KEYWORDS
                    </div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Economy</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Healthcare</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Donald Trump</div>
                  </div>
                  <div className="keyword-group">
                    <div className="text-[9px] text-white/60 mb-1 uppercase font-semibold tracking-wider truncate font-barlow">
                      RELATED
                    </div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Inflation</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Medicare</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• GOP Primary</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Tax Policy</div>
                    <div className="text-white/75 text-[10px] leading-tight uppercase truncate font-barlow">• Border Security</div>
                  </div>
                </div>
                <div className="phrase-3d">
                  <div className="phrase-carousel">
                    <div 
                      onClick={() => handlePhraseClick('Trump leads GOP primary polling by 42 points nationwide')}
                      className="phrase-item text-white/80 text-sm cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Trump leads GOP primary polling by 42 points nationwide
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Healthcare costs surge 23% in critical swing states')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Healthcare costs surge 23% in critical swing states
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Economy shows mixed signals ahead of Fed meeting')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Economy shows mixed signals ahead of Fed meeting
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Medicare expansion gains bipartisan support')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Medicare expansion gains bipartisan support
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Trump defense fund raises $47M post-indictment')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Trump defense fund raises $47M post-indictment
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Inflation eases but remains top voter priority')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Inflation eases but remains top voter priority
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Border security bill passes House committee')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Border security bill passes House committee
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Trump rallies Iowa base before caucus deadline')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Trump rallies Iowa base before caucus deadline
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Prescription drug costs hit unprecedented highs')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Prescription drug costs hit unprecedented highs
                    </div>
                    <div 
                      onClick={() => handlePhraseClick('Global market volatility impacts US outlook')}
                      className="phrase-item cursor-pointer hover:text-blue-300 hover:font-bold transition-all duration-200"
                    >
                      Global market volatility impacts US outlook
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Performance Metrics - Glassmorphic Cards */}
            <div className="performance-metrics-container">
              <div className="text-xs lg:text-sm text-white/60 mb-3 uppercase font-semibold tracking-wider font-barlow">Performance Metrics</div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-green-400 font-barlow-condensed">45s</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Alert Response</div>
                  <div className="text-[8px] text-green-400 mt-1">▲ 12%</div>
                </Card>
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-blue-400 font-barlow-condensed">3.2x</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Campaign ROI</div>
                  <div className="text-[8px] text-green-400 mt-1">▲ 8%</div>
                </Card>
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-orange-400 font-barlow-condensed">32</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Threat Score</div>
                  <div className="text-[8px] text-red-400 mt-1">▼ 5%</div>
                </Card>
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-purple-400 font-barlow-condensed">67%</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Voter Rate</div>
                  <div className="text-[8px] text-gray-400 mt-1">— 0%</div>
                </Card>
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-cyan-400 font-barlow-condensed">2.4M</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Media Reach</div>
                  <div className="text-[8px] text-green-400 mt-1">▲ 23%</div>
                </Card>
                <Card variant="glass" padding="sm" className="hoverable hover:scale-[1.02] transition-all duration-200 flex flex-col items-center justify-center">
                  <div className="text-lg font-normal text-green-400 font-barlow-condensed">+18</div>
                  <div className="text-[9px] text-white/60 uppercase mt-1 text-center font-semibold tracking-wider font-barlow">Sentiment</div>
                  <div className="text-[8px] text-green-400 mt-1">▲ 3%</div>
                </Card>
              </div>
            </div>

            {/* Social Media Posts - Latest posts related to user's keywords */}
            <SocialMediaPosts />

          </div>
        </div>

          {/* Bottom spacer */}
          <div className="dashboard-footer"></div>
        </div>
      </div>
      </div>
      
      {/* Campaign Setup Modal */}
      <CampaignSetupModal 
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onComplete={handleSetupComplete}
      />
    </PageLayout>
  );
}