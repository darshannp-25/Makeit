# Deployment Strategy for Full-Stack File Converter App

## Overview
This plan outlines the deployment of a Next.js frontend on Vercel and a Flask backend on Render, both using free tiers with GitHub integration.

## Prerequisites
- GitHub repository containing the project code
- Vercel account linked to GitHub
- Render account linked to GitHub

## Backend Deployment (Render)

### Platform Configuration
- **Service Type**: Web Service
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
- **Root Directory**: `backend`

### Environment Variables
- `PORT`: Automatically set by Render (default 10000)
- No additional variables required for basic functionality

### Code Changes Required
Modify `backend/app.py` to use dynamic base URL for download links:

```python
# Replace line 128:
"download_url": f"http://localhost:5000/download/{output_filename}",

# With:
base_url = os.environ.get('RENDER_EXTERNAL_URL', 'http://localhost:5000')
"download_url": f"{base_url}/download/{output_filename}",
```

Note: Render provides `RENDER_EXTERNAL_URL` environment variable with the service URL.

### Deployment Steps
1. Log in to Render dashboard
2. Click "New" > "Web Service"
3. Connect GitHub repository
4. Select branch (main/master)
5. Configure settings as above
6. Deploy

## Frontend Deployment (Vercel)

### Platform Configuration
- **Framework**: Next.js (detected automatically via `vercel.json`)
- **Root Directory**: `frontend`
- **Build Settings**: Default (Next.js handles build)

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Set to the Render backend URL (e.g., `https://your-app.onrender.com`)

### Code Changes Required
No changes needed. The frontend already uses `process.env.NEXT_PUBLIC_API_URL` with localhost fallback.

### Deployment Steps
1. Log in to Vercel dashboard
2. Click "New Project"
3. Import GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
5. Add environment variable: `NEXT_PUBLIC_API_URL` = Render service URL
6. Deploy

## Integration Steps
1. Deploy backend to Render first to obtain the service URL
2. Update Vercel's `NEXT_PUBLIC_API_URL` environment variable with the Render URL
3. Redeploy frontend on Vercel
4. Test the full application:
   - Frontend loads on Vercel
   - API calls reach Render backend
   - File conversions work end-to-end
   - Download links work correctly

## CORS Configuration
- Flask-CORS is enabled globally in the backend, allowing all origins
- For production security, consider restricting origins to the Vercel domain:
  ```python
  CORS(app, origins=["https://your-app.vercel.app"])
  ```
- Update the origins list after frontend deployment

## Monitoring and Maintenance
- Render free tier: 750 hours/month, sleeps after 15 minutes of inactivity
- Vercel free tier: Unlimited static sites, 100GB bandwidth
- Monitor logs in respective dashboards for errors
- Update dependencies periodically for security

## Potential Issues and Solutions
- **Cold starts**: Render free tier may have startup delays
- **File storage**: Temporary files are cleaned up after 10 minutes; ensure this is sufficient
- **Domain**: Use custom domains if needed (paid features)
- **Environment variables**: Ensure variables are set correctly and redeploy after changes