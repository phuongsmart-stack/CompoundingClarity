# Feature: Coaching Session Flow

**Last updated:** February 2026

---

## Purpose

The coaching session flow is the heart of ClarityAI. It guides the user through a structured, multi-step experience — from signing in all the way through to leaving feedback — designed to create the right mindset for a productive coaching conversation.

---

## The Four Steps

Every coaching session follows this sequence:

```
Step 1          Step 2              Step 3          Step 4
Login  ───────> Preparation  ────>  Chat  ────────> Feedback
(Sign in)       (Mental prep)       (AI coaching)   (Rate session)
```

The user cannot skip steps or jump ahead. Each step must be completed before the next one begins.

---

## Step 1: Login

**What the user sees:** A clean, centered screen with the ClarityAI logo and a "Continue with Google" button.

**What happens:**
- The user signs in with their Google account
- If already signed in (from a previous visit in the same browser session), this step is automatically skipped

**Next step trigger:** Successful authentication automatically advances the user to Step 2.

*For full details, see [02-authentication.md](./02-authentication.md).*

---

## Step 2: Mental Preparation

**What the user sees:** A "Before we begin" screen with three guideline cards and a commitment button.

**Purpose:** This step sets the right mindset before the coaching conversation. It asks the user to mentally commit to being open and honest, which improves the quality of the coaching session.

**The three guidelines shown:**

| Icon | Guideline |
|---|---|
| Shield | "Be honest with yourself throughout the session. There is no judgement, nor can any human read your session." |
| Brain | "You can think while talking. Take your time to process your thoughts." |
| Refresh | "You can change what you say. It's okay to revise and refine your thoughts." |

**Call to action:** A gold button reading **"I commit to being honest with myself"**

**What happens when the button is clicked:**
1. A new coaching session is created in the system (assigned a unique ID)
2. The user advances to Step 3 (Chat)

**Error handling:** If creating the session fails, an error message appears at the top of the screen (e.g., "Failed to start session"). The user can dismiss it and try again.

---

## Step 3: AI Coaching Chat

**What the user sees:** A full-screen chat interface with messages between the user and the AI coach.

This is the main experience — an interactive conversation where the AI coach helps the user explore their thoughts and reach clarity on a decision or dilemma.

**Next step trigger:** The user clicks the "End Session" button in the chat header.

*For full details, see [04-ai-coaching-chat.md](./04-ai-coaching-chat.md).*

---

## Step 4: Feedback

**What the user sees:** A "Session Complete" screen with a star rating and a submit button.

The user rates their experience and is then redirected to the home page.

**Next step trigger:** After submitting feedback, the user is automatically redirected to the landing page after 2 seconds.

*For full details, see [05-session-feedback.md](./05-session-feedback.md).*

---

## Navigation Rules

| Rule | Behavior |
|---|---|
| User is not signed in | Always shown Step 1 (Login), regardless of which step they were on |
| User signs in | Automatically moves to Step 2 (Preparation) |
| User clicks commitment button | Moves to Step 3 (Chat) |
| User clicks "End Session" | Session is marked as ended; moves to Step 4 (Feedback) |
| User submits feedback | Redirected to the landing page (home) after 2 seconds |
| User closes the browser mid-session | Session remains "active" in the system but cannot currently be resumed |

---

## Error Handling

Errors can occur at several points in the flow. All errors are displayed as a red banner at the top of the screen with a dismiss (X) button.

| Error Scenario | Message Shown |
|---|---|
| Google sign-in fails (unauthorized email) | "This email is not authorized to use this application." |
| Failed to create a new session | "Failed to start session" |
| Failed to end a session | Error is logged silently; user still advances to feedback |
| General/unknown error | The error message from the system is displayed |

---

## Current Limitations

- **No way to resume a session** — if the user leaves mid-conversation (closes the browser, navigates away), the session cannot be continued. They must start a new session.
- **No back button** — the user cannot go back to a previous step (e.g., from Chat back to Preparation)
- **No progress indicator** — there is no visible indicator (like a step counter or progress bar) showing which step the user is on
- **One session at a time** — the flow always creates a new session. There is no "continue previous session" option.
- **Session ends even if the server call fails** — if the request to mark the session as "ended" fails, the user still moves to the feedback step. The session may remain marked as "active" in the database.
