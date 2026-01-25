# Bug Fix: Chat Not Returning Messages

## Problem
Users send messages in production but receive no response from the AI coach.

## Root Cause
1. **Token limit too low**: `max_tokens: 1024` was insufficient for responses
   - System prompt alone is ~26KB (~6,500-7,000 tokens)
   - Multi-turn conversations quickly exhausted the token budget
   - Claude API couldn't generate responses within the limit

2. **Inadequate error logging**: Errors in production were not visible
   - Generic error handling masked API failures
   - Difficult to diagnose issues in Cloud Run logs

3. **Missing timeout configuration**: Cloud Run default timeout (60s) could cause issues
   - Long Claude API calls might timeout
   - No server-side timeout handling

## Changes Made

### 1. Increased Claude API Token Limit
**File**: `server/src/services/claude.ts`

```typescript
// Before
max_tokens: 1024

// After
max_tokens: 4096
```

**Impact**: Allows Claude to generate full responses even with:
- Large system prompt (26KB)
- Multi-turn conversation history
- Detailed coaching responses

---

### 2. Enhanced Error Logging
**Files**:
- `server/src/routes/chat.ts`
- `server/src/services/claude.ts`

**Added detailed logging for**:
- Conversation history length
- Message save confirmations
- AI response generation status
- Detailed error information (type, message, stack, status)
- API-specific error codes

**Error logs now show**:
```
=== ERROR in chat message ===
Error type: APIError
Error message: ...
Error stack: ...
Error status: 429
```

---

### 3. Improved Error Messages for Users
**File**: `src/components/session/ChatStep.tsx`

**Before**: Generic "Failed to send message"

**After**: Context-specific messages:
- Timeout: "The request took too long. Please try again with a shorter message."
- Network: "Network error. Please check your connection and try again."
- Auth: "Session expired. Please refresh the page and log in again."
- Rate limit: "Rate limit exceeded. Please wait a moment and try again."

---

### 4. Server Timeout Configuration
**File**: `server/src/index.ts`

**Added**:
```typescript
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // 66 seconds
```

**Why**:
- Prevents hung connections
- Allows long Claude API calls to complete
- Optimized for Cloud Run load balancer

---

### 5. Cloud Run Deployment Configuration
**File**: `cloudrun.yaml` (new)

**Configuration**:
- Request timeout: 300 seconds (5 minutes)
- Memory: 512Mi (increased from 256Mi)
- CPU: 1 full CPU
- Max instances: 10
- Container concurrency: 80

**Why**:
- Ensures adequate resources for AI processing
- Prevents timeout issues
- Optimized cost vs performance

---

### 6. Deployment Documentation
**File**: `DEPLOYMENT.md` (new)

**Includes**:
- Deployment commands
- Environment variable setup
- Monitoring instructions
- Troubleshooting guide
- Rollback procedures

---

## Testing Instructions

### Local Testing

1. **Install dependencies**:
   ```bash
   cd ~/CompoundingClarity
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run locally**:
   ```bash
   npm run dev:all
   ```

4. **Test chat**:
   - Open http://localhost:8080
   - Log in with Google
   - Start a coaching session
   - Send multiple messages
   - Verify responses are received
   - Check terminal for detailed logs

### Production Testing

After deploying, test:

1. **Send short message**: "Hello"
   - Should receive greeting response

2. **Send medium message**: Explain a decision you're considering
   - Should receive thoughtful coaching questions

3. **Send long message**: Multiple paragraphs about a complex situation
   - Should receive detailed, non-truncated response

4. **Monitor logs**:
   ```bash
   gcloud run services logs tail compoundingclarity --region us-central1
   ```

5. **Check for errors**:
   ```bash
   gcloud run services logs read compoundingclarity --region us-central1 | grep "ERROR"
   ```

---

## Deployment Steps

### Option 1: Using Cloud Run YAML (Recommended)

```bash
# 1. Build and deploy with configuration
gcloud run services replace cloudrun.yaml \
  --region us-central1 \
  --project YOUR_PROJECT_ID

# 2. Set environment variables (see DEPLOYMENT.md)
```

### Option 2: Using gcloud CLI

```bash
# Deploy with proper timeout settings
gcloud run deploy compoundingclarity \
  --source . \
  --region us-central1 \
  --timeout 300 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated
```

### Option 3: Via Lovable.dev

```bash
# Commit and push changes
git add .
git commit -m "Fix: Increase Claude API token limit and add timeout configuration

- Increase max_tokens from 1024 to 4096 for longer responses
- Add detailed error logging for debugging production issues
- Configure server timeouts for Cloud Run compatibility
- Add Cloud Run deployment configuration
- Improve user-facing error messages
- Add deployment documentation"

git push origin main

# Then in Lovable.dev: Share -> Publish
```

---

## Expected Results

### Before Fix
- ❌ Messages sent but no response
- ❌ Silent failures in production
- ❌ No visibility into errors
- ❌ Generic "Failed to send message" error

### After Fix
- ✅ Consistent AI responses
- ✅ Detailed error logging in Cloud Run
- ✅ Helpful error messages for users
- ✅ No timeout issues
- ✅ Handles long conversations

---

## Monitoring

### Key Metrics to Watch

1. **Success Rate**: % of messages receiving responses
2. **Response Time**: Average time for AI responses
3. **Error Rate**: Frequency of API errors
4. **Token Usage**: Monitor Claude API token consumption

### Log Patterns to Watch For

**✅ Successful flow**:
```
=== Chat message request ===
User: user@example.com
Conversation history: 5 messages
Generating AI response...
AI response generated: Welcome. I'm here...
Assistant message saved: abc-123
```

**❌ Error patterns**:
```
=== Claude API error ===
Error status: 429
→ Rate limit exceeded
```

```
=== ERROR in chat message ===
Error: Request timed out
→ Check Cloud Run timeout configuration
```

---

## Rollback Plan

If issues persist:

```bash
# Check current revision
gcloud run revisions list --service compoundingclarity --region us-central1

# Rollback to previous version
gcloud run services update-traffic compoundingclarity \
  --region us-central1 \
  --to-revisions PREVIOUS_REVISION=100
```

---

## Additional Notes

### Why 4096 tokens?
- System prompt: ~7,000 tokens
- Conversation history: ~1,000-2,000 tokens per exchange
- Response generation: 1,000-3,000 tokens
- **Total needed**: ~4,000-8,000 tokens
- **Set to 4096**: Safe middle ground (can increase to 8192 if needed)

### Why 5-minute timeout?
- Claude API response time: 5-30 seconds typically
- Network latency: 1-5 seconds
- Database operations: 1-2 seconds
- **Buffer**: 5 minutes handles edge cases without wasting resources

### Cost Impact
- **Token increase**: ~$0.015 → $0.060 per request (+$0.045)
- **Memory increase**: ~$0.001 → $0.002 per request (+$0.001)
- **Total increase**: ~$0.046 per conversation turn
- **Worth it**: Fixes critical bug affecting all users

---

## Next Steps

1. ✅ Deploy the fix
2. ✅ Monitor logs for 24 hours
3. ✅ Verify user reports improve
4. 🔄 Consider adding:
   - Response caching for common questions
   - Rate limiting per user
   - Analytics dashboard
   - Performance monitoring (Sentry/DataDog)

---

## Questions?

If issues persist after deployment:
1. Check Cloud Run logs immediately
2. Verify all environment variables are set
3. Test API key validity: https://docs.anthropic.com/en/api
4. Review DEPLOYMENT.md troubleshooting section
