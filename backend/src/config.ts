import 'dotenv/config';

// Validate required environment variables
function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const CONFIG = {
  // Server configuration
  PORT: Number(process.env.PORT || 8787),
  HOST: process.env.HOST || '0.0.0.0',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // AI Model configuration (Dobby-70)
  OPENAI_BASE_URL: requireEnv('OPENAI_BASE_URL', 'https://api.openai.com'),
  OPENAI_API_KEY: requireEnv('FIREWORKS_API_KEY'),
  MODEL: process.env.MODEL || 'dobby-70',
  
  // API timeouts and limits
  AI_REQUEST_TIMEOUT: Number(process.env.AI_REQUEST_TIMEOUT || 30000),
  EXTERNAL_API_TIMEOUT: Number(process.env.EXTERNAL_API_TIMEOUT || 10000),
  MAX_QUERY_LENGTH: Number(process.env.MAX_QUERY_LENGTH || 2000),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Log configuration (excluding sensitive data)
console.log('🚀 Backend Configuration:');
console.log(`   Port: ${CONFIG.PORT}`);
console.log(`   Environment: ${CONFIG.NODE_ENV}`);
console.log(`   Model: ${CONFIG.MODEL}`);
console.log(`   AI Endpoint: ${CONFIG.OPENAI_BASE_URL}`);
console.log(`   CORS Origin: ${CONFIG.CORS_ORIGIN}`);
console.log('✅ Configuration loaded successfully\n');