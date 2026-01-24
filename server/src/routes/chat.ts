import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { getSession, getSessionMessages, addMessage } from '../db';
import { generateResponse } from '../services/claude';

const router = Router();

// Send a message and get AI response
router.post('/message', requireAuth, async (req, res) => {
  console.log('=== Chat message request ===');
  console.log('User:', req.user?.email);
  console.log('Body:', req.body);

  try {
    const { sessionId, content } = req.body;

    if (!sessionId || !content) {
      console.log('Missing sessionId or content');
      return res.status(400).json({ error: 'sessionId and content are required' });
    }

    // Verify session exists and belongs to user
    const session = await getSession(sessionId);
    console.log('Session found:', session ? 'yes' : 'no');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (session.status === 'ended') {
      return res.status(400).json({ error: 'Session has ended' });
    }

    // Get conversation history
    const history = await getSessionMessages(sessionId);

    // Save user message
    const userMessageId = uuidv4();
    const userMessage = await addMessage(userMessageId, sessionId, 'user', content);

    // Generate AI response
    const aiResponse = await generateResponse(history, content);

    // Save AI response
    const assistantMessageId = uuidv4();
    const assistantMessage = await addMessage(assistantMessageId, sessionId, 'assistant', aiResponse);

    res.json({
      userMessage,
      assistantMessage,
    });
  } catch (error: any) {
    console.error('Error in chat message:', error?.message || error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error?.message || 'Unknown error'
    });
  }
});

export default router;
