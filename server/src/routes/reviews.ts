import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getSessionReviews, getAllReviews, getSession } from '../db';

const router = Router();

// Get all reviews (optionally filtered)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { session_id, verdict, limit } = req.query;

    // If filtering by session, verify ownership
    if (session_id) {
      const session = await getSession(session_id as string);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.user_id !== req.user!.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const reviews = await getSessionReviews(session_id as string);
      return res.json({ reviews });
    }

    // Otherwise return all reviews (filtered by verdict/limit)
    const reviews = await getAllReviews({
      verdict: verdict as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : 100,
    });

    res.json({ reviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error?.message || error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
