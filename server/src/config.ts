import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  },
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  allowedEmails: (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean),
  isDev: process.env.NODE_ENV !== 'production',
};

export function validateConfig(): void {
  const required = [
    ['GOOGLE_CLIENT_ID', config.google.clientId],
    ['GOOGLE_CLIENT_SECRET', config.google.clientSecret],
    ['ANTHROPIC_API_KEY', config.anthropicApiKey],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    console.warn('======================================');
    console.warn('Missing environment variables:');
    missing.forEach(name => console.warn(`  - ${name}`));
    console.warn('');
    console.warn('Please edit .env file to add credentials.');
    console.warn('See .env.example for reference.');
    console.warn('======================================');

    if (!config.isDev) {
      console.error('Cannot start in production without all required variables.');
      process.exit(1);
    }
  }

  if (config.allowedEmails.length === 0) {
    console.warn('Warning: ALLOWED_EMAILS is empty. All emails will be allowed.');
  }
}
