# Phase 2: Lecture Schedule + Polish

**Goal**: Students can upload/view weekly lecture schedule, see exam seat mini-map, and use dark mode.

**Status**: NOT STARTED

**Depends on**: Phase 1 complete

---

## Tasks

### 2.1 Manual Lecture Upload
- [ ] Create `src/lib/sheets/parse-lectures.ts` - parse lecture CSV/XLSX into Lecture objects
- [ ] Add upload UI in settings page: file picker for CSV/XLSX
- [ ] Parse uploaded file client-side with xlsx library
- [ ] Store parsed lectures in localStorage (or IndexedDB if large)
- [ ] Create `src/hooks/use-schedule.ts` - read lectures from storage, filter by group

### 2.2 Weekly Schedule Grid
- [ ] Create `src/components/schedule/week-nav.tsx` - week forward/back with swipe
- [ ] Create `src/components/schedule/day-column.tsx` - single day with time slots
- [ ] Create `src/components/schedule/lecture-block.tsx` - colored block for each lecture
- [ ] Create `src/components/schedule/week-grid.tsx` - Mon-Fri grid with time axis
- [ ] Create `src/app/schedule/page.tsx` - weekly view with empty state prompt
- [ ] Add bottom sheet (vaul) for lecture details on tap

### 2.3 Exam Seat Mini-Map
- [ ] Create `src/components/exam-room/room-mini-map.tsx` - small SVG of sections A-G
- [ ] Create `src/components/exam-room/seat-input.tsx` - input field for seat assignment
- [ ] Integrate into exam-card.tsx expanded view: show mini-map when seat is entered
- [ ] Save seat assignments per exam to localStorage

### 2.4 Dark Mode
- [ ] Implement Tailwind dark class strategy
- [ ] Add dark mode variants to all existing components
- [ ] System preference detection on first load
- [ ] Toggle in settings persisted to localStorage

---

## Key Files Created This Phase
- `src/app/schedule/page.tsx` - weekly lecture grid
- `src/components/schedule/` - all schedule components
- `src/components/exam-room/` - seat map components
