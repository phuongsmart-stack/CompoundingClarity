#!/bin/bash

# Environment Setup Script
# This script helps you set up your .env file for deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}CompoundingClarity Environment Setup${NC}"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}Warning: .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env from example
cp .env.example .env
echo -e "${GREEN}✓${NC} Created .env file from template"
echo ""

# Function to prompt for input
prompt_for() {
    local var_name=$1
    local description=$2
    local default=$3
    local secret=$4

    echo -e "${BLUE}$var_name${NC}"
    echo "  $description"

    if [ -n "$default" ]; then
        echo "  Default: $default"
    fi

    if [ "$secret" == "true" ]; then
        read -s -p "  Enter value: " value
        echo ""
    else
        read -p "  Enter value: " value
    fi

    if [ -z "$value" ] && [ -n "$default" ]; then
        value=$default
    fi

    # Update .env file
    if grep -q "^${var_name}=" .env; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^${var_name}=.*|${var_name}=${value}|" .env
        else
            sed -i "s|^${var_name}=.*|${var_name}=${value}|" .env
        fi
    else
        echo "${var_name}=${value}" >> .env
    fi

    echo -e "${GREEN}✓${NC} Set $var_name"
    echo ""
}

echo "Let's set up your environment variables:"
echo ""

# Google Project ID
prompt_for "GOOGLE_PROJECT_ID" \
    "Your Google Cloud Project ID (e.g., my-project-123456)" \
    "" \
    "false"

# Google OAuth
echo "Get these from: https://console.cloud.google.com/apis/credentials"
echo ""
prompt_for "GOOGLE_CLIENT_ID" \
    "Google OAuth Client ID" \
    "" \
    "false"

prompt_for "GOOGLE_CLIENT_SECRET" \
    "Google OAuth Client Secret" \
    "" \
    "true"

# Anthropic API Key
echo ""
echo "Get this from: https://console.anthropic.com/"
echo ""
prompt_for "ANTHROPIC_API_KEY" \
    "Anthropic API Key (starts with sk-ant-)" \
    "" \
    "true"

# Session Secret
echo ""
echo "Generating secure session secret..."
SESSION_SECRET=$(openssl rand -base64 32)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^SESSION_SECRET=.*|SESSION_SECRET=${SESSION_SECRET}|" .env
else
    sed -i "s|^SESSION_SECRET=.*|SESSION_SECRET=${SESSION_SECRET}|" .env
fi
echo -e "${GREEN}✓${NC} Generated and set SESSION_SECRET"
echo ""

# Allowed Emails
prompt_for "ALLOWED_EMAILS" \
    "Allowed email addresses (comma-separated, leave empty for all)" \
    "" \
    "false"

# Success
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Environment setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Your .env file has been created with all required variables."
echo ""
echo "Next steps:"
echo "1. Review your .env file: cat .env"
echo "2. Update Google OAuth callback URL after first deployment"
echo "3. Deploy: ./deploy.sh"
echo ""
