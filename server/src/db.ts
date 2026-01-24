import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../data/truthcompass.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      rating INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
  `);

  console.log('Database initialized successfully');
}

// User operations
export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  created_at: string;
}

export function findOrCreateUser(googleProfile: {
  id: string;
  email: string;
  displayName?: string;
  picture?: string;
}): User {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(googleProfile.id) as User | undefined;

  if (existing) {
    // Update user info in case it changed
    db.prepare('UPDATE users SET name = ?, picture = ? WHERE id = ?')
      .run(googleProfile.displayName || null, googleProfile.picture || null, googleProfile.id);
    return { ...existing, name: googleProfile.displayName || null, picture: googleProfile.picture || null };
  }

  db.prepare('INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?)')
    .run(googleProfile.id, googleProfile.email, googleProfile.displayName || null, googleProfile.picture || null);

  return db.prepare('SELECT * FROM users WHERE id = ?').get(googleProfile.id) as User;
}

export function getUserById(id: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
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

export function createSession(id: string, userId: string): ChatSession {
  db.prepare('INSERT INTO sessions (id, user_id) VALUES (?, ?)').run(id, userId);
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as ChatSession;
}

export function getSession(id: string): ChatSession | undefined {
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as ChatSession | undefined;
}

export function getUserSessions(userId: string): ChatSession[] {
  return db.prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as ChatSession[];
}

export function updateSession(id: string, updates: { status?: string; rating?: number; ended_at?: string }): void {
  const setClauses: string[] = [];
  const values: (string | number)[] = [];

  if (updates.status !== undefined) {
    setClauses.push('status = ?');
    values.push(updates.status);
  }
  if (updates.rating !== undefined) {
    setClauses.push('rating = ?');
    values.push(updates.rating);
  }
  if (updates.ended_at !== undefined) {
    setClauses.push('ended_at = ?');
    values.push(updates.ended_at);
  }

  if (setClauses.length > 0) {
    values.push(id);
    db.prepare(`UPDATE sessions SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);
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

export function addMessage(id: string, sessionId: string, role: 'user' | 'assistant', content: string): Message {
  db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)')
    .run(id, sessionId, role, content);
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as Message;
}

export function getSessionMessages(sessionId: string): Message[] {
  return db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC')
    .all(sessionId) as Message[];
}
