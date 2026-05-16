# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ClarityAI / CompoundingClarity — a private, single-user (allowlisted) AI coaching web app. Marketing landing page + an authenticated session flow that runs a long-form coaching chat against Anthropic's Claude using an ICF (International Coaching Federation) system prompt. Originally scaffolded by Lovable; the README is the Lovable template and is mostly not useful — treat the **PRDs/** folder as the canonical product spec.

## Repo layout (the non-obvious parts)

This is a **two-package monorepo with no workspace tooling**: the root `package.json` is the Vite/React frontend, `server/package.json` is the Express backend. They're stitched together by:

- Root `postinstall` script — `npm install` at the root recursively installs `server/` deps.
- `dev:all` — runs Vite (`:8080`) and the API (`:3001`) concurrently. Vite proxies `/api` → `localhost:3001` (see `vite.config.ts`).
- The Dockerfile builds both, then the production Express server (`server/src/index.ts`) serves the built frontend from `./public` and handles `/api/*` itself — **same origin in prod, proxied in dev**. CORS and cookie `sameSite` behavior branch on `config.isDev` because of this.

There is no test runner configured. `npm run lint` (ESLint) is the only quality gate.

### Frontend (`src/`)
- React 18 + Vite + TypeScript + Tailwind + shadcn/ui (Radix primitives in `src/components/ui/`, do not edit these by hand — they're generated).
- Routing in `src/App.tsx`: `/` (landing), `/session` and `/session/:sessionId` (the chat flow), `/history`, `/history/:id`.
- `src/pages/Session.tsx` is a **stepper state machine** (`login → active-sessions → preparation → chat → feedback`) driven by `useAuth()` and URL params (`:sessionId` for resume, `?continueId=` for re-opening an ended session). The step components live in `src/components/session/`.
- All HTTP goes through `src/api/index.ts` (`apiFetch` wrapper sends `credentials: 'include'` for session cookies). `@tanstack/react-query` is installed but most components fetch directly — don't assume cache invalidation will happen.
- `@/` is aliased to `src/`.

### Backend (`server/src/`)
- Express + Passport (`passport-google-oauth20`) + `express-session` (in-memory store — sessions don't survive container restarts).
- `db.ts` is a **re-export shim** over `db-firestore.ts`. Firestore is used for users/sessions/messages in **both dev and prod** (the `useFirestore` / SQLite path in `config.ts` is dead — `db.ts` ignores it). When running locally you still need GCP application-default credentials for Firestore (`gcloud auth application-default login`) and `GOOGLE_PROJECT_ID` set.
- Routes mounted at `/api/auth`, `/api/sessions`, `/api/chat`. `requireAuth` middleware in `server/src/middleware/auth.ts` gates everything except `/api/auth/*` and `/api/health`.
- `server/src/services/claude.ts` holds the **entire ICF coaching system prompt inline** (~700 lines) plus the past-session-context formatter. When sending a message, the route fetches the user's 2 most recent **ended** past sessions and injects their transcripts into the system prompt for continuity. Model is pinned to `claude-sonnet-4-5-20250929`, `max_tokens: 4096`. Editing the prompt directly changes coach behavior — do this deliberately.

## Common commands

```bash
# First-time setup (also installs server/ deps via postinstall)
npm install

# Local development — frontend + backend together
npm run dev:all        # Vite on :8080, API on :3001 (proxied)
npm run dev            # frontend only
npm run dev:server     # backend only (cd server && tsx watch)

# Build / lint
npm run build          # vite build → dist/
npm run lint           # ESLint over the whole repo
cd server && npm run build   # tsc → server/dist/

# Deploy to Cloud Run (requires env vars exported, see deploy.sh)
./deploy.sh
```

No test command exists. If you add tests, also add the script to the right `package.json` (root vs `server/`) — don't assume one runner covers both.

## Environment

`.env` lives at the **repo root** and is loaded by the server only when `NODE_ENV !== 'production'` (see `server/src/config.ts`). The server reads it via `dotenv` from `../../.env` relative to its build output. In production all env comes from Cloud Run.

Required for the app to actually function: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ANTHROPIC_API_KEY`, `GOOGLE_PROJECT_ID`, `SESSION_SECRET`, `APP_URL`, `ALLOWED_EMAILS`. Missing the first three only warns in dev but exits in prod. `./setup-env.sh` interactively fills `.env` from `.env.example`.

`ALLOWED_EMAILS` is a comma-separated allowlist enforced in the Google OAuth callback — empty means anyone with a Google account can sign in.

## Deployment

Single-container deploy to Google Cloud Run. The Dockerfile is a 3-stage build (frontend builder → backend builder → production runtime serving both). `cloudrun.yaml` and `deploy.sh` are the source of truth for runtime config — notably:

- `timeoutSeconds: 300` (Cloud Run request timeout) and server-level `server.timeout = 5min`, `keepAliveTimeout = 65s`. These are tuned for slow Claude responses; don't lower without checking `DEPLOYMENT.md`.
- Memory `512Mi`, CPU `1`, min 0 / max 10 instances.
- After first deploy, the Google OAuth callback URL in Cloud Console must be updated to `${DEPLOYED_URL}/api/auth/google/callback` — `deploy.sh` reminds you on success.

## Things to know before making changes

- **Update the PRDs.** The root README explicitly requires that any product-facing feature change be reflected in `PRDs/`. Start at `PRDs/00-product-overview.md`; the "What Does Not Yet Exist" list there is out of date (session history *does* now exist — routes `/history` and `/history/:id` are live), update it when you touch those features.
- **The coaching system prompt is the product.** Behavior changes to the AI coach belong in `server/src/services/claude.ts`, not in route handlers or frontend prompting hacks. Read it before tweaking — the prompt is opinionated about not giving advice and about specific "dysregulation protocol" / "safety rupture" responses.
- **Firestore is the only store.** Don't reintroduce the SQLite path from the original scaffold; the dead config in `config.ts` is the only remnant. New persistence goes in `db-firestore.ts` with a matching re-export in `db.ts`.
- **Session resume semantics.** `/session/:sessionId` resumes only `active` sessions; `/session?continueId=` re-activates an `ended` session by PATCHing it back to `active`. The `resumeAttempted` ref in `Session.tsx` prevents double-loading — be careful editing that effect.
- **shadcn/ui components in `src/components/ui/`** are generated from `components.json` — don't hand-edit them; if you need a variant, add a wrapper.
- The frontend `package.json` still has `"name": "vite_react_shadcn_ts"` from the Lovable template — cosmetic, fine to leave.
