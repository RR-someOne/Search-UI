# GitHub Pages Setup Guide

## The Problem
The error "Get Pages site failed" indicates that GitHub Pages is not properly enabled for your repository. This is a **manual step** that needs to be done in the GitHub web interface.

## Solution: Enable GitHub Pages Manually

### Step 1: Go to Repository Settings
1. Navigate to: `https://github.com/RR-someOne/Search-UI/settings`
2. Scroll down to find **"Pages"** in the left sidebar
3. Click on **"Pages"**

### Step 2: Configure GitHub Pages
1. Under **"Source"**, select **"GitHub Actions"** (NOT "Deploy from a branch")
2. Click **"Save"**

### Step 3: Add Required Secrets (Optional but Recommended)
1. Go to: `https://github.com/RR-someOne/Search-UI/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add:
   - **Name**: `REACT_APP_GOOGLE_CLIENT_ID`
   - **Value**: Your Google OAuth Client ID
4. Click **"Add secret"**

### Step 4: Verify Deployment
After enabling Pages, your GitHub Actions workflow will automatically run and deploy your app to:
**`https://rr-someone.github.io/Search-UI`**

## Alternative: Manual Deployment Check

If the above steps don't work, you can also manually trigger the deployment:

1. Go to: `https://github.com/RR-someOne/Search-UI/actions`
2. Click on the latest workflow run
3. If it failed, click **"Re-run jobs"**
4. Or click **"Run workflow"** to manually trigger a new deployment

## Troubleshooting

### If you see "404 - Page not found":
- Wait 5-10 minutes after first deployment
- Check that the workflow completed successfully
- Verify the homepage URL in package.json matches your repository name

### If the app loads but Google login doesn't work:
- Add the `REACT_APP_GOOGLE_CLIENT_ID` secret (Step 3 above)
- Make sure the Client ID is configured for the correct domain in Google Cloud Console

## Quick Commands to Test Locally

```bash
# Build and test production version locally
npm run build
npm run serve

# Then visit: http://localhost:3000
```

This will let you test the production build before deploying.