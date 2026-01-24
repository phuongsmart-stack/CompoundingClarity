import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { config, validateConfig } from './config';
import { initializeDatabase } from './db';
import authRoutes, { passport, initializePassportStrategy } from './routes/auth';
import sessionsRoutes from './routes/sessions';
import chatRoutes from './routes/chat';

// Validate configuration
validateConfig();

// Initialize database
initializeDatabase();

const app = express();

// Trust proxy for Cloud Run
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: config.isDev ? config.frontendUrl : true, // Allow same-origin in production
  credentials: true,
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !config.isDev, // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // Use lax for same-origin in production
  },
}));

// Initialize Passport
initializePassportStrategy();
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve static files in production
if (!config.isDev) {
  const publicPath = path.resolve(__dirname, '../public');
  app.use(express.static(publicPath));

  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.isDev ? 'development' : 'production'}`);
  console.log(`Allowed emails: ${config.allowedEmails.join(', ') || 'ALL (no restrictions)'}`);
});
