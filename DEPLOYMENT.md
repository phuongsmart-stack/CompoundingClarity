# Deployment Guide

## Cloud Run Deployment

### Quick Deploy (Recommended)

Deploy with the Cloud Run configuration file for optimal settings:

```bash
# Deploy using gcloud CLI with the configuration file
gcloud run services replace cloudrun.yaml \
  --region us-central1 \
  --project YOUR_PROJECT_ID
```

### Manual Deploy

If deploying without the YAML file:

```bash
gcloud run deploy compoundingclarity \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --timeout 300 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0
```

### Important: Set Environment Variables

After deployment, set the required environment variables:

```bash
gcloud run services update compoundingclarity \
  --region us-central1 \
  --set-env-vars="NODE_ENV=production" \
  --update-secrets="GOOGLE_CLIENT_ID=google-client-id:latest" \
  --update-secrets="GOOGLE_CLIENT_SECRET=google-client-secret:latest" \
  --update-secrets="ANTHROPIC_API_KEY=anthropic-api-key:latest" \
  --update-secrets="SESSION_SECRET=session-secret:latest" \
  --update-env-vars="GOOGLE_PROJECT_ID=YOUR_PROJECT_ID" \
  --update-env-vars="APP_URL=https://your-service-url.run.app" \
  --update-env-vars="ALLOWED_EMAILS=your-email@example.com"
```

Or set them via the Google Cloud Console:
1. Go to Cloud Run → Select your service
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add the environment variables from `.env.example`

## Key Configuration Changes

### Server Timeout Settings
- **Request timeout**: 5 minutes (300 seconds)
- **Keep-alive timeout**: 65 seconds
- **Headers timeout**: 66 seconds
- **Cloud Run timeout**: 300 seconds (5 minutes)

These settings allow Claude API calls to complete without timing out.

### Resource Limits
- **Memory**: 512Mi (increased from default 256Mi)
- **CPU**: 1 (ensures responsive AI responses)
- **Max instances**: 10 (prevents unexpected scaling costs)

### Claude API Configuration
- **max_tokens**: 4096 (increased from 1024)
  - Allows longer responses even with large system prompts
  - Handles multi-turn conversations without truncation

## Monitoring

After deployment, monitor the logs:

```bash
# View logs in real-time
gcloud run services logs tail compoundingclarity --region us-central1

# View recent logs
gcloud run services logs read compoundingclarity --region us-central1 --limit 50
```

Look for:
- ✅ "Calling Claude API with X messages"
- ✅ "AI response generated: ..."
- ❌ "Claude API error" (indicates API issues)
- ❌ "Error in chat message" (indicates server issues)

## Troubleshooting

### Issue: "No response from AI"

**Possible causes:**
1. ANTHROPIC_API_KEY not set or invalid
2. API rate limit exceeded
3. Request timeout (check logs)
4. Network issues

**Solution:**
```bash
# Check if env vars are set
gcloud run services describe compoundingclarity --region us-central1 --format="value(spec.template.spec.containers[0].env)"

# View recent errors
gcloud run services logs read compoundingclarity --region us-central1 --limit 100 | grep ERROR
```

### Issue: "Request timed out"

**Solution:**
- Ensure Cloud Run timeout is set to 300 seconds
- Check that `cloudrun.yaml` is being used in deployment
- Verify server timeout settings in code

### Issue: "Session expired"

**Solution:**
- Check SESSION_SECRET is set
- Verify cookie settings in production
- Ensure APP_URL matches actual Cloud Run URL

## Health Checks

Test the deployment:

```bash
# Health check
curl https://your-service-url.run.app/api/health

# Should return:
# {"status":"ok","timestamp":"2026-01-25T..."}
```

## Rollback

If issues occur, rollback to previous revision:

```bash
# List revisions
gcloud run revisions list --service compoundingclarity --region us-central1

# Rollback to specific revision
gcloud run services update-traffic compoundingclarity \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

## Cost Optimization

Current configuration:
- Min instances: 0 (scales to zero when idle)
- Max instances: 10 (prevents runaway costs)
- Memory: 512Mi (sufficient for AI workloads)

Expected monthly cost (light usage):
- ~$5-20/month for compute
- ~$10-50/month for Claude API calls (depending on usage)
- Firestore: Free tier typically sufficient

## Security Notes

1. **Never commit secrets** - Use Google Secret Manager
2. **Restrict allowed emails** - Set ALLOWED_EMAILS environment variable
3. **Use HTTPS only** - Cloud Run enforces this by default
4. **Review firestore rules** - Ensure user data isolation

## Support

If you encounter issues:
1. Check Cloud Run logs first
2. Review this deployment guide
3. Verify all environment variables are set
4. Test locally with `npm run dev:all` before deploying
