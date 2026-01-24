import { Firestore } from '@google-cloud/firestore';
import { config } from './config';

// Initialize Firestore
// In Cloud Run, this will use the default service account
// Locally, set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key
const firestore = new Firestore({
  projectId: config.googleProjectId,
});

// Collections
const usersCollection = firestore.collection('users');
const sessionsCollection = firestore.collection('sessions');
const messagesCollection = firestore.collection('messages');

export function initializeDatabase(): void {
  console.log('Firestore initialized');
}

// User operations
export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  created_at: string;
}

export async function findOrCreateUser(googleProfile: {
  id: string;
  email: string;
  displayName?: string;
  picture?: string;
}): Promise<User> {
  const userRef = usersCollection.doc(googleProfile.id);
  const userDoc = await userRef.get();

  const userData: User = {
    id: googleProfile.id,
    email: googleProfile.email,
    name: googleProfile.displayName || null,
    picture: googleProfile.picture || null,
    created_at: userDoc.exists ? userDoc.data()!.created_at : new Date().toISOString(),
  };

  await userRef.set(userData, { merge: true });
  return userData;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) return undefined;
  return userDoc.data() as User;
}

// Session operations
export interface ChatSession {
  id: string;
  user_id: string;
  status: string;
  rating: number | null;
  created_at: string;
  ended_at: string | null;
}

export async function createSession(id: string, userId: string): Promise<ChatSession> {
  const session: ChatSession = {
    id,
    user_id: userId,
    status: 'active',
    rating: null,
    created_at: new Date().toISOString(),
    ended_at: null,
  };

  await sessionsCollection.doc(id).set(session);
  return session;
}

export async function getSession(id: string): Promise<ChatSession | undefined> {
  const sessionDoc = await sessionsCollection.doc(id).get();
  if (!sessionDoc.exists) return undefined;
  return sessionDoc.data() as ChatSession;
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  const snapshot = await sessionsCollection
    .where('user_id', '==', userId)
    .orderBy('created_at', 'desc')
    .get();

  return snapshot.docs.map(doc => doc.data() as ChatSession);
}

export async function updateSession(
  id: string,
  updates: { status?: string; rating?: number; ended_at?: string }
): Promise<void> {
  const updateData: Record<string, any> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.rating !== undefined) updateData.rating = updates.rating;
  if (updates.ended_at !== undefined) updateData.ended_at = updates.ended_at;

  if (Object.keys(updateData).length > 0) {
    await sessionsCollection.doc(id).update(updateData);
  }
}

// Message operations
export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export async function addMessage(
  id: string,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const message: Message = {
    id,
    session_id: sessionId,
    role,
    content,
    created_at: new Date().toISOString(),
  };

  await messagesCollection.doc(id).set(message);
  return message;
}

export async function getSessionMessages(sessionId: string): Promise<Message[]> {
  const snapshot = await messagesCollection
    .where('session_id', '==', sessionId)
    .orderBy('created_at', 'asc')
    .get();

  return snapshot.docs.map(doc => doc.data() as Message);
}
