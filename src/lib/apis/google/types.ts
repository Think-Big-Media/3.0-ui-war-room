/**
 * Google Ads API v20 TypeScript Interfaces
 * Based on official Google Ads API documentation
 * Complete type definitions with security hardening
 */

// Configuration Interfaces
export interface GoogleAdsConfig {
  developerToken: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  serviceAccountKeyFile?: string;
  serviceAccountKey?: ServiceAccountConfig;
  // Security: Service account JSON from environment variable
  serviceAccountJson?: string;
  loginCustomerId?: string;
  linkedCustomerId?: string;
  redisUrl?: string;
  rateLimitConfig?: RateLimitConfig;
  cacheConfig?: CacheConfig;
  circuitBreakerConfig?: CircuitBreakerConfig;
}

// Missing critical interfaces for type safety
export interface RateLimitStatus {
  tokensRemaining: number;
  bucketSize: number;
  tokensPerSecond: number;
  nextRefillIn: number;
  timeToFull: number;
  resetTime: Date;
  isLimited: boolean;
}

export interface SearchStreamRequest {
  customerId: string;
  query: string;
  pageSize?: number;
  summaryRowSetting?: 'NO_SUMMARY_ROW' | 'SUMMARY_ROW_WITH_RESULTS' | 'SUMMARY_ROW_ONLY';
}

export interface SearchStreamResponse {
  results: any[];
  fieldMask?: string;
  summaryRows?: any[];
  requestId?: string;
  totalResults: number;
}

export interface CampaignPerformanceMetrics {
  campaignId: string;
  campaignName: string;
  status: string;
  biddingStrategyType: string;
  budget: string;
  impressions: number;
  clicks: number;
  conversions: number;
  costMicros: number;
  ctr: number;
  averageCpc: number;
  costPerConversion: number;
  conversionRate: number;
  date: string;
}

export interface BudgetRecommendation {
  resourceName: string;
  type: string;
  impact: {
    baseMetrics: {
      impressions: number;
      clicks: number;
      costMicros: number;
    };
    potentialMetrics: {
      impressions: number;
      clicks: number;
      costMicros: number;
    };
  };
  currentBudgetAmountMicros: number;
  recommendedBudgetAmountMicros: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  hitRate?: number;
  compressionRatio: number;
  memoryUsage: number;
  avgResponseTime: number;
}

export interface CacheEntry {
  key: string;
  size: number;
  ttl: number;
  compressed: boolean;
  createdAt: Date;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface CustomerListResponse {
  resourceNames: string[];
  totalResults: number;
}

export interface ServiceAccountConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

// Customer & Account Management
export interface Customer {
  resourceName: string;
  id: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  trackingUrlTemplate?: string;
  finalUrlSuffix?: string;
  autoTaggingEnabled: boolean;
  hasPartnersBadge: boolean;
  manager: boolean;
  testAccount: boolean;
  callReportingSetting?: CallReportingSetting;
  conversionTrackingSetting?: ConversionTrackingSetting;
  remarketingSetting?: RemarketingSetting;
}

export interface CustomerClient {
  resourceName: string;
  clientCustomer: string;
  hidden: boolean;
  level: number;
  timeZone: string;
  testAccount: boolean;
  manager: boolean;
  descriptiveName: string;
  currencyCode: string;
  id: string;
}

export interface CustomerHierarchy {
  customer: Customer;
  customerClients: CustomerClient[];
  subManagers: CustomerHierarchy[];
}

// Campaign Management
export interface Campaign {
  resourceName: string;
  id: string;
  name: string;
  status: CampaignStatus;
  servingStatus: CampaignServingStatus;
  advertisingChannelType: AdvertisingChannelType;
  advertisingChannelSubType?: AdvertisingChannelSubType;
  trackingUrlTemplate?: string;
  urlCustomParameters: CustomParameter[];
  realTimeBiddingStrategy?: RealTimeBiddingStrategy;
  networkSettings: NetworkSettings;
  hotelSetting?: HotelSetting;
  dynamicSearchAdsSetting?: DynamicSearchAdsSetting;
  shoppingSetting?: ShoppingSetting;
  targetingSetting?: TargetingSetting;
  geoTargetTypeSetting?: GeoTargetTypeSetting;
  localCampaignSetting?: LocalCampaignSetting;
  appCampaignSetting?: AppCampaignSetting;
  labels: string[];
  experimentType: CampaignExperimentType;
  baseCampaign?: string;
  campaignBudget: string;
  biddingStrategyType: BiddingStrategyType;
  accessibleBiddingStrategy?: string;
  startDate: string;
  campaignGroup?: string;
  endDate?: string;
  finalUrlSuffix?: string;
  frequencyCaps: FrequencyCap[];
  videoBrandSafetySuitability: BrandSafetySuitability;
  vanityPharma?: VanityPharma;
  selectiveOptimization?: SelectiveOptimization;
  optimizationGoalSetting?: OptimizationGoalSetting;
  trackingSetting?: TrackingSetting;
  paymentMode: PaymentMode;
  optimizationScore?: number;
  excludedParentAssetFieldTypes: AssetFieldType[];
  excludedParentAssetSetTypes: AssetSetType[];
  urlExpansionOptOut?: boolean;
  performanceMaxUpgrade?: PerformanceMaxUpgrade;
  hotelPropertyAssetSet?: string;
  listingType?: ListingType;
}

export enum CampaignStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED'
}

export enum CampaignServingStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SERVING = 'SERVING',
  NONE = 'NONE',
  ENDED = 'ENDED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum AdvertisingChannelType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SEARCH = 'SEARCH',
  DISPLAY = 'DISPLAY',
  SHOPPING = 'SHOPPING',
  HOTEL = 'HOTEL',
  VIDEO = 'VIDEO',
  MULTI_CHANNEL = 'MULTI_CHANNEL',
  LOCAL = 'LOCAL',
  SMART = 'SMART',
  PERFORMANCE_MAX = 'PERFORMANCE_MAX',
  LOCAL_SERVICES = 'LOCAL_SERVICES',
  DISCOVERY = 'DISCOVERY',
  TRAVEL = 'TRAVEL'
}

export enum AdvertisingChannelSubType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SEARCH_MOBILE_APP = 'SEARCH_MOBILE_APP',
  DISPLAY_MOBILE_APP = 'DISPLAY_MOBILE_APP',
  SEARCH_EXPRESS = 'SEARCH_EXPRESS',
  DISPLAY_EXPRESS = 'DISPLAY_EXPRESS',
  SHOPPING_SMART_ADS = 'SHOPPING_SMART_ADS',
  DISPLAY_GMAIL_AD = 'DISPLAY_GMAIL_AD',
  DISPLAY_SMART_CAMPAIGN = 'DISPLAY_SMART_CAMPAIGN',
  VIDEO_OUTSTREAM = 'VIDEO_OUTSTREAM',
  VIDEO_ACTION = 'VIDEO_ACTION',
  VIDEO_NON_SKIPPABLE = 'VIDEO_NON_SKIPPABLE',
  APP_CAMPAIGN = 'APP_CAMPAIGN',
  APP_CAMPAIGN_FOR_ENGAGEMENT = 'APP_CAMPAIGN_FOR_ENGAGEMENT',
  LOCAL_CAMPAIGN = 'LOCAL_CAMPAIGN',
  SHOPPING_COMPARISON_LISTING_ADS = 'SHOPPING_COMPARISON_LISTING_ADS',
  SMART_CAMPAIGN = 'SMART_CAMPAIGN',
  VIDEO_SEQUENCE = 'VIDEO_SEQUENCE',
  APP_CAMPAIGN_FOR_PRE_REGISTRATION = 'APP_CAMPAIGN_FOR_PRE_REGISTRATION',
  VIDEO_REACH_TARGET_FREQUENCY = 'VIDEO_REACH_TARGET_FREQUENCY',
  TRAVEL_ACTIVITIES = 'TRAVEL_ACTIVITIES'
}

export enum BiddingStrategyType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  COMMISSION = 'COMMISSION',
  ENHANCED_CPC = 'ENHANCED_CPC',
  INVALID = 'INVALID',
  MANUAL_CPA = 'MANUAL_CPA',
  MANUAL_CPC = 'MANUAL_CPC',
  MANUAL_CPM = 'MANUAL_CPM',
  MANUAL_CPV = 'MANUAL_CPV',
  MAXIMIZE_CONVERSIONS = 'MAXIMIZE_CONVERSIONS',
  MAXIMIZE_CONVERSION_VALUE = 'MAXIMIZE_CONVERSION_VALUE',
  PAGE_ONE_PROMOTED = 'PAGE_ONE_PROMOTED',
  PERCENT_CPC = 'PERCENT_CPC',
  TARGET_CPA = 'TARGET_CPA',
  TARGET_CPM = 'TARGET_CPM',
  TARGET_IMPRESSION_SHARE = 'TARGET_IMPRESSION_SHARE',
  TARGET_OUTRANK_SHARE = 'TARGET_OUTRANK_SHARE',
  TARGET_ROAS = 'TARGET_ROAS',
  TARGET_SPEND = 'TARGET_SPEND'
}

// Budget Management
export interface CampaignBudget {
  resourceName: string;
  id: string;
  name: string;
  amountMicros: number;
  totalAmountMicros?: number;
  status: BudgetStatus;
  deliveryMethod: BudgetDeliveryMethod;
  explicitlyShared: boolean;
  referenceCount: number;
  hasRecommendedBudgetAmount: boolean;
  recommendedBudgetAmountMicros?: number;
  period: BudgetPeriod;
  recommendedBudgetEstimatedChangeWeeklyClicks?: number;
  recommendedBudgetEstimatedChangeWeeklyCostMicros?: number;
  recommendedBudgetEstimatedChangeWeeklyInteractions?: number;
  recommendedBudgetEstimatedChangeWeeklyViews?: number;
  type: BudgetType;
}

export enum BudgetStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  REMOVED = 'REMOVED'
}

export enum BudgetDeliveryMethod {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  STANDARD = 'STANDARD',
  ACCELERATED = 'ACCELERATED'
}

export enum BudgetPeriod {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  DAILY = 'DAILY',
  CUSTOM_PERIOD = 'CUSTOM_PERIOD'
}

export enum BudgetType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  STANDARD = 'STANDARD',
  HOTEL_ADS_COMMISSION = 'HOTEL_ADS_COMMISSION',
  FIXED_CPA = 'FIXED_CPA',
  SMART_CAMPAIGN = 'SMART_CAMPAIGN',
  LOCAL_SERVICES = 'LOCAL_SERVICES'
}

export interface AccountBudget {
  resourceName: string;
  id: string;
  billingSetup: string;
  status: AccountBudgetStatus;
  name: string;
  proposedStartDateTime: string;
  approvedStartDateTime?: string;
  totalAdjustmentsMicros: number;
  amountServedMicros: number;
  purchaseOrderNumber?: string;
  notes?: string;
  pendingProposal?: AccountBudgetProposal;
  proposedEndDateTime?: string;
  proposedSpendingLimitMicros?: number;
  adjustedSpendingLimitMicros?: number;
  approvedSpendingLimitMicros?: number;
  proposedEndTimeType: TimeType;
  approvedEndTimeType?: TimeType;
}

export enum AccountBudgetStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PROPOSED = 'PROPOSED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

// Metrics and Performance
export interface Metrics {
  absoluteTopImpressionPercentage?: number;
  activeViewCpm?: number;
  activeViewCtr?: number;
  activeViewImpressions?: number;
  activeViewMeasurability?: number;
  activeViewMeasurableViewCost?: number;
  activeViewMeasurableViews?: number;
  activeViewViewability?: number;
  allConversionsFromInteractionsRate?: number;
  allConversionsValue?: number;
  allConversionsValueByConversionDate?: number;
  allConversions?: number;
  allConversionsByConversionDate?: number;
  allConversionsFromClickstoCall?: number;
  allConversionsFromDirections?: number;
  allConversionsFromInteractionsValuePerInteraction?: number;
  allConversionsFromMenu?: number;
  allConversionsFromOrder?: number;
  allConversionsFromOtherEngagement?: number;
  allConversionsFromStoreVisit?: number;
  allConversionsFromStoreWebsite?: number;
  auctionInsightSearchAbsoluteTopImpressionPercentage?: number;
  auctionInsightSearchImpressionShare?: number;
  auctionInsightSearchOutrankingShare?: number;
  auctionInsightSearchOverlapRate?: number;
  auctionInsightSearchPositionAboveRate?: number;
  auctionInsightSearchTopImpressionPercentage?: number;
  averageCost?: number;
  averageCpc?: number;
  averageCpe?: number;
  averageCpm?: number;
  averageCpv?: number;
  averagePageViews?: number;
  averageTimeOnSite?: number;
  benchmarkAverageMaxCpc?: number;
  benchmarkCtr?: number;
  bounceRate?: number;
  clicks?: number;
  combinedClicksPerQuery?: number;
  combinedQueriesPerDay?: number;
  contentBudgetLostImpressionShare?: number;
  contentImpressionShare?: number;
  contentRankLostImpressionShare?: number;
  conversionLastReceivedRequestDateTime?: string;
  conversionLastConversionDate?: string;
  conversionsFromInteractionsRate?: number;
  conversionsValue?: number;
  conversionsValueByConversionDate?: number;
  conversionsValuePerCost?: number;
  conversionsFromInteractionsValuePerInteraction?: number;
  conversions?: number;
  conversionsByConversionDate?: number;
  costMicros?: number;
  costPerAllConversions?: number;
  costPerConversion?: number;
  costPerCurrentModelAttributedConversion?: number;
  crossDeviceConversions?: number;
  ctr?: number;
  currentModelAttributedConversions?: number;
  currentModelAttributedConversionsFromInteractionsRate?: number;
  currentModelAttributedConversionsFromInteractionsValuePerInteraction?: number;
  currentModelAttributedConversionsValue?: number;
  currentModelAttributedConversionsValuePerCost?: number;
  engagementRate?: number;
  engagements?: number;
  hotelAverageLeadValueMicros?: number;
  hotelCommissionRateMicros?: number;
  hotelExpectedCommissionCost?: number;
  hotelPriceDifferencePercentage?: number;
  hotelEligibleImpressions?: number;
  impressions?: number;
  interactionRate?: number;
  interactionEventTypes: InteractionEventType[];
  interactions?: number;
  invalidClickRate?: number;
  invalidClicks?: number;
  mobileFriendlyClicksPercentage?: number;
  organicClicksPerQuery?: number;
  organicImpressions?: number;
  organicImpressionsPerQuery?: number;
  organicQueriesPerDay?: number;
  percentNewVisitors?: number;
  phoneCalls?: number;
  phoneImpressions?: number;
  phoneThroughRate?: number;
  relativeCtr?: number;
  searchAbsoluteTopImpressionShare?: number;
  searchBudgetLostAbsoluteTopImpressionShare?: number;
  searchBudgetLostImpressionShare?: number;
  searchBudgetLostTopImpressionShare?: number;
  searchClickShare?: number;
  searchExactMatchImpressionShare?: number;
  searchImpressionShare?: number;
  searchRankLostAbsoluteTopImpressionShare?: number;
  searchRankLostImpressionShare?: number;
  searchRankLostTopImpressionShare?: number;
  searchTopImpressionShare?: number;
  speedScore?: number;
  topImpressionPercentage?: number;
  validAcceleratedMobilePagesClicksPercentage?: number;
  valuePerAllConversions?: number;
  valuePerAllConversionsByConversionDate?: number;
  valuePerConversion?: number;
  valuePerConversionsByConversionDate?: number;
  valuePerCurrentModelAttributedConversion?: number;
  videoQuartile100Rate?: number;
  videoQuartile25Rate?: number;
  videoQuartile50Rate?: number;
  videoQuartile75Rate?: number;
  videoViewRate?: number;
  videoViews?: number;
  viewThroughConversions?: number;
}

export enum InteractionEventType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CLICK = 'CLICK',
  ENGAGEMENT = 'ENGAGEMENT',
  VIDEO_VIEW = 'VIDEO_VIEW',
  NONE = 'NONE'
}

// Segments (for reporting)
export interface Segments {
  activityAccountId?: string;
  activityRating?: number;
  adDestinationType?: AdDestinationType;
  adNetworkType?: AdNetworkType;
  auctionInsightDomain?: string;
  budgetCampaignAssociationStatus?: BudgetCampaignAssociationStatus;
  clickType?: ClickType;
  conversionAction?: string;
  conversionActionCategory?: ConversionActionCategory;
  conversionActionName?: string;
  conversionAdjustment?: boolean;
  conversionLagBucket?: ConversionLagBucket;
  conversionOrAdjustmentLagBucket?: ConversionOrAdjustmentLagBucket;
  date?: string;
  dayOfWeek?: DayOfWeek;
  device?: Device;
  externalConversionSource?: ExternalConversionSource;
  geoTargetAirport?: string;
  geoTargetCanton?: string;
  geoTargetCity?: string;
  geoTargetCountry?: string;
  geoTargetCounty?: string;
  geoTargetDistrict?: string;
  geoTargetMostSpecificLocation?: string;
  geoTargetPostalCode?: string;
  geoTargetProvince?: string;
  geoTargetRegion?: string;
  geoTargetState?: string;
  hotelBookingWindowDays?: number;
  hotelCenterId?: string;
  hotelCheckInDate?: string;
  hotelCheckInDayOfWeek?: DayOfWeek;
  hotelCity?: string;
  hotelClass?: number;
  hotelCountry?: string;
  hotelDateSelectionType?: HotelDateSelectionType;
  hotelLengthOfStay?: number;
  hotelRateRuleId?: string;
  hotelRateType?: HotelRateType;
  hotelPriceBucket?: HotelPriceBucket;
  hotelState?: string;
  hour?: number;
  interactionOnThisExtension?: boolean;
  keyword?: Keyword;
  month?: string;
  monthOfYear?: MonthOfYear;
  partnerHotelId?: string;
  placeholderType?: PlaceholderType;
  productAggregatorId?: string;
  productBiddingCategoryLevel1?: string;
  productBiddingCategoryLevel2?: string;
  productBiddingCategoryLevel3?: string;
  productBiddingCategoryLevel4?: string;
  productBiddingCategoryLevel5?: string;
  productBrand?: string;
  productChannel?: ProductChannel;
  productChannelExclusivity?: ProductChannelExclusivity;
  productCondition?: ProductCondition;
  productCountry?: string;
  productCustomAttribute0?: string;
  productCustomAttribute1?: string;
  productCustomAttribute2?: string;
  productCustomAttribute3?: string;
  productCustomAttribute4?: string;
  productFeedLabel?: string;
  productItemId?: string;
  productLanguage?: string;
  productMerchantId?: string;
  productStoreId?: string;
  productTitle?: string;
  productTypeL1?: string;
  productTypeL2?: string;
  productTypeL3?: string;
  productTypeL4?: string;
  productTypeL5?: string;
  quarter?: string;
  searchEngineResultsPageType?: SearchEngineResultsPageType;
  searchSubcategory?: string;
  searchTerm?: string;
  searchTermMatchType?: SearchTermMatchType;
  slot?: Slot;
  webpage?: string;
  week?: string;
  year?: number;
}

// Search and Reporting
export interface SearchGoogleAdsRequest {
  customerId: string;
  query: string;
  pageToken?: string;
  pageSize?: number;
  validateOnly?: boolean;
  returnTotalResultsCount?: boolean;
  summaryRowSetting?: SummaryRowSetting;
}

export interface SearchGoogleAdsStreamRequest {
  customerId: string;
  query: string;
  summaryRowSetting?: SummaryRowSetting;
}

export enum SummaryRowSetting {
  UNSPECIFIED = 'UNSPECIFIED',
  NO_SUMMARY_ROW = 'NO_SUMMARY_ROW',
  SUMMARY_ROW_WITH_RESULTS = 'SUMMARY_ROW_WITH_RESULTS',
  SUMMARY_ROW_ONLY = 'SUMMARY_ROW_ONLY'
}

export interface SearchGoogleAdsResponse {
  results: GoogleAdsRow[];
  nextPageToken?: string;
  totalResultsCount?: number;
  summaryRow?: GoogleAdsRow;
  fieldMask?: string;
}

export interface GoogleAdsRow {
  customer?: Customer;
  campaign?: Campaign;
  campaignBudget?: CampaignBudget;
  accountBudget?: AccountBudget;
  metrics?: Metrics;
  segments?: Segments;
  [key: string]: any;
}

// Error Handling
export interface GoogleAdsError {
  code: number;
  message: string;
  status: string;
  details?: GoogleAdsErrorDetails[];
}

export interface GoogleAdsErrorDetails {
  '@type': string;
  errors?: GoogleAdsFailure[];
}

export interface GoogleAdsFailure {
  errors: GoogleAdsErrorInfo[];
  requestId?: string;
}

export interface GoogleAdsErrorInfo {
  errorCode: {
    [key: string]: string;
  };
  message: string;
  trigger?: Value;
  location?: ErrorLocation;
  details?: PolicyViolationDetails;
}

export interface ErrorLocation {
  fieldPathElements: FieldPathElement[];
}

export interface FieldPathElement {
  fieldName: string;
  index?: number;
}

export interface Value {
  stringValue?: string;
  int64Value?: string;
  boolValue?: boolean;
  [key: string]: any;
}

export interface PolicyViolationDetails {
  externalPolicyName: string;
  key?: string;
  externalPolicyUrl?: string;
  externalPolicyDescription?: string;
  isExemptable: boolean;
  violatingParts: PolicyViolationPart[];
}

export interface PolicyViolationPart {
  index: number;
  length: number;
}

// Helper types
export interface CustomParameter {
  key: string;
  value: string;
}

export interface CallReportingSetting {
  callReportingEnabled: boolean;
  callConversionReportingEnabled: boolean;
  callConversionAction?: string;
}

export interface ConversionTrackingSetting {
  conversionTrackingId?: string;
  crossAccountConversionTrackingId?: string;
  acceptedCustomerDataTerms: boolean;
  conversionTrackingStatus: ConversionTrackingStatus;
  enhancedConversionsForLeadsEnabled: boolean;
  googleAdsConversionCustomer?: string;
}

export enum ConversionTrackingStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  NOT_CONVERSION_TRACKED = 'NOT_CONVERSION_TRACKED',
  CONVERSION_TRACKING_MANAGED_BY_SELF = 'CONVERSION_TRACKING_MANAGED_BY_SELF',
  CONVERSION_TRACKING_MANAGED_BY_THIS_MANAGER = 'CONVERSION_TRACKING_MANAGED_BY_THIS_MANAGER',
  CONVERSION_TRACKING_MANAGED_BY_ANOTHER_MANAGER = 'CONVERSION_TRACKING_MANAGED_BY_ANOTHER_MANAGER'
}

export interface RemarketingSetting {
  googleGlobalSiteTag?: string;
}

export interface NetworkSettings {
  targetGoogleSearch: boolean;
  targetSearchNetwork: boolean;
  targetContentNetwork: boolean;
  targetPartnerSearchNetwork: boolean;
}

export interface RealTimeBiddingStrategy {
  type: RealTimeBiddingStrategyType;
  targetCpa?: TargetCpa;
  targetRoas?: TargetRoas;
}

export enum RealTimeBiddingStrategyType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  TARGET_CPA = 'TARGET_CPA',
  TARGET_ROAS = 'TARGET_ROAS'
}

export interface TargetCpa {
  targetCpaMicros?: number;
  cpcBidCeilingMicros?: number;
  cpcBidFloorMicros?: number;
}

export interface TargetRoas {
  targetRoas?: number;
  cpcBidCeilingMicros?: number;
  cpcBidFloorMicros?: number;
}

// Additional supporting types and enums would go here...
// This is a comprehensive but not exhaustive list of all Google Ads API v20 types

export interface HotelSetting {
  hotelCenterId?: string;
}

export interface DynamicSearchAdsSetting {
  domainName: string;
  languageCode: string;
  useSuppliedUrlsOnly: boolean;
  feeds: string[];
}

export interface ShoppingSetting {
  merchantId?: string;
  feedLabel?: string;
  campaignPriority?: number;
  enableLocal: boolean;
  useVehicleInventory: boolean;
}

export interface TargetingSetting {
  targetRestrictions: TargetRestriction[];
  targetRestrictionOperations: TargetRestrictionOperation[];
}

export interface TargetRestriction {
  targetingDimension: TargetingDimension;
  bidOnly?: boolean;
}

export interface TargetRestrictionOperation {
  operator: TargetRestrictionOperator;
  value: TargetRestriction;
}

export enum TargetingDimension {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  KEYWORD = 'KEYWORD',
  AUDIENCE = 'AUDIENCE',
  TOPIC = 'TOPIC',
  GENDER = 'GENDER',
  AGE_RANGE = 'AGE_RANGE',
  PLACEMENT = 'PLACEMENT',
  PARENTAL_STATUS = 'PARENTAL_STATUS',
  INCOME_RANGE = 'INCOME_RANGE'
}

export enum TargetRestrictionOperator {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

export interface GeoTargetTypeSetting {
  positiveGeoTargetType: PositiveGeoTargetType;
  negativeGeoTargetType: NegativeGeoTargetType;
}

export enum PositiveGeoTargetType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PRESENCE_OR_INTEREST = 'PRESENCE_OR_INTEREST',
  SEARCH_INTEREST = 'SEARCH_INTEREST',
  PRESENCE = 'PRESENCE'
}

export enum NegativeGeoTargetType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PRESENCE_OR_INTEREST = 'PRESENCE_OR_INTEREST',
  PRESENCE = 'PRESENCE'
}

export interface LocalCampaignSetting {
  locationSourceType: LocationSourceType;
}

export enum LocationSourceType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  GOOGLE_MY_BUSINESS = 'GOOGLE_MY_BUSINESS',
  AFFILIATE = 'AFFILIATE'
}

export interface AppCampaignSetting {
  appId?: string;
  appStore: AppStore;
  biddingStrategyGoalType: AppCampaignBiddingStrategyGoalType;
}

export enum AppStore {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  APPLE_APP_STORE = 'APPLE_APP_STORE',
  GOOGLE_APP_STORE = 'GOOGLE_APP_STORE'
}

export enum AppCampaignBiddingStrategyGoalType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  OPTIMIZE_FOR_INSTALL_CONVERSION_VOLUME = 'OPTIMIZE_FOR_INSTALL_CONVERSION_VOLUME',
  OPTIMIZE_FOR_IN_APP_CONVERSION_VOLUME = 'OPTIMIZE_FOR_IN_APP_CONVERSION_VOLUME',
  OPTIMIZE_FOR_TOTAL_CONVERSION_VALUE = 'OPTIMIZE_FOR_TOTAL_CONVERSION_VALUE',
  OPTIMIZE_FOR_TARGET_INSTALL_COST = 'OPTIMIZE_FOR_TARGET_INSTALL_COST',
  OPTIMIZE_FOR_RETURN_ON_ADVERTISING_SPEND = 'OPTIMIZE_FOR_RETURN_ON_ADVERTISING_SPEND',
  OPTIMIZE_FOR_INSTALL_CONVERSION_VOLUME_WITHOUT_TARGET_INSTALL_COST = 'OPTIMIZE_FOR_INSTALL_CONVERSION_VOLUME_WITHOUT_TARGET_INSTALL_COST',
  OPTIMIZE_FOR_PRE_REGISTRATION_CONVERSION_VOLUME = 'OPTIMIZE_FOR_PRE_REGISTRATION_CONVERSION_VOLUME'
}

export enum CampaignExperimentType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  BASE = 'BASE',
  DRAFT = 'DRAFT',
  EXPERIMENT = 'EXPERIMENT'
}

export interface FrequencyCap {
  key: FrequencyCapKey;
  cap?: number;
}

export interface FrequencyCapKey {
  level: FrequencyCapLevel;
  eventType: FrequencyCapEventType;
  timeUnit: FrequencyCapTimeUnit;
  timeLength?: number;
}

export enum FrequencyCapLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  AD_GROUP_AD = 'AD_GROUP_AD',
  AD_GROUP = 'AD_GROUP',
  CAMPAIGN = 'CAMPAIGN'
}

export enum FrequencyCapEventType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  IMPRESSION = 'IMPRESSION',
  VIDEO_VIEW = 'VIDEO_VIEW'
}

export enum FrequencyCapTimeUnit {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  LIFETIME = 'LIFETIME'
}

export enum BrandSafetySuitability {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  EXPANDED_INVENTORY = 'EXPANDED_INVENTORY',
  STANDARD_INVENTORY = 'STANDARD_INVENTORY',
  LIMITED_INVENTORY = 'LIMITED_INVENTORY'
}

export interface VanityPharma {
  vanityPharmaDisplayUrlMode: VanityPharmaDisplayUrlMode;
  vanityPharmaText: VanityPharmaText;
}

export enum VanityPharmaDisplayUrlMode {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  MANUFACTURER_WEBSITE_URL = 'MANUFACTURER_WEBSITE_URL',
  WEBSITE_DESCRIPTION = 'WEBSITE_DESCRIPTION'
}

export enum VanityPharmaText {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PRESCRIPTION_TREATMENT_WEBSITE_EN = 'PRESCRIPTION_TREATMENT_WEBSITE_EN',
  PRESCRIPTION_TREATMENT_WEBSITE_ES = 'PRESCRIPTION_TREATMENT_WEBSITE_ES',
  PRESCRIPTION_DEVICE_WEBSITE_EN = 'PRESCRIPTION_DEVICE_WEBSITE_EN',
  PRESCRIPTION_DEVICE_WEBSITE_ES = 'PRESCRIPTION_DEVICE_WEBSITE_ES',
  MEDICAL_DEVICE_WEBSITE_EN = 'MEDICAL_DEVICE_WEBSITE_EN',
  MEDICAL_DEVICE_WEBSITE_ES = 'MEDICAL_DEVICE_WEBSITE_ES',
  PREVENTATIVE_TREATMENT_WEBSITE_EN = 'PREVENTATIVE_TREATMENT_WEBSITE_EN',
  PREVENTATIVE_TREATMENT_WEBSITE_ES = 'PREVENTATIVE_TREATMENT_WEBSITE_ES',
  PRESCRIPTION_CONTRACEPTION_WEBSITE_EN = 'PRESCRIPTION_CONTRACEPTION_WEBSITE_EN',
  PRESCRIPTION_CONTRACEPTION_WEBSITE_ES = 'PRESCRIPTION_CONTRACEPTION_WEBSITE_ES',
  PRESCRIPTION_VACCINE_WEBSITE_EN = 'PRESCRIPTION_VACCINE_WEBSITE_EN',
  PRESCRIPTION_VACCINE_WEBSITE_ES = 'PRESCRIPTION_VACCINE_WEBSITE_ES'
}

export interface SelectiveOptimization {
  conversionActions: string[];
}

export interface OptimizationGoalSetting {
  optimizationGoalTypes: OptimizationGoalType[];
}

export enum OptimizationGoalType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CALL_CLICKS = 'CALL_CLICKS',
  DRIVING_DIRECTIONS = 'DRIVING_DIRECTIONS',
  APP_PRE_REGISTRATION = 'APP_PRE_REGISTRATION'
}

export interface TrackingSetting {
  trackingUrl?: string;
}

export enum PaymentMode {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CLICKS = 'CLICKS',
  CONVERSION_VALUE = 'CONVERSION_VALUE',
  CONVERSIONS = 'CONVERSIONS',
  GUEST_STAY = 'GUEST_STAY'
}

export enum AssetFieldType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  HEADLINE = 'HEADLINE',
  DESCRIPTION = 'DESCRIPTION',
  MANDATORY_AD_TEXT = 'MANDATORY_AD_TEXT',
  MARKETING_IMAGE = 'MARKETING_IMAGE',
  MEDIA_BUNDLE = 'MEDIA_BUNDLE',
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  BOOK_ON_GOOGLE = 'BOOK_ON_GOOGLE',
  LEAD_FORM = 'LEAD_FORM',
  PROMOTION = 'PROMOTION',
  CALLOUT = 'CALLOUT',
  STRUCTURED_SNIPPET = 'STRUCTURED_SNIPPET',
  SITELINK = 'SITELINK',
  MOBILE_APP = 'MOBILE_APP',
  HOTEL_CALLOUT = 'HOTEL_CALLOUT',
  CALL = 'CALL',
  PRICE = 'PRICE',
  LONG_HEADLINE = 'LONG_HEADLINE',
  BUSINESS_NAME = 'BUSINESS_NAME',
  SQUARE_MARKETING_IMAGE = 'SQUARE_MARKETING_IMAGE',
  PORTRAIT_MARKETING_IMAGE = 'PORTRAIT_MARKETING_IMAGE',
  LOGO = 'LOGO',
  LANDSCAPE_LOGO = 'LANDSCAPE_LOGO',
  VIDEO = 'VIDEO',
  CALL_TO_ACTION_SELECTION = 'CALL_TO_ACTION_SELECTION',
  AD_IMAGE = 'AD_IMAGE',
  BUSINESS_LOGO = 'BUSINESS_LOGO',
  HOTEL_PROPERTY = 'HOTEL_PROPERTY'
}

export enum AssetSetType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PAGE_FEED = 'PAGE_FEED',
  DYNAMIC_EDUCATION = 'DYNAMIC_EDUCATION',
  MERCHANT_CENTER = 'MERCHANT_CENTER',
  RESTAURANT_LOCATION = 'RESTAURANT_LOCATION',
  CHAIN_LOCATION = 'CHAIN_LOCATION',
  HOTEL_PROPERTY = 'HOTEL_PROPERTY'
}

export interface PerformanceMaxUpgrade {
  performanceMaxCampaign?: string;
  preUpgradeIneligibilityReasons: PerformanceMaxUpgradeIneligibilityReason[];
  status: PerformanceMaxUpgradeStatus;
}

export enum PerformanceMaxUpgradeIneligibilityReason {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  UNRELATED_RESOURCE_REFERENCES = 'UNRELATED_RESOURCE_REFERENCES',
  INADEQUATE_CONVERSIONS = 'INADEQUATE_CONVERSIONS',
  INADEQUATE_CONVERSION_VALUE = 'INADEQUATE_CONVERSION_VALUE',
  INADEQUATE_HISTORY = 'INADEQUATE_HISTORY',
  INADEQUATE_BUDGET = 'INADEQUATE_BUDGET',
  INSUFFICIENT_LOCATION_INFORMATION = 'INSUFFICIENT_LOCATION_INFORMATION',
  MISSING_LANDING_PAGE = 'MISSING_LANDING_PAGE',
  MISSING_LISTING_ID = 'MISSING_LISTING_ID',
  NON_IMAGE_AD_GROUP = 'NON_IMAGE_AD_GROUP',
  TOO_MANY_PRODUCTS = 'TOO_MANY_PRODUCTS'
}

export enum PerformanceMaxUpgradeStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  UPGRADE_ELIGIBLE = 'UPGRADE_ELIGIBLE',
  UPGRADE_IN_PROGRESS = 'UPGRADE_IN_PROGRESS',
  UPGRADE_COMPLETE = 'UPGRADE_COMPLETE',
  UPGRADE_FAILED = 'UPGRADE_FAILED'
}

export enum ListingType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  VEHICLES = 'VEHICLES'
}

// Additional supporting enums and interfaces...

export enum TimeType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  NOW = 'NOW',
  FOREVER = 'FOREVER'
}

export interface AccountBudgetProposal {
  resourceName: string;
  id: string;
  billingSetup: string;
  accountBudget?: string;
  proposalType: AccountBudgetProposalType;
  status: AccountBudgetProposalStatus;
  proposedName?: string;
  approvedStartDateTime?: string;
  proposedStartDateTime?: string;
  approvedEndDateTime?: string;
  approvedEndTimeType?: TimeType;
  proposedEndDateTime?: string;
  proposedEndTimeType?: TimeType;
  approvedSpendingLimitMicros?: number;
  proposedSpendingLimitMicros?: number;
  approvedSpendingLimitType?: SpendingLimitType;
  proposedSpendingLimitType?: SpendingLimitType;
  creationDateTime: string;
  approvalDateTime?: string;
  proposer: AccountBudgetProposalProposer;
}

export enum AccountBudgetProposalType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  END = 'END',
  REMOVE = 'REMOVE'
}

export enum AccountBudgetProposalStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PENDING = 'PENDING',
  APPROVED_HELD = 'APPROVED_HELD',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export enum SpendingLimitType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  INFINITE = 'INFINITE',
  FINITE = 'FINITE'
}

export enum AccountBudgetProposalProposer {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CUSTOMER = 'CUSTOMER',
  GOOGLE = 'GOOGLE'
}

// Additional enums for segments
export enum AdDestinationType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  WEBSITE = 'WEBSITE',
  APP_DEEP_LINK = 'APP_DEEP_LINK',
  APP_STORE = 'APP_STORE',
  PHONE_CALL = 'PHONE_CALL',
  MAP_DIRECTIONS = 'MAP_DIRECTIONS',
  LOCATION_LISTING = 'LOCATION_LISTING',
  MESSAGE = 'MESSAGE',
  LEAD_FORM = 'LEAD_FORM',
  YOUTUBE = 'YOUTUBE'
}

export enum AdNetworkType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SEARCH = 'SEARCH',
  SEARCH_PARTNERS = 'SEARCH_PARTNERS',
  CONTENT = 'CONTENT',
  YOUTUBE_SEARCH = 'YOUTUBE_SEARCH',
  YOUTUBE_WATCH = 'YOUTUBE_WATCH',
  MIXED = 'MIXED'
}

export enum BudgetCampaignAssociationStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  REMOVED = 'REMOVED'
}

export enum ClickType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  APP_DEEPLINK = 'APP_DEEPLINK',
  BREADCRUMBS = 'BREADCRUMBS',
  BROADBAND_PLAN = 'BROADBAND_PLAN',
  CALL_TRACKING = 'CALL_TRACKING',
  CALLS = 'CALLS',
  CLICK_ON_ENGAGEMENT_AD = 'CLICK_ON_ENGAGEMENT_AD',
  GET_DIRECTIONS = 'GET_DIRECTIONS',
  LOCATION_EXPANSION = 'LOCATION_EXPANSION',
  LOCATION_FORMAT_CALL = 'LOCATION_FORMAT_CALL',
  LOCATION_FORMAT_DIRECTIONS = 'LOCATION_FORMAT_DIRECTIONS',
  LOCATION_FORMAT_IMAGE = 'LOCATION_FORMAT_IMAGE',
  LOCATION_FORMAT_LANDING_PAGE = 'LOCATION_FORMAT_LANDING_PAGE',
  LOCATION_FORMAT_MAP = 'LOCATION_FORMAT_MAP',
  LOCATION_FORMAT_STORE_INFO = 'LOCATION_FORMAT_STORE_INFO',
  LOCATION_FORMAT_TEXT = 'LOCATION_FORMAT_TEXT',
  MOBILE_CALL_TRACKING = 'MOBILE_CALL_TRACKING',
  OFFER_PRINTS = 'OFFER_PRINTS',
  OTHER = 'OTHER',
  PRODUCT_EXTENSION_CLICKS = 'PRODUCT_EXTENSION_CLICKS',
  PRODUCT_LISTING_AD_CLICKS = 'PRODUCT_LISTING_AD_CLICKS',
  SITELINKS = 'SITELINKS',
  STORE_LOCATOR = 'STORE_LOCATOR',
  URL_CLICKS = 'URL_CLICKS',
  VIDEO_APP_STORE_CLICKS = 'VIDEO_APP_STORE_CLICKS',
  VIDEO_CALL_TO_ACTION_CLICKS = 'VIDEO_CALL_TO_ACTION_CLICKS',
  VIDEO_CARD_ACTION_HEADLINE_CLICKS = 'VIDEO_CARD_ACTION_HEADLINE_CLICKS',
  VIDEO_END_CAP_CLICKS = 'VIDEO_END_CAP_CLICKS',
  VIDEO_WEBSITE_CLICKS = 'VIDEO_WEBSITE_CLICKS',
  VISUAL_SITELINKS = 'VISUAL_SITELINKS',
  WIRELESS_PLAN = 'WIRELESS_PLAN',
  PRODUCT_LISTING_AD_LOCAL = 'PRODUCT_LISTING_AD_LOCAL',
  PRODUCT_LISTING_AD_MULTICHANNEL_LOCAL = 'PRODUCT_LISTING_AD_MULTICHANNEL_LOCAL',
  PRODUCT_LISTING_AD_MULTICHANNEL_ONLINE = 'PRODUCT_LISTING_AD_MULTICHANNEL_ONLINE',
  PRODUCT_LISTING_ADS_COUPON = 'PRODUCT_LISTING_ADS_COUPON',
  PRODUCT_LISTING_AD_TRANSACTABLE = 'PRODUCT_LISTING_AD_TRANSACTABLE',
  PRODUCT_AD_APP_DEEPLINK = 'PRODUCT_AD_APP_DEEPLINK',
  SHOWCASE_AD_CATEGORY_LINK = 'SHOWCASE_AD_CATEGORY_LINK',
  SHOWCASE_AD_LOCAL_STOREFRONT_LINK = 'SHOWCASE_AD_LOCAL_STOREFRONT_LINK',
  SHOWCASE_AD_ONLINE_PRODUCT_LINK = 'SHOWCASE_AD_ONLINE_PRODUCT_LINK',
  SHOWCASE_AD_LOCAL_PRODUCT_LINK = 'SHOWCASE_AD_LOCAL_PRODUCT_LINK',
  PROMOTION_EXTENSION = 'PROMOTION_EXTENSION',
  SWIPEABLE_GALLERY_AD_HEADLINE = 'SWIPEABLE_GALLERY_AD_HEADLINE',
  SWIPEABLE_GALLERY_AD_SWIPES = 'SWIPEABLE_GALLERY_AD_SWIPES',
  SWIPEABLE_GALLERY_AD_SEE_MORE = 'SWIPEABLE_GALLERY_AD_SEE_MORE',
  SWIPEABLE_GALLERY_AD_SITELINK_ONE = 'SWIPEABLE_GALLERY_AD_SITELINK_ONE',
  SWIPEABLE_GALLERY_AD_SITELINK_TWO = 'SWIPEABLE_GALLERY_AD_SITELINK_TWO',
  SWIPEABLE_GALLERY_AD_SITELINK_THREE = 'SWIPEABLE_GALLERY_AD_SITELINK_THREE',
  SWIPEABLE_GALLERY_AD_SITELINK_FOUR = 'SWIPEABLE_GALLERY_AD_SITELINK_FOUR',
  SWIPEABLE_GALLERY_AD_SITELINK_FIVE = 'SWIPEABLE_GALLERY_AD_SITELINK_FIVE',
  AD_IMAGE = 'AD_IMAGE',
  SHOPPING_COMPARISON_LISTING = 'SHOPPING_COMPARISON_LISTING',
  CROSS_NETWORK = 'CROSS_NETWORK',
  APP_INSTALL = 'APP_INSTALL',
  APP_ENGAGEMENT = 'APP_ENGAGEMENT',
  TRIAL_REGISTRATION = 'TRIAL_REGISTRATION',
  APP_STORE = 'APP_STORE',
  CALL_TO_ACTION_APP_STORE = 'CALL_TO_ACTION_APP_STORE',
  CALL_TO_ACTION_APP_DEEPLINK = 'CALL_TO_ACTION_APP_DEEPLINK',
  CALL_TO_ACTION_WEBSITE = 'CALL_TO_ACTION_WEBSITE',
  STRUCTURED_SNIPPET_EXTENSION = 'STRUCTURED_SNIPPET_EXTENSION',
  RECIPE_EXTENSION = 'RECIPE_EXTENSION',
  LEAD_FORM_EXTENSION = 'LEAD_FORM_EXTENSION',
  ADVERTISER_PROVIDED_PHONE_CALL = 'ADVERTISER_PROVIDED_PHONE_CALL',
  CLICK_TO_CALL = 'CLICK_TO_CALL',
  MOBILE_CALL_TRACKING_CLICK_TO_CALL = 'MOBILE_CALL_TRACKING_CLICK_TO_CALL',
  PHONE_CALL_FROM_STORE = 'PHONE_CALL_FROM_STORE',
  TEXT_MESSAGE = 'TEXT_MESSAGE',
  MOBILE_CALL_TRACKING_TEXT_MESSAGE = 'MOBILE_CALL_TRACKING_TEXT_MESSAGE',
  DIRECTORY_SUPERCATEGORY_LINK = 'DIRECTORY_SUPERCATEGORY_LINK',
  DIRECTORY_CATEGORY_LINK = 'DIRECTORY_CATEGORY_LINK',
  DIRECTORY_SUBCATEGORY_LINK = 'DIRECTORY_SUBCATEGORY_LINK',
  DIRECTORY_BUSINESS_LINK = 'DIRECTORY_BUSINESS_LINK',
  DIRECTORY_CONTINUE_LINK = 'DIRECTORY_CONTINUE_LINK',
  DIRECTORY_CONTACT_LINK = 'DIRECTORY_CONTACT_LINK',
  STORE_LOCATOR_SHOW_MORE_LINK = 'STORE_LOCATOR_SHOW_MORE_LINK',
  ORDER_NOW = 'ORDER_NOW',
  APPOINTMENTS = 'APPOINTMENTS',
  MENU = 'MENU',
  SERVICES = 'SERVICES',
  BOOK_TRAVEL = 'BOOK_TRAVEL',
  DELIVERY = 'DELIVERY',
  TAKEOUT = 'TAKEOUT',
  MOBILE_DOWNLOAD = 'MOBILE_DOWNLOAD',
  MOBILE_ENGAGEMENT = 'MOBILE_ENGAGEMENT',
  FLYER_HEADER = 'FLYER_HEADER',
  FLYER_BODY = 'FLYER_BODY',
  FLYER_CTA = 'FLYER_CTA',
  IMAGE_GALLERY = 'IMAGE_GALLERY',
  TRAVEL_UNCOLLAPSED_ITINERARY = 'TRAVEL_UNCOLLAPSED_ITINERARY',
  TRAVEL_COLLAPSED_ITINERARY = 'TRAVEL_COLLAPSED_ITINERARY',
  TRAVEL_HEADER = 'TRAVEL_HEADER',
  TRAVEL_VIEW_ALL = 'TRAVEL_VIEW_ALL',
  TRAVEL_LANDING_PAGE = 'TRAVEL_LANDING_PAGE',
  TRAVEL_BOOK = 'TRAVEL_BOOK',
  PRODUCT_TITLE = 'PRODUCT_TITLE',
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  SHOPPING_MERCHANT_CENTER = 'SHOPPING_MERCHANT_CENTER',
  PROMOTION_EXTENSION_DISCOUNTED_PRICE = 'PROMOTION_EXTENSION_DISCOUNTED_PRICE',
  PROMOTION_EXTENSION_FINAL_PRICE = 'PROMOTION_EXTENSION_FINAL_PRICE',
  PROMOTION_EXTENSION_FINAL_PRICE_BY_PERCENTAGE_OFF = 'PROMOTION_EXTENSION_FINAL_PRICE_BY_PERCENTAGE_OFF',
  PROMOTION_EXTENSION_FINAL_PRICE_BY_MONETARY_AMOUNT_OFF = 'PROMOTION_EXTENSION_FINAL_PRICE_BY_MONETARY_AMOUNT_OFF',
  PROMOTION_EXTENSION_FINAL_PRICE_BY_PERCENTAGE_UP_TO = 'PROMOTION_EXTENSION_FINAL_PRICE_BY_PERCENTAGE_UP_TO',
  PROMOTION_EXTENSION_FINAL_PRICE_BY_MONETARY_AMOUNT_UP_TO = 'PROMOTION_EXTENSION_FINAL_PRICE_BY_MONETARY_AMOUNT_UP_TO',
  HOTELS_PRICE = 'HOTELS_PRICE',
  HOTELS_BOOK_ON_GOOGLE_ROOM_SELECTION = 'HOTELS_BOOK_ON_GOOGLE_ROOM_SELECTION',
  HOTELS_BOOK_ON_GOOGLE_BOOK_NOW = 'HOTELS_BOOK_ON_GOOGLE_BOOK_NOW',
  HOTELS_PARTNER_BOOK_NOW = 'HOTELS_PARTNER_BOOK_NOW'
}

export enum ConversionActionCategory {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  DEFAULT = 'DEFAULT',
  PAGE_VIEW = 'PAGE_VIEW',
  PURCHASE = 'PURCHASE',
  SIGNUP = 'SIGNUP',
  LEAD = 'LEAD',
  DOWNLOAD = 'DOWNLOAD',
  ADD_TO_CART = 'ADD_TO_CART',
  BEGIN_CHECKOUT = 'BEGIN_CHECKOUT',
  SUBSCRIBE_PAID = 'SUBSCRIBE_PAID',
  PHONE_CALL_LEAD = 'PHONE_CALL_LEAD',
  IMPORTED_LEAD = 'IMPORTED_LEAD',
  SUBMIT_LEAD_FORM = 'SUBMIT_LEAD_FORM',
  BOOK_APPOINTMENT = 'BOOK_APPOINTMENT',
  REQUEST_QUOTE = 'REQUEST_QUOTE',
  GET_DIRECTIONS = 'GET_DIRECTIONS',
  OUTBOUND_CLICK = 'OUTBOUND_CLICK',
  CONTACT = 'CONTACT',
  ENGAGEMENT = 'ENGAGEMENT',
  STORE_VISIT = 'STORE_VISIT',
  STORE_SALE = 'STORE_SALE',
  QUALIFIED_LEAD = 'QUALIFIED_LEAD',
  CONVERTED_LEAD = 'CONVERTED_LEAD'
}

export enum ConversionLagBucket {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  LESS_THAN_ONE_DAY = 'LESS_THAN_ONE_DAY',
  ONE_TO_TWO_DAYS = 'ONE_TO_TWO_DAYS',
  TWO_TO_THREE_DAYS = 'TWO_TO_THREE_DAYS',
  THREE_TO_FOUR_DAYS = 'THREE_TO_FOUR_DAYS',
  FOUR_TO_FIVE_DAYS = 'FOUR_TO_FIVE_DAYS',
  FIVE_TO_SIX_DAYS = 'FIVE_TO_SIX_DAYS',
  SIX_TO_SEVEN_DAYS = 'SIX_TO_SEVEN_DAYS',
  SEVEN_TO_EIGHT_DAYS = 'SEVEN_TO_EIGHT_DAYS',
  EIGHT_TO_NINE_DAYS = 'EIGHT_TO_NINE_DAYS',
  NINE_TO_TEN_DAYS = 'NINE_TO_TEN_DAYS',
  TEN_TO_ELEVEN_DAYS = 'TEN_TO_ELEVEN_DAYS',
  ELEVEN_TO_TWELVE_DAYS = 'ELEVEN_TO_TWELVE_DAYS',
  TWELVE_TO_THIRTEEN_DAYS = 'TWELVE_TO_THIRTEEN_DAYS',
  THIRTEEN_TO_FOURTEEN_DAYS = 'THIRTEEN_TO_FOURTEEN_DAYS',
  FOURTEEN_TO_TWENTY_ONE_DAYS = 'FOURTEEN_TO_TWENTY_ONE_DAYS',
  TWENTY_ONE_TO_THIRTY_DAYS = 'TWENTY_ONE_TO_THIRTY_DAYS',
  THIRTY_TO_FORTY_FIVE_DAYS = 'THIRTY_TO_FORTY_FIVE_DAYS',
  FORTY_FIVE_TO_SIXTY_DAYS = 'FORTY_FIVE_TO_SIXTY_DAYS',
  SIXTY_TO_NINETY_DAYS = 'SIXTY_TO_NINETY_DAYS'
}

export enum ConversionOrAdjustmentLagBucket {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CONVERSION_LESS_THAN_ONE_DAY = 'CONVERSION_LESS_THAN_ONE_DAY',
  CONVERSION_ONE_TO_TWO_DAYS = 'CONVERSION_ONE_TO_TWO_DAYS',
  CONVERSION_TWO_TO_THREE_DAYS = 'CONVERSION_TWO_TO_THREE_DAYS',
  CONVERSION_THREE_TO_FOUR_DAYS = 'CONVERSION_THREE_TO_FOUR_DAYS',
  CONVERSION_FOUR_TO_FIVE_DAYS = 'CONVERSION_FOUR_TO_FIVE_DAYS',
  CONVERSION_FIVE_TO_SIX_DAYS = 'CONVERSION_FIVE_TO_SIX_DAYS',
  CONVERSION_SIX_TO_SEVEN_DAYS = 'CONVERSION_SIX_TO_SEVEN_DAYS',
  CONVERSION_SEVEN_TO_EIGHT_DAYS = 'CONVERSION_SEVEN_TO_EIGHT_DAYS',
  CONVERSION_EIGHT_TO_NINE_DAYS = 'CONVERSION_EIGHT_TO_NINE_DAYS',
  CONVERSION_NINE_TO_TEN_DAYS = 'CONVERSION_NINE_TO_TEN_DAYS',
  CONVERSION_TEN_TO_ELEVEN_DAYS = 'CONVERSION_TEN_TO_ELEVEN_DAYS',
  CONVERSION_ELEVEN_TO_TWELVE_DAYS = 'CONVERSION_ELEVEN_TO_TWELVE_DAYS',
  CONVERSION_TWELVE_TO_THIRTEEN_DAYS = 'CONVERSION_TWELVE_TO_THIRTEEN_DAYS',
  CONVERSION_THIRTEEN_TO_FOURTEEN_DAYS = 'CONVERSION_THIRTEEN_TO_FOURTEEN_DAYS',
  CONVERSION_FOURTEEN_TO_TWENTY_ONE_DAYS = 'CONVERSION_FOURTEEN_TO_TWENTY_ONE_DAYS',
  CONVERSION_TWENTY_ONE_TO_THIRTY_DAYS = 'CONVERSION_TWENTY_ONE_TO_THIRTY_DAYS',
  CONVERSION_THIRTY_TO_FORTY_FIVE_DAYS = 'CONVERSION_THIRTY_TO_FORTY_FIVE_DAYS',
  CONVERSION_FORTY_FIVE_TO_SIXTY_DAYS = 'CONVERSION_FORTY_FIVE_TO_SIXTY_DAYS',
  CONVERSION_SIXTY_TO_NINETY_DAYS = 'CONVERSION_SIXTY_TO_NINETY_DAYS',
  ADJUSTMENT_LESS_THAN_ONE_DAY = 'ADJUSTMENT_LESS_THAN_ONE_DAY',
  ADJUSTMENT_ONE_TO_TWO_DAYS = 'ADJUSTMENT_ONE_TO_TWO_DAYS',
  ADJUSTMENT_TWO_TO_THREE_DAYS = 'ADJUSTMENT_TWO_TO_THREE_DAYS',
  ADJUSTMENT_THREE_TO_FOUR_DAYS = 'ADJUSTMENT_THREE_TO_FOUR_DAYS',
  ADJUSTMENT_FOUR_TO_FIVE_DAYS = 'ADJUSTMENT_FOUR_TO_FIVE_DAYS',
  ADJUSTMENT_FIVE_TO_SIX_DAYS = 'ADJUSTMENT_FIVE_TO_SIX_DAYS',
  ADJUSTMENT_SIX_TO_SEVEN_DAYS = 'ADJUSTMENT_SIX_TO_SEVEN_DAYS',
  ADJUSTMENT_SEVEN_TO_EIGHT_DAYS = 'ADJUSTMENT_SEVEN_TO_EIGHT_DAYS',
  ADJUSTMENT_EIGHT_TO_NINE_DAYS = 'ADJUSTMENT_EIGHT_TO_NINE_DAYS',
  ADJUSTMENT_NINE_TO_TEN_DAYS = 'ADJUSTMENT_NINE_TO_TEN_DAYS',
  ADJUSTMENT_TEN_TO_ELEVEN_DAYS = 'ADJUSTMENT_TEN_TO_ELEVEN_DAYS',
  ADJUSTMENT_ELEVEN_TO_TWELVE_DAYS = 'ADJUSTMENT_ELEVEN_TO_TWELVE_DAYS',
  ADJUSTMENT_TWELVE_TO_THIRTEEN_DAYS = 'ADJUSTMENT_TWELVE_TO_THIRTEEN_DAYS',
  ADJUSTMENT_THIRTEEN_TO_FOURTEEN_DAYS = 'ADJUSTMENT_THIRTEEN_TO_FOURTEEN_DAYS',
  ADJUSTMENT_FOURTEEN_TO_TWENTY_ONE_DAYS = 'ADJUSTMENT_FOURTEEN_TO_TWENTY_ONE_DAYS',
  ADJUSTMENT_TWENTY_ONE_TO_THIRTY_DAYS = 'ADJUSTMENT_TWENTY_ONE_TO_THIRTY_DAYS',
  ADJUSTMENT_THIRTY_TO_FORTY_FIVE_DAYS = 'ADJUSTMENT_THIRTY_TO_FORTY_FIVE_DAYS',
  ADJUSTMENT_FORTY_FIVE_TO_SIXTY_DAYS = 'ADJUSTMENT_FORTY_FIVE_TO_SIXTY_DAYS',
  ADJUSTMENT_SIXTY_TO_NINETY_DAYS = 'ADJUSTMENT_SIXTY_TO_NINETY_DAYS',
  UNKNOWN_ADJUSTMENT_DATE = 'UNKNOWN_ADJUSTMENT_DATE'
}

export enum DayOfWeek {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export enum Device {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
  CONNECTED_TV = 'CONNECTED_TV',
  OTHER = 'OTHER'
}

export enum ExternalConversionSource {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  WEBPAGE = 'WEBPAGE',
  ANALYTICS = 'ANALYTICS',
  UPLOAD = 'UPLOAD',
  AD_CALL_METRICS = 'AD_CALL_METRICS',
  WEBSITE_CALL_METRICS = 'WEBSITE_CALL_METRICS',
  STORE_VISITS = 'STORE_VISITS',
  ANDROID_IN_APP = 'ANDROID_IN_APP',
  IOS_IN_APP = 'IOS_IN_APP',
  IOS_FIRST_OPEN = 'IOS_FIRST_OPEN',
  APP_UNSPECIFIED = 'APP_UNSPECIFIED',
  ANDROID_FIRST_OPEN = 'ANDROID_FIRST_OPEN',
  UPLOAD_CALLS = 'UPLOAD_CALLS',
  UPLOAD_CLICKS = 'UPLOAD_CLICKS',
  EXTERNAL_CLICK_ID = 'EXTERNAL_CLICK_ID',
  EXTERNAL_ATTRIBUTION = 'EXTERNAL_ATTRIBUTION',
  STORE_SALES = 'STORE_SALES',
  ANDROID_APP_PRE_REGISTRATION = 'ANDROID_APP_PRE_REGISTRATION',
  CONVERSION_ACTION_FLOODLIGHT = 'CONVERSION_ACTION_FLOODLIGHT',
  YOUTUBE_HOSTED = 'YOUTUBE_HOSTED',
  GOOGLE_HOSTED = 'GOOGLE_HOSTED',
  GOOGLE_ANALYTICS_4 = 'GOOGLE_ANALYTICS_4',
  GOOGLE_ANALYTICS_AND_GOOGLE_ADS_LINKED = 'GOOGLE_ANALYTICS_AND_GOOGLE_ADS_LINKED',
  FLOODLIGHT_CROSS_ENVIRONMENT = 'FLOODLIGHT_CROSS_ENVIRONMENT'
}

export enum HotelDateSelectionType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  DEFAULT_SELECTION = 'DEFAULT_SELECTION',
  USER_SELECTED = 'USER_SELECTED'
}

export enum HotelRateType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  UNAVAILABLE = 'UNAVAILABLE',
  PUBLIC_RATE = 'PUBLIC_RATE',
  QUALIFIED_PUBLIC_RATE = 'QUALIFIED_PUBLIC_RATE',
  PRIVATE_RATE = 'PRIVATE_RATE'
}

export enum HotelPriceBucket {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  LOWEST_UNIQUE = 'LOWEST_UNIQUE',
  LOWEST_TIED = 'LOWEST_TIED',
  NOT_LOWEST = 'NOT_LOWEST',
  ONLY_PARTNER_SHOWN = 'ONLY_PARTNER_SHOWN'
}

export interface Keyword {
  adGroupCriterion?: string;
  info?: KeywordInfo;
}

export interface KeywordInfo {
  text?: string;
  matchType?: KeywordMatchType;
}

export enum KeywordMatchType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  EXACT = 'EXACT',
  PHRASE = 'PHRASE',
  BROAD = 'BROAD'
}

export enum MonthOfYear {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER'
}

export enum PlaceholderType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SITELINK = 'SITELINK',
  CALL = 'CALL',
  APP = 'APP',
  LOCATION = 'LOCATION',
  AFFILIATE_LOCATION = 'AFFILIATE_LOCATION',
  CALLOUT = 'CALLOUT',
  STRUCTURED_SNIPPET = 'STRUCTURED_SNIPPET',
  MESSAGE = 'MESSAGE',
  PRICE = 'PRICE',
  PROMOTION = 'PROMOTION',
  AD_CUSTOMIZER = 'AD_CUSTOMIZER',
  DYNAMIC_EDUCATION = 'DYNAMIC_EDUCATION',
  DYNAMIC_FLIGHT = 'DYNAMIC_FLIGHT',
  DYNAMIC_CUSTOM = 'DYNAMIC_CUSTOM',
  DYNAMIC_HOTEL = 'DYNAMIC_HOTEL',
  DYNAMIC_REAL_ESTATE = 'DYNAMIC_REAL_ESTATE',
  DYNAMIC_TRAVEL = 'DYNAMIC_TRAVEL',
  DYNAMIC_LOCAL = 'DYNAMIC_LOCAL',
  DYNAMIC_JOB = 'DYNAMIC_JOB',
  IMAGE = 'IMAGE',
  LEAD_FORM = 'LEAD_FORM'
}

export enum ProductChannel {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ONLINE = 'ONLINE',
  LOCAL = 'LOCAL'
}

export enum ProductChannelExclusivity {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SINGLE_CHANNEL = 'SINGLE_CHANNEL',
  MULTI_CHANNEL = 'MULTI_CHANNEL'
}

export enum ProductCondition {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  OLD = 'OLD',
  NEW = 'NEW',
  REFURBISHED = 'REFURBISHED',
  USED = 'USED'
}

export enum SearchEngineResultsPageType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ADS_ONLY = 'ADS_ONLY',
  ORGANIC_ONLY = 'ORGANIC_ONLY',
  ADS_AND_ORGANIC = 'ADS_AND_ORGANIC'
}

export enum SearchTermMatchType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  BROAD = 'BROAD',
  EXACT = 'EXACT',
  PHRASE = 'PHRASE',
  NEAR_EXACT = 'NEAR_EXACT',
  NEAR_PHRASE = 'NEAR_PHRASE'
}

export enum Slot {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SEARCH_SIDE = 'SEARCH_SIDE',
  SEARCH_TOP = 'SEARCH_TOP',
  SEARCH_OTHER = 'SEARCH_OTHER',
  CONTENT = 'CONTENT',
  SEARCH_ABSOLUTE_TOP = 'SEARCH_ABSOLUTE_TOP'
}

// Rate limiting and caching interfaces
export interface RateLimitConfig {
  maxTokens: number;
  refillRate: number;
  tokensPerSecond?: number;
  windowMs: number;
  maxRequestsPerDay?: number;
  maxRequestsPerSecond?: number;
  bucketSize?: number;
}

export interface CacheConfig {
  ttl?: number;
  defaultTtl?: number;
  maxSize?: number;
  maxMemoryMB?: number;
  compressionEnabled?: boolean;
  compressionThreshold?: number;
  keyPattern?: string;
  redisUrl?: string;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  monitoringWindowMs: number;
  recoveryTimeout?: number;
}

// Client configuration interface
export interface GoogleAdsClientConfig extends GoogleAdsConfig {
  rateLimitConfig?: RateLimitConfig;
  cacheConfig?: CacheConfig;
  circuitBreakerConfig?: CircuitBreakerConfig;
  retryConfig?: {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
  };
}

// AdGroup and Ad Management
export interface AdGroup {
  resourceName: string;
  id: string;
  name: string;
  status: AdGroupStatus;
  type: AdGroupType;
  adRotationMode: AdGroupAdRotationMode;
  trackingUrlTemplate?: string;
  urlCustomParameters: CustomParameter[];
  campaign: string;
  cpcBidMicros?: number;
  cpmBidMicros?: number;
  targetCpaMicros?: number;
  cpvBidMicros?: number;
  targetCpmMicros?: number;
  targetRoas?: number;
  percentCpcBidMicros?: number;
  explorerAutoOptimizerSetting?: ExplorerAutoOptimizerSetting;
  displayCustomBidDimension?: DisplayCustomBidDimension;
  finalUrlSuffix?: string;
  targetingSettingDetails: TargetingSetting[];
  effectiveTargetCpaMicros?: number;
  effectiveTargetCpaSource: BiddingSource;
  effectiveTargetRoas?: number;
  effectiveTargetRoasSource: BiddingSource;
  labels: string[];
  excludedParentAssetFieldTypes: AssetFieldType[];
  excludedParentAssetSetTypes: AssetSetType[];
  adGroupTypeDetails?: AdGroupTypeDetails;
}

export enum AdGroupStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED'
}

export enum AdGroupType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  SEARCH_STANDARD = 'SEARCH_STANDARD',
  DISPLAY_STANDARD = 'DISPLAY_STANDARD',
  SHOPPING_PRODUCT_ADS = 'SHOPPING_PRODUCT_ADS',
  HOTEL_ADS = 'HOTEL_ADS',
  SHOPPING_SMART_ADS = 'SHOPPING_SMART_ADS',
  VIDEO_BUMPER = 'VIDEO_BUMPER',
  VIDEO_TRUE_VIEW_IN_STREAM = 'VIDEO_TRUE_VIEW_IN_STREAM',
  VIDEO_TRUE_VIEW_IN_DISPLAY = 'VIDEO_TRUE_VIEW_IN_DISPLAY',
  VIDEO_NON_SKIPPABLE_IN_STREAM = 'VIDEO_NON_SKIPPABLE_IN_STREAM',
  VIDEO_OUTSTREAM = 'VIDEO_OUTSTREAM',
  SEARCH_DYNAMIC_ADS = 'SEARCH_DYNAMIC_ADS',
  SHOPPING_COMPARISON_LISTING_ADS = 'SHOPPING_COMPARISON_LISTING_ADS',
  DISPLAY_SMART_CAMPAIGN = 'DISPLAY_SMART_CAMPAIGN',
  DISPLAY_GMAIL_AD = 'DISPLAY_GMAIL_AD',
  DISPLAY_UPLOAD_AD = 'DISPLAY_UPLOAD_AD',
  VIDEO_RESPONSIVE = 'VIDEO_RESPONSIVE',
  VIDEO_EFFICIENT_REACH = 'VIDEO_EFFICIENT_REACH',
  SMART_CAMPAIGN_ADS = 'SMART_CAMPAIGN_ADS'
}

export enum AdGroupAdRotationMode {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  OPTIMIZE = 'OPTIMIZE',
  ROTATE_FOREVER = 'ROTATE_FOREVER'
}

export interface AdGroupAd {
  resourceName: string;
  status: AdGroupAdStatus;
  adGroup: string;
  ad?: Ad;
  policyTopics: PolicyTopic[];
  adStrength: AdStrength;
  actionItems: string[];
  labels: string[];
}

export enum AdGroupAdStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED'
}

export interface Ad {
  id: string;
  finalUrls: string[];
  finalAppUrls: AppUrl[];
  finalMobileUrls: string[];
  trackingUrlTemplate?: string;
  finalUrlSuffix?: string;
  urlCustomParameters: CustomParameter[];
  urlCollections: UrlCollection[];
  displayUrl?: string;
  type: AdType;
  addedByGoogleAds: boolean;
  devicePreference: DeviceType;
  urlData?: UrlData;
  name?: string;
  systemManagedResourceSource: SystemManagedResourceSource;
  textAd?: TextAdInfo;
  expandedTextAd?: ExpandedTextAdInfo;
  callAd?: CallAdInfo;
  expandedDynamicSearchAd?: ExpandedDynamicSearchAdInfo;
  hotelAd?: HotelAdInfo;
  shoppingSmartAd?: ShoppingSmartAdInfo;
  shoppingProductAd?: ShoppingProductAdInfo;
  imageAd?: ImageAdInfo;
  videoAd?: VideoAdInfo;
  videoResponsiveAd?: VideoResponsiveAdInfo;
  responsiveSearchAd?: ResponsiveSearchAdInfo;
  legacyResponsiveDisplayAd?: LegacyResponsiveDisplayAdInfo;
  appAd?: AppAdInfo;
  legacyAppInstallAd?: LegacyAppInstallAdInfo;
  responsiveDisplayAd?: ResponsiveDisplayAdInfo;
  localAd?: LocalAdInfo;
  displayUploadAd?: DisplayUploadAdInfo;
  appEngagementAd?: AppEngagementAdInfo;
  shoppingComparisonListingAd?: ShoppingComparisonListingAdInfo;
  smartCampaignAd?: SmartCampaignAdInfo;
  callToActionAd?: CallToActionAdInfo;
  performanceMaxAd?: PerformanceMaxAdInfo;
}

export enum AdType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  TEXT_AD = 'TEXT_AD',
  EXPANDED_TEXT_AD = 'EXPANDED_TEXT_AD',
  EXPANDED_DYNAMIC_SEARCH_AD = 'EXPANDED_DYNAMIC_SEARCH_AD',
  HOTEL_AD = 'HOTEL_AD',
  SHOPPING_SMART_AD = 'SHOPPING_SMART_AD',
  SHOPPING_PRODUCT_AD = 'SHOPPING_PRODUCT_AD',
  VIDEO_AD = 'VIDEO_AD',
  IMAGE_AD = 'IMAGE_AD',
  RESPONSIVE_SEARCH_AD = 'RESPONSIVE_SEARCH_AD',
  LEGACY_RESPONSIVE_DISPLAY_AD = 'LEGACY_RESPONSIVE_DISPLAY_AD',
  APP_AD = 'APP_AD',
  LEGACY_APP_INSTALL_AD = 'LEGACY_APP_INSTALL_AD',
  RESPONSIVE_DISPLAY_AD = 'RESPONSIVE_DISPLAY_AD',
  LOCAL_AD = 'LOCAL_AD',
  HTML5_UPLOAD_AD = 'HTML5_UPLOAD_AD',
  DYNAMIC_HTML5_AD = 'DYNAMIC_HTML5_AD',
  APP_ENGAGEMENT_AD = 'APP_ENGAGEMENT_AD',
  SHOPPING_COMPARISON_LISTING_AD = 'SHOPPING_COMPARISON_LISTING_AD',
  VIDEO_BUMPER_AD = 'VIDEO_BUMPER_AD',
  VIDEO_NON_SKIPPABLE_INSTREAM_AD = 'VIDEO_NON_SKIPPABLE_INSTREAM_AD',
  VIDEO_OUTSTREAM_AD = 'VIDEO_OUTSTREAM_AD',
  VIDEO_TRUEVIEW_DISCOVERY_AD = 'VIDEO_TRUEVIEW_DISCOVERY_AD',
  VIDEO_TRUEVIEW_INSTREAM_AD = 'VIDEO_TRUEVIEW_INSTREAM_AD',
  VIDEO_RESPONSIVE_AD = 'VIDEO_RESPONSIVE_AD',
  SMART_CAMPAIGN_AD = 'SMART_CAMPAIGN_AD',
  CALL_AD = 'CALL_AD',
  APP_PRE_REGISTRATION_AD = 'APP_PRE_REGISTRATION_AD',
  IN_FEED_VIDEO_AD = 'IN_FEED_VIDEO_AD',
  VIDEO_EFFICIENT_REACH_AD = 'VIDEO_EFFICIENT_REACH_AD',
  PERFORMANCE_MAX_AD = 'PERFORMANCE_MAX_AD'
}

// Supporting interfaces for Ad types
export interface AppUrl {
  url?: string;
  osType: MobileAppVendor;
}

export interface UrlCollection {
  urlCollectionId?: string;
  finalUrls: string[];
  finalMobileUrls: string[];
  trackingUrlTemplate?: string;
}

export interface UrlData {
  urlCollections: UrlCollection[];
}

export interface PolicyTopic {
  resourceName: string;
  topicName?: string;
  type: PolicyTopicType;
  evidences: PolicyTopicEvidence[];
  constraints: PolicyTopicConstraint[];
}

export enum PolicyTopicType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PROHIBITED = 'PROHIBITED',
  LIMITED = 'LIMITED'
}

export interface PolicyTopicEvidence {
  websiteList?: PolicyTopicEvidenceWebsiteList;
  textList?: PolicyTopicEvidenceTextList;
  languageCode?: string;
  destinationTextList?: PolicyTopicEvidenceDestinationTextList;
  destinationMismatch?: PolicyTopicEvidenceDestinationMismatch;
  destinationNotWorking?: PolicyTopicEvidenceDestinationNotWorking;
  httpCode?: number;
}

export interface PolicyTopicEvidenceWebsiteList {
  websites: string[];
}

export interface PolicyTopicEvidenceTextList {
  texts: string[];
}

export interface PolicyTopicEvidenceDestinationTextList {
  destinationTexts: string[];
}

export interface PolicyTopicEvidenceDestinationMismatch {
  urlTypes: PolicyTopicEvidenceDestinationMismatchUrlType[];
}

export interface PolicyTopicEvidenceDestinationNotWorking {
  expandedUrl?: string;
  device: Device;
  lastCheckedDateTime: string;
  dnsErrorType: PolicyTopicEvidenceDestinationNotWorkingDnsErrorType;
  httpErrorCode?: number;
}

export enum PolicyTopicEvidenceDestinationMismatchUrlType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  DISPLAY_URL = 'DISPLAY_URL',
  FINAL_URL = 'FINAL_URL',
  FINAL_MOBILE_URL = 'FINAL_MOBILE_URL',
  TRACKING_URL = 'TRACKING_URL',
  MOBILE_TRACKING_URL = 'MOBILE_TRACKING_URL'
}

export enum PolicyTopicEvidenceDestinationNotWorkingDnsErrorType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  HOSTNAME_NOT_FOUND = 'HOSTNAME_NOT_FOUND',
  GOOGLE_CRAWLER_DNS_ISSUE = 'GOOGLE_CRAWLER_DNS_ISSUE'
}

export interface PolicyTopicConstraint {
  countryConstraintList?: PolicyTopicConstraintCountryConstraintList;
  resellerConstraint?: PolicyTopicConstraintResellerConstraint;
  certificateMissingInCountryList?: PolicyTopicConstraintCountryConstraintList;
  certificateDomainMismatchInCountryList?: PolicyTopicConstraintCountryConstraintList;
}

export interface PolicyTopicConstraintCountryConstraintList {
  totalTargetedCountries?: number;
  countries: GeoTargetConstant[];
}

export interface PolicyTopicConstraintResellerConstraint {
}

export interface GeoTargetConstant {
  resourceName: string;
  id?: number;
  name?: string;
  countryCode?: string;
  targetType?: string;
  status?: GeoTargetConstantStatus;
  canonicalName?: string;
  parentGeoTarget?: string;
}

export enum GeoTargetConstantStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ENABLED = 'ENABLED',
  REMOVAL_PLANNED = 'REMOVAL_PLANNED'
}

export enum AdStrength {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PENDING = 'PENDING',
  NO_ADS = 'NO_ADS',
  POOR = 'POOR',
  AVERAGE = 'AVERAGE',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT'
}

// Additional supporting enums
export interface ExplorerAutoOptimizerSetting {
  optIn: boolean;
}

export enum DisplayCustomBidDimension {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  KEYWORD = 'KEYWORD',
  AUDIENCE = 'AUDIENCE',
  TOPIC = 'TOPIC',
  GENDER = 'GENDER',
  AGE_RANGE = 'AGE_RANGE',
  PLACEMENT = 'PLACEMENT',
  PARENTAL_STATUS = 'PARENTAL_STATUS',
  INCOME_RANGE = 'INCOME_RANGE'
}

export enum BiddingSource {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  CAMPAIGN_BIDDING_STRATEGY = 'CAMPAIGN_BIDDING_STRATEGY',
  AD_GROUP = 'AD_GROUP',
  AD_GROUP_CRITERION = 'AD_GROUP_CRITERION'
}

export interface AdGroupTypeDetails {
  // This would contain specific details based on ad group type
}

export enum DeviceType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET'
}

export enum MobileAppVendor {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  APPLE_APP_STORE = 'APPLE_APP_STORE',
  GOOGLE_APP_STORE = 'GOOGLE_APP_STORE'
}

export enum SystemManagedResourceSource {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  AD_VARIATIONS = 'AD_VARIATIONS'
}

// Ad-specific interfaces (simplified versions - would need more detail in production)
export interface TextAdInfo {
  headline?: string;
  description1?: string;
  description2?: string;
}

export interface ExpandedTextAdInfo {
  headlinePart1?: string;
  headlinePart2?: string;
  headlinePart3?: string;
  description?: string;
  description2?: string;
  path1?: string;
  path2?: string;
}

export interface CallAdInfo {
  countryCode: string;
  phoneNumber: string;
  businessName: string;
  headline1: string;
  headline2: string;
  description1: string;
  description2: string;
  callTracked: boolean;
  disableCallConversion: boolean;
  phoneNumberVerificationUrl?: string;
  conversionAction?: string;
  conversionReportingState: CallConversionReportingState;
  path1?: string;
  path2?: string;
}

export enum CallConversionReportingState {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  DISABLED = 'DISABLED',
  USE_ACCOUNT_LEVEL_CALL_CONVERSION_ACTION = 'USE_ACCOUNT_LEVEL_CALL_CONVERSION_ACTION',
  USE_RESOURCE_LEVEL_CALL_CONVERSION_ACTION = 'USE_RESOURCE_LEVEL_CALL_CONVERSION_ACTION'
}

export interface ExpandedDynamicSearchAdInfo {
  description?: string;
  description2?: string;
}

export interface HotelAdInfo {
}

export interface ShoppingSmartAdInfo {
}

export interface ShoppingProductAdInfo {
}

export interface ImageAdInfo {
  pixelWidth?: number;
  pixelHeight?: number;
  imageUrl?: string;
  previewPixelWidth?: number;
  previewPixelHeight?: number;
  previewImageUrl?: string;
  mimeType?: MimeType;
  name?: string;
  imageAsset?: string;
}

export enum MimeType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  IMAGE_JPEG = 'IMAGE_JPEG',
  IMAGE_GIF = 'IMAGE_GIF',
  IMAGE_PNG = 'IMAGE_PNG',
  FLASH = 'FLASH',
  TEXT_HTML = 'TEXT_HTML',
  PDF = 'PDF',
  MSWORD = 'MSWORD',
  MSEXCEL = 'MSEXCEL',
  RTF = 'RTF',
  AUDIO_WAV = 'AUDIO_WAV',
  AUDIO_MP3 = 'AUDIO_MP3',
  HTML5_AD_ZIP = 'HTML5_AD_ZIP'
}

export interface VideoAdInfo {
  videoAsset?: string;
  inStreamAdInfo?: InStreamAdInfo;
  bumperAdInfo?: BumperAdInfo;
  outStreamAdInfo?: OutStreamAdInfo;
  nonSkippableAdInfo?: NonSkippableAdInfo;
  videoTrueViewInStreamAdInfo?: VideoTrueViewInStreamAdInfo;
  videoTrueViewDiscoveryAdInfo?: VideoTrueViewDiscoveryAdInfo;
}

export interface InStreamAdInfo {
  companionBanner?: ImageAdInfo;
  actionButtonLabel?: string;
  actionHeadline?: string;
}

export interface BumperAdInfo {
  companionBanner?: ImageAdInfo;
}

export interface OutStreamAdInfo {
  headline?: string;
  description?: string;
}

export interface NonSkippableAdInfo {
  companionBanner?: ImageAdInfo;
  actionButtonLabel?: string;
  actionHeadline?: string;
}

export interface VideoTrueViewInStreamAdInfo {
  actionButtonLabel?: string;
  actionHeadline?: string;
  companionBanner?: ImageAdInfo;
}

export interface VideoTrueViewDiscoveryAdInfo {
  headline?: string;
  description1?: string;
  description2?: string;
}

export interface VideoResponsiveAdInfo {
  headlines: AdTextAsset[];
  longHeadlines: AdTextAsset[];
  descriptions: AdTextAsset[];
  callToActions: AdTextAsset[];
  videos: AdVideoAsset[];
  companionBanners: AdImageAsset[];
}

export interface ResponsiveSearchAdInfo {
  headlines: AdTextAsset[];
  descriptions: AdTextAsset[];
  path1?: string;
  path2?: string;
}

export interface LegacyResponsiveDisplayAdInfo {
  shortHeadline?: string;
  longHeadline?: string;
  description?: string;
  businessName?: string;
  allowFlexibleColor?: boolean;
  accentColor?: string;
  mainColor?: string;
  callToActionText?: string;
  logoImage?: string;
  squareLogoImage?: string;
  marketingImage?: string;
  squareMarketingImage?: string;
  formatSetting?: DisplayAdFormatSetting;
  pricePrefix?: string;
  promoText?: string;
}

export interface AppAdInfo {
  mandatoryAdText?: AdTextAsset;
  headlines: AdTextAsset[];
  descriptions: AdTextAsset[];
  images: AdImageAsset[];
  youtubeVideos: AdVideoAsset[];
  html5MediaBundles: AdMediaBundleAsset[];
}

export interface LegacyAppInstallAdInfo {
  appId?: string;
  appStore: LegacyAppInstallAdAppStore;
  headline?: string;
  description1?: string;
  description2?: string;
}

export enum LegacyAppInstallAdAppStore {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  APPLE_APP_STORE = 'APPLE_APP_STORE',
  GOOGLE_PLAY = 'GOOGLE_PLAY'
}

export interface ResponsiveDisplayAdInfo {
  marketingImages: AdImageAsset[];
  squareMarketingImages: AdImageAsset[];
  logoImages: AdImageAsset[];
  squareLogoImages: AdImageAsset[];
  headlines: AdTextAsset[];
  longHeadline?: AdTextAsset;
  descriptions: AdTextAsset[];
  youtubeVideos: AdVideoAsset[];
  businessName?: string;
  mainColor?: string;
  accentColor?: string;
  allowFlexibleColor?: boolean;
  callToActionText?: string;
  pricePrefix?: string;
  promoText?: string;
  formatSetting?: DisplayAdFormatSetting;
  controlSpec?: ControlSpec;
}

export interface LocalAdInfo {
  headlines: AdTextAsset[];
  descriptions: AdTextAsset[];
  callToActions: AdTextAsset[];
  marketingImages: AdImageAsset[];
  logoImages: AdImageAsset[];
  videos: AdVideoAsset[];
  path1?: string;
  path2?: string;
}

export interface DisplayUploadAdInfo {
  displayUploadProductType?: DisplayUploadProductType;
  mediaBundle?: AdMediaBundleAsset;
}

export enum DisplayUploadProductType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  HTML5_UPLOAD_AD = 'HTML5_UPLOAD_AD',
  DYNAMIC_HTML5_EDUCATION_AD = 'DYNAMIC_HTML5_EDUCATION_AD',
  DYNAMIC_HTML5_FLIGHT_AD = 'DYNAMIC_HTML5_FLIGHT_AD',
  DYNAMIC_HTML5_HOTEL_RENTAL_AD = 'DYNAMIC_HTML5_HOTEL_RENTAL_AD',
  DYNAMIC_HTML5_JOB_AD = 'DYNAMIC_HTML5_JOB_AD',
  DYNAMIC_HTML5_LOCAL_AD = 'DYNAMIC_HTML5_LOCAL_AD',
  DYNAMIC_HTML5_REAL_ESTATE_AD = 'DYNAMIC_HTML5_REAL_ESTATE_AD',
  DYNAMIC_HTML5_CUSTOM_AD = 'DYNAMIC_HTML5_CUSTOM_AD',
  DYNAMIC_HTML5_TRAVEL_AD = 'DYNAMIC_HTML5_TRAVEL_AD',
  DYNAMIC_HTML5_HOTEL_AD = 'DYNAMIC_HTML5_HOTEL_AD'
}

export interface AppEngagementAdInfo {
  headlines: AdTextAsset[];
  descriptions: AdTextAsset[];
  images: AdImageAsset[];
  videos: AdVideoAsset[];
}

export interface ShoppingComparisonListingAdInfo {
  headline?: string;
}

export interface SmartCampaignAdInfo {
  headlines: AdTextAsset[];
  descriptions: AdTextAsset[];
}

export interface CallToActionAdInfo {
  businessName?: string;
  imageAsset?: string;
  color?: string;
  callToActionAsset?: string;
}

export interface PerformanceMaxAdInfo {
}

// Asset-related interfaces
export interface AdTextAsset {
  text?: string;
  pinnedField?: ServedAssetFieldType;
}

export interface AdImageAsset {
  asset?: string;
  pinnedField?: ServedAssetFieldType;
}

export interface AdVideoAsset {
  asset?: string;
  pinnedField?: ServedAssetFieldType;
}

export interface AdMediaBundleAsset {
  asset?: string;
}

export enum ServedAssetFieldType {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  HEADLINE_1 = 'HEADLINE_1',
  HEADLINE_2 = 'HEADLINE_2',
  HEADLINE_3 = 'HEADLINE_3',
  DESCRIPTION_1 = 'DESCRIPTION_1',
  DESCRIPTION_2 = 'DESCRIPTION_2'
}

export enum DisplayAdFormatSetting {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  ALL_FORMATS = 'ALL_FORMATS',
  NON_NATIVE = 'NON_NATIVE',
  NATIVE = 'NATIVE'
}

export interface ControlSpec {
  enableAssetEnhancements?: boolean;
  enableAutogenVideoAssets?: boolean;
}

// Response wrapper interface
export interface GoogleAdsApiResponse<T = any> {
  data: T;
  requestId?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: Date;
  };
  cached?: boolean;
  executionTime: number;
}
