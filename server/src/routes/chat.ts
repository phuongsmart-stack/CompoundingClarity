import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { getSession, getSessionMessages, addMessage, getUserSessions } from '../db';
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
    console.log('Conversation history:', history.length, 'messages');

    // Get past sessions for context (exclude current session)
    const allSessions = await getUserSessions(req.user!.id);
    const pastSessions = allSessions.filter(s => s.id !== sessionId && s.status === 'ended');
    const recentPastSessions = pastSessions.slice(0, 2); // Get 2 most recent past sessions
    console.log('Found', recentPastSessions.length, 'recent past sessions for context');

    // Fetch messages from past sessions
    const pastSessionsWithMessages = await Promise.all(
      recentPastSessions.map(async (session) => ({
        session,
        messages: await getSessionMessages(session.id),
      }))
    );

    // Save user message
    const userMessageId = uuidv4();
    const userMessage = await addMessage(userMessageId, sessionId, 'user', content);
    console.log('User message saved:', userMessageId);

    // Generate AI response with past session context
    console.log('Generating AI response...');
    const aiResponse = await generateResponse(history, content, pastSessionsWithMessages);
    console.log('AI response generated:', aiResponse.substring(0, 100));

    // Save AI response
    const assistantMessageId = uuidv4();
    const assistantMessage = await addMessage(assistantMessageId, sessionId, 'assistant', aiResponse);
    console.log('Assistant message saved:', assistantMessageId);

    res.json({
      userMessage,
      assistantMessage,
    });
  } catch (error: any) {
    console.error('=== ERROR in chat message ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));

    res.status(500).json({
      error: 'Failed to process message',
      details: error?.message || 'Unknown error'
    });
  }
});

export default router;
