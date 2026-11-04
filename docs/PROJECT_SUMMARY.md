# ABHISHEK: The Series — Project Summary & Pipeline Architecture

*A living document, updated after every task. Exported to PDF at the end of the project.*
**Last updated:** 5 Nov 2026 · **Current step:** Live at https://sirabhishekportfolio.vercel.app; tablet fixes waiting to be pushed

---

## 1. Overview

| | |
|---|---|
| **What** | A personal portfolio website styled like a streaming service: your career presented as a TV series |
| **Who** | Abhishek Kaushik, full-stack developer and M.Tech student (Mathematics & Computing, NIT Jalandhar) |
| **Goal** | A portfolio that stands out to recruiters and developers, while learning React, GSAP and Three.js properly |
| **Inspiration** | A reference reel ("This isn't Netflix, it's my portfolio"). The idea is borrowed; all code, content and branding are original. |
| **Folder** | `D:\Project02\my_Project` |
| **Way of working** | Hybrid: Claude does setup, writes the 3D scene and reviews. Abhishek writes every section and all animations, one task at a time. |

---

## 2. Tech stack

| Layer | Tool | Version | Role |
|---|---|---|---|
| Build tool | Vite (Rolldown bundler) | 8.3 | Dev server with instant reload, production builds |
| UI library | React | 19.3 | Components, state, rendering |
| Styling | Tailwind CSS (`@tailwindcss/vite`) | 4.3 | Utility classes, design tokens via `@theme` |
| Fonts | Fontsource (Bebas Neue, Inter Variable, Instrument Serif) | 5.3 | Self-hosted fonts, no Google requests |
| Animation | GSAP + `@gsap/react` | 3.15 | Timelines, ScrollTrigger, SplitText, Flip *(from M4)* |
| 3D | Three.js + React Three Fiber + Drei | 0.186 / 9.8 / 10.7 | 3D name intro *(M6)* |
| Linting | Oxlint | 1.89 | Fast code checks |
| Hosting | Vercel *(planned, M16)* | — | Static hosting on a global CDN |
| Backend *(planned, M17)* | Node.js + Express | — | Contact-form API that emails Abhishek |

---

## 3. Pipeline architecture

### 3.1 Content pipeline: from resume to screen
```
 Resume PDF            content.md              src/data/*.js                React components            Browser
 (updated_resume  ──►  (text drafted     ──►   (structured JS data:    ──►  (.map() turns each    ──►   (DOM: cards,
  _08-26.pdf)           for the web)            arrays of objects)           object into JSX)            pills, titles)
                                                 projects.js  ✅
                                                 skills.js    ✅
                                                 experience.js ✅
                                                 journey.js    ✅
                                                 credentials.js ✅ (awards + education)
                                                 profile.js    ✅ (hero: name, role, pills, tagline)
```
**Principle: data is separate from design.** Adding a project means editing one data file, and a new
card appears with no UI code changed. Later, this data could come from a database through an API, the
same pattern used in backend systems.

### 3.2 Render pipeline: how the page starts in the browser
```
 index.html                    src/main.jsx                         src/App.jsx                  Components
 ┌───────────────────┐        ┌──────────────────────────────┐      ┌──────────────────────┐     ┌──────────────────┐
 │ <body class=      │        │ import fonts (Fontsource)    │      │ <main>               │     │ SectionTitle     │
 │  "bg-night        │ ─────► │ import index.css (Tailwind)  │ ───► │  <section> × N       │ ──► │ (eyebrow + title)│
 │   text-white">    │        │ createRoot(#root).render(    │      │  data.map(...)       │     │ cards, pills …   │
 │ <div id="root">   │        │   <App/>)                    │      │ </main>              │     │                  │
 └───────────────────┘        └──────────────────────────────┘      └──────────────────────┘     └──────────────────┘
```

### 3.3 Styling pipeline
```
 src/index.css                             Tailwind (Vite plugin)                        Output
 @import "tailwindcss";            ──►     scans every .jsx/.html for class names  ──►   one small CSS file
 @theme { --color-accent: … }               (bg-base, font-display, md:text-9xl …)        with only the classes used
```
**Design tokens:** `night #0b0b0f` (page background) · `surface #18181b` · `accent #ff2a36` · `muted #a1a1aa` · `gold #d4a64a` (awards) ·
`font-display` Bebas Neue · `font-sans` Inter Variable · `font-serif` Instrument Serif.

### 3.4 Development & build pipeline
```
                         DEVELOPMENT                                            PRODUCTION
 Edit a file in VS Code ─► Vite dev server (localhost:5173) ─► Browser     npm run build ─► dist/ (HTML + 1 JS + 1 CSS
 (Ctrl+S to save)          transforms JSX + Tailwind on demand  hot-reloads                   + font files, minified)
                           (must run inside my_Project and                                       │
                            stay open while working)                                             ▼
                                                                            Git push ─► Vercel builds ─► Global CDN ─► Visitors
                                                                            (M16, planned)
```
Current production build: **22 modules → 224 KB JS (70 KB gzipped) + 15 KB CSS**, built in under 1 second.

### 3.5 Planned layers
```
 Visitor ─► 3D intro (Three.js, lazy-loaded, once per session) ─► "Who's watching?" profile gate
                                                                       │ chosen profile reorders sections
                                                                       ▼
            Home: Billboard ─ Episodes row ─ Screenplay ─ Experience ─ Awards ─ Skills ─ Originals ─ Pilot ─ Journey ─ Top Picks ─ To Be Continued
                                       ▲ GSAP animations (ScrollTrigger, SplitText, Flip) on every section
 Contact form (M17) ─► Node/Express API ─► email to Abhishek
```

---

## 4. Folder structure (current)
```
my_Project/
├── docs/PROJECT_SUMMARY.md   ← this document
├── PLAN.md                   ← full plan and milestones
├── content.md                ← text drafted from the resume
├── index.html                ← page shell, tab title, body colors
├── vite.config.js            ← React + Tailwind plugins
├── package.json              ← dependencies and scripts (dev, build, lint, preview)
├── public/
│   ├── favicon.svg
│   └── images/abhishek.webp ← portrait, background removed (OpenCV GrabCut), 57 KB WebP with transparency
└── src/
    ├── main.jsx              ← entry: fonts, CSS, render <App/>
    ├── index.css             ← Tailwind import + @theme design tokens
    ├── App.jsx               ← page: title screen + sections
    ├── components/
    │   ├── SectionTitle.jsx  ← reusable eyebrow + big title
    │   ├── Navbar.jsx        ← fixed top bar: "A · SERIES" logo + links array → #section ids
    │   ├── ProfileGate.jsx   ← "Who's watching?" screen
    │   ├── TiltCard.jsx      ← reusable 3D tilt + lift + glare wrapper (children prop)
    │   └── Footer.jsx        ← © year (auto), Email · LinkedIn · GitHub (shown only if set)
    ├── intro/
    │   ├── Intro.jsx         ← 3D name intro (lazy-loaded, once per visit)
    │   └── helvetiker_bold.typeface.json ← 3D font
    └── data/
        ├── projects.js       ← 4 projects (Eventora, AI Cold Email, Irrigation ML, Student Tracker)
        ├── skills.js         ← 8 skill genres
        ├── experience.js     ← Yantram Medtech (role, period, summary, 3 points, tech)
        ├── journey.js        ← 5 seasons (S05 marked upcoming → dashed, faded style)
        ├── credentials.js    ← awards (3) + education (2): two named exports in one file
        ├── profiles.js       ← 4 viewer profiles, each with its section order
        └── profile.js        ← one object: name, labels, role, pills, tagline, links
```

---

## 5. Milestones & progress

| Milestone | Status | Notes |
|---|---|---|
| M0 Setup | ✅ Done (28 Oct) | Vite, React, Tailwind, GSAP, Three.js installed |
| M1 Design system | ✅ Done (28 Oct) | Fonts, `@theme` tokens, `SectionTitle` component |
| M2 Content as data | ✅ Done (31 Oct) | projects · skills · experience · journey · credentials · profile: every section now reads from `src/data/` |
| M3 App shell | ✅ Done (31 Oct) | Navbar (5 links, smooth scroll) · Footer (auto year, Email, LinkedIn, GitHub) · one component per section in `src/sections/` |
| M4 Billboard hero + first GSAP animation | ✅ Done (31 Oct) | GSAP entrance timeline · pulsing glow · billboard with cut-out portrait (blur-in, slow zoom) · Watch Originals / More Info buttons |
| M5 Episode row + card effects | ✅ Done (31 Oct) | Custom cursor tried and removed by choice · Full Story screenplay (from M8) · "Continue Exploring" episode row · TiltCard: 3D tilt + lift + glare on project and award cards |
| M6 3D name intro (Claude) | ✅ Done (31 Oct) | `src/intro/Intro.jsx`: extruded "ABHISHEK" (Three.js Text3D, Helvetiker Bold), camera fly-in, red light sweep, labels, Skip button; once per visit (sessionStorage); skipped for reduced motion; lazy-loaded chunk |
| M7 "Who's watching?" profiles | ✅ Done (2 Nov) | Profile gate (4 profiles), each reorders the sections; Switch-profile button in the navbar; choice remembered for the visit |
| M8–M14 Remaining sections | Planned | The Screenplay part of M8 is already done |
| M15 Mobile, accessibility, performance | Planned | |
| M16 Git + deploy to Vercel | Planned | |
| M17 Contact-form backend | Planned | |

---

## 6. Decisions log

| Date | Decision | Why |
|---|---|---|
| 28 Oct | React + GSAP + Three.js instead of plain HTML/CSS/JS | User's choice, for an impressive, animated portfolio |
| 28 Oct | Streaming-series theme, based on the reference reel | User's choice |
| 28 Oct | Hybrid split: Claude does setup + 3D, user builds sections + animations | Learn by building, without getting stuck on specialist 3D code |
| 28 Oct | **3D name intro** instead of a morphing 3D shape | Fits the cinematic theme and keeps the main page fast |
| 28 Oct | Self-hosted fonts (Fontsource) | No extra network trip to Google; better privacy |
| 28 Oct | Content stored as JS data files | One source of truth; UI and content stay independent |
| 28 Oct | Phone number left off the public site and resume download | Prevents spam scraping |
| 31 Oct | Card "lift" never happened | `gsap.quickTo(el, "scale")` does nothing, because quickTo needs a single real property and `scale` is a shortcut for scaleX + scaleY | Use quickTo for one property (x, rotationX…). For scale, use `gsap.to` on pointerenter/leave. Claude fixed TiltCard.jsx. |
| 31 Oct | "I don't see the tilt" | The project cards did tilt, but ±6° and a 12% glare are too subtle to notice; Awards.jsx edits were unsaved | Make effects clearly visible (±10°, a slight lift, stronger glare), and always check the ● on tabs |
| 31 Oct | Problems panel: "`z-[100]` can be written as `z-100`", "`[scrollbar-width:none]` → `scrollbar-none`" | Tailwind IntelliSense suggestions (shorter built-in class names), not errors. The Cursor.jsx one came from a stale tab of a deleted file. | Yellow suggestions don't break anything. Apply them for cleaner code, and close tabs of deleted files. |
| 2 Nov | **User-supplied MP3 intro sound** (`public/sounds/netflix-intro.mp3`), played on profile click, replacing the synthesised ta-dum | User chose the real tone. It is Netflix's trademarked sound, so swap it for an original before the site goes public. Browsers block audio until a click, so the 3D intro stays silent |
| 31 Oct | **Custom cursor removed**, normal pointer kept | Abhishek preferred the familiar pointer. Simpler, clearer, and accessible by default. |
| 29 Oct | Background token renamed `base` → **`night`** | `text-base` already means "16px font size" in Tailwind, so the old name collided |

---

## 7. Issues & lessons log

| Date | What happened | Cause | Lesson |
|---|---|---|---|
| 28 Oct | Fonts installed in the wrong place | `npm install` ran in `D:\Project02`, not the project | npm installs into the terminal's **current folder**. Check the prompt first. |
| 28 Oct | Theme colors didn't apply | `index.css` / `index.html` edits weren't saved | Look for the ● on VS Code tabs; enable **File → Auto Save** |
| 28 Oct | Section code landed in the wrong place | Similar-looking blocks | Use **Ctrl + F** to find the exact spot before pasting |
| 29 Oct | Blank page: "Module not found" | File named `skill.js`, import said `skills` | Import paths must match file names **exactly** (and case matters on Linux servers) |
| 29 Oct | `npm run dev` → ENOENT | Command run in `D:\Project02` | Open `my_Project` itself as the VS Code folder |
| 29 Oct | Blank page: "no export named 'default'" | Skills data pasted into `App.jsx` | Check the **tab name** before pasting |
| 29 Oct | Build crashed once (exit 134) | One-off native crash; passed on re-run | Re-run before debugging; not every failure is your code |
| 29 Oct | Experience bullets invisible (dark on dark) | Token named `base` collided with Tailwind's `text-base` font size, so `md:text-base` set the text **color** to the background | Don't name tokens after built-in Tailwind words (`base`, `sm`, `lg`, `xl` …). Check computed styles in DevTools (F12) |
| 29 Oct | Browser "failed" to load the page | The dev server had stopped (its terminal was closed) | The site only runs while `npm run dev` keeps running. Keep that terminal open. |
| 31 Oct | Blank page: "ReferenceError: profile is not defined" | The hero used `profile.…` but the `import { profile }` line was missing | Every name you use must be **imported** (or defined) in that file. The build can still pass, so check the browser console (F12). |
| 31 Oct | `<html …></html>` on one line in index.html | VS Code **auto-closes** a tag when you type `>` | Watch for an extra closing tag after typing `>`. Browsers forgive it, but it is invalid HTML. |
| 31 Oct | First custom cursor "didn't look good" | Big opaque red ▶ circle covered card text, showed on every card, and sat next to the normal arrow | Design for readability: a small dot + ring with `mix-blend-difference`, the label only where it means something (`data-cursor="view"`), and the native arrow hidden |
| 31 Oct | "My Journey" disappeared, Originals showed twice | During the swap exercise `<Journey />` was overwritten with `<Originals />` | After moving lines, re-read the whole list. Each section should appear exactly once. |
| 31 Oct | Code typed into the dev-server terminal | Pasted into the wrong window | The `npm run dev` terminal only shows the server log. Code goes in editor tabs. |
| 30 Oct | Grey "muted" text turned white everywhere | The new `--color-gold` line **replaced** `--color-muted` instead of going below it | "Add a line" means a **new** line (End → Enter). Overwriting a token silently breaks every class that uses it. |
| 29 Oct | "The Full Story" appeared twice | The full "after" snippet was pasted below the existing code instead of replacing it | **Before → After means replace.** For additions, paste only the new lines |

---

## 8. Next steps
1. ~~M2, Task 3: `experience.js` with a "Previously On…" section~~ ✅
2. ~~M2, Task 4: journey (5 seasons) data~~ ✅
3. ~~M2, Task 5: awards and education data~~ ✅
4. ~~M2, Task 6: profile / hero data~~ ✅ **M2 complete**
5. ~~M3, Task 1: navbar with links, section ids, smooth scrolling~~ ✅
6. ~~M3, Task 2: footer~~ ✅
7. ~~M3, Task 3: one component per section~~ ✅ **M3 complete**
8. ~~M4, Task 1: GSAP entrance timeline + pulsing red glow~~ ✅
9. ~~M4, Task 2: billboard with your photo~~ ✅ **M4 complete**
10. ~~M5, Task 1: custom cursor~~ removed. The normal mouse pointer is kept.
11. ~~"The Full Story" screenplay + stats~~ ✅ (brought forward from M8)
12. ~~M5, Task 2: "Continue Exploring" episode row~~ ✅
13. ~~M5, Task 3: TiltCard on project + award cards~~ ✅ **M5 complete**
14. ~~Navbar turns solid on scroll~~ ✅
15. ~~M6: 3D name intro~~ ✅
16. ~~M7: "Who's watching?" profile gate~~ ✅
17. ~~M8: Experience + Awards reveals, gold laurels, MP3 sound on profile click~~ ✅
18. ~~M9: Skill Universe: accessible genre tabs (click + arrow keys), tiles animate on every switch~~ ✅
19. ~~M10: Originals: pinned sideways scroll + red progress bar on computers, swipeable row on phones~~ ✅
20. ~~M11: The Pilot + Character card: new About section, SplitText line-by-line quote reveal, added to all four profile orders~~ ✅
21. ~~M12: My Journey: season tabs, episodes per season, direction-aware slide between seasons~~ ✅
22. ~~M13: Top Picks: outlined rank numbers, posters linking to their sections, hover effects~~ ✅
23. ~~M14: To Be Continued: scrubbed letter build-up, contact buttons, Contact link in navbar~~ ✅
24. ~~M15: Audit passed for phone widths, reduced motion and keyboard; added skip link, meta description, own favicon, motion-safe smooth scroll, data-saver intro skip, clearer gate text; brightened accent to #ff2a36 for contrast~~ ✅
25. ~~M16: Live on Vercel from GitHub (abhishekkaushik123/Sirabhishekportfolio); user chose to keep the MP3 after a trademark warning~~ ✅
26. **Next:** push tablet fixes, real-phone test, then admin panel + API (replaces M17)
