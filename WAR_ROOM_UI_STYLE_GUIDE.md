# War Room UI Style Guide

This document defines the comprehensive styling standards for the War Room application, established through iterative refinement of the monitoring components and extended site-wide.

## Typography Hierarchy

### Font Stack
- **Content Text**: Inter (primary sans-serif)
- **Sub-headers**: Barlow Condensed (condensed display font)
- **Technical Labels & Action Buttons**: JetBrains Mono (monospace)

### Configuration
```javascript
// tailwind.config.js
fontFamily: {
  'sans': ['Inter', 'system-ui', 'sans-serif'], // Primary content
  'condensed': ['Barlow Condensed', 'system-ui', 'sans-serif'], // Sub-headers
  'mono': ['JetBrains Mono', 'monospace'], // Technical elements
}
```

### Google Fonts Import
```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
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

### Content to Button Spacing
- **Standard**: `mt-4` (16px) between content and secondary buttons
- **Applied consistently** across all components with secondary buttons

### Component Interior Spacing
- **Interior box padding**: Increased (`p-5`, `p-6`)
- **Gaps between interior boxes**: Reduced (`space-y-3`, `gap-3`)
- **Exterior container padding**: Standard (`p-4`, `p-5`)
- **Exterior container gaps**: Standard (`gap-4`, `space-y-4`)

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
  mask: linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask: linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%);
}

.scroll-fade-glass {
  mask: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
}

.scroll-fade-subtle {
  mask: linear-gradient(180deg, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask: linear-gradient(180deg, transparent 0%, black 5%, black 95%, transparent 100%);
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
{typeof document !== 'undefined' && createPortal(
  <motion.div
    className="fixed z-[99999] bg-black/[0.97] backdrop-blur-md rounded"
    style={{
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      width: dropdownPosition.width,
      zIndex: 99999
    }}
  >
    {/* Dropdown content */}
  </motion.div>,
  document.body
)}
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

This style guide ensures consistent visual hierarchy and user experience across the entire War Room application.
