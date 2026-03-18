# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project

**UniSchedule** — University schedule & exam tracker for Agricultural University of Georgia (agruni.edu.ge). Parses dynamic Google Sheets containing exam/lecture schedules, filters by student group, and presents a clean mobile-first PWA with notifications.

## Architecture

```
src/
├── app/                        # Next.js App Router pages + API routes
│   ├── layout.tsx              # Root layout, providers, fonts
│   ├── page.tsx                # Redirect to /exams or /onboarding
│   ├── onboarding/             # University → Faculty → Year → Group wizard
│   ├── exams/                  # Main page: exam list with countdowns
│   ├── schedule/               # Weekly lecture grid
│   ├── settings/               # Preferences, notifications, upload
│   ├── admin/                  # Hidden admin panel for Google auth
│   └── api/
│       ├── sheets/exams/       # Fetch public exam schedule CSV
│       ├── sheets/lectures/    # Fetch protected lecture schedule
│       ├── discover/           # Scrape agruni.edu.ge for current sheet URLs
│       ├── push/               # Push notification subscribe + send
│       ├── gmail/              # Gmail exam detail parsing (Phase 4)
│       └── auth/               # NextAuth.js routes
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # bottom-nav, header, install-prompt
│   ├── exams/                  # exam-card, countdown, type-badge
│   ├── schedule/               # week-grid, day-column, lecture-block
│   ├── exam-room/              # room-mini-map (inline SVG), seat-input
│   └── onboarding/             # step-indicator, faculty-grid, etc.
├── lib/
│   ├── sheets/                 # CSV fetching, parsing, tab discovery, caching
│   ├── group-decoder.ts        # Group code → faculty/year mapping
│   ├── exam-types.ts           # Georgian exam type strings → enums
│   ├── georgian-dates.ts       # Georgian month names, date formatting
│   ├── storage.ts              # localStorage wrapper
│   ├── notifications.ts        # Push subscription helpers
│   └── auth-config.ts          # NextAuth configuration
├── hooks/                      # use-exams, use-schedule, use-notifications, etc.
├── types/                      # TypeScript type definitions
└── i18n/                       # Georgian (ka) + English (en) translations
```

## Tech Stack

Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui · Framer Motion · vaul · sonner · lucide-react · papaparse · xlsx · date-fns · googleapis · google-auth-library · NextAuth.js v5 · web-push · Service Worker (PWA)

## Commands

```bash
npm run dev        # Next.js dev server (localhost:3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

## Key Rules

- **Georgian first**: All user-facing strings through i18n (ka.ts primary, en.ts secondary)
- **Named exports only**. No default exports.
- **One component per file**. Props type defined above component.
- **Path alias `@/*`** → `src/*`
- **Mobile-first**: Design for 375px viewport, scale up. Bottom nav, not sidebar.
- **Server-side data**: All Google Sheets fetching happens in API routes, never client-side
- **Cache**: Server-side 15-minute TTL cache for sheet data
- **No student auth required**: Core features (exams, schedule) work without sign-in
- **Group codes**: `chem24-01` = Chemistry, 2024 entry, group 1. See `lib/group-decoder.ts`.

## Data Sources

| Source | Access | Method |
|---|---|---|
| Exam schedule | Public | `gviz/tq?tqx=out:csv&gid={GID}` - no auth |
| Lecture schedule | Protected | Service Account or Admin OAuth |
| Sheet URLs | Public | Scrape `agruni.edu.ge/ge/students/bachelor/` |
| Exam room emails | Per-student | Gmail API readonly (optional, Phase 4) |

### Key Sheet IDs
- Exam: `1pHchPdQPuPRyq_2HJJItcH3MtITXSJFrVEqobGZiW_0`
- Lectures: `1PY7AyDut0EjvzIW6C6bLH-2iFYIbLVau`

## Group Code Mapping

| Prefix | Faculty |
|---|---|
| `agr` | Agronomy | `chem` | Chemistry | `bio` | Biology |
| `food` | Food Technology | `eno` | Viticulture-Winemaking |
| `vet` | Veterinary | `for` | Forestry |
| `land` | Landscape Management | `ece` | ECE | `ce` | Civil Eng. | `me` | Mech. Eng. |
| (no prefix, `YY-NN`) | First Year Common | `MAGR` | Master's |

Year derivation: code `24` in academic year `2025-26` → entered 2024 → 2nd year.

## OpenSpec

This project uses OpenSpec for structured change management. Skills available:
- `/opsx:explore` - Think through ideas before implementing
- `/opsx:propose` - Create a new change with all artifacts
- `/opsx:apply` - Implement tasks from a change
- `/opsx:archive` - Finalize and archive completed changes

Config: `openspec/config.yaml`
Changes: `openspec/changes/`
Specs: `openspec/specs/`

## Implementation Phases

Progress tracked in `docs/phases/` directory. Each phase has its own document with task checkboxes. Current status is always visible in `docs/PROGRESS.md`.

## Environment

```
EXAM_SHEET_ID=1pHchPdQPuPRyq_2HJJItcH3MtITXSJFrVEqobGZiW_0
LECTURE_SHEET_ID=1PY7AyDut0EjvzIW6C6bLH-2iFYIbLVau
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:your@email.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
CRON_SECRET=
```

## Deployment

Vercel free tier. Cron job in `vercel.json` for push notifications.

## Cost

Everything is $0/month. See `docs/phases/PROGRESS.md` for full cost analysis.
