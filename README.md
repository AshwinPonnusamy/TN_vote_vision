# Tamil Nadu 2026 - Live Election Dashboard

A real-time, interactive election results dashboard for the Tamil Nadu Assembly Elections, built with React, Vite, and Tailwind CSS. Features live seat tracking, party trend analysis, historical election archives spanning 1952-2021, and a secure admin panel for data management.

---

## Features

### Live Dashboard (/)
- Real-Time Seat Tracking - Auto-refreshing every 3 seconds with animated counters
- Party Scoreboard - Progress bars, leading/won breakdown for DMK, AIADMK, TVK, BJP, NTK & Others
- 234 Constituencies - Full table with search, district filter, party filter, and status badges
- Star Candidates & Tight Contests - Leaderboard highlights and close-fight alerts
- Exit Poll vs Live Comparison - Bar chart comparing exit polls to actual trends
- News Ticker - Breaking news banner with auto-scroll
- Confetti Celebration - Canvas confetti when a party crosses majority (118)
- Tamil/English Toggle - Full UI language switch
- System Theme - Automatically adapts to light or dark mode based on device settings

### Party Trends (/party-trends)
- Interactive Doughnut, Line, Radar, and Bar charts
- Swing analysis and historical comparisons
- Party-wise vote share cards with detailed breakdowns

### Live Results (/live-results)
- Drill-down results with advanced filtering and sorting
- Animated number counters for seat counts
- Sticky party scoreboard sidebar
- Expandable constituency cards with polling data (turnout, EVM/postal)

### Previous Election Results (/previous-results)
- 16 elections from 1952 to 2021 - complete historical archive
- Interactive year selector with arrow navigation
- Winner banner with Chief Minister, seats, vote share, and turnout
- Horizontal bar chart (seats) + doughnut chart (vote share)
- DMK vs AIADMK vs Congress timeline - Line chart showing 74 years of political evolution
- Party results table with seat change indicators (+/-) and seat share %
- Key constituencies with margins and highlights per election
- All Elections at a Glance - Quick-compare grid

### Admin Panel (/admin)
- PIN-protected access (default: 2026)
- Constituencies CRUD - Add, edit, delete constituency entries
- Party Seats Override - Manually set seat count per party (validates total = 234)
- Vote Share Override - Set vote share % with visual progress bars
- Simulation Toggle - Switch between auto-refresh and manual data entry
- Data Import/Export - Download or upload all data as JSON
- Lock/Unlock - Re-lock admin panel for security

---

## Tech Stack

- Framework: React 19
- Build Tool: Vite 8
- Styling: Tailwind CSS v4
- Routing: React Router DOM v7
- Charts: Chart.js + react-chartjs-2
- Icons: Lucide React
- Animations: AOS, Framer Motion, Canvas Confetti
- Utilities: clsx, tailwind-merge

---

## Project Structure

- src/components/: Reusable UI components
- src/pages/: Full-page route components
- src/constants/: Data files (Live data and Historical results)
- src/utils/: Utility functions
- App.jsx: Root component with routing and state management
- index.css: Theme configuration and animations

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

The app will be running at http://localhost:5173

### Build for Production

npm run build
npm run preview

---

## Routes

- / : Dashboard (Main live election results)
- /party-trends : Party Trends (In-depth analytics)
- /live-results : Live Results (Detailed constituency-level results)
- /previous-results : Previous Results (Historical archive 1952-2021)
- /admin : Admin Panel (PIN-protected data management)

---

## Key Notes

- Simulation: When enabled (default), the dashboard auto-updates every 3s with randomized data. Disable in Admin -> Simulation Toggle before manual edits.
- Data Persistence: Data is held in-memory (React state). Use Admin -> Export/Import JSON for persistence across sessions.
- Admin PIN: Default is 2026.
- Historical Data: 16 elections covering the political evolution from 1952 to 2021.

---

## License

MIT License 2026
