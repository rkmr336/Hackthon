# PulseDesk - Agent Log & Evidence

## Project Overview
**PulseDesk** is an AI-powered customer support helpdesk built for Forge 2 Hackathon.

**Live URL:** https://hackthon-mauve.vercel.app/  
**GitHub Repo:** https://github.com/rkmr336/Hackthon

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | password |
| Customer | customer@test.com | password |

---

## Key Features Built

1. **Role-based Login** - Admin and Customer separate dashboards
2. **AI Auto-Reply** - Typing animation, auto-generates professional support reply
3. **Slack Integration** - Real-time notifications via Vercel serverless proxy
4. **Ticket Lifecycle** - Create → Open → Pending → Resolved → Closed
5. **Glassmorphism Dark UI** - Premium cyberpunk theme

---

## How to Run / Judge

1. Open https://hackthon-mauve.vercel.app/
2. Select **"Customer Login"** → Login with any email/password → Create a ticket
3. Logout → Select **"Admin Login"** → Login
4. Open the ticket → Click **"🤖 AI Auto-Reply"**
5. Check Slack **#all-pulsedesk-team** for real-time notification
6. Click **"Mark as Resolved"** or **"Close Ticket"**

---

## Sprints

| Sprint | What was built |
|--------|----------------|
| 1 | Project setup, mock API, basic ticket CRUD |
| 2 | Dashboard with charts (Recharts), dark theme |
| 3 | AI Auto-Reply with typing animation |
| 4 | Role-based auth (Admin vs Customer views) |
| 5 | Glassmorphism UI revamp, Login role toggle |
| 6 | Slack integration via Vercel serverless proxy (CORS fix) |

---

## Models Used

- **Gemini 2.5 Pro** - Architecture, complex UI components, bug fixes
- **Gemini 2.5 Flash** - Quick iterations, styling tweaks

---

## Screenshots

- `evidence/screenshot-01-dashboard.png` - Admin Dashboard with analytics
- `evidence/screenshot-02-slack.png` - Slack notification from PulseDesk Bot

---

## Slack Integration Details

- **Channel:** #all-pulsedesk-team (`C0BDLC9BMC2`)
- **Trigger:** New ticket created, AI reply generated, ticket resolved/closed
- **Architecture:** Frontend → `/api/slack-notify` (Vercel serverless) → Slack API
- **CORS Fix:** Direct browser→Slack calls were blocked, solved with server-side proxy

---

## Architecture

```
Browser (React + Vite)
    ↓
Vercel CDN (hackthon-mauve.vercel.app)
    ↓
/api/slack-notify (Vercel Serverless Function)
    ↓
Slack API (chat.postMessage)
```

Data storage: localStorage (mock API for hackathon demo)
