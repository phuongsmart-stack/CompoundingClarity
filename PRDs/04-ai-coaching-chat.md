# Feature: AI Coaching Chat

**Last updated:** February 2026

---

## Purpose

The AI coaching chat is the core feature of ClarityAI. It provides a private, one-on-one conversation between the user and an AI coach that helps them think through difficult decisions. The AI does not give advice — it asks questions, reflects patterns, and helps the user discover their own answers.

---

## What the User Sees

The chat screen is a full-screen interface with three areas:

### 1. Header Bar

- **Left side:** ClarityAI logo and the text *"Your session is private"*
- **Right side:** An **"End Session"** button (with a logout icon)
- The header stays fixed at the top as the user scrolls through messages

### 2. Message Area (Center)

- Takes up most of the screen
- Messages appear in a scrollable list, newest at the bottom
- **AI messages** appear on the left side with:
  - A "CLARITY AI" label above the message
  - A light card background with a subtle border
- **User messages** appear on the right side with:
  - A dark/primary background color
  - No label
- The view automatically scrolls to the newest message when a new one appears

### 3. Input Area (Bottom)

- **Text field:** A resizable text area with placeholder text *"Share your thoughts..."*
- **Send button:** A gold-colored button with a send (arrow) icon
- **Help text:** *"Press Enter to send, Shift+Enter for new line"*
- The input area stays fixed at the bottom of the screen

---

## How a Conversation Works

### Opening Message

When the chat starts, the AI coach sends an automatic greeting:

> *"Welcome. I'm here to help you examine your thoughts and find clarity. What's been on your mind lately? Is there a belief or situation you'd like to explore together?"*

This message appears immediately — the user does not need to type anything first.

### Sending a Message

1. The user types in the text area
2. They press **Enter** (or tap the send button) to send
3. Pressing **Shift+Enter** inserts a new line without sending
4. The user's message immediately appears in the chat (before the AI responds)
5. A **typing indicator** (three bouncing dots) appears while the AI is thinking
6. The AI's response appears once ready
7. The typing indicator disappears

### Message Flow (What Happens Behind the Scenes)

When the user sends a message:
1. The message appears instantly in the chat (so the user doesn't wait)
2. The message is sent to the server
3. The server saves the user's message
4. The server sends the full conversation history to the AI (Claude by Anthropic)
5. The AI generates a coaching response
6. The server saves the AI's response
7. The AI's response is sent back and displayed in the chat

If something goes wrong (e.g., network error), the user's message is removed from the chat and an error message appears.

---

## The AI Coach's Behavior

The AI coach is powered by Claude (by Anthropic) and follows International Coaching Federation (ICF) principles. Here is how it behaves:

### What the AI Coach Does

| Behavior | Example |
|---|---|
| Asks open-ended questions | "What feels most unresolved about this?" |
| Reflects the user's words back to them | "You mentioned 'stuck' several times. What does that signal for you?" |
| Surfaces patterns the user may not see | "I'm noticing you're waiting for others to decide in multiple areas. What do you make of that?" |
| Challenges assumptions gently | "If that were 100% true, what would that imply?" |
| Slows down at important moments | When the user has a sudden insight or uses charged language, the AI pauses to explore it |
| Holds space for discomfort | When the user feels overwhelmed, the AI doesn't rush to fix it — it helps them sit with and understand the feeling |

### What the AI Coach Does NOT Do

| Behavior the AI Avoids | Why |
|---|---|
| Giving direct advice ("You should do X") | Coaching is about helping the user find their own answer |
| Offering tools or frameworks unprompted | The user should lead; tools are only offered if explicitly requested |
| Acting as a therapist | If deeper mental health issues surface, the AI suggests professional support |
| Judging or evaluating choices | The AI stays neutral and non-judgmental |
| Rushing to solutions | Insight comes before action; the AI prioritizes understanding first |

### Coaching Approach

The AI uses several coaching techniques:

1. **Deep listening** — Notices repeated words, absolutes ("always", "never"), tone shifts, and gaps between values and actions
2. **Open-ended questioning** — Prefers "what" and "how" questions that expand thinking
3. **Reflection and mirroring** — Plays back what the user said without adding judgment
4. **Gentle challenge** — Questions narratives that reduce the user's sense of agency
5. **Pattern recognition** — Connects themes across different topics in the conversation
6. **Pace control** — Asks one question at a time; doesn't overwhelm with multiple questions

### Session Endings

The AI adapts its closing based on the user's state:

| User State | AI Approach |
|---|---|
| Has clarity and energy | Offers to help turn insights into action steps |
| Has insight but is tired | Encourages sitting with the insight and letting it settle |
| Issues exceed coaching scope | Gently suggests professional support (therapist, counselor) |

---

## Visual Behaviors

| Behavior | Details |
|---|---|
| Auto-scroll | The chat automatically scrolls to the bottom when a new message appears |
| Typing indicator | Three animated bouncing dots appear while the AI is generating a response |
| Message highlighting | The most recent exchange (last user message + AI response) is displayed at full brightness. Older messages are slightly faded to keep focus on the current topic. |
| Disabled input while waiting | The send button is disabled and the text field is non-interactive while the AI is typing |
| Error banner | If a message fails to send, a red banner appears below the header with a "Dismiss" link |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Enter | Send message |
| Shift + Enter | Insert a new line (does not send) |

---

## Current Limitations

- **No message editing** — once a message is sent, it cannot be edited or deleted
- **No conversation export** — there is no way to save, download, or share the conversation transcript
- **No session resumption** — if the user leaves the chat (closes the browser, navigates away), the conversation cannot be continued
- **No streaming responses** — the AI's full response appears all at once after it finishes generating (not word by word)
- **No voice input** — messages can only be typed, not spoken
- **No file or image sharing** — the chat is text-only
- **No message search** — users cannot search through their conversation
- **No conversation length warning** — there is no alert if the conversation becomes very long (which could affect AI response quality)
