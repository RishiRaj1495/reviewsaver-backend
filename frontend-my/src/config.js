// ============================================
// API Configuration for ReviewSaver Frontend
// ============================================

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API Base URLs for different environments
const PRODUCTION_API_URL = 'https://reviewsaver-backend-api.onrender.com/api';
const DEVELOPMENT_API_URL = 'http://localhost:8080/api';

// Determine which API URL to use
const API_BASE_URL = isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;

// Optional: Override with environment variable if provided
const customApiUrl = process.env.REACT_APP_API_URL;
const finalApiUrl = customApiUrl || API_BASE_URL;

// Log which environment is being used (helps with debugging)
if (isDevelopment) {
  console.log(`🔧 Running in DEVELOPMENT mode`);
  console.log(`📡 API URL: ${finalApiUrl}`);
} else {
  console.log(`🚀 Running in PRODUCTION mode`);
  console.log(`📡 API URL: ${finalApiUrl}`);
}

// Export configuration
export default finalApiUrl;

// Optional: Export additional configuration
export const API_CONFIG = {
  baseUrl: finalApiUrl,
  isProduction,
  isDevelopment,
  timeout: 30000, // 30 seconds timeout
  retryAttempts: 3,
};