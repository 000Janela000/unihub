# UniSchedule - Implementation Progress

## Current Status: Phase 1 - IN PROGRESS (mostly complete)

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| 1 | Core MVP - Exam Schedule | IN PROGRESS | 8/10 complete |
| 2 | Lecture Schedule + Polish | NOT STARTED | 0/4 |
| 3 | Auth + Protected Sheets + Push Notifications | NOT STARTED | 0/6 |
| 4 | Gmail + Polish + Deployment | NOT STARTED | 0/4 |

## Phase Details

See individual phase docs in `docs/phases/`:
- `phase-1-mvp.md` - Core exam schedule with filtering and countdowns
- `phase-2-lectures.md` - Lecture upload, weekly grid, room map, dark mode
- `phase-3-auth-push.md` - Google auth, auto-fetch, PWA, push notifications
- `phase-4-gmail-deploy.md` - Gmail integration, calendar export, deployment

## Quick Context for Continuing Agents

**What this project does**: Parses Google Sheets exam/lecture schedules from Agricultural University of Georgia, filters by student's group code, shows clean mobile-first UI with countdowns and notifications.

**Where we are**: Phase 1 ~85% complete. All source files created, build passes, API verified with real Google Sheets data. Remaining: shadcn/ui init, browser testing of UI.

**Key data**: Exam schedule is publicly accessible via `gviz/tq?tqx=out:csv` API. Lecture schedule requires auth. Group codes like `chem24-01` map to faculties.

**Tech decisions made**: Next.js 14, Tailwind, shadcn/ui, Framer Motion, papaparse for CSV, Georgian + English i18n.

## Cost Analysis - Everything Free

| Service | Free Tier | Limit |
|---|---|---|
| Vercel Hobby | Hosting, serverless, cron, HTTPS | 100GB bandwidth/mo |
| Google Cloud | Sheets API + Gmail API | 500 req/100sec, 100 test users |
| web-push | VAPID-based push | Unlimited |
| Domain | `unischedule.vercel.app` | Custom domain optional ~$10/yr |
| GitHub | Public repo | Unlimited |
| npm packages | All open-source | Free |

**Total: $0/month**
