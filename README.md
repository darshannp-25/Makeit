# MakeIt - Professional File Converter

## Structure
- `frontend/`: Next.js Web App
- `backend/`: Python Flask API

## Quick Start
1. **Backend**: `cd backend && pip install -r requirements.txt && python app.py`
2. **Frontend**: `cd frontend && npm install && npm run dev`

## Deployment to Live (Free)

### 1. Backend (Render)
1. Fork/Clone this repo to your GitHub.
2. Sign up on [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your repository.
5. Click **Apply**. Render will read `render.yaml`, build, and deploy the backend.
6. Copy the **Service URL** (e.g., `https://makeit-backend.onrender.com`).

### 2. Frontend (Vercel)
1. Sign up on [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your repository.
4. **Important**: Change **Root Directory** to `frontend`.
5. Add an **Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your Render Backend URL (from Step 1)
6. Click **Deploy**.

Your app is now live!
