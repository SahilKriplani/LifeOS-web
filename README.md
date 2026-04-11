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
| Framework | Next.js (App Router) | 16.2.2 |
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
| Icons | Lucide React + React Icons | Latest |
| Toasts | react-hot-toast | Latest |

---

## 🎨 Design System

**Style:** Glassmorphism — translucent cards, backdrop blur, layered depth
**Theme:** Teal Noir — full dark + light mode
**Motion:** Framer Motion — entrance animations, hover effects, page transitions
**Inspiration:** Linear, Stripe, Vercel, Apple dashboards

### Color Tokens (Teal Noir)

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--background` | `#060F0E` | `#F0FDFA` |
| `--primary` | `#14B8A6` | `#0D9488` |
| `--secondary` | `#2DD4BF` | `#14B8A6` |
| `--accent` | `#5EEAD4` | `#2DD4BF` |
| `--border` | `rgba(20,184,166,0.2)` | `rgba(13,148,136,0.15)` |
| `--glass-bg` | `rgba(6,15,14,0.75)` | `rgba(240,253,250,0.75)` |
| `--glass-border` | `rgba(20,184,166,0.25)` | `rgba(13,148,136,0.2)` |

### Glass Utilities

```css
.glass        /* blur(12px) + saturate — standard cards */
.glass-strong /* blur(24px) + saturate(180%) — navbar, sidebar */
```

---

## 🏗️ Architecture

```
Browser (Next.js 16 — App Router)
         │
         │  REST API (JSON, httpOnly cookies)
         ▼
   LifeOS Backend (FastAPI)
         │
         ▼
      MySQL 9.x
```

**Key decisions:**
- **App Router** — file-based routing, layouts, server components where applicable
- **TanStack Query** — all server state with automatic caching and error boundaries
- **Zustand** — lightweight client state, zero boilerplate, fine-grained selectors
- **httpOnly Cookies** — auth tokens never exposed to JavaScript
- **Feature-based structure** — each module is self-contained
- **shadcn/ui** — Radix-based accessible components, styled with CSS variables

---

## 📁 Folder Structure

```
frontend/
├── .env.local                    # Environment variables
└── src/
    ├── app/
    │   ├── dashboard/
    │   │   ├── layout.tsx        # Dashboard shell (DashboardShell wrapper)
    │   │   ├── page.tsx          # Dashboard home
    │   │   ├── planner/          # Planner route (coming)
    │   │   ├── dsa/              # DSA tracker route (coming)
    │   │   ├── fitness/          # Fitness tracker route (coming)
    │   │   └── goals/            # Goals route (coming)
    │   ├── login/
    │   │   └── page.tsx          # Login page
    │   ├── register/
    │   │   └── page.tsx          # Register page
    │   ├── layout.tsx            # Root layout (ThemeProvider, ToasterProvider)
    │   ├── page.tsx              # Landing page (LandingPage component)
    │   └── globals.css           # CSS variables + glass utilities
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx        # Sticky glass navbar + user dropdown
    │   │   ├── Sidebar.tsx       # Collapsible animated sidebar
    │   │   └── DashboardShell.tsx # Layout wrapper (navbar + sidebar + main)
    │   ├── dashboard/
    │   │   └── DashboardHeader.tsx # Greeting + date + streak badge
    │   ├── landing/
    │   │   ├── LandingPage.tsx   # Master landing component
    │   │   ├── LandingNavbar.tsx # Landing page navbar
    │   │   ├── HeroSection.tsx   # Hero with floating cards
    │   │   ├── FeaturesSection.tsx # 6 feature cards
    │   │   ├── StatsSection.tsx  # Journey stats
    │   │   └── FooterSection.tsx # Footer with links
    │   ├── auth/
    │   │   ├── LoginForm.tsx     # Login form (shadcn Input + Button + Yup)
    │   │   └── RegisterForm.tsx  # Register form (shadcn Input + Button + Yup)
    │   ├── shared/
    │   │   ├── GlassCard.tsx     # Reusable glass card component
    │   │   ├── StatBadge.tsx     # Stat card with icon + trend
    │   │   ├── ProgressRing.tsx  # Animated SVG progress ring
    │   │   └── ToasterProvider.tsx # react-hot-toast with dark/light mode
    │   └── ui/                   # shadcn auto-generated components
    │       ├── button.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── badge.tsx
    │       ├── separator.tsx
    │       └── dropdown-menu.tsx
    │
    ├── lib/
    │   ├── api.ts                # Axios instance + interceptors (sanitizes passwords in logs)
    │   ├── auth.ts               # logout() helper
    │   └── utils.ts              # cn(), formatDate(), getGreeting(), getTodayISO(), etc.
    │
    ├── hooks/                    # usePlanner, useDSA, useStreak (coming)
    │
    ├── store/
    │   ├── useUserStore.ts       # User auth state (persisted via Zustand persist)
    │   ├── usePlannerStore.ts    # Planner tasks + selected date + completion %
    │   └── useDSAStore.ts        # DSA logs + stats
    │
    ├── types/
    │   └── index.ts              # All shared TypeScript interfaces
    │
    └── middleware.ts             # Route protection (redirects /dashboard → /login if no cookie)
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v20+` (works on v22)
- npm `10+`
- [LifeOS Backend](https://github.com/sahilkriplani/lifeos-backend) running on port `8000`

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

---

## 🔑 Environment Variables

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🔐 Auth Flow

```
/login or /register
       │
       ▼
  LoginForm / RegisterForm
  (React Hook Form + Yup validation)
       │
       ▼
  POST /api/v1/auth/login
  (Axios → FastAPI backend)
       │
       ▼
  httpOnly cookie set by backend
       │
       ▼
  Zustand useUserStore.setUser()
       │
       ▼
  router.push("/dashboard")
```

**Route protection via `middleware.ts`:**
- `/dashboard/*` without cookie → redirect to `/login`
- `/login` or `/register` with cookie → redirect to `/dashboard`

---

## 🧩 Shared Components

### GlassCard
```tsx
<GlassCard hover padding="md">content</GlassCard>
// Props: hover, strong, padding (none|sm|md|lg)
```

### StatBadge
```tsx
<StatBadge label="DSA Solved" value={42} icon={Code2} trend="up" trendValue="3 today" />
```

### ProgressRing
```tsx
<ProgressRing value={72} label="Goals" size={120} strokeWidth={8} />
```

---

## 📌 Available Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript type check
```

---

## 🗺️ Roadmap

- [x] Phase 1 — Project setup, folder structure, base layout (Navbar + Sidebar + Shell)
- [x] Phase 2 — Landing page (Hero + Features + Stats + Footer)
- [x] Phase 3 — Auth pages (Login + Register + middleware)
- [x] Phase 3.5 — Backend connected (FastAPI + MySQL)
- [ ] Phase 4 — Dashboard components (Header + StatsRow + Charts + Planner Widget + Streak Calendar)
- [ ] Phase 5 — Planner (full CRUD, priority, date picker)
- [ ] Phase 6 — DSA tracker
- [ ] Phase 7 — Fitness tracker
- [ ] Phase 8 — Goals tracker
- [ ] Phase 9 — Charts, polish, animations
- [ ] Phase 10 — Google SSO
- [ ] Phase 11 — Deployment

---

## 🧠 Engineering Principles

- **MVP first** — build the simplest thing that works, then iterate
- **Modular** — each feature is self-contained and independently removable
- **Type-safe** — TypeScript everywhere, shared interfaces in `types/index.ts`
- **Secure** — no sensitive data in localStorage, httpOnly cookie auth, passwords sanitized from logs
- **Performance** — TanStack Query caching, Zustand selectors, no unnecessary re-renders

---

## 🔗 Related

- [LifeOS Backend](https://github.com/sahilkriplani/lifeos-backend) — FastAPI + MySQL REST API

---

## 👤 Author

**Sahil Kriplani** — Full-Stack Developer, Ahmedabad 🇮🇳
GitHub: [@sahilkriplani](https://github.com/sahilkriplani)

> *"Build it like it's going to production. Because it is."*