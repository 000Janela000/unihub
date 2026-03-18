# Phase 3: Auth + Protected Sheets + Push Notifications

**Goal**: Auto-fetch protected lecture schedule, PWA installable, push notifications before exams.

**Status**: NOT STARTED

**Depends on**: Phase 2 complete

---

## Tasks

### 3.1 Google Cloud Setup
- [ ] Create Google Cloud project "UniSchedule" (free)
- [ ] Enable Google Sheets API
- [ ] Create Service Account OR OAuth 2.0 credentials
- [ ] If Service Account: share lecture sheet with service account email
- [ ] If OAuth: set up consent screen in Testing Mode, create Web client credentials
- [ ] Store credentials in `.env.local`

### 3.2 Protected Lecture Sheet Auto-Fetch
- [ ] Create `src/lib/auth-config.ts` - NextAuth configuration with Google provider
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` - auth routes
- [ ] Create `src/app/api/sheets/lectures/route.ts` - fetch protected sheet with service account/OAuth token
- [ ] Create `src/app/admin/page.tsx` - hidden admin panel (if using OAuth approach)
- [ ] Auto-refresh lecture data with same 15-min cache as exams

### 3.3 Auto-URL Discovery
- [ ] Create `src/lib/sheets/discover-urls.ts` - scrape agruni.edu.ge for current sheet URLs
- [ ] Create `src/app/api/discover/route.ts` - API endpoint for URL discovery
- [ ] Cache discovered URLs for 24 hours
- [ ] Fallback to hardcoded sheet IDs if scraping fails

### 3.4 PWA Setup
- [ ] Create `public/manifest.json` with app name, icons, theme color
- [ ] Create PWA icons (192x192, 512x512, apple-touch-icon)
- [ ] Create `public/sw.js` - service worker with cache-first for static, network-first for API
- [ ] Register service worker in layout.tsx
- [ ] Create `src/components/layout/install-prompt.tsx` - iOS/Android install banner
- [ ] Create `src/hooks/use-install-prompt.ts`

### 3.5 Push Notifications
- [ ] Generate VAPID keys, add to `.env.local`
- [ ] Create `src/lib/notifications.ts` - client-side push subscription helpers
- [ ] Create `src/hooks/use-notifications.ts` - permission request + subscribe
- [ ] Create `src/app/api/push/subscribe/route.ts` - store subscriptions (JSON file)
- [ ] Create `src/app/api/push/send/route.ts` - send push notifications via web-push
- [ ] Add push event handler to service worker
- [ ] Create notification settings UI in settings page

### 3.6 Cron Job
- [ ] Create `vercel.json` with cron configuration (hourly)
- [ ] Implement exam reminder logic: check upcoming exams, match to subscriptions, send push
- [ ] Configurable timing: 1 week, 3 days, 1 day, 2 hours before exam

---

## Key Files Created This Phase
- `src/app/api/sheets/lectures/route.ts` - protected sheet access
- `public/sw.js` - service worker
- `public/manifest.json` - PWA manifest
- `src/app/api/push/` - push notification endpoints
- `vercel.json` - cron configuration
