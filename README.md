# 🌱 EcoQuest — Campus Sustainability Gaming Platform

> **PLAY FOR THE PLANET.**  
> Transform campus environmental actions into a multiplayer RPG experience with AI verification, gaming avatars, department guild wars, and measurable sustainability metrics.  
> *Saranathan College of Engineering Campus Arena*

---

## 🚀 Quick Overview

EcoQuest turns real-world sustainable actions into an engaging gaming platform. Students log in, customize gaming avatars, select eco goals, complete campus sustainability quests, verify proof using Google Gemini AI, earn XP & Eco Coins, evolve their digital Eco Spirit, and lead their Department Guild to campus victory.

```text
Real-World Eco Action ➔ AI Proof Verification ➔ XP + Eco Coins ➔ Avatar & Eco Spirit Progression ➔ Guild Victory
```

---

## 🔥 Key Features

- **🔐 Dual Authentication System**: Firebase Auth with Google OAuth 2.0 Sign-In + Email/Password sign-up & sign-in.
- **👤 28+ Gaming Avatars**: Choose from Eco Guardians, Cyber Rangers, Solar Sentinels, Bio Alchemists, and custom outfits.
- **✨ 6-Step Hero Onboarding**: Personalize name, college, department guild, sustainability interests, and weekly goals.
- **🤖 Gemini AI Vision Verification**: Upload photo proof of your eco action for real-time AI validation and reward distribution.
- **🐾 Eco Spirit Digital Companion**: Evolve your companion from a tiny *Sproutling* to a *Planetary Guardian*.
- **🏰 Department Guild Wars**: Compete across AI & DS, ECE, CSE, Mechanical, IT, Biotech, Civil, and EEE guilds.
- **🗺️ Eco World Map & Eco Pet Arena**: Interactive 3D/2D visual campus ecosystem that grows as actions are completed.
- **🗄️ Dual Database Architecture**: Primary Firestore DB + Supabase SQL analytics dual-sync with offline IndexedDB fallback.
- **📱 PWA & Cross-Device Ready**: Fully responsive mobile/desktop UI with ambient particle systems, spatial audio, and haptic feedback.

---

## ⚡ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion)
- **Authentication**: Firebase Auth (Google Sign-In & Email/Password)
- **Databases**: Firebase Firestore + Supabase PostgreSQL
- **Artificial Intelligence**: Google Gemini 2.5/3.0 Vision API & AI Sustainability Coach
- **Server**: Express.js + Node.js (Vercel Serverless Ready)

---

## 🛠️ Local Development & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ananthyoj26-a11y/EcoQuest.git
cd EcoQuest
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your keys:

```env
# Gemini AI
GEMINI_API_KEY="your_gemini_api_key_here"

# App URL
VITE_APP_URL="http://localhost:3000"

# Firebase Web SDK Configuration
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="107116..."
VITE_FIREBASE_APP_ID="1:107116..."

# Supabase Configuration
VITE_SUPABASE_URL="https://wywhxwboyoerntqwajuo.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Database Setup

To set up the Supabase database schema:

1. Open your Supabase Dashboard → **SQL Editor** → **New Query**.
2. Run the idempotent SQL script located at:
   [`supabase_schema.sql`](file:///C:/Users/Ananth/.gemini/antigravity/brain/2989af86-661a-4bc1-a208-924cc9fa4f9a/supabase_schema.sql)
3. The script safely creates all tables, triggers, indexes, and Row Level Security (RLS) policies:
   - `user_profiles`, `user_progress`, `user_impact`, `user_avatars`, `user_achievements`, `user_notifications`, `user_preferences`
   - `quests`, `live_activities`, `leaderboard`
   - Views: `campus_leaderboard`, `department_leaderboard`, `campus_impact`

---

## 🚢 Deployment (Vercel)

EcoQuest is optimized for instant deployment on Vercel:

1. Connect your repository to Vercel.
2. Set Environment Variables in Vercel Project Settings (`VITE_FIREBASE_*`, `GEMINI_API_KEY`, `VITE_SUPABASE_*`).
3. Deploy! The included [`vercel.json`](vercel.json) handles single-page application routing and serverless function distribution.

---

## 📄 License & Credits

Developed for Saranathan College of Engineering Campus Sustainability Arena.  
EcoQuest v3.6 • Play for the Planet 🌍