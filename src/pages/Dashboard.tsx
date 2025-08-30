import { useEffect } from "react";
import PageLayout from "../components/shared/PageLayout";
import { useBackgroundClasses } from "../contexts/BackgroundThemeContext";
import { SWOTRadarDashboard } from "../components/generated/SWOTRadarDashboard";
import { IntelligencePanel } from "../components/generated/IntelligencePanel";
import { StatusBar } from "../components/generated/StatusBar";
import CommandStatusBar from "../components/dashboard/CommandStatusBar";
import { Zap, Radio, PenTool, TrendingUp, Smartphone, AlertTriangle } from "lucide-react";
import "../main-dashboard.css";

export default function Dashboard() {
  console.log('🏠 [DASHBOARD PAGE] Rendering at', window.location.pathname);
  console.log('🔄 [DASHBOARD] Component render at', performance.now());
  
  const { baseClass, overlayClass } = useBackgroundClasses();
  
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
      pageTitle="Campaign Intelligence" 
      placeholder="Ask about your campaign intelligence..."
    >
      {/* Dynamic Background Theme System */}
      <div className={`fixed inset-0 ${baseClass} -z-10`} />
      {overlayClass && <div className={`fixed inset-0 ${overlayClass} -z-10`} />}
      
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
            <div className="card political-map">
              <div className="map-container" style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '10px' }}>
                {/* Political Map Image - Direct without wrapper */}
                <img
                  src="https://p129.p0.n0.cdn.zight.com/items/BluAK9rN/cb190d20-eec7-4e05-8969-259b1dbd9d69.png?source=client&v=6826eb6cb151acf76bf79d55b23b9628"
                  alt="Political Map"
                  className="electoral-map-svg"
                  style={{
                    width: "88%",
                    height: "88%",
                    objectFit: "contain",
                    objectPosition: "center top",
                    marginTop: "-5px",
                    marginLeft: "8px"
                  }}
                />
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
            </div>

            {/* Fresh SWOT Radar - Green Square Design */}
            <div className="card fresh-swot-radar">
              <SWOTRadarDashboard />
            </div>

            {/* Live Intelligence Feed - War Room Style - Moved directly under SWOT radar */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-barlow font-semibold text-white text-lg">Live Intelligence Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-jetbrains text-xs text-white/70">LIVE</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Strength Intelligence */}
                <div className="relative backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-lg p-3 hover:bg-green-500/30 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-jetbrains text-xs text-green-200 uppercase tracking-wide">STRENGTH</span>
                        <span className="font-jetbrains text-xs text-white/50">2m ago</span>
                      </div>
                      <p className="font-barlow text-sm text-white">Strong social media engagement on healthcare messaging</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="font-jetbrains text-xs text-white/70">Sentiment: +87%</span>
                        <span className="font-jetbrains text-xs text-white/70">Reach: 23.4K</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-jetbrains text-lg font-bold text-green-400">+87</div>
                      <div className="font-jetbrains text-xs text-green-300">Impact Score</div>
                    </div>
                  </div>
                </div>

                {/* Opportunity Intelligence */}
                <div className="relative backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 hover:bg-blue-500/30 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-jetbrains text-xs text-blue-200 uppercase tracking-wide">OPPORTUNITY</span>
                        <span className="font-jetbrains text-xs text-white/50">7m ago</span>
                      </div>
                      <p className="font-barlow text-sm text-white">Trending hashtag #CleanEnergyNow gaining momentum</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="font-jetbrains text-xs text-white/70">Growth: +142%</span>
                        <span className="font-jetbrains text-xs text-white/70">Volume: 18.7K</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-jetbrains text-lg font-bold text-blue-400">+73</div>
                      <div className="font-jetbrains text-xs text-blue-300">Trend Score</div>
                    </div>
                  </div>
                </div>

                {/* Weakness Intelligence */}
                <div className="relative backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-lg p-3 hover:bg-red-500/30 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="font-jetbrains text-xs text-red-200 uppercase tracking-wide">WEAKNESS</span>
                        <span className="font-jetbrains text-xs text-white/50">12m ago</span>
                      </div>
                      <p className="font-barlow text-sm text-white">Low engagement on economic policy posts</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="font-jetbrains text-xs text-white/70">Engagement: -34%</span>
                        <span className="font-jetbrains text-xs text-white/70">Comments: 47</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-jetbrains text-lg font-bold text-red-400">-42</div>
                      <div className="font-jetbrains text-xs text-red-300">Alert Level</div>
                    </div>
                  </div>
                </div>

                {/* Threat Intelligence */}
                <div className="relative backdrop-blur-md bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 hover:bg-orange-500/30 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="font-jetbrains text-xs text-orange-200 uppercase tracking-wide">THREAT</span>
                        <span className="font-jetbrains text-xs text-white/50">15m ago</span>
                      </div>
                      <p className="font-barlow text-sm text-white">Negative sentiment spike detected in district coverage</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="font-jetbrains text-xs text-white/70">Sentiment: -23%</span>
                        <span className="font-jetbrains text-xs text-white/70">Sources: 12</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-jetbrains text-lg font-bold text-orange-400">68</div>
                      <div className="font-jetbrains text-xs text-orange-300">Risk Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Phrase Cloud */}
            <div className="card phrase-cloud">
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
                    <div className="phrase-item text-white/80 text-sm">
                      Trump leads GOP primary polling by 42 points nationwide
                    </div>
                    <div className="phrase-item">
                      Healthcare costs surge 23% in critical swing states
                    </div>
                    <div className="phrase-item">
                      Economy shows mixed signals ahead of Fed meeting
                    </div>
                    <div className="phrase-item">
                      Medicare expansion gains bipartisan support
                    </div>
                    <div className="phrase-item">
                      Trump defense fund raises $47M post-indictment
                    </div>
                    <div className="phrase-item">
                      Inflation eases but remains top voter priority
                    </div>
                    <div className="phrase-item">
                      Border security bill passes House committee
                    </div>
                    <div className="phrase-item">
                      Trump rallies Iowa base before caucus deadline
                    </div>
                    <div className="phrase-item">
                      Prescription drug costs hit unprecedented highs
                    </div>
                    <div className="phrase-item">
                      Global market volatility impacts US outlook
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Golden Measure Squares */}
            <div className="metric-boxes-container">
              <div className="card metric-box-square">
                <div className="text-3xl font-normal text-red-400 font-barlow-condensed">
                  7
                </div>
                <div className="text-[10px] text-white/60 uppercase mt-2 text-center font-semibold tracking-wider font-barlow">
                  Real-Time
                  <br />
                  Alerts
                </div>
              </div>
              <div className="card metric-box-square">
                <div className="text-3xl font-normal text-blue-400 font-barlow-condensed">
                  $47.2K
                </div>
                <div className="text-[10px] text-white/60 uppercase mt-2 text-center font-semibold tracking-wider font-barlow">
                  Ad
                  <br />
                  Spend
                </div>
              </div>
              <div className="card metric-box-square">
                <div className="text-3xl font-normal text-green-400 font-barlow-condensed">
                  2,847
                </div>
                <div className="text-[10px] text-white/60 uppercase mt-2 text-center font-semibold tracking-wider font-barlow">
                  Mention
                  <br />
                  Volume
                </div>
              </div>
              <div className="card metric-box-square">
                <div className="text-3xl font-normal text-green-400 font-barlow-condensed">
                  74%
                </div>
                <div className="text-[10px] text-white/60 uppercase mt-2 text-center font-semibold tracking-wider font-barlow">
                  Sentiment
                  <br />
                  Score
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="card quick-actions" style={{ padding: 0, overflow: "hidden" }}>
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
                <div className="bg-white/5 border-r border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Campaign
                </div>
                <div className="bg-white/5 border-r border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <Radio className="w-4 h-4 text-green-400" />
                  Live Monitor
                </div>
                <div className="bg-black/10 border-b border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <PenTool className="w-4 h-4 text-blue-400" />
                  Make Content
                </div>
                <div className="bg-black/10 border-r border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Trend Ops
                </div>
                <div className="bg-black/10 border-r border-white/20 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Social Media
                </div>
                <div className="bg-white/5 flex flex-col items-center justify-center text-[10px] text-white/90 cursor-pointer hover:bg-white/15 hover:border-orange-500/50 transition-all duration-200 gap-1.5 py-3 uppercase font-semibold font-barlow tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Alert Center
                </div>
              </div>
            </div>

            {/* Performance Metrics Table */}
            <div className="card performance-metrics">
              <div className="text-xs lg:text-sm text-white/60 mb-3 uppercase font-semibold tracking-wider font-barlow">Performance Metrics</div>
              <div className="metrics-table">
                <div className="metric-cell">
                  <div className="metric-label">Alert Response</div>
                  <div className="metric-value">45s</div>
                  <div className="metric-trend trend-up">▲ 12%</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-label">Campaign ROI</div>
                  <div className="metric-value">3.2x</div>
                  <div className="metric-trend trend-up">▲ 8%</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-label">Threat Score</div>
                  <div className="metric-value">32</div>
                  <div className="metric-trend trend-down">▼ 5%</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-label">Voter Rate</div>
                  <div className="metric-value">67%</div>
                  <div className="metric-trend trend-neutral">— 0%</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-label">Media Reach</div>
                  <div className="metric-value">2.4M</div>
                  <div className="metric-trend trend-up">▲ 23%</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-label">Sentiment</div>
                  <div className="metric-value">+18</div>
                  <div className="metric-trend trend-up">▲ 3%</div>
                </div>
              </div>
            </div>

          </div>
        </div>

          {/* Bottom spacer */}
          <div className="dashboard-footer"></div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}