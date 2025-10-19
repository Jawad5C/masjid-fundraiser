# Netlify Deployment Guide

## Configuration Files Created

### 1. `netlify.toml`
- Build command: `npm run build`
- Publish directory: `out`
- Node.js version: 18
- Redirects: All routes redirect to `/index.html` for client-side routing

### 2. `next.config.js`
- Static export enabled (`output: 'export'`)
- Trailing slash enabled for better routing
- Images unoptimized for static hosting

### 3. `public/_redirects`
- Handles client-side routing for all donation pages
- Ensures all routes work properly on Netlify

## Deployment Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Add Netlify configuration for static export"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Connect your GitHub repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node.js version: 18

3. **Verify Deployment**
   - Main page: `https://your-site.netlify.app/`
   - Donation pages:
     - `https://your-site.netlify.app/donate/general`
     - `https://your-site.netlify.app/donate/education`
     - `https://your-site.netlify.app/donate/prayer-hall`
     - `https://your-site.netlify.app/donate/community`

## Features Included

✅ Static export for fast loading
✅ Client-side routing for donation pages
✅ Proper redirects for all routes
✅ Optimized build for production
✅ All assets included (images, PDFs, etc.)

## Troubleshooting

If you still get 404 errors:
1. Check that the build command is `npm run build`
2. Verify publish directory is set to `out`
3. Ensure `_redirects` file is in the `out` directory
4. Check Netlify build logs for any errors
