# GitHub Pages Deployment Guide

This guide explains how to deploy the Spannerly application to GitHub Pages.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Repository Settings**: You need admin access to configure GitHub Pages

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

### 2. Configure Repository Settings

1. In the **Pages** settings, ensure the source is set to **GitHub Actions**
2. The custom domain field can be left empty for now
3. Enable **Enforce HTTPS** (recommended)

### 3. Workflow Configuration

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- Triggers on pushes to the `main` branch
- Can be manually triggered via workflow dispatch
- Runs tests before deployment
- Builds the Next.js application with production settings
- Deploys to GitHub Pages

### 4. First Deployment

1. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Check Workflow Status**:
   - Go to the **Actions** tab in your GitHub repository
   - Watch the deployment workflow run
   - Ensure all steps complete successfully

3. **Access Your Site**:
   - After successful deployment, your site will be available at:
   - `https://YOUR_USERNAME.github.io/Spannerly`
   - Replace `YOUR_USERNAME` with your actual GitHub username

## Configuration Details

### Next.js Configuration

The `next.config.js` is configured to:
- Export static files for GitHub Pages
- Use conditional `basePath` for production
- Optimize images for static hosting

### Environment Handling

- **Development**: Runs on `http://localhost:3000`
- **Production**: Uses `/Spannerly` base path for GitHub Pages

### Automatic Deployment

Every push to the `main` branch will trigger a new deployment:

1. **Build Process**:
   - Install dependencies
   - Run tests
   - Build Next.js application
   - Export static files

2. **Deployment**:
   - Upload artifacts to GitHub Pages
   - Deploy to live site

## Troubleshooting

### Common Issues

1. **404 Errors**:
   - Ensure `basePath` is correctly configured
   - Check that `.nojekyll` file exists in `public/` folder

2. **Build Failures**:
   - Check the Actions tab for error details
   - Ensure all tests pass locally
   - Verify dependencies are correctly listed

3. **Theme Not Loading**:
   - Check browser console for errors
   - Ensure all static assets use relative paths

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab
2. Select **Deploy Next.js to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow** button

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update the domain in GitHub Pages settings

## Security Considerations

- The workflow uses `GITHUB_TOKEN` with appropriate permissions
- No sensitive data should be committed to the repository
- Environment variables can be added in repository secrets if needed

## Monitoring

- Monitor deployments in the **Actions** tab
- Check the **Environment** section for deployment history
- Set up notifications for failed deployments if needed

---

After following these steps, your Spannerly application will be automatically deployed to GitHub Pages whenever you push changes to the main branch.
