# DevLog AI

DevLog AI is a full-stack developer productivity platform that turns GitHub commit activity into clear, reusable updates for teams.

It connects to GitHub with OAuth, fetches repository and commit data, generates AI summaries for standups and reports, and supports export flows for sharing updates.

## Highlights

- GitHub OAuth login flow with JWT-based API auth
- Repository and commit ingestion from GitHub APIs
- AI summary generation for:
  - standup updates
  - pull request notes
  - weekly reports
- Log history with filtering and pagination
- Export options:
  - copy
  - text download
  - Notion page creation
  - Slack webhook delivery
- Modern React frontend with Redux state management
- Deploy-ready split architecture (Vercel + Render)

- Live frontend: https://dev-log-ai-wheat.vercel.app/

## Architecture

- Frontend: React + Vite + Redux Toolkit + Axios + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: GitHub OAuth + JWT
- AI: Google GenAI integration
- Hosting:
  - frontend: Vercel
  - backend: Render

## Monorepo Structure

```text
dev-log-ai/
  client/   # React application (UI + auth callback handling)
  server/   # Express API (auth, github data, ai generation, export)
```

## Production Flow

1. User clicks Sign in with GitHub in frontend.
2. Frontend navigates to backend auth entrypoint.
3. Backend redirects user to GitHub OAuth.
4. GitHub redirects back to backend callback URL.
5. Backend exchanges code for token, upserts user, signs JWT.
6. Backend redirects to frontend callback route with token/user in URL fragment.
7. Frontend stores credentials and calls protected APIs.

## Environment Variables

### Backend (server/.env)

Required:

- MONGODB_URI
- PORT
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_REDIRECT_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- FRONTEND_URL
- GEMINI_API_KEY

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-backend-domain/api/auth/github/callback
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (client/.env)

Required:

- VITE_API_BASE_URL

Example:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

## GitHub OAuth App Configuration

Configure your GitHub OAuth App with:

- Homepage URL: your frontend domain
- Authorization callback URL: your backend callback route

Example production callback URL:

```text
https://your-backend-domain/api/auth/github/callback
```

Important:

- The callback URL in GitHub settings must exactly match GITHUB_REDIRECT_URI.
- Any path mismatch will produce redirect_uri validation errors.

## Local Development

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Start backend

```bash
cd server
npm run server
```

### 3) Start frontend

```bash
cd client
npm run dev
```

### 4) Open app

```text
http://localhost:5173
```

## Build Commands

Frontend:

```bash
cd client
npm run build
npm run preview
```

Backend:

```bash
cd server
npm start
```

## API Surface

Base URL:

```text
/api
```

Auth and GitHub routes:

- GET /auth/github
- GET /auth/github/callback
- GET /auth/me
- GET /auth/repos
- GET /auth/repos/:owner/:repo/commits

AI and log routes:

- GET /logs
- GET /generate/standup/:owner/:repo
- GET /generate/pr/:owner/:repo
- GET /generate/weekly/:owner/:repo
- POST /export/copy
- POST /export/download
- POST /export/notion
- POST /export/slack

Health check:

- GET /health

## Deployment Guide

### Backend on Render

1. Create a new Web Service for server.
2. Set root directory to server (if using monorepo settings).
3. Build command: npm install
4. Start command: npm start
5. Add all backend environment variables.
6. Confirm GITHUB_REDIRECT_URI points to Render backend URL.

### Frontend on Vercel

1. Import repository and set root directory to client.
2. Build command: npm run build
3. Output directory: dist
4. Add VITE_API_BASE_URL pointing to backend /api.
5. Deploy and verify login flow.
 
Live frontend URL for this project: https://dev-log-ai-wheat.vercel.app/

## Troubleshooting

### redirect_uri is not associated with this application

- Verify GitHub OAuth callback URL exactly matches GITHUB_REDIRECT_URI.
- Confirm backend response Location header contains the same redirect_uri.
- Redeploy backend after environment variable updates.

### Browser shows CORS error on protected route

- If status is 502/5xx from backend, browser may display it as CORS.
- Verify backend logs and upstream API failures.
- Test endpoints with curl to separate CORS from server failures.

### GitHub login works but frontend does not stay signed in

- Confirm frontend handles /auth/callback route.
- Confirm JWT token is persisted in local storage.
- Confirm Authorization header is attached for protected API requests.

## Security Checklist

- Rotate any leaked or shared secrets immediately.
- Use strong random JWT secret in production.
- Restrict CORS to trusted frontend domains.
- Never commit real .env values to git.
- Use separate credentials for dev and production.

## Current Status

This project is structured for production deployment with separate frontend/backend hosting and OAuth callback routing aligned to cloud domains.

## License

ISC
