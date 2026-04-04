# 🖥️ LifeOS — Frontend

> A production-grade personal productivity dashboard. Track DSA progress, fitness, daily tasks, and streaks — all in one premium interface.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Overview

LifeOS Frontend is the client-side of the LifeOS personal operating system. It connects to the [LifeOS Backend](https://github.com/sahilkriplani/lifeos-backend) via REST APIs and delivers a fast, animated, and beautifully crafted dashboard experience.

**Modules:**
- 📊 **DSA Tracker** — Log and visualize LeetCode/GFG problems by topic and difficulty
- 🏋️ **Fitness Tracker** — Daily weight, calorie, and step logs with trend charts
- 📅 **Daily Planner** — Full CRUD task management with priority levels and date picker
- 🔥 **Streak System** — Daily activity streaks with visual calendar heatmap
- 🎯 **Goals** — Long-term goal tracking with progress rings
- 📈 **Analytics** — Charts and trends across all modules

---

## 🧰 Tech Stack

| Category | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui (Radix-based) | Latest |
| Animations | Framer Motion | 12.x |
| Client State | Zustand | 5.x |
| Server State | TanStack Query | 5.x |
| Forms | React Hook Form + Yup | 7.x / 1.x |
| HTTP Client | Axios | 1.x |
| Theming | next-themes | 0.4.x |
| Icons | Lucide React | Latest |

---

## 🎨 Design System

**Style:** Glassmorphism — translucent cards, backdrop blur, layered depth  
**Theme:** Teal Noir — full dark + light mode  
**Motion:** Framer Motion — entrance animations, hover effects, page transitions  
**Inspiration:** Linear, Stripe, Vercel, Apple dashboards

### Color Tokens

| Token | Dark Mode | Light Mode |
|---|---|---|
| `background` | `#060F0E` | `#F0FDFA` |
| `primary` | `#14B8A6` | `#0D9488` |
| `secondary` | `#2DD4BF` | `#14B8A6` |
| `accent` | `#5EEAD4` | `#2DD4BF` |
| `border` | `rgba(20,184,166,0.2)` | `rgba(13,148,136,0.15)` |

---

## 🏗️ Architecture

```
Browser (Next.js 16 — App Router)
         │
         │  REST API (JSON over HTTP, httpOnly cookies)
         ▼
   LifeOS Backend (FastAPI)
```

**Key decisions:**
- **App Router** — file-based routing, layouts, server components where applicable
- **TanStack Query** — all server state with automatic caching, background refetch, and error boundaries
- **Zustand** — lightweight client state, zero boilerplate, fine-grained selectors
- **httpOnly Cookies** — auth tokens never exposed to JavaScript
- **Feature-based structure** — each module (DSA, fitness, planner) is self-contained

---

## 📁 Folder Structure

```
frontend/
└── src/
    ├── app/
    │   ├── dashboard/
    │   │   ├── layout.tsx          # Dashboard shell layout
    │   │   ├── page.tsx            # Dashboard home
    │   │   ├── planner/            # Planner route
    │   │   ├── dsa/                # DSA tracker route
    │   │   ├── fitness/            # Fitness tracker route
    │   │   └── goals/              # Goals route
    │   ├── layout.tsx              # Root layout (ThemeProvider, QueryClient)
    │   ├── page.tsx                # Redirects → /dashboard
    │   └── globals.css             # CSS variables + glass utilities
    │
    ├── components/
    │   ├── layout/                 # Navbar, Sidebar, DashboardShell
    │   ├── dashboard/              # StatsRow, Charts, PlannerWidget, StreakCalendar
    │   └── shared/                 # GlassCard, StatBadge, ProgressRing, etc.
    │
    ├── lib/
    │   ├── api.ts                  # Axios instance + request/response interceptors
    │   └── utils.ts                # cn(), formatDate(), getGreeting(), etc.
    │
    ├── hooks/                      # usePlanner, useDSA, useStreak, useFitness
    ├── store/                      # Zustand stores (user, planner, dsa)
    └── types/                      # Shared TypeScript interfaces
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v20+`
- npm or yarn
- [LifeOS Backend](https://github.com/sahilkriplani/lifeos-backend) running locally

### Installation

```bash
git clone https://github.com/sahilkriplani/lifeos-frontend.git
cd lifeos-frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🔌 API Integration

- All API calls go through the centralized Axios instance at `lib/api.ts`
- Interceptors handle auth token attachment and error normalization
- TanStack Query wraps all data fetching — no manual loading/error state
- Auth is managed via httpOnly cookies set by the backend on login

---

## 📌 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check # Run TypeScript compiler check
```

---

## 🗺️ Roadmap

- [x] Phase 1 — Project setup, folder structure, base layout (Navbar + Sidebar + Shell)
- [ ] Phase 2 — Landing page
- [ ] Phase 3 — Dashboard (header, stats, charts, planner widget, streak calendar)
- [ ] Phase 4 — Planner (full CRUD, priority, date picker)
- [ ] Phase 5 — DSA tracker
- [ ] Phase 6 — Fitness tracker
- [ ] Phase 9 — Charts, polish, animations
- [ ] Phase 10 — Deployment

---

## 🧠 Engineering Principles

- **MVP first** — build the simplest thing that works, then iterate
- **Modular** — each feature is self-contained and independently removable
- **Type-safe** — TypeScript everywhere, shared interfaces in `types/index.ts`
- **Secure** — no sensitive data in localStorage, httpOnly cookie auth
- **Performance** — TanStack Query caching, Zustand selectors, no unnecessary re-renders

---

## 🔗 Related

- [LifeOS Backend](https://github.com/sahilkriplani/lifeos-backend) — FastAPI + MySQL REST API

---

## 👤 Author

**Sahil Kriplani** — Full-Stack Developer, Ahmedabad 🇮🇳  
GitHub: [@sahilkriplani](https://github.com/sahilkriplani)

> *"Build it like it's going to production. Because it is."*