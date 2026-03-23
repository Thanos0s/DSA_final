# 🧠 ThinkDSA — Master DSA via Socratic AI

ThinkDSA is a premium, AI-powered learning platform designed to teach Data Structures and Algorithms (DSA) through **Socratic Inquiry**. Instead of providing direct answers, ThinkDSA's AI tutor guides users through progressive discovery, building genuine intuition and problem-solving mastery.

---

## 🚀 The ThinkDSA Philosophy: Socratic Mastery

Most platforms give you the solution. ThinkDSA makes you *think* of it. Our AI tutor uses a **5-Level Socratic Framework** to guide your learning:

| Level | Phase | Goal |
|-------|-------|------|
| **1** | **Understanding** | Force the student to explain the problem in their own words and walk through examples. |
| **2** | **Approach** | Explore brute-force vs. optimal ideas. Ask about time/space complexity. |
| **3** | **Gentle Hints** | Conceptual nudges and real-life analogies without naming the pattern. |
| **4** | **Strategic Hints** | Name the pattern (e.g., "Two Pointers", "Sliding Window") but don't give the logic. |
| **5** | **Last Resort** | Conceptual walkthrough followed by code, ending with a reflection period. |

> [!TIP]
> **Socratic in Normal Language**: The AI is tuned to skip jargon unless necessary, using plain, conversational English to make complex concepts accessible.

---

## ✨ Key Features

### 💬 Live Algo Tute Bot (AI Tutor)
A persistent AI companion that "watches" your progress. It remembers your previous attempts and adapts its Socratic hints based on your specific coding errors or logic gaps.

### 💻 Integrated Pro Workspace
A high-performance, three-panel environment designed for focus:
- **Problem Panel**: Markdown-rendered descriptions with clear constraints and examples.
- **Monaco Editor**: The same engine that powers VS Code. Supports `Python` and `JavaScript` with smooth caret animations.
- **AI Chat**: Your Socratic tutor, always one click away.

### ⚡ Secure Execution Engine (Compiler)
Run your code instantly against multiple test cases.
- **Staging Input**: Manually provide custom `stdin` for debugging.
- **Instant Output**: See standard out (stdout) and standard error (stderr) in real-time.
- **Language Support**: Native execution for Python 3 and Node.js.

### 🧬 Algorithm Visualizer
For Medium and Hard problems, unlock an AI-generated logic flow. It breaks down the optimal solution into a visual sequence of steps:
- **Init**: Setup and base cases.
- **Loop/Branch**: Iterative logic and conditional paths.
- **Process**: Data manipulation.
- **Complexity**: Real-time display of Time and Space complexity.

### 🧪 Dynamic Question Lab
Experience "Questions that generate questions". ThinkDSA uses AI to dynamically generate new problem variations or entirely original challenges based on your weak areas.

### 📊 Performance & Gamification
- **Activity Heatmap**: Track your consistency with a GitHub-style contribution graph.
- **Achievement System**: Earn badges for streaks, difficulty milestones, and topic mastery.
- **Scorecards**: Real-time stats on your Rank, Total Solved, and Streaks.

---

## 🛠️ Full Tech Stack

### Frontend (Client)
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with custom Claymorphism/Glassmorphism tokens)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)

### Backend (API)
- **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [SQLite](https://www.sqlite.org/) (via [Prisma ORM](https://www.prisma.io/))
- **AI Engine**: [Groq](https://groq.com/) / [OpenRouter](https://openrouter.ai/) (Llama 3 / GPT-4o)
- **Validation**: [Zod](https://zod.dev/)
- **Auth**: [Firebase Admin SDK](https://firebase.google.com/docs/admin)

---

## 🎨 Design Philosophy: Cyber-Clay
ThinkDSA features a unique "Cyber-Clay" aesthetic — a blend of **Claymorphism** (soft, 3D-effect panels) and **Glassmorphism** (frosted glass overlays). 

**Available Themes:**
- 🍊 **Earthy**: Warm oranges and organic greens.
- 🌊 **Ocean**: Deep blues and aqua highlights.
- 💜 **Cyber**: High-contrast neon purple and emerald.

---

## 📂 Project Structure

```bash
ThinkDSA/
├── apps/
│   ├── web/          # React Frontend (Vite)
│   └── api/          # Express Backend (Prisma)
├── packages/
│   └── shared/       # Shared TypeScript types and utilities
├── prisma/           # Database schema and seed scripts
└── scripts/          # Automation and deployment helpers
```

---

## 🛠️ Setup & Development

### Prerequisites
- Node.js (v18+)
- Firebase Account (for Authentication)
- OpenRouter/Groq API Key (for Socratic AI)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ThinkDSA.git
   cd ThinkDSA
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Create `.env` in `apps/api` (see `.env.example`).
   - Create `.env` in `apps/web` (see `.env.example`).

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Start development:
   ```bash
   npm run dev
   ```

---

*Built with ❤️ by the ThinkDSA Team.*
