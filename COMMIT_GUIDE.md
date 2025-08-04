# Commit and Deploy Checklist

Before deploying to GitHub Pages, follow this checklist:

## Pre-deployment Checklist

### 1. Test Locally
```bash
# Run tests
npm test

# Test build process
npm run build

# Test the production build locally (optional)
npm run serve:static
```

### 2. Commit Changes
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add theme customization and GitHub Pages deployment"

# Push to main branch (triggers deployment)
git push origin main
```

### 3. Monitor Deployment

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Watch the "Deploy Next.js to GitHub Pages" workflow
4. Ensure all steps complete successfully

### 4. Verify Deployment

1. After successful deployment, visit:
   `https://YOUR_USERNAME.github.io/Spannerly`

2. Test key features:
   - [ ] All tool categories load
   - [ ] Theme switching works
   - [ ] Tools open in modals
   - [ ] Theme preferences persist after page reload

## Quick Commands

```bash
# Full deployment test
npm run deploy:test

# Run development server
npm run dev

# Run tests only
npm test

# Build for production
npm run build
```

## Troubleshooting

If deployment fails:

1. Check the Actions tab for error details
2. Ensure all tests pass locally
3. Verify the build completes without errors
4. Check the Issues tab for known problems

## First-Time Setup

If this is your first deployment:

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch
4. Wait for deployment to complete

Your site will be available at:
`https://YOUR_USERNAME.github.io/Spannerly`
