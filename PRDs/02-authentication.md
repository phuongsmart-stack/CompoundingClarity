# Feature: User Authentication (Google Sign-In)

**Last updated:** February 2026

---

## Purpose

Authentication ensures that only authorized users can access coaching sessions. It also ties each session to a specific user so their conversation history is stored securely.

ClarityAI uses **Google Sign-In** as the sole authentication method. There is no email/password login, no social login with other providers, and no guest access to the coaching chat.

---

## How It Works (User Perspective)

### Signing In

1. The user navigates to `/session` (or clicks "Start Your Free Session" from the landing page)
2. They see the **Login screen** with:
   - A "Welcome to ClarityAI" heading
   - A "Continue with Google" button showing the Google logo
   - A privacy statement: *"Your session is completely private and confidential. We never share your data."*
3. Clicking "Continue with Google" redirects the user to Google's sign-in page
4. The user selects their Google account and grants permission
5. Google redirects the user back to ClarityAI
6. If successful, the user is automatically moved to the next step (Mental Preparation)

### Authorization Errors

- If the user's email address is **not on the allowed list** (see Access Control below), they are redirected back with an error message: *"This email is not authorized to use this application."*
- The error appears as a banner at the top of the screen and can be dismissed

### Signing Out

- During a coaching session, the user can click the **"End Session"** button in the chat header
- After the session ends and feedback is submitted, the user is redirected to the home page
- There is currently no visible "Sign Out" button on the landing page or elsewhere outside the session flow

### Staying Signed In

- Once signed in, the user remains authenticated for the duration of their browser session (via a session cookie)
- If the user returns to `/session` while still signed in, they skip the login step and go directly to Mental Preparation

---

## Access Control (Email Allowlist)

ClarityAI supports an **email allowlist** to restrict who can use the application.

| Scenario | Behavior |
|---|---|
| Allowlist is configured (one or more emails listed) | Only users whose Google account email matches an entry on the list can sign in. All others are rejected with an "unauthorized" error. |
| Allowlist is empty or not configured | All Google accounts are allowed to sign in. |

- Email matching is **case-insensitive** (e.g., `User@Gmail.com` matches `user@gmail.com`)
- The allowlist is managed through server configuration, not through the app's user interface

---

## What the User Sees at Each Stage

| State | Screen |
|---|---|
| Not signed in | Login screen with "Continue with Google" button |
| Loading (checking if already signed in) | Centered spinner with "Loading..." text |
| Unauthorized email | Login screen with red error banner at top |
| Successfully signed in | Automatically moves to Mental Preparation step |

---

## User Data Stored

When a user signs in for the first time, the following information is saved:

| Field | Source | Example |
|---|---|---|
| User ID | Google account ID | `117438529301...` |
| Email | Google account email | `jane.doe@company.com` |
| Name | Google profile display name | `Jane Doe` |
| Profile picture | Google profile photo URL | `https://lh3.googleusercontent.com/...` |
| Account created date | Automatically set on first sign-in | `2026-02-17T10:30:00Z` |

- If the user has signed in before, their existing record is reused (not duplicated)
- Name and profile picture are updated each time the user signs in, in case they changed on Google's side

---

## Current Limitations

- **Google is the only sign-in method** — there is no email/password, Apple, Microsoft, or other social login option
- **No "Sign Out" button on the landing page** — the user can only end their session from within the chat
- **No account management** — the user cannot view, edit, or delete their account data from within the app
- **No "Remember Me" persistence** — the session cookie does not persist across browser restarts (it expires when the browser is closed)
- **Allowlist is server-managed only** — there is no admin interface to add or remove authorized emails
