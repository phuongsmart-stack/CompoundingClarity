#!/bin/bash

# CompoundingClarity Cloud Run Deployment Script
# This script builds and deploys the application to Google Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GOOGLE_PROJECT_ID:-}"
SERVICE_NAME="compoundingclarity"
REGION="${REGION:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}==>${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed"
    echo "Install it with: brew install google-cloud-sdk"
    echo "Then run: gcloud auth login"
    exit 1
fi

# Check if project ID is set
if [ -z "$PROJECT_ID" ]; then
    print_error "GOOGLE_PROJECT_ID is not set"
    echo "Set it with: export GOOGLE_PROJECT_ID=your-project-id"
    echo "Or run: gcloud config set project your-project-id"
    exit 1
fi

# Verify required environment variables
print_status "Checking required environment variables..."
REQUIRED_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "ANTHROPIC_API_KEY"
    "SESSION_SECRET"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Set them with:"
    echo "  export GOOGLE_CLIENT_ID=your-client-id"
    echo "  export GOOGLE_CLIENT_SECRET=your-client-secret"
    echo "  export ANTHROPIC_API_KEY=your-api-key"
    echo "  export SESSION_SECRET=\$(openssl rand -base64 32)"
    exit 1
fi

# Set project
print_status "Setting GCP project to: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# Enable required APIs
print_status "Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    firestore.googleapis.com \
    --quiet

# Build the application
print_status "Building frontend..."
npm run build

# Build and push Docker image
print_status "Building and pushing Docker image..."
gcloud builds submit --tag "$IMAGE_NAME" --timeout=10m

# Get the deployed service URL (if it exists) or construct expected URL
APP_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --format="value(status.url)" 2>/dev/null || echo "")

if [ -z "$APP_URL" ]; then
    # First deployment - construct expected URL
    APP_URL="https://${SERVICE_NAME}-$(gcloud config get-value project | cut -d'-' -f1)-${REGION}.run.app"
    print_warning "First deployment detected. Using expected URL: $APP_URL"
    echo "Note: You may need to update GOOGLE_CALLBACK_URL in Google Console after deployment"
fi

# Deploy to Cloud Run
print_status "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_NAME" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --timeout=300 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --set-env-vars="NODE_ENV=production,PORT=8080,APP_URL=${APP_URL},GOOGLE_PROJECT_ID=${PROJECT_ID},FRONTEND_URL=${APP_URL}" \
    --set-env-vars="GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID},GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET},ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY},SESSION_SECRET=${SESSION_SECRET}" \
    --set-env-vars="ALLOWED_EMAILS=${ALLOWED_EMAILS:-}" \
    --quiet

# Get the deployed service URL
DEPLOYED_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --format="value(status.url)")

# Success message
echo ""
print_status "Deployment successful! 🎉"
echo ""
echo "Service URL: $DEPLOYED_URL"
echo ""
echo "Next steps:"
echo "1. Update Google OAuth callback URL to: ${DEPLOYED_URL}/api/auth/google/callback"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Edit your OAuth 2.0 Client ID"
echo "   - Add the callback URL to 'Authorized redirect URIs'"
echo ""
echo "2. Test your application: $DEPLOYED_URL"
echo ""
echo "To view logs, run:"
echo "  gcloud run services logs read $SERVICE_NAME --region=$REGION --limit=50"
