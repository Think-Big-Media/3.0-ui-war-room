# War Room UI Style Guide

This document defines the comprehensive styling standards for the War Room application, established through iterative refinement of the monitoring components and extended site-wide.

## Typography Hierarchy (2025 Update)

### Refined Font Stack - War Room 2025

- **Major Section Headers**: Barlow Condensed 600 (Campaign Operations, Quick Actions, Intelligence Dashboard)
- **Numbers & Metrics**: Barlow Condensed 400 (dollars, percentages, counts, statistics)
- **Content Titles**: Barlow Semi-Condensed Bold (Crisis Response Protocol, Alert Response)
- **Content Subtitles**: Barlow Semi-Condensed (Active crisis detections, Meta + Google Ads)
- **Status Indicators**: JetBrains Mono Uppercase (Live, Active, Ready, Today)
- **Footer Text**: JetBrains Mono Uppercase (Last updated, Quick access to key features)

### Configuration

```javascript
// tailwind.config.js
fontFamily: {
  'sans': ['Barlow', 'system-ui', 'sans-serif'], // Body content
  'condensed': ['Barlow Condensed', 'system-ui', 'sans-serif'], // Headers
  'semi-condensed': ['Barlow Semi Condensed', 'system-ui', 'sans-serif'], // Numbers
  'mono': ['JetBrains Mono', 'monospace'], // Technical labels
}
```

### Site-wide Typography Classes

```css
/* src/index.css */

/* Section Header - Major headings across the site */
.section-header {
  @apply text-white/50 uppercase;
  font:
    600 20px/29px 'Barlow Condensed',
    sans-serif;
}

/* Content Typography Classes */
.content-subtitle {
  @apply text-white/50;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  line-height: 17px;
  margin-top: 6px;
}

@media (min-width: 1024px) {
  .content-subtitle {
    font-size: 15px;
    line-height: 19px;
  }
}

.content-title {
  @apply font-bold text-white/95;
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 15px;
  line-height: 19px;
}

@media (min-width: 1024px) {
  .content-title {
    font-size: 17px;
    line-height: 21px;
  }
}
  line-height: 16px;
}

.status-indicator {
  @apply text-xs font-mono uppercase;
  font-family: 'JetBrains Mono', monospace;
}

/* Footer text - always uppercase JetBrains Mono */
.footer-text {
  @apply text-xs font-mono uppercase;
  font-family: 'JetBrains Mono', monospace;
}

/* Color-coded status indicators */
.status-active {
  @apply text-green-400;
}

.status-running {
  @apply text-blue-400;
}

.status-planning {
  @apply text-yellow-400;
}
```

### Typography Usage Examples

```tsx
// Major section headers
<h3 className="section-header">
  Campaign Operations
</h3>

// Content subtitles (descriptions, metadata)
<p className="content-subtitle">
  Active crisis detections
</p>

// Content titles (project names, template names)
<h5 className="content-title">
  Crisis Response Protocol
</h5>

// Status indicators with semantic colors
<span className="status-indicator status-active">Live</span>
<span className="status-indicator status-running">Today</span>
<span className="status-indicator status-planning">Next Week</span>

// Footer text
<span className="footer-text text-white/75">Last updated</span>
<span className="footer-text text-white/90">30 seconds ago</span>
```

## Sub-header Styling Standards

### Primary Rules

- **Case**: ALL UPPERCASE for secondary text and metadata
- **Opacity**: 40% (`text-white/40`)
- **Font**: Barlow Condensed (`font-condensed`)
- **Spacing**: Wide letter spacing (`tracking-wide`)
- **Size**: One point larger than default for category

### Text Rendering Optimization

```css
style={{
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  fontKerning: 'normal',
  textSizeAdjust: '100%',
}}
```

### Indentation Rules

- **With boxes below**: `ml-2` (8px) or `ml-4` (16px) for sub-headers
- **Without boxes**: No left margin

### Examples

```tsx
// Standard sub-header
<h3 className="text-xl font-semibold text-white/40 mb-4 font-condensed tracking-wide ml-2">
  TRENDING TOPICS (Issue Spike Detector)
</h3>

// Secondary metadata
<span className="text-white/70 text-sm font-mono uppercase">
  LAST UPDATED: 30 seconds ago
</span>
```

## Secondary Button System

### Button Variants

Three standardized secondary button types with specific use cases:

#### Alert Buttons (`.btn-secondary-alert`)

- **Use**: Urgent actions, critical responses
- **Color**: Red theme (`bg-red-500/20 hover:bg-red-500/30 text-red-400`)

#### Action Buttons (`.btn-secondary-action`)

- **Use**: Primary interactive actions
- **Color**: Blue theme (`bg-blue-500/20 hover:bg-blue-500/30 text-blue-400`)

#### Neutral Buttons (`.btn-secondary-neutral`)

- **Use**: Secondary actions, supplementary functions
- **Color**: Neutral theme (`bg-white/10 hover:bg-white/20 text-white/80`)

### Button Specifications

```css
/* src/index.css */
.btn-secondary-alert {
  @apply bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-0.5 rounded-lg transition-colors font-mono text-sm uppercase whitespace-nowrap;
  letter-spacing: -0.05em; /* Halved spacing for multi-word buttons */
}

.btn-secondary-action {
  @apply bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-0.5 rounded-lg transition-colors font-mono text-sm uppercase whitespace-nowrap;
  letter-spacing: -0.05em;
}

.btn-secondary-neutral {
  @apply bg-white/10 hover:bg-white/20 text-white/80 px-3 py-0.5 rounded-lg transition-colors font-mono text-sm uppercase whitespace-nowrap;
  letter-spacing: -0.05em;
}
```

### Key Features

- **Height**: Reduced by 10% (`py-0.5` instead of `py-1`)
- **Letter Spacing**: Halved (`letter-spacing: -0.05em`)
- **Font**: Monospace (`font-mono`)
- **Case**: UPPERCASE
- **Wrap**: Prevent wrapping (`whitespace-nowrap`)

## Spacing Standards

### Site-wide Grid Standardization

**CRITICAL RULE**: All page-level grids must use **consistent 16px spacing** to match Live Monitoring:

- **Grid gaps**: `gap-4` (16px) - NO responsive variations
- **Component spacing**: `mb-4` (16px) between major sections
- **Interior grids**: `gap-4` (16px) consistent across all components

### Examples of Correct Implementation

```tsx
/* ✅ CORRECT - Dashboard grids */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

/* ✅ CORRECT - Live Monitoring reference */
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="space-y-4">

/* ❌ INCORRECT - Inconsistent spacing */
<div className="gap-3 lg:gap-4 mb-4 lg:mb-5">  /* Responsive variations */
<div className="gap-6 mb-8">                   /* Excessive spacing */
```

### Component Interior Spacing

- **Interior box padding**: Increased (`p-5`, `p-6`)
- **Gaps between interior boxes**: Reduced (`space-y-3`, `gap-3`)
- **Exterior container padding**: Standard (`p-4`, `p-5`)
- **Exterior container gaps**: **STANDARDIZED** (`gap-4`, `mb-4`)

### Sub-navigation Tab Standards

**CRITICAL RULE**: Sub-navigation tabs must be smaller than primary navigation to create proper hierarchy:

- **Primary Navigation**: `px-3 py-2 text-sm` (larger)
- **Sub-navigation Tabs**: `px-3 py-1.5 text-sm` (smaller - reduced vertical padding)

### Examples of Correct Implementation

```tsx
/* ✅ CORRECT - Sub-navigation tabs */
<button className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg">
  Strategic Projects
</button>

/* ❌ INCORRECT - Same size as primary navigation */
<button className="flex items-center space-x-2 px-4 py-2 rounded-lg">
  Strategic Projects
</button>
```

**Reference implementations:**

- ✅ Intelligence Hub tabs
- ✅ Alert Center tabs
- ✅ War Room tabs (fixed)

### Content to Button Spacing

- **Standard**: `mt-4` (16px) between content and secondary buttons
- **Applied consistently** across all components with secondary buttons

### Monitoring Controls Specific

- **Right padding**: 50% increase (`pr-6`) for metadata alignment
- **Metadata spacing**: Increased horizontal gaps (`space-x-6`)

### Stacked Components

- **Alert to monitoring bar**: Reduced margin (`mb-2` instead of `mb-4`)

## Scroll Effects

### CSS Mask-based Fade System

```css
/* src/index.css */
.scroll-fade {
  mask: linear-gradient(
    180deg,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    180deg,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.scroll-fade-glass {
  mask: linear-gradient(
    180deg,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    180deg,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
}

.scroll-fade-subtle {
  mask: linear-gradient(
    180deg,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    180deg,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}
```

### Application

- Apply to scrollable containers to eliminate harsh cutoffs
- Use `.scroll-fade` for standard fade
- Use `.scroll-fade-glass` for glass-effect containers
- Use `.scroll-fade-subtle` for minimal fade effect

## Z-Index Management

### Dropdown System

- **Implementation**: React Portals for all dropdowns
- **Container z-index**: `z-[99998]`
- **Dropdown menu z-index**: `z-[99999]`
- **Render target**: `document.body`

### Example Implementation

```tsx
{
  typeof document !== 'undefined' &&
    createPortal(
      <motion.div
        className="fixed z-[99999] bg-black/[0.97] backdrop-blur-md rounded"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 99999,
        }}
      >
        {/* Dropdown content */}
      </motion.div>,
      document.body
    );
}
```

## Secondary Text Rules

### Metadata vs Content Classification

- **Metadata** (make UPPERCASE):
  - Timestamps ("LAST UPDATED: 30 seconds ago")
  - Counts ("TOTAL MENTIONS: 12,847")
  - Stats ("INFLUENCE: 72", "ENG: 45%")
  - Technical labels ("FOLLOWERS", "REACH")
  - Time references ("LAST 24h")

- **Content** (keep lowercase):
  - Alert messages ("Negative mentions about crime policy...")
  - User-generated content
  - Descriptions and narrative text
  - Names and proper nouns

### Styling Application

```tsx
// Metadata - UPPERCASE
<span className="text-white/70 text-sm font-mono uppercase">
  TOTAL MENTIONS: {totalMentions.toLocaleString()}
</span>

// Content - lowercase
<span className="text-white/90 font-mono">
  {message}
</span>
```

## Component-Specific Applications

### Monitoring Components

- **MentionsStream**: Content in `<p>` tags, metadata in `<span>` with `font-mono uppercase`
- **TrendingTopics**: Keywords as content, stats as metadata
- **InfluencerTracker**: Usernames as content, follower counts and metrics as metadata
- **PlatformPerformance**: Platform insights as metadata
- **MonitoringControls**: All status indicators as metadata

### Alert Components

- **Alert titles**: UPPERCASE as they're categorical labels
- **Alert content**: lowercase as they're descriptive messages
- **Action buttons**: UPPERCASE as they're technical controls

## Implementation Checklist

When applying these standards to new components:

### Typography

- [ ] Font hierarchy properly applied (Inter/Barlow Condensed/JetBrains Mono)
- [ ] Sub-headers use condensed font with proper opacity and spacing
- [ ] Text rendering optimizations applied where needed

### Buttons

- [ ] Secondary buttons use appropriate variant class
- [ ] Button heights and letter spacing follow standards
- [ ] UPPERCASE and monospace font applied

### Spacing

- [ ] Content to button spacing is `mt-4`
- [ ] Interior and exterior spacing follows established patterns
- [ ] Component-specific spacing rules applied

### Effects

- [ ] Scroll fades applied to scrollable containers
- [ ] Z-index management uses Portal system for dropdowns

### Text Classification

- [ ] Metadata text is UPPERCASE with mono font
- [ ] Content text remains lowercase with appropriate font
- [ ] Proper opacity levels applied (40% for sub-headers, 70% for metadata)

## Settings Item Component Pattern

### Standard Layout for Toggle Settings

All settings page toggle items (notifications, security, appearance, privacy) use a consistent layout pattern:

```tsx
<div className="flex items-start justify-between">
  <div className="flex items-start space-x-3 ml-2.5">
    <Icon className="w-5 h-5 text-white/75" />
    <div className="ml-1.5">
      <p className="content-title">Setting Name</p>
      <p className="content-subtitle">Setting description</p>
    </div>
  </div>
  <div className="mt-1">
    <ToggleSwitch />
  </div>
</div>
```

### Implementation Rules

- **Typography**:
  - Main text uses `.content-title` (Barlow Semi-Condensed Bold, 15px/17px desktop, 95% opacity)
  - Descriptions use `.content-subtitle` (Barlow Condensed, 50% opacity, 8px top margin for proper spacing)
- **Icon Spacing**: Container uses `ml-2.5` (10px), text container uses `ml-1.5` (6px)
- **Icon Styling**: `w-5 h-5` size, `text-white/75` color, aligned with title text (no mt-0.5)
- **Toggle Alignment**: `mt-1` for vertical alignment with text
- **Icon Selection**: Use semantic icons (Mail for email, Shield for security, Moon for dark mode, etc.)

### Applied To

- Email Notifications, Push Notifications, Auto-Publish Content
- Two-Factor Authentication, Dark Mode, Data Sharing
- Any future toggle-based settings items

## Single-Column Card Content Indentation

### Standard for Right-Hand Side Components

Single-column cards (like Sentiment Breakdown, Platform Performance, Influencer Tracker) require consistent content indentation to align with the overall visual grid.

#### Implementation

```tsx
// Apply to headers and content containers within single-column cards
<h3 className="text-xl font-semibold text-white/40 mb-4 font-condensed tracking-wide ml-1.5">
  COMPONENT TITLE
</h3>
<div className="space-y-3 px-1.5">
  {/* Content items */}
</div>

// For insights boxes and sub-containers (less indented)
<div className="mt-4 mx-1 p-3 bg-black/20 rounded-lg">
  {/* Insights content */}
</div>
```

#### Measurements

- **Header Indentation**: `ml-1.5` (6px left margin)
- **Content Indentation**: `px-1.5` (6px horizontal padding)
- **Rounded Elements**: `mx-1` (4px horizontal margin)
- **Card Outer Padding**: `p-4` (16px) via Card component
- **Total Content Offset**: 22px from card edge

#### Visual Alignment

This creates proper visual hierarchy where:

- Multi-column components (left side) have natural content flow
- Single-column components (right side) have indented content that aligns with grid guidelines
- All percentages and data points align consistently

#### Examples

```tsx
// Sentiment Breakdown
<Card padding="md" variant="glass">
  <h3 className="text-xl font-semibold text-white/40 mb-4 font-condensed tracking-wide ml-1.5">
    SENTIMENT BREAKDOWN
  </h3>
  <div className="space-y-4 px-1.5">
    {/* Sentiment items with proper indentation */}
  </div>
</Card>

// Platform Performance
<Card padding="md" variant="glass">
  <h3 className="text-xl font-semibold text-white/40 mb-4 font-condensed tracking-wide ml-1.5">
    PLATFORM PERFORMANCE
  </h3>
  <div className="space-y-3 px-1.5">
    {/* Platform items with proper indentation */}
  </div>
  <div className="mt-4 mx-1 p-3 bg-black/20 rounded-lg">
    {/* Insights with subtle indentation */}
  </div>
</Card>
```

#### Application Rules

- **Single-column card headers**: Apply `ml-1.5` for consistent header indentation
- **Single-column card content**: Apply `px-1.5` to main content container
- **Multi-column cards**: Use natural grid alignment without forced indentation
- **Rounded sub-containers**: Use `mx-1` for subtle horizontal margin (buttons, insights boxes)
- **Visual Balance**: Headers and content align consistently, rounded elements slightly less indented

## Site-wide Implementation Status

### ✅ **Components Updated with Style Guide:**

- **Alert Center**: Subheaders, spacing (gap-4), label positioning
- **Settings Page**: All typography updated to content-title/content-subtitle classes, consistent toggle layout with icons (Dark Mode, Data Sharing), form labels standardized
- **Intelligence Hub**: Dropdown replaced with CustomDropdown, label positioning
- **Dashboard**: Grid spacing updated to gap-4
- **Monitoring Components**: Reference implementation (SentimentBreakdown, PlatformPerformance, InfluencerTracker)
- **Campaign Control**: ActivityFeed indentation and spacing

### 📋 **Standards Applied Consistently:**

- **Grid Spacing**: All page-level grids use `gap-4` to match Live Monitoring
- **Label Positioning**: All form labels use `mb-1 ml-1.5` (5px indent, 4px from field)
- **Toggle Switch Labels**: All use `ml-1.5` indentation to match form labels
- **Subheaders**: All section headers use Barlow Condensed with 40% opacity and UPPERCASE
- **Dropdown Components**: CustomDropdown used consistently across all pages
- **Content Indentation**: Single-column cards use `px-1.5` for content, `ml-1.5` for headers

### 🎯 **Design System Compliance:**

- **Typography Hierarchy**: Inter, Barlow Condensed, JetBrains Mono properly applied
- **Button System**: Secondary button variants used consistently
- **Spacing Standards**: 4px gap for grids, 4px spacing for component stacks
- **Label Standards**: No trailing colons, proper indentation, consistent spacing

This style guide ensures consistent visual hierarchy and user experience across the entire War Room application.
