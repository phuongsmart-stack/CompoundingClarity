# Feature: Privacy & Access Control

**Last updated:** February 2026

---

## Purpose

Privacy is a core part of the ClarityAI experience. Users are sharing their deepest professional dilemmas and personal thoughts. The product must ensure that users feel safe and that their data is protected.

Access control ensures that only authorized individuals can use the application during its current stage.

---

## Privacy Commitments to the User

The following privacy messages are communicated to the user throughout the experience:

| Where It Appears | Message |
|---|---|
| Login screen | "Your session is completely private and confidential. We never share your data." |
| Chat header | "Your session is private" |
| Landing page (Value Props) | "Your deepest career dilemmas stay between you and the screen. No judgment, no record, no human ever sees your session." |
| Preparation step (Guideline 1) | "Be honest with yourself throughout the session. There is no judgement, nor can any human read your session." |

---

## How Privacy Is Implemented

### Session Data

| Data Type | What Is Stored | Who Can Access It |
|---|---|---|
| User profile | Google ID, email, name, profile picture | Only the user (via their authenticated session) |
| Coaching sessions | Session ID, status (active/ended), rating, timestamps | Only the user who created the session |
| Chat messages | Message content, sender (user or AI), timestamp | Only the user who owns the session |

### Data Ownership

- Each coaching session belongs to a single user
- The system verifies ownership before allowing access to any session or its messages
- If a user tries to access another user's session, they receive an "Access denied" response

### Authentication Security

| Measure | Details |
|---|---|
| Session cookies | Authentication uses HTTP-only cookies that cannot be read by browser JavaScript |
| SameSite cookies | Cookies are restricted to same-site requests to prevent cross-site attacks |
| Secure cookies (production) | In the live environment, cookies are only sent over encrypted (HTTPS) connections |
| Session destruction on logout | When a user signs out, their server session is completely destroyed and the cookie is cleared |

---

## Access Control (Email Allowlist)

ClarityAI includes an **email allowlist** feature that restricts who can create an account and use the coaching service.

### How It Works

1. An administrator configures a list of approved email addresses in the server settings
2. When a user tries to sign in with Google, the system checks their email against this list
3. If the email is on the list (or if the list is empty), they are allowed in
4. If the email is not on the list, they are rejected with an error message

### Behavior Summary

| Configuration | Who Can Sign In |
|---|---|
| Allowlist has specific emails (e.g., `jane@company.com, john@company.com`) | Only those specific users |
| Allowlist is empty or not configured | Anyone with a Google account |

### How Rejection Looks to the User

- The user clicks "Continue with Google" and completes Google's sign-in flow
- They are redirected back to ClarityAI with an error parameter in the URL
- A red error banner appears: *"This email is not authorized to use this application."*
- The user remains on the login screen and can dismiss the error

### Management

- The allowlist is configured through a server environment variable (`ALLOWED_EMAILS`)
- It is a comma-separated list of email addresses
- Email matching is case-insensitive
- There is no admin interface to manage the allowlist — it requires server configuration changes

---

## Data Storage

### Production Environment

In the live environment, all data is stored in **Google Cloud Firestore**, a managed cloud database service.

| Collection | What It Contains |
|---|---|
| `users` | User profiles (ID, email, name, picture, creation date) |
| `sessions` | Coaching sessions (ID, user link, status, rating, timestamps) |
| `messages` | Individual chat messages (ID, session link, sender role, content, timestamp) |

### Development Environment

In the development/testing environment, data is stored in a local **SQLite** database file on the developer's machine. This data is not shared or accessible outside the development environment.

---

## Current Limitations

- **No data deletion** — there is no way for a user to delete their account or session data from within the app
- **No data export** — users cannot download their data (e.g., chat transcripts)
- **No privacy policy page** — the "Privacy" link in the footer is a placeholder and does not navigate to a real privacy policy
- **No terms of service page** — the "Terms" link in the footer is a placeholder
- **No data retention policy** — there is no defined period after which old session data is automatically deleted
- **No encryption at rest** — chat messages are stored in plain text in the database (Firestore provides infrastructure-level encryption, but there is no application-level encryption)
- **No admin audit log** — there is no record of who accessed what data or when
- **AI provider data handling** — conversation content is sent to Anthropic's API (Claude) for AI processing. Anthropic's data handling policies apply to this data in transit.
