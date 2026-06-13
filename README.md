# CinGen AI — Frontend

<!-- <p align="center">
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="60" alt="React" />
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/vite/vite.png" width="60" alt="Vite" />
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/redux/redux.png" width="60" alt="Redux Toolkit" />
  <img src="https://mui.com/static/logo.png" width="60" alt="Material UI" />
  <img src="https://cdn.jsdelivr.net/gh/pnpm/graphics/icon/512x512.png" width="60" alt="pnpm" />
</p> -->

<p align="center">
  <b>Real-time AI Video Generation Frontend</b><br/>
  React 19 · Vite · Redux Toolkit · Material UI · WebSocket · pnpm
</p>

---

## 🚀 Overview

CinGen AI Frontend is a **real-time control interface** for an AI-powered multi-agent video generation system.

It enables users to:
- Create AI video projects
- Send natural language prompts
- Track multi-stage generation pipelines in real time
- View scenes, scripts, and final rendered videos
- Interact with live WebSocket updates

---

## ✨ Features

- ⚡ React 19 + Vite ultra-fast UI
- 🧠 AI project-based workspace
- 🔄 Real-time job tracking (WebSocket)
- 🎬 Video generation pipeline visualization
- 📊 Step-by-step progress tracker (Script → Voice → Images → Render)
- 📁 Project + job history system
- 🎥 Scene-level media viewer
- 🔐 JWT authentication flow
- 🎨 Material UI (light mode optimized)
- 📡 Optimistic UI + retry handling

---

## 🧱 Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | React 19 |
| Build Tool | Vite |
| Package Manager | pnpm |
| State Management | Redux Toolkit |
| UI Library | Material UI (MUI v5) |
| Styling | Emotion |
| API Client | Axios |
| Routing | React Router DOM |
| Media Playback | React Player |
| Utilities | date-fns |

---

## ⚙️ Getting Started

Follow these steps to run the CinGen AI frontend locally.

---

### 1. Clone the repository

```
git clone https://github.com/JineshPrajapat/cingenai_frontend.git
cd cingen_frontend
```

### 2. Install dependencies

This project uses pnpm as the package manager.
```
pnpm install
```

### 3. Setup Environment

Create a .env file in the root directory:
```
VITE_API_BASE=http://localhost:8010/api/v1
VITE_APP_TOKEN=your_app_token_here
VITE_WS_BASE=ws://localhost:8010/api/v1
```

### 4. Run Development Server
```
pnpm dev
```

### 5. Build for Production
```
pnpm build
```

## 🚀 Notes
- Ensure backend server is running before starting frontend
- WebSocket connection is required for live job updates
- pnpm is required (do not use npm/yarn for consistency)