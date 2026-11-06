# ReverseMarket - Production Deployment Guide

ReverseMarket is architected as a **unified single-port full-stack application**. The Express engine serves the compiled React Vite production bundle and handles all WebSockets (`socket.io`) and REST APIs on a single port (`5000`).

---

## 🚀 Option 1: 1-Click Deploy on Render (Recommended)

1. Connect your GitHub repository to [Render.com](https://render.com).
2. Choose **Web Service**.
3. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas URI (or leave blank to use the high-speed in-memory fallback)
   - `JWT_SECRET`: Any random 32-character string
5. Click **Create Web Service**. Your app is live!

---

## 🚂 Option 2: Deploy on Railway

1. Push code to GitHub and create a new project on [Railway.app](https://railway.app).
2. Choose **Deploy from GitHub repo**.
3. Railway will automatically detect the `Dockerfile` or `package.json` and build the container.
4. Add `PORT=5000` in variables.

---

## 🐳 Option 3: Docker / Self-Hosted VPS (DigitalOcean / AWS / Linode)

To run anywhere with Docker Compose:

```bash
docker-compose up -d --build
```

Your app will be live on `http://YOUR_SERVER_IP:5000` with automated MongoDB container provisioning.

---

## 💻 Local Testing & Verification

1. Start server:
   ```bash
   node backend/src/server.js
   ```
2. Open browser:
   **http://localhost:5000**
