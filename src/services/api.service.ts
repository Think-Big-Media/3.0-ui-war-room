/**
 * War Room API Service
 * Central configuration for backend API connection
 * Following FRONTEND-CONNECTION-GUIDE.md specifications
 */

// Get API base URL from environment or fallback to localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

// Check if we're in mock mode
const USE_MOCK = localStorage.getItem('VITE_USE_MOCK_DATA') === 'true' || 
                 import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * API Service Configuration
 */
export const apiService = {
  // Base URLs
  baseUrl: API_BASE,
  wsUrl: WS_BASE,
  
  // Mode
  isMockMode: USE_MOCK,
  
  // Helper method to construct full API URLs
  url: (endpoint: string) => `${API_BASE}${endpoint}`,
  
  // Helper method to construct WebSocket URLs
  wsUrl: (endpoint: string) => `${WS_BASE}${endpoint}`,
  
  // Common headers
  headers: () => ({
    'Content-Type': 'application/json',
    ...(localStorage.getItem('auth_token') && {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    })
  }),
  
  // Request helper with error handling
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK) {
      console.log(`[MOCK MODE] Would call: ${endpoint}`);
      // Return mock data handling
      return Promise.resolve({} as T);
    }
    
    try {
      const response = await fetch(this.url(endpoint), {
        ...options,
        headers: {
          ...this.headers(),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  },
  
  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },
  
  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
  
  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(this.url('/health'), { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  },
  
  // Test endpoints from the guide
  testEndpoints: {
    health: '/health',
    monitoring: '/api/v1/monitoring/mentions',
    chat: '/api/v1/chat',
    campaigns: '/api/v1/campaigns',
    alerts: '/api/v1/alerts',
  }
};

// Export for use in components
export default apiService;

// Development helper to test connection
if (import.meta.env.DEV) {
  (window as any).__testBackendConnection = async () => {
    console.log('Testing backend connection...');
    console.log(`API Base URL: ${API_BASE}`);
    console.log(`WebSocket URL: ${WS_BASE}`);
    console.log(`Mock Mode: ${USE_MOCK}`);
    
    if (!USE_MOCK) {
      const isHealthy = await apiService.checkHealth();
      console.log(`Backend Health Check: ${isHealthy ? '✅ Connected' : '❌ Failed'}`);
      
      if (isHealthy) {
        try {
          const mentions = await apiService.get('/api/v1/monitoring/mentions');
          console.log('Monitoring API Test: ✅ Success', mentions);
        } catch (error) {
          console.log('Monitoring API Test: ❌ Failed', error);
        }
      }
    } else {
      console.log('📦 Using MOCK data - backend connection skipped');
    }
  };
  
  console.log('💡 Tip: Use __testBackendConnection() to test the backend connection');
}