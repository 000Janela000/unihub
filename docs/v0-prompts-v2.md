# v0.dev Prompts — UniHub v2 Fresh Redesign

Start a NEW project in v0.dev. Don't reference any existing design. Let v0 choose the best theme, colors, and style. The only requirement is: shadcn/ui + Tailwind + dark mode.

Generate these 7 pages in order. Each prompt is self-contained.

---

## 1. Login Page

```
Design a premium login page for "UniHub" — a university student portal app for Georgian students.

The page should feel like signing into Linear, Notion, or Vercel — minimal, premium, modern.

Content:
- App logo area: any modern geometric icon + "UniHub" wordmark
- Subtitle: "სტუდენტის პორტალი" (Georgian for "Student Portal")
- Single "Google-ით შესვლა" button (Georgian for "Sign in with Google") with Google G icon
- Below: "მხოლოდ @agruni.edu.ge ელ-ფოსტა" (Only @agruni.edu.ge emails)
- At bottom: "საქართველოს აგრარული უნივერსიტეტი" (Agricultural University of Georgia)

Design requirements:
- Full screen, no navigation
- Beautiful animated or gradient background
- Card with glassmorphism/frosted glass effect
- Dark mode variant that looks equally premium
- Theme toggle button in corner
- Mobile responsive
- Use shadcn/ui, Tailwind CSS, Next.js "use client"
```

## 2. Extension Setup Page

```
Design a setup/onboarding page for "UniHub" that asks the user to install a Chrome browser extension.

This page is shown once after first login. The extension is REQUIRED — there is no skip option.

Content:
- Title: "EMIS-თან დაკავშირება" (Connect to EMIS)
- Subtitle: explain that the extension reads student data from the university system
- Step-by-step visual:
  1. Install Chrome extension (with Chrome Web Store button/link)
  2. Visit EMIS (emis.campus.edu.ge) — you'll be auto-signed in
  3. Return to UniHub — your data syncs automatically
- Visual illustration or icon for each step (puzzle piece, globe, check)
- Large "გაფართოება დაინსტალირებულია" (Extension Installed) button at bottom
- Status indicator: waiting for extension → connected ✓

Design requirements:
- Clean, spacious, step-by-step layout
- Progress/stepper visual
- Matches the login page theme
- Dark mode
- Mobile responsive
- Use shadcn/ui, Tailwind CSS, Next.js "use client"
```

## 3. Dashboard (Home Page)

```
Design a student portal dashboard for "UniHub". This is the main home page after login.

Top section:
- Greeting: "გამარჯობა, [სახელი]" (Hello, [Name]) with today's date in Georgian
- Small user avatar on the right

Card grid (2 columns desktop, 1 mobile):
1. "დღის ცხრილი" (Today's Schedule) — vertical list of today's lectures:
   - Each: time range (10:00-11:00), subject name, room badge
   - If no classes: "დღეს ლექციები არ არის"
   - Max 5-6 items

2. "მომავალი გამოცდები" (Upcoming Exams) — next 3-5 future exams:
   - Each: date, subject, exam type pill (მიდტერმი/ფინალური/ქვიზი), countdown ("3 დღეში")
   - Color-coded left border per type

3. "GPA" — current GPA as big number (e.g., 3.45), credits earned/total, small trend arrow
   - Links to full grades page

4. "სწრაფი ბმულები" (Quick Links) — icon grid: EMIS, Email, Library, University site

Navigation:
- Desktop: left sidebar (240px) with: Dashboard, Schedule (ცხრილი), Exams (გამოცდები), Grades (ნიშნები), Settings (პარამეტრები)
- Mobile: bottom bar with 3 tabs (Dashboard, Schedule, Exams) + "More" button that opens a drawer with (Grades, Settings)
- Active state with subtle highlight

Design requirements:
- Cards with subtle shadow, rounded corners
- Clean spacing, not cramped
- Dark mode
- Mobile responsive
- Use shadcn/ui, Tailwind CSS, lucide-react icons, Next.js "use client"
```

## 4. Weekly Schedule Page

```
Design a full weekly class schedule view for "UniHub" — ALL days visible at once, no tabs.

Header:
- Title: "კვირის ცხრილი" (Weekly Schedule)
- Group code badge (e.g., "con24-01")
- Total lecture count
- Toggle: "ჩემი საგნები" (My Subjects) / "ყველა" (All) — switches between enrolled subjects and all group lectures

Layout:
- 6 columns side by side: ორშაბათი, სამშაბათი, ოთხშაბათი, ხუთშაბათი, პარასკევი, შაბათი (Mon-Sat)
- Horizontal scroll on mobile
- Each column has: day name header with lecture count badge
- Today's column highlighted with accent background
- Compact lecture cards in each column, sorted by time

Each lecture card:
- Time range (10:00-11:00) in small mono text
- Subject name (bold, 2-line max truncate)
- Room number as tiny badge with map pin icon
- Left border color: one color for lectures, another for seminars, another for labs
- Hover/tap shows tooltip with: full subject name, lecturer name, time, room

Bottom: color legend showing what each border color means (ლექცია/სემინარი/ლაბორატორია)

Empty day columns show a subtle dash "—"

Design requirements:
- Cards fit in narrow columns (min 140px per column)
- Scannable at a glance — student sees entire week without scrolling vertically
- Dark mode
- Mobile: columns scroll horizontally
- Use shadcn/ui, Tailwind CSS, lucide-react, tooltip component, Next.js "use client"
```

## 5. Exams Page

```
Design an exam schedule page for "UniHub" — showing ONLY upcoming future exams.

Header:
- Title: "გამოცდები" (Exams) with count badge
- Search bar: "ძებნა..." (Search) — filters by subject or lecturer
- Toggle: "მომავალი" (Upcoming) / "ყველა" (All) — switches between future-only and all exams
- "Export" button for calendar export

Exam list:
- Grouped by date with sticky date headers
- Date header shows: "21 ოქტომბერი, ორშაბათი" (October 21, Monday) in Georgian
- Each exam card:
  - Left: colored border (different color per exam type)
  - Time shown in subtle circle/badge
  - Subject name (bold)
  - Exam type pill: "შუალედური" (midterm, blue), "ფინალური" (final, red), "ქვიზი" (quiz, purple), "აღდგენა" (retake, gray)
  - Countdown: "3 დღეში" (in 3 days), "ხვალ" (tomorrow), "დღეს 10:00" (today at 10:00)
  - Click to expand: shows lecturers, group code, student count, "კალენდარში დამატება" (Add to Calendar) button

Filter chips: filter by exam type (midterm, final, quiz, retake)

Empty state: "მომავალი გამოცდები არ არის" (No upcoming exams)

Design requirements:
- Cards with smooth expand animation
- Urgent exams (today/tomorrow) visually highlighted
- Staggered fade-in on load
- Dark mode
- Mobile responsive
- Use shadcn/ui, Tailwind CSS, lucide-react, Next.js "use client"
```

## 6. Grades/GPA Page

```
Design a grades and GPA page for "UniHub" — academic transcript with visual analytics.

Top hero:
- Large GPA number (e.g., "3.45") with label "GPA"
- Credits: "earned 120 / required 240 ECTS"
- Small up/down trend arrow comparing to last semester

Chart section:
- Line chart: GPA trend across semesters (use recharts)
- X-axis: semesters (I, II, III, IV, V, VI, VII, VIII)
- Y-axis: GPA 0-4 scale

Semester selector:
- Horizontal pills: "I სემესტრი", "II სემესტრი", etc. or "All"

Course grades table/cards:
- Each course: name, credits (ECTS), grade letter (A/B/C/D/F), numeric points, status
- Status badge: green "ჩაბარებული" (Passed), red "ვერ ჩააბარა" (Failed)
- If a subject was retaken: special badge "ხელახლა ჩაბარებული" (Retaken) with link to original attempt
- Sort by: name, grade, credits

Summary footer:
- Total credits this semester
- Semester GPA vs cumulative GPA

Design requirements:
- GPA hero section is visually prominent
- Chart is clean and readable
- Table/cards hybrid that works on mobile
- Dark mode
- Use shadcn/ui, Tailwind CSS, recharts, lucide-react, Next.js "use client"
```

## 7. Settings Page

```
Design a settings page for "UniHub" that combines profile info + app settings.

Profile section:
- Large profile photo (circle), full name, email with @agruni.edu.ge badge
- Faculty name, Year, Group Code — all read from EMIS (not editable)
- EMIS connection status: green dot "დაკავშირებულია" (Connected) with last sync time, or red "გათიშულია" (Disconnected) with reconnect button

Settings sections (each in its own card):
1. Theme: Light / Dark / System — as segmented control with sun/moon/monitor icons
2. Language: ქართული / English — segmented control
3. Notifications: push notification toggle, timing options (1 week, 3 days, 1 day, 2 hours before exams) as checkboxes
4. About: app version, "Made for agruni.edu.ge", GitHub link

Sign out button at bottom: "გასვლა" (Sign Out) — subtle, not prominent

Design requirements:
- Card sections with clean spacing
- Segmented controls (not dropdowns) for theme/language
- Profile section at top is visually distinct
- Dark mode
- Mobile responsive
- Use shadcn/ui, Tailwind CSS, lucide-react, Next.js "use client"
```

---

## Instructions

1. Go to https://v0.dev
2. Start a NEW chat (fresh, no existing project)
3. Paste each prompt one at a time
4. Let v0 choose the theme/colors — don't constrain it
5. If you don't like a result, iterate with follow-up prompts
6. When satisfied, download the zip for each page
7. Share all zips — I'll rebuild the entire frontend from them
