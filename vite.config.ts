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
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@reduxjs/toolkit', 'react-redux', 'react-hook-form'],
            'charts-vendor': ['recharts', 'd3-scale'],
            'maps-vendor': ['react-simple-maps'],
            'dnd-vendor': ['react-beautiful-dnd'],
            'analytics-vendor': ['posthog-js'],
            'builder-vendor': ['@builder.io/react', '@builder.io/sdk'],
            'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge', 'yup'],
            'icons-vendor': ['lucide-react']
          }
        }
      },
      // Enable source maps for production debugging
      sourcemap: mode === 'production' ? false : true,
      // Use esbuild for minification (faster than terser)
      minify: mode === 'production' ? 'esbuild' : false,
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
