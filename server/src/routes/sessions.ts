import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth';
import {
  createSession,
  getSession,
  getUserSessions,
  updateSession,
  getSessionMessages,
  ChatSession,
} from '../db';

const router = Router();

// Create a new session
router.post('/', requireAuth, async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = await createSession(sessionId, req.user!.id);
    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get user's sessions
router.get('/', requireAuth, async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user!.id);
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get a specific session with messages
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id as string;
    const session = await getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify ownership
    if (session.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await getSessionMessages(sessionId);
    res.json({ session, messages });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update a session (end session, add rating)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id as string;
    const session = await getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify ownership
    if (session.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, rating } = req.body;
    const updates: { status?: string; rating?: number; ended_at?: string } = {};

    if (status === 'ended') {
      updates.status = 'ended';
      updates.ended_at = new Date().toISOString();
    }

    if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
      updates.rating = rating;
    }

    await updateSession(sessionId, updates);

    const updatedSession = await getSession(sessionId);
    res.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

export default router;
