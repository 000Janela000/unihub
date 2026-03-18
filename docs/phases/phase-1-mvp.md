# Phase 1: Core MVP - Exam Schedule

**Goal**: Users select their group and see upcoming exams with countdowns, type badges, and filters.

**Status**: IN PROGRESS

---

## Tasks

### 1.1 Project Setup
- [x] Create Next.js 14 app with TypeScript, Tailwind, ESLint, App Router, src dir
- [x] Install dependencies: papaparse, date-fns, lucide-react, class-variance-authority, clsx, tailwind-merge
- [x] Initialize shadcn/ui and add components: button, card, badge, skeleton, separator
- [x] Set up path alias `@/*` → `src/*`
- [x] Create directory structure: components/{ui,layout,exams,schedule,exam-room,onboarding}, lib/{sheets}, hooks, types, i18n
- [x] Set up `.env.local` with sheet IDs
- [x] Set up `.gitignore`, git init

### 1.2 Types + Constants
- [x] Create `src/types/exam.ts` - ExamType enum (midterm, final, quiz, retake), Exam interface
- [x] Create `src/types/lecture.ts` - Lecture, DaySchedule, WeekSchedule interfaces
- [x] Create `src/types/group.ts` - Faculty, UserGroup interfaces
- [x] Create `src/types/index.ts` - re-export all types

### 1.3 Core Libraries
- [x] Create `src/lib/group-decoder.ts` - AGRUNI_PROGRAMS map, decodeGroupCode(), getAcademicYear()
- [x] Create `src/lib/exam-types.ts` - parseExamType() extracts type from Georgian subject names
- [x] Create `src/lib/georgian-dates.ts` - GEORGIAN_MONTHS map, formatGeorgianDate(), parseTabDate()
- [x] Create `src/lib/storage.ts` - localStorage wrapper for user preferences (get/set/clear)

### 1.4 Google Sheets Data Pipeline
- [x] Create `src/lib/sheets/cache.ts` - server-side TTL cache (Map with expiry, 15min default)
- [x] Create `src/lib/sheets/fetch-csv.ts` - fetchSheetCSV(sheetId, gid) using gviz API
- [x] Create `src/lib/sheets/discover-tabs.ts` - probe known GIDs, discover accessible tabs
- [x] Create `src/lib/sheets/parse-exams.ts` - parseExamCSV() converts CSV rows to Exam objects
- [x] Create `src/app/api/sheets/exams/route.ts` - GET endpoint: discover tabs → fetch all → parse → filter by group → return JSON
- [x] **VERIFIED**: API returns 24 exams from 3 tabs, group filtering works (chem24-01 → 2 exams, 25-01 → 2 exams)

### 1.5 i18n Setup
- [x] Create `src/i18n/ka.ts` - Georgian translation strings
- [x] Create `src/i18n/en.ts` - English translation strings
- [x] Create `src/i18n/context.tsx` - LanguageProvider with localStorage persistence

### 1.6 Onboarding Flow
- [x] Create `src/hooks/use-user-group.ts` - read/write group from localStorage
- [x] Create `src/components/onboarding/university-toggle.tsx` - Agruni vs Freeuni
- [x] Create `src/components/onboarding/faculty-grid.tsx` - card grid of faculties
- [x] Create `src/components/onboarding/year-picker.tsx` - year 1-4 or Master's
- [x] Create `src/components/onboarding/group-picker.tsx` - group number selection
- [x] Create `src/components/onboarding/step-indicator.tsx` - progress dots
- [x] Create `src/app/onboarding/page.tsx` - multi-step wizard with animations

### 1.7 Exam List Page
- [x] Create `src/hooks/use-exams.ts` - fetch from /api/sheets/exams, SWR-like pattern with localStorage fallback
- [x] Create `src/components/exams/exam-type-badge.tsx` - color-coded badge (midterm=blue, final=red, quiz=purple, retake=gray)
- [x] Create `src/components/exams/countdown-timer.tsx` - shows "3 დღეში", "ხვალ", "დღეს 10:00"
- [x] Create `src/components/exams/exam-card.tsx` - expandable card with all exam details
- [x] Create `src/components/exams/exam-day-group.tsx` - groups exams by date with day headers
- [x] Create `src/app/exams/page.tsx` - main exam list with pull-to-refresh, skeletons, empty state

### 1.8 Layout + Navigation
- [x] Create `src/components/layout/header.tsx` - app title + settings gear icon
- [x] Create `src/components/layout/bottom-nav.tsx` - 3 tabs: Exams, Schedule, Settings
- [x] Create `src/app/globals.css` - Tailwind imports, Georgian font, custom properties
- [x] Create `src/app/layout.tsx` - root layout with providers, font, metadata, nav
- [x] Create `src/app/page.tsx` - redirect to /exams or /onboarding based on localStorage

### 1.9 Settings Page (basic)
- [x] Create `src/hooks/use-theme.ts` - dark/light mode toggle with localStorage + system detection
- [x] Create `src/app/settings/page.tsx` - change group, language toggle, theme toggle, about section

### 1.10 Testing + Verification
- [x] Test data pipeline: fetch real exam data from public sheet, verify parsing
- [x] Test group filtering: select specific group, verify only matching exams appear
- [ ] Test countdown accuracy against real exam dates
- [ ] Test mobile responsiveness at 375px viewport
- [ ] Test onboarding flow end-to-end (browser test)
- [x] Build passes with zero errors
- [x] All pages return HTTP 200

---

## Key Files Created This Phase
- `src/lib/sheets/` - entire data pipeline (verified working with real data)
- `src/lib/group-decoder.ts` - group code logic
- `src/lib/exam-types.ts` - Georgian exam type parser (midterm, final, quiz, retake detection)
- `src/app/exams/page.tsx` - primary user-facing page
- `src/app/onboarding/page.tsx` - first-run experience
- `src/app/api/sheets/exams/route.ts` - server-side data endpoint

## Known Issues
- Tab names don't carry date info (exam dates show empty) - needs either a date column in the sheet or tab name discovery
- shadcn/ui components not yet initialized (using basic Tailwind styles)
