import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '')
  
  return {
    plugins: [
      react(),
      // Bundle analyzer - only in production with analyze flag
      env.ANALYZE && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // IMPORTANT: Never use process.env in define section - it breaks browser builds!
    // Vite automatically handles VITE_ prefixed env vars via import.meta.env
    // No define section needed for env vars
    build: {
      // Bundle size optimization
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Aggressive code splitting for better caching and smaller chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('@reduxjs') || id.includes('react-redux')) {
                return 'state-vendor';
              }
              if (id.includes('recharts') || id.includes('d3')) {
                return 'charts-vendor';
              }
              if (id.includes('lucide-react')) {
                return 'icons-vendor';
              }
              if (id.includes('@builder.io')) {
                return 'builder-vendor';
              }
              if (id.includes('posthog')) {
                return 'analytics-vendor';
              }
              if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'utils-vendor';
              }
              // All other node_modules in a shared vendor chunk
              return 'vendor';
            }
            // Split each page into its own chunk
            if (id.includes('src/pages/')) {
              const pageName = id.split('/pages/')[1].split('.')[0];
              return `page-${pageName.toLowerCase()}`;
            }
          },
          // Optimize chunk names for production
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `assets/${facadeModuleId}-[hash].js`;
          }
        },
        // External dependencies that should not be bundled
        external: [],
        // Tree-shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        }
      },
      // Disable source maps in production for smaller bundle
      sourcemap: false,
      // Use esbuild for faster minification
      minify: 'esbuild',
      // Target modern browsers for smaller output
      target: 'es2020',
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Compress assets
      assetsInlineLimit: 4096,
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
      open: false, // Disable auto-browser opening in headless environments
      host: true, // Listen on all addresses
      watch: {
        // Exclude directories that shouldn't be watched to prevent ENOSPC errors
        ignored: [
          '**/src/backend/**',
          '**/venv/**',
          '**/.venv/**',
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/__pycache__/**',
          '**/*.pyc',
          '**/env/**',
          '**/migrations/**',
          '**/logs/**',
          '**/tmp/**',
          '**/temp/**'
        ]
      }
    },
  }
})
