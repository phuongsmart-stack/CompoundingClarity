import express from 'express';
import cors from 'cors';
import session from 'express-session';
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

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// Session configuration
// Using memory store for simplicity - in production, use a proper session store
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !config.isDev, // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: config.isDev ? 'lax' : 'none',
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

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Frontend URL: ${config.frontendUrl}`);
  console.log(`Allowed emails: ${config.allowedEmails.join(', ') || 'ALL (no restrictions)'}`);
});
