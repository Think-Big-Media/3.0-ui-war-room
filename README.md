Fix QuickActions.tsx duplicate style attributes
src/pages/QuickActions.tsx
Open In Editor
        style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
        style={{ boxShadow: perfectCardShadow }}>
        style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
        style={{ boxShadow: perfectCardShadow }}>
        style={{ border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: perfectCardShadow }}>

Remove duplicate style and simplify QuickActions header
src/pages/QuickActions.tsx
Open In Editor
              className="text-xl lg:text-2xl font-semibold text-white/70 tracking-wide"
              style={{ font: "600 20px/33px Barlow Semi Condensed, sans-serif" }}
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                fontKerning: 'normal',
                textSizeAdjust: '100%',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased'
              }}>
              className="text-xl lg:text-2xl font-semibold text-white/70 tracking-wide"
              style={{ font: "600 20px/33px Barlow Semi Condensed, sans-serif" }}
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                fontKerning: 'normal',
                textSizeAdjust: '100%',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased'
              }}>
              className="text-xl lg:text-2xl section-header tracking-wide">

Fix SentimentBreakdown.tsx duplicate keys  
src/components/monitoring/SentimentBreakdown.tsx
Open In Editor
            style={{
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              fontKerning: 'normal',
              textSizeAdjust: '100%',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}>
            style={{
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              fontKerning: 'normal',
              textSizeAdjust: '100%',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}>
            className="text-xs lg:text-sm text-white/75">

Fix ActivityFeed.tsx duplicate keys
src/components/campaign-control/ActivityFeed.tsx
Open In Editor
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                fontKerning: 'normal',
                textSizeAdjust: '100%',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased'
              }}>
              style={{
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                fontKerning: 'normal',
                textSizeAdjust: '100%',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased'
              }}>
              className="text-xs lg:text-sm text-white/75">

