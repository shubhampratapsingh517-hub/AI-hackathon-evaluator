# 🤖 AI Hackathon Evaluator

A premium, full-stack hackathon management and AI-powered evaluation platform. This system automates the grading process of hackathon projects using Gemini AI, provides real-time leaderboard updates, and features a sleek, high-tech dark-mode interface.

## 🚀 Tech Stack

### Frontend
- **React 19** + **Vite 6**
- **Tailwind CSS 4** (Modern utility-first styling)
- **Motion (Framer Motion)** (Smooth animations & micro-interactions)
- **Lucide React** (Iconography)
- **Recharts** (Dashboard analytics)

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** (Cloud NoSQL Database)
- **Socket.io** (Real-time leaderboard & event updates)
- **Google Gemini 1.5 Flash** (AI Evaluation Engine)
- **JWT & Bcryptjs** (Secure Authentication)

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (Free tier works)
- Google AI Studio API Key (for Gemini)

### 2. Clone and Setup
```bash
git clone <your-repo-url>
cd AI-hackathon-evaluator
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_cluster_uri
   JWT_SECRET=your_random_secret_key
   GOOGLE_API_KEY=your_gemini_api_key
   ALLOWED_ORIGINS=http://localhost:3000
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## ☁️ Deployment Guide

### Recommended: [Render.com](https://render.com)

#### Deploying Backend (Web Service)
1. New -> **Web Service**.
2. Connect your GitHub Repo.
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `cd backend && npm start`
5. **Environment Variables**: Add all keys from your backend `.env`.

#### Deploying Frontend (Static Site)
1. New -> **Static Site**.
2. Connect your GitHub Repo.
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**: Add `VITE_API_URL` pointing to your backend Render URL.

---

## 🔑 Default Credentials
- **Admin Email**: `admin@hackathon.com`
- **Admin Password**: `admin`
*(Note: Change these immediately after first login)*

## 🛡️ Features
- **AI Scoring**: Evaluation based on UI/UX, Technical Complexity, Innovation, and Performance.
- **Real-time Leaderboard**: Instant rank updates via WebSockets.
- **Admin Dashboard**: Manage teams, post announcements, and trigger AI evaluations.
- **Team Dashboard**: Submit projects, view scores, and track competition status.

---
© 2026 AI HACKATHON EVALUATOR
