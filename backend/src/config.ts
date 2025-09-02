import 'dotenv/config';

export const CONFIG = {
  PORT: Number(process.env.PORT || 8787),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  // OpenAI-compatible (Dobby-70) endpoint
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-PLACEHOLDER',
  MODEL: process.env.MODEL || 'dobby-70',
};
