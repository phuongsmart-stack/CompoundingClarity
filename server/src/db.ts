// Re-export everything from Firestore database module
// This module provides a consistent interface for database operations
// using Google Cloud Firestore for persistent storage in Cloud Run

export {
  initializeDatabase,
  User,
  findOrCreateUser,
  getUserById,
  ChatSession,
  createSession,
  getSession,
  getUserSessions,
  updateSession,
  Message,
  addMessage,
  getSessionMessages,
} from './db-firestore';
