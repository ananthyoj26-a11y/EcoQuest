# 🌱 EcoQuest — Campus Sustainability Gaming Platform

> **PLAY FOR THE PLANET.** A premium, production-ready sustainability gaming platform for Saranathan College of Engineering.

## 🎮 Overview

EcoQuest turns real-world sustainability actions into a campus-wide RPG — students complete eco quests, verify them with AI, earn XP & Eco Coins, evolve their Eco Spirit, and compete in department guild wars.

**Core Flow:**
Landing → Google/Email Login → 6-Step Onboarding → Choose Avatar → Eco Goals → Personalized Quests → Real-World Action → AI Verification → XP/Coins/Badges → Avatar Evolution → Campus Competition → Measurable Impact

---

## Quick Start

### 1. Install Dependencies
npm install

### 2. Configure Environment
cp .env.example .env
# Fill in your Firebase + Supabase + Gemini API credentials

### 3. Run Locally
npm run dev
# Opens on http://localhost:3000

### 4. Production Build
npm run build
npm start

---

## Firebase Setup

1. Create a Firebase project at console.firebase.google.com
2. Enable Authentication with Google provider and Email/Password
3. Add your domains to Auth > Authorized Domains: localhost, your-app.vercel.app
4. Create a Firestore Database in production mode
5. Deploy security rules: firebase deploy --only firestore:rules
6. Copy your Web App config to .env

---

## Supabase Setup (Optional)

EcoQuest uses Supabase as a secondary analytics database. If not configured, it gracefully falls back to Firestore-only mode.

1. Create a project at supabase.com
2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env

---

## Vercel Deployment

1. Push code to GitHub
2. Import repository in vercel.com
3. Add all environment variables in Vercel Dashboard > Settings > Environment Variables
4. Deploy

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| users/{uid} | Root identity doc |
| userProfiles/{uid} | Profile, avatar, preferences |
| userProgress/{uid} | XP, level, eco spirit, streaks |
| userImpact/{uid} | Environmental impact metrics |
| userAvatars/{uid} | Avatar cosmetics |
| userAchievements/{uid} | Badges, milestones |
| userNotifications/{uid} | In-app notifications |
| userPreferences/{uid} | Settings |

---

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Styling: TailwindCSS v4 + custom CSS animations
- Animation: Framer Motion
- Auth: Firebase Authentication (Google + Email/Password)
- Database: Firestore (primary) + Supabase (secondary)
- AI: Google Gemini API
- Backend: Express.js
- Deployment: Vercel

EcoQuest v3.6 -- Saranathan College of Engineering Campus Arena
