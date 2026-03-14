# Quick Start Deployment Guide

Deploy CompoundingClarity to Google Cloud Run in 5 minutes.

## Prerequisites

- Google Cloud account with billing enabled
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/apis/credentials))
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Step 1: Install gcloud CLI

**macOS:**
```bash
brew install google-cloud-sdk
```

**Other platforms:** See https://cloud.google.com/sdk/docs/install

## Step 2: Login to Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

## Step 3: Set Up Environment Variables

**Option A: Interactive Setup (Recommended)**
```bash
./setup-env.sh
```

**Option B: Manual Setup**
```bash
cp .env.example .env
# Edit .env and fill in your values
```

Required variables:
- `GOOGLE_PROJECT_ID` - Your GCP project ID
- `GOOGLE_CLIENT_ID` - OAuth client ID
- `GOOGLE_CLIENT_SECRET` - OAuth client secret
- `ANTHROPIC_API_KEY` - Claude API key
- `SESSION_SECRET` - Random secret (generate with: `openssl rand -base64 32`)
- `ALLOWED_EMAILS` - Your email address(es)

## Step 4: Deploy

```bash
# Load environment and deploy
source .env
export GOOGLE_PROJECT_ID GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET ANTHROPIC_API_KEY SESSION_SECRET ALLOWED_EMAILS
./deploy.sh
```

The script will:
- ✅ Build the frontend
- ✅ Build and push Docker image
- ✅ Deploy to Cloud Run
- ✅ Configure all settings automatically

## Step 5: Update OAuth Callback

After deployment, you'll get a URL like: `https://compoundingclarity-xxx.run.app`

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://your-deployed-url.run.app/api/auth/google/callback
   ```
4. Save

## Step 6: Test

Visit your deployed URL and test:
- Login with Google
- Start a coaching session
- View past sessions

## View Logs

```bash
gcloud run services logs tail compoundingclarity --region=us-central1
```

## Update/Redeploy

After making code changes:

```bash
source .env
export GOOGLE_PROJECT_ID GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET ANTHROPIC_API_KEY SESSION_SECRET ALLOWED_EMAILS
./deploy.sh
```

## Troubleshooting

### "gcloud: command not found"
Install gcloud CLI (see Step 1)

### "Missing required environment variables"
Make sure you've exported all variables:
```bash
source .env
export GOOGLE_PROJECT_ID GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET ANTHROPIC_API_KEY SESSION_SECRET ALLOWED_EMAILS
```

### OAuth not working
1. Check callback URL in Google Console
2. Verify it matches your deployed URL
3. Make sure you added `/api/auth/google/callback` at the end

### View detailed logs
```bash
gcloud run services logs read compoundingclarity --region=us-central1 --limit=100
```

## Cost Estimate

Expected monthly cost for typical usage:
- Cloud Run: **$0-10** (free tier covers most small apps)
- Firestore: **$0-5** (free tier is generous)
- Anthropic API: **$10-50** (depends on usage)

**Total: ~$10-65/month** for a working production app

## Need Help?

- Check full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- View logs: `gcloud run services logs tail compoundingclarity --region=us-central1`
- Test locally first: `npm run dev:all`
