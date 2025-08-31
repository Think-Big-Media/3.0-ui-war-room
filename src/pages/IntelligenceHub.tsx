import type React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Upload,
  Search,
  Filter,
  FileText,
  Brain,
  MessageSquare,
  Download,
  Eye,
  Plus,
  Clock,
  Tag,
  File,
  Image,
  Link,
  Zap,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import PageLayout from '../components/shared/PageLayout';
// PageHeader removed - no longer using headers on pages
import Card from '../components/shared/Card';
import CustomDropdown from '../components/shared/CustomDropdown';
import { useSentimentAnalysis, useGeographicMentions, useTopInfluencers, useMentionlyticsMode } from '../hooks/useMentionlytics';

interface IntelligenceFile {
  id: string;
  title: string;
  type:
    | 'polling'
    | 'field-report'
    | 'opposition-research'
    | 'messaging'
    | 'news-media';
  uploadDate: string;
  size: string;
  tags: string[];
  summary?: string;
}

interface ChatQuery {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  topic: string;
}

const IntelligenceHub: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedFile, setSelectedFile] = useState<IntelligenceFile | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Get Mentionlytics data
  const { data: sentimentData, loading: sentimentLoading, dataMode: sentimentMode } = useSentimentAnalysis();
  const { data: geographicData, loading: geoLoading, dataMode: geoMode } = useGeographicMentions();
  const { data: influencerData, loading: influencerLoading, dataMode: influencerMode } = useTopInfluencers();
  const { mode: dataMode } = useMentionlyticsMode();
  
  const isLoadingData = sentimentLoading || geoLoading || influencerLoading;
  
  // Parse query parameters
  const urlFilter = searchParams.get('filter');
  const urlLocation = searchParams.get('location');
  const urlCategory = searchParams.get('category');
  const urlTopic = searchParams.get('topic');
  const urlSearch = searchParams.get('search');
  
  // Update search term from URL on mount
  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  // Dropdown options
  const filterOptions = [
    {
      value: 'all',
      label: 'All Files',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    { value: 'polling', label: 'Polling', icon: <Brain className="w-4 h-4" /> },
    {
      value: 'field-report',
      label: 'Field Reports',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: 'opposition-research',
      label: 'Opposition Research',
      icon: <Eye className="w-4 h-4" />,
    },
    {
      value: 'messaging',
      label: 'Messaging Assets',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      value: 'news-media',
      label: 'News & Media',
      icon: <Link className="w-4 h-4" />,
    },
  ];

  const intelligenceFiles: IntelligenceFile[] = [
    {
      id: '1',
      title: 'District 3 Polling Report - Q4 2024',
      type: 'polling',
      uploadDate: '2 hours ago',
      size: '2.4 MB',
      tags: ['District 3', 'Polling', 'Q4 2024'],
      summary:
        'Voter sentiment analysis showing 12% improvement in favorability ratings',
    },
    {
      id: '2',
      title: 'Opposition Research - Candidate Profile',
      type: 'opposition-research',
      uploadDate: '1 day ago',
      size: '5.1 MB',
      tags: ['Opposition', 'Research', 'Campaign'],
      summary:
        'Comprehensive background analysis including policy positions and voting record',
    },
    {
      id: '3',
      title: 'Messaging Framework - Healthcare Policy',
      type: 'messaging',
      uploadDate: '3 days ago',
      size: '892 KB',
      tags: ['Healthcare', 'Messaging', 'Policy'],
      summary:
        'Strategic messaging guidelines for healthcare policy discussions',
    },
    {
      id: '4',
      title: 'Field Report - Suburban Canvassing',
      type: 'field-report',
      uploadDate: '1 week ago',
      size: '1.3 MB',
      tags: ['Field', 'Canvassing', 'Suburban'],
      summary: 'Door-to-door campaign results from suburban neighborhoods',
    },
  ];

  const chatQueries: ChatQuery[] = [
    {
      id: '1',
      query: "What's the current sentiment trend in swing districts?",
      response:
        'Based on recent polling data, sentiment has improved by 8% in key swing districts over the past month...',
      timestamp: '30 minutes ago',
      topic: 'Sentiment Analysis',
    },
    {
      id: '2',
      query: 'Summarize opposition research on healthcare stance',
      response:
        'Opposition candidate has taken 3 different positions on healthcare in the past year...',
      timestamp: '2 hours ago',
      topic: 'Opposition Research',
    },
    {
      id: '3',
      query: 'Generate press release for education policy announcement',
      response:
        'FOR IMMEDIATE RELEASE: [Candidate Name] Announces Comprehensive Education Reform Plan...',
      timestamp: '1 day ago',
      topic: 'Press Release',
    },
  ];

  const filteredFiles = intelligenceFiles.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'polling':
        return <Brain className="w-5 h-5 file-icon-intelligence" />;
      case 'field-report':
        return <FileText className="w-5 h-5 file-icon-monitoring" />;
      case 'opposition-research':
        return <Eye className="w-5 h-5 file-icon-warroom" />;
      case 'messaging':
        return <MessageSquare className="w-5 h-5 file-icon-settings" />;
      case 'news-media':
        return <Link className="w-5 h-5 file-icon-alerts" />;
      default:
        return <File className="w-5 h-5 text-white/70" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'polling':
        return 'Polling';
      case 'field-report':
        return 'Field Report';
      case 'opposition-research':
        return 'Opposition Research';
      case 'messaging':
        return 'Messaging';
      case 'news-media':
        return 'News & Media';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="page-intelligence" data-route="intelligence-hub">
      <PageLayout
        pageTitle="Intelligence"
        placeholder="Ask War Room about campaign intelligence..."
      >
        {/* Data Mode Indicator */}
        <div className="fixed top-20 right-4 z-40">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm ${
            dataMode === 'MOCK' 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {dataMode} DATA
          </div>
        </div>

        {/* Contextual Header - Show active filters and data */}
        {(urlFilter || urlLocation || urlCategory) && (
          <Card variant="glass" padding="sm" className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {urlFilter === 'sentiment' && (
                  <>
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Sentiment Analysis View</h3>
                      {sentimentLoading ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-white/60">Loading sentiment data...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-green-400">
                            Positive: {sentimentData?.positive || 0} ({sentimentData ? Math.round((sentimentData.positive / sentimentData.total) * 100) : 0}%)
                          </span>
                          <span className="text-xs text-red-400">
                            Negative: {sentimentData?.negative || 0} ({sentimentData ? Math.round((sentimentData.negative / sentimentData.total) * 100) : 0}%)
                          </span>
                          <span className="text-xs text-gray-400">
                            Neutral: {sentimentData?.neutral || 0} ({sentimentData ? Math.round((sentimentData.neutral / sentimentData.total) * 100) : 0}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {urlFilter === 'shareOfVoice' && (
                  <>
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Share of Voice Analysis</h3>
                      <p className="text-xs text-white/70">Analyzing competitive landscape and brand presence</p>
                    </div>
                  </>
                )}
                
                {urlFilter === 'influencers' && (
                  <>
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Top Influencers</h3>
                      {influencerLoading ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-white/60">Loading influencer data...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mt-1">
                          {influencerData?.slice(0, 3).map((influencer, idx) => (
                            <span key={idx} className="text-xs text-cyan-400">
                              @{influencer.username} ({influencer.followers.toLocaleString()})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {urlLocation && (
                  <>
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Location Intelligence: {urlLocation}</h3>
                      <p className="text-xs text-white/70">
                        {geographicData?.find(loc => loc.state === urlLocation)?.mentions || 0} mentions in this region
                      </p>
                    </div>
                  </>
                )}
                
                {urlCategory && (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white capitalize">{urlCategory} Analysis</h3>
                      {urlTopic && <p className="text-xs text-white/70">Topic: {urlTopic.replace(/-/g, ' ')}</p>}
                    </div>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => window.history.back()}
                className="text-xs text-white/70 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-3">
          {[
            { id: 'chat', label: 'Chat History', icon: MessageSquare },
            { id: 'upload', label: 'Upload Intelligence', icon: Upload },
            { id: 'library', label: 'Knowledge Library', icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Upload Intelligence Tab */}
        {activeTab === 'upload' && (
          <Card
            className="hoverable hover:scale-[1.02] transition-all duration-200 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            padding="md"
          >
            <h3 className="section-header mb-4">Upload Intelligence</h3>

            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center mb-6">
              <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">
                Drag & drop files here or click to browse
              </p>
              <p className="text-white/50 text-sm">
                Supports: .pdf, .docx, .txt, .csv, images, URLs
              </p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 text-sm rounded-lg transition-colors">
                Choose Files
              </button>
            </div>

            {/* File Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1.5">
                  Category
                </label>
                <CustomDropdown
                  value="auto-detect"
                  onChange={(value) => console.log('Category changed:', value)}
                  options={[
                    { value: 'auto-detect', label: 'Auto-detect' },
                    { value: 'polling', label: 'Polling' },
                    { value: 'field-reports', label: 'Field Reports' },
                    {
                      value: 'opposition-research',
                      label: 'Opposition Research',
                    },
                    { value: 'messaging-assets', label: 'Messaging Assets' },
                    { value: 'news-media', label: 'News & Media' },
                  ]}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="District, issue, audience, date..."
                  className="w-full bg-black/20 border border-white/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white/80 mb-1 ml-1.5">
                Add Notes
              </label>
              <textarea
                placeholder="Optional context (e.g., 'Use this in next debate prep')"
                className="w-full bg-black/20 border border-white/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/50 h-20 resize-none"
              />
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <input type="checkbox" id="ai-memory" className="rounded" />
              <label htmlFor="ai-memory" className="text-white/80">
                Include in War Room AI memory
              </label>
            </div>
          </Card>
        )}

        {/* Knowledge Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Filter & Search */}
            <Card
              className="hoverable hover:scale-[1.02] transition-all duration-200"
              padding="sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white placeholder-white/50 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/50" />
                  <CustomDropdown
                    value={filterType}
                    onChange={setFilterType}
                    options={filterOptions}
                    className="min-w-[160px]"
                  />
                </div>
              </div>
            </Card>

            {/* Files List */}
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className="hoverable hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                  padding="none"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="px-4 pt-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white/95">
                          {file.title}
                        </h4>
                        <p className="text-sm text-white/70">{file.summary}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
                          <span>{getTypeLabel(file.type)}</span>
                          <span>{file.uploadDate}</span>
                          <span>{file.size}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {file.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-white/20 text-white/80 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-white/70" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Zap className="w-4 h-4 text-white/70" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-white/70" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat History Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="section-header">Chat History & Saved Queries</h3>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-white/70 hover:text-white">
                  My Chats
                </button>
                <span className="text-white/50">|</span>
                <button className="text-sm text-white/70 hover:text-white">
                  Team Chats
                </button>
              </div>
            </div>

            {chatQueries.map((query) => (
              <Card
                key={query.id}
                className="hoverable hover:scale-[1.02] transition-all duration-200"
                padding="none"
              >
                <div className="px-4 pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 chat-icon" />
                      <span className="text-sm text-white/70">
                        {query.topic}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>{query.timestamp}</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-white/95 mb-2">
                    {query.query}
                  </h4>
                  <p className="text-sm text-white/70 mb-3">{query.response}</p>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs chat-button">Reopen</button>
                    <button className="text-xs text-white/70 hover:text-white">
                      Copy
                    </button>
                    <button className="text-xs text-white/70 hover:text-white">
                      Add to Doc
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageLayout>
    </div>
  );
};

export default IntelligenceHub;
