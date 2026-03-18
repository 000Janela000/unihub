# Phase 2: Lecture Schedule + Polish

**Goal**: Students can upload/view weekly lecture schedule, see exam seat mini-map, and use dark mode.

**Status**: COMPLETE

**Depends on**: Phase 1 complete

---

## Tasks

### 2.1 Manual Lecture Upload
- [x] Create `src/lib/sheets/parse-lectures.ts` - parse lecture CSV/XLSX into Lecture objects
- [x] Add upload UI in settings page: file picker for CSV/XLSX
- [x] Parse uploaded file client-side with xlsx library
- [x] Store parsed lectures in localStorage
- [x] Create `src/hooks/use-schedule.ts` - read lectures from storage, filter by group

### 2.2 Weekly Schedule Grid
- [x] Create `src/components/schedule/week-nav.tsx` - week forward/back
- [x] Create `src/components/schedule/day-column.tsx` - single day with time slots
- [x] Create `src/components/schedule/lecture-block.tsx` - colored block for each lecture
- [x] Create `src/components/schedule/week-grid.tsx` - Mon-Fri grid with time axis
- [x] Update `src/app/schedule/page.tsx` - weekly view with empty state prompt
- [x] Lecture click shows details (alert for now)

### 2.3 Exam Seat Mini-Map
- [x] Create `src/components/exam-room/room-mini-map.tsx` - small SVG of sections A-G
- [x] Create `src/components/exam-room/seat-input.tsx` - input field for seat assignment
- [x] Integrate into exam-card.tsx expanded view: show mini-map when seat is entered
- [x] Save seat assignments per exam to localStorage

### 2.4 Dark Mode
- [x] Tailwind dark class strategy (configured in tailwind.config.ts)
- [x] Dark mode CSS variables defined in globals.css
- [x] System preference detection via use-theme.ts hook
- [x] Toggle in settings persisted to localStorage
- [x] All components use semantic Tailwind classes (bg-background, text-foreground, etc.)

---

## Key Files Created This Phase
- `src/lib/sheets/parse-lectures.ts` - flexible CSV/XLSX lecture parser
- `src/hooks/use-schedule.ts` - lecture data hook
- `src/components/schedule/` - week-grid, day-column, lecture-block, week-nav
- `src/components/exam-room/` - room-mini-map (SVG), seat-input
- Updated: exam-card.tsx (seat + map), settings/page.tsx (upload), schedule/page.tsx (real grid)

## Build Status
- Zero type errors
- All pages compile and return HTTP 200
