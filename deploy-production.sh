#!/bin/bash

# Production Deployment Script
# This script prepares and triggers production deployment

echo "🚀 Starting Production Deployment Process..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Must be on main branch for production deployment"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean"
    echo "Please commit or stash your changes before deploying"
    git status
    exit 1
fi

# Run tests to ensure quality
echo "🧪 Running test suite..."
npm run test:ci
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Aborting deployment."
    exit 1
fi

# Build the application
echo "🔨 Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

# Create a production deployment commit if there are any new changes
echo "📝 Checking for deployment updates..."
git add .
if [ -n "$(git diff --staged)" ]; then
    echo "📦 Creating production deployment commit..."
    git commit -m "Production deployment - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Push to trigger GitHub Actions deployment
echo "🚀 Pushing to main branch (triggers GitHub Pages deployment)..."
git push origin main

echo "✅ Production deployment initiated!"
echo "📱 Your app will be available at: https://rr-someone.github.io/Search-UI"
echo "🔍 Monitor deployment progress at: https://github.com/RR-someOne/Search-UI/actions"
echo ""
echo "⏰ Deployment typically takes 2-5 minutes to complete."
echo "🔄 The site may take additional time to propagate across GitHub's CDN."