# Phase 4: Gmail + Polish + Deployment

**Goal**: Optional Gmail integration for auto-fetching exam details, calendar export, final polish, deployment.

**Status**: NOT STARTED

**Depends on**: Phase 3 complete

---

## Tasks

### 4.1 Gmail Integration (Optional)
- [ ] Add Gmail API scope to Google Cloud project
- [ ] Add `gmail.readonly` scope to NextAuth Google provider
- [ ] Create `src/app/api/gmail/exam-details/route.ts` - search + parse exam emails
- [ ] Add "Connect Gmail" button in settings
- [ ] Auto-populate exam card with room/seat/variant from parsed email
- [ ] Handle edge cases: no email yet, multiple exams same day

### 4.2 Calendar Export
- [ ] Implement .ics file generation for individual exams
- [ ] "Add to Calendar" button on exam cards
- [ ] Bulk export: add all upcoming exams at once
- [ ] Timezone: Asia/Tbilisi (UTC+4)

### 4.3 Animation Polish
- [ ] Page transitions with Framer Motion (AnimatePresence)
- [ ] Card hover/press animations
- [ ] Pull-to-refresh custom animation
- [ ] Skeleton loading shimmer effect
- [ ] Onboarding step transitions
- [ ] Bottom sheet smooth drag (vaul)

### 4.4 GitHub + Deployment
- [ ] Set up `gh` CLI auth
- [ ] Create GitHub repository
- [ ] Push all code
- [ ] Connect to Vercel
- [ ] Configure environment variables on Vercel
- [ ] Set up cron job for push notifications
- [ ] Test production deployment end-to-end

---

## Key Files Created This Phase
- `src/app/api/gmail/exam-details/route.ts` - Gmail integration
- Calendar export utility
- Animation enhancements across all components
