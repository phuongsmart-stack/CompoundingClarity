import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { config } from '../config';
import { findOrCreateUser, getUserById, User } from '../db';

const router = Router();

// Configure Passport Google Strategy (only if credentials are available)
export function initializePassportStrategy(): void {
  if (!config.google.clientId || !config.google.clientSecret) {
    console.warn('Google OAuth credentials not configured. OAuth will not work.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();

          if (!email) {
            return done(null, false, { message: 'No email provided by Google' });
          }

          // Check if email is in allowlist
          if (config.allowedEmails.length > 0 && !config.allowedEmails.includes(email)) {
            console.log(`Login rejected for email: ${email}`);
            return done(null, false, { message: 'This email is not authorized to use this application' });
          }

          // Find or create user
          const user = findOrCreateUser({
            id: profile.id,
            email,
            displayName: profile.displayName,
            picture: profile.photos?.[0]?.value,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

// Deserialize user from session
passport.deserializeUser((id: string, done) => {
  try {
    const user = getUserById(id);
    done(null, user || null);
  } catch (error) {
    done(error);
  }
});

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/session?error=unauthorized' }),
  (req, res) => {
    // Successful authentication
    res.redirect(`${config.frontendUrl}/session?auth=success`);
  }
);

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
      },
    });
  } else {
    res.json({ user: null });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

export default router;
export { passport };
