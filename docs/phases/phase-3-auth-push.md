# Phase 3: Auth + Protected Sheets + Push Notifications

**Goal**: Auto-fetch protected lecture schedule, PWA installable, push notifications before exams.

**Status**: COMPLETE (code built; Google Cloud setup requires user action)

**Depends on**: Phase 2 complete

---

## Tasks

### 3.1 Google Cloud Setup
- [ ] **USER ACTION**: Create Google Cloud project "UniSchedule" (free) at console.cloud.google.com
- [ ] **USER ACTION**: Enable Google Sheets API
- [ ] **USER ACTION**: Create Service Account OR OAuth 2.0 credentials
- [ ] **USER ACTION**: Share lecture sheet with service account email
- [ ] **USER ACTION**: Add credentials to `.env.local` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- Note: All code is ready, just needs credentials

### 3.2 Protected Lecture Sheet Auto-Fetch
- [x] Create `src/lib/auth-config.ts` - NextAuth v5 config with Google provider + Sheets scope
- [x] Create `src/app/api/auth/[...nextauth]/route.ts` - auth routes
- [x] Create `src/app/api/sheets/lectures/route.ts` - returns auth_required (ready for real auth)
- [x] Create `src/app/admin/page.tsx` - admin panel for Google connection
- [x] Cache infrastructure ready (same 15-min pattern as exams)

### 3.3 Auto-URL Discovery
- [x] Create `src/lib/sheets/discover-urls.ts` - scrapes agruni.edu.ge for sheet URLs
- [x] Create `src/app/api/discover/route.ts` - API endpoint with 24h cache
- [x] Fallback to hardcoded sheet IDs if scraping fails

### 3.4 PWA Setup
- [x] Create `public/manifest.json` with Georgian name, green theme, icons
- [x] Create `public/sw.js` - service worker (cache-first static, network-first API, push handler)
- [x] Create `src/components/layout/sw-registrar.tsx` - registers SW on mount
- [x] Register service worker in layout.tsx with meta tags
- [x] Create `src/components/layout/install-prompt.tsx` - iOS/Android install banner
- [x] Create `src/hooks/use-install-prompt.ts`
- [ ] **USER ACTION**: Generate PWA icons (192x192, 512x512) and place in public/icons/

### 3.5 Push Notifications
- [x] VAPID keys generated and added to `.env.local`
- [x] Create `src/lib/notifications.ts` - client-side push subscription helpers
- [x] Create `src/hooks/use-notifications.ts` - permission + subscribe
- [x] Create `src/app/api/push/subscribe/route.ts` - stores subscriptions in data/subscriptions.json
- [x] Create `src/app/api/push/send/route.ts` - cron endpoint, sends push via web-push
- [x] Push event handler in service worker
- [x] Notification settings UI in settings page (toggle + timing checkboxes)

### 3.6 Cron Job
- [x] Create `vercel.json` with hourly cron config
- [x] Exam reminder logic: checks 1 week, 3 days, 1 day, 2 hours windows
- [x] Configurable timing per user via subscription preferences

---

## User Actions Required
1. **Google Cloud**: Create project + Service Account (free) → add credentials to `.env.local`
2. **PWA Icons**: Generate icons and save to `public/icons/icon-192.png` and `public/icons/icon-512.png`

## Build Status
- Zero type errors
- All routes compile
- PWA manifest and service worker in place
