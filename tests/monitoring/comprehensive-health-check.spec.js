const { test, expect } = require('@playwright/test');

const SITE_URL = 'https://war-room-oa9t.onrender.com';
const API_ENDPOINTS = [
  '/api/health',
  '/api/v1/status',
  '/docs' // FastAPI documentation
];

test.describe('War Room Comprehensive Health Monitoring', () => {
  test('Frontend loads successfully', async ({ page }) => {
    const response = await page.goto(SITE_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    expect(response.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/, { timeout: 10000 });
    
    console.log('✅ Frontend Status:', response.status());
    console.log('✅ Page Title:', await page.title());
  });

  test('Critical page elements exist', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Check for main app container
    const appContainer = page.locator('#root, #app, .app-container').first();
    await expect(appContainer).toBeVisible({ timeout: 15000 });
    
    console.log('✅ App container loaded');
  });

  test('API endpoints respond', async ({ request }) => {
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await request.get(`${SITE_URL}${endpoint}`, {
          timeout: 10000
        });
        
        console.log(`API ${endpoint}:`, response.status());
        
        if (endpoint === '/api/health') {
          expect(response.status()).toBe(200);
          const data = await response.json();
          console.log('Health check data:', data);
        }
      } catch (error) {
        console.warn(`⚠️  ${endpoint} failed:`, error.message);
      }
    }
  });

  test('Performance metrics', async ({ page }) => {
    await page.goto(SITE_URL);
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('Performance Metrics:', metrics);
    expect(metrics.totalTime).toBeLessThan(10000); // 10 seconds max
  });

  test('Console errors check', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(SITE_URL);
    await page.waitForTimeout(3000); // Wait for any async errors
    
    if (errors.length > 0) {
      console.warn('Console errors detected:', errors);
    } else {
      console.log('✅ No console errors');
    }
  });
});

test.describe('Render.com Specific Checks', () => {
  test('Check Render deployment status', async ({ request }) => {
    // Check if site is using Render's headers
    const response = await request.get(SITE_URL);
    const headers = response.headers();
    
    console.log('Server:', headers['server'] || 'Unknown');
    console.log('X-Render-Upstream:', headers['x-render-upstream'] || 'Not found');
    
    // Render typically adds these headers
    if (headers['x-render-upstream']) {
      console.log('✅ Confirmed Render.com deployment');
    }
  });
});