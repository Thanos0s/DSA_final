# ThinkDSA — Landing Page Design Guide

> This document describes **all existing features** of the ThinkDSA app, the design system, and recommendations for building a new public-facing **entry/landing page**.

---

## 1. What is ThinkDSA?

ThinkDSA is an AI-powered DSA (Data Structures & Algorithms) learning platform that teaches using the **Socratic method** — guiding users to discover answers themselves rather than giving them directly. It is built as a full-stack React + Node.js monorepo.

---

## 2. Current Application Features

### 🔐 Authentication
- **Email/Password login** (Firebase + local Prisma DB sync)
- **Google Sign-In** via Firebase OAuth popup
- **GitHub Sign-In** button (placeholder, not yet implemented)
- **Auto-registration** for Google users on first sign-in
- Protected routes redirect unauthenticated users to `/login`

### 🏠 Home Page (`/`)
- Personalized welcome message with the user's name
- **Stats bar** showing total problems & unique topics
- **Search bar** — filters problems by title or topic
- **Problem list** — cards showing title, difficulty badge (Easy/Medium/Hard), and topic tag
- **Generate Problem** button (currently a placeholder/console log)
- Pagination-free scrollable list

### 🧠 Problem Workspace (`/problem/:slug`)
Three-panel resizable layout:

| Panel | Content |
|-------|---------|
| **Problem Panel** (left, ~28%) | Problem title, difficulty, topic, full markdown-rendered statement |
| **Editor Panel** (center, ~42%) | Monaco code editor, language switcher (Python/JS), Run Code button, output terminal, custom stdin input |
| **Chat Panel** (right, ~30%) | AI tutoring chat (Socratic mode) |

**Key features:**
- **Drag-to-resize** panels with min-width guards
- **Monaco Editor** (VS Code-style) with `JetBrains Mono` font, smooth caret animation
- **Code execution** via backend judge — supports Python & JavaScript, with pre-filled stdin from problem examples
- **Output terminal** — shows stdout (green) and stderr (red)
- **"Visualize Algo"** button (Medium/Hard only) — fetches an AI-generated step-by-step algorithm visualization overlay
- **Auto-populated custom input** parsed from the problem statement

### 💬 AI Tutor / Chat Interface
- Available inside `ProblemWorkspace` (tied to a problem) and as a standalone **Tutor Mode** (`/chat`)
- **Socratic Mode toggle** (TorchCheckbox UI) — switches between guided hints vs. direct answers
- Streams markdown-rendered AI responses
- Message history per session
- Bot avatar and animated thinking indicator

### 👤 Profile Page (`/profile`)
- Avatar with first-letter initial
- **Stats scorecards**: Rank, Total Solved, Current Streak / Max Streak
- **Activity Heatmap** — GitHub-style contribution graph
- **Achievements / Badges** — dynamically rendered with lucide icons (squircle shape)
- **Recent Activity** — list of recently attempted problems with difficulty and timestamp

### 🎨 Themes
Three built-in themes selectable from the Navbar:
| Theme | Description |
|-------|-------------|
| **Earthy** | Warm oranges and earth tones (default) |
| **Deep Ocean** | Dark blues and aqua |
| **Cyber Clay** | Neon green/purple cyberpunk palette |

---

## 3. Design System

### Color Tokens (CSS Variables)
```css
/* Backgrounds */
--bg-primary       /* Page background */
--bg-secondary     /* Panel background */
--bg-elevated      /* Cards, inputs */
--bg-card
--bg-input

/* Typography */
--text-primary
--text-secondary
--text-muted

/* Accents */
--accent-burnt-orange   /* Primary brand color */
--accent-earth-green    /* Secondary accent */
--accent-amber
--accent-emerald

/* Borders */
--border-subtle
--border-default
--border-focus

/* Shadows (Neumorphism/Clay) */
--shadow-3d-out
--shadow-3d-in
```

### Typography
- **UI Font**: `Inter` (Google Fonts)
- **Code Font**: `JetBrains Mono` (Google Fonts)
- Base size: `16px`, scale via `rem`

### CSS Classes (utility)
| Class | Purpose |
|-------|---------|
| `.card` | Default card with border + bg |
| `.card-hover` | Lift + border highlight on hover |
| `.clay-panel` | Neumorphic raised panel |
| `.clay-inset` | Neumorphic sunken inset |
| `.clay-card` | Clay-style card |
| `.glass` | Frosted glass effect (Navbar) |
| `.btn-primary` | Primary gradient button |
| `.btn-success` | Green run/submit button |
| `.badge-easy` | Green difficulty pill |
| `.badge-medium` | Amber difficulty pill |
| `.badge-hard` | Red difficulty pill |
| `.animate-fade-in` | Fade-in animation on mount |
| `.animate-slide-up` | Slide up on mount |
| `.stagger-children` | Staggered animation for list items |
| `.input-field` | Styled text input |
| `.mobile-hidden` | Hides on mobile |
| `.mobile-col` | Switches to column layout on mobile |

### Animations
- **Fade-in** (`.animate-fade-in`): opacity 0→1, ~400ms
- **Slide-up** (`.animate-slide-up`): translateY + opacity
- **Stagger** (`.stagger-children`): nth-child delay on list items
- **Spin** (keyframe `spin`): used on loading icons
- **Hover micro-animations** on all interactive elements (translateY(-1px), border/color transitions)

---

## 4. Component Inventory

| Component | Description |
|-----------|-------------|
| `Navbar` | Sticky top nav — logo, profile link, theme picker, Tutor Mode link, logout |
| `Layout` | Wraps all pages with Navbar + Outlet |
| `ProtectedRoute` | Redirects to `/login` if not authenticated |
| `ChatInterface` | Full chat UI — message list, input, streaming response, markdown render |
| `AlgoVisualizer` | Full-screen overlay with step-by-step visualization of algorithm |
| `Heatmap` | GitHub-style contributions heatmap |
| `OrbLoader` | Animated glowing orb (used on Login page) |
| `PageLoader` | Full-page spinner overlay |
| `AILoader` | AI-specific animated loader |
| `GenerateButton` | Styled magic sparkle button |
| `TorchCheckbox` | Toggle switch with torch/flame animation |

---

## 5. Routing

| Route | Page | Auth Required |
|-------|------|---------------|
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/` | Home (Problem List) | ✅ |
| `/problem/:slug` | Problem Workspace | ✅ |
| `/chat` | AI Tutor Mode | ✅ |
| `/profile` | User Profile | ✅ |
| `*` | → Redirects to `/` | — |

---

## 6. Recommendations for a New Landing Page

The app currently has **no public landing page** — unauthenticated users are sent directly to `/login`. A proper entry page at `/` (or a new `/landing` route) would dramatically improve onboarding.

### Suggested Sections

1. **Hero Section**
   - Big headline: _"Master DSA the Smart Way"_
   - Sub-headline: _"An AI tutor that guides your thinking — not just gives answers."_
   - Two CTAs: `Get Started Free` (→ `/register`) and `See How It Works` (scroll anchor)
   - Animated OrbLoader or background particle effect

2. **Feature Highlights (3-column grid)**
   - 🧠 **Socratic AI Tutor** — Learn by thinking, not memorizing
   - ⚡ **Live Code Execution** — Run Python & JS instantly
   - 📊 **Track Your Growth** — Heatmaps, streaks, badges

3. **How It Works (3-step)**
   - Step 1: Pick a problem
   - Step 2: Write your solution
   - Step 3: Get guided by AI — not spoiled

4. **Demo / Screenshot Preview**
   - Screenshot or mock of the 3-panel workspace

5. **Social Proof / Stats**
   - "X problems, Y topics covered"

6. **Final CTA**
   - `Start Learning Now` (→ `/register`)

### Design Notes for the Landing Page
- Use the existing CSS variable tokens for colors — do NOT add new color values
- Use `.animate-fade-in` and `.stagger-children` for scroll reveals
- Use `OrbLoader` as a decorative hero background element (already used on Login page at `size={1.3}`)
- Typography: `Inter` for body, large display font weights of 800+
- Keep dark theme consistent — background should be `var(--bg-primary)` with gradient accent text using `var(--accent-burnt-orange)` → `var(--accent-earth-green)`

---

## 7. Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite 4 |
| Language | TypeScript |
| Routing | React Router v7 |
| State | Zustand |
| HTTP | Axios + TanStack Query |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Auth | Firebase Authentication (Email + Google) |
| Backend | Node.js + Express + Prisma (SQLite) |
| AI | Groq API (via OpenRouter) |
| Icons | Lucide React |

---

*Generated on 2026-03-16 for ThinkDSA frontend reference.*
