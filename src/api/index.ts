// API base URL - in development, Vite proxy handles /api routes
const API_BASE = '/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

export interface ChatSession {
  id: string;
  user_id: string;
  status: string;
  rating: number | null;
  created_at: string;
  ended_at: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  // Get current user
  getMe: () => apiFetch<{ user: User | null }>('/auth/me'),

  // Logout
  logout: () => apiFetch<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  // Get Google OAuth URL (redirect to this)
  getGoogleAuthUrl: () => `${API_BASE}/auth/google`,
};

// Sessions API
export const sessionsApi = {
  // Create a new session
  create: () => apiFetch<{ session: ChatSession }>('/sessions', { method: 'POST' }),

  // Get all user sessions
  getAll: () => apiFetch<{ sessions: ChatSession[] }>('/sessions'),

  // Get a specific session with messages
  get: (id: string) => apiFetch<{ session: ChatSession; messages: Message[] }>(`/sessions/${id}`),

  // Update a session (end, rate)
  update: (id: string, data: { status?: string; rating?: number }) =>
    apiFetch<{ session: ChatSession }>(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Chat API
export const chatApi = {
  // Send a message and get AI response
  sendMessage: (sessionId: string, content: string) =>
    apiFetch<{ userMessage: Message; assistantMessage: Message }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, content }),
    }),
};
