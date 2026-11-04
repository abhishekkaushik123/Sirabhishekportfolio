# My Portfolio — "ABHISHEK: The Series"

A streaming-service-style portfolio, inspired by a reference reel
(`D:\downloads\VID_20261028_020020_252.mp4`). It's built with **React, GSAP and Three.js**, and
all the content is yours, from [content.md](content.md).

> **Inspired by, not copied.** We borrow the *idea* (your career presented as a TV series) and
> build our own code and visuals. We don't use any real streaming brand's name, logo or font: the
> brand is "ABHISHEK — THE SERIES" with your own "A" logo.

---

## 1. How a visitor moves through the site

```
 ┌───────────────────────┐    ┌─────────────────────────┐    ┌──────────────────────────────┐
 │ 1. INTRO  (3D)        │ ─► │ 2. WHO'S WATCHING?      │ ─► │ 3. HOME (the series)         │
 │ "A KAUSHIK ORIGINAL"  │    │ Abhishek · Recruiter ·  │    │ Billboard + rows of sections │
 │ 3D name flies in      │    │ Developer · Explorer    │    │ order depends on the profile │
 │ Skip button · ~3 s    │    │ (chosen profile is      │    │                              │
 │ plays once a session  │    │  remembered)            │    │                              │
 └───────────────────────┘    └─────────────────────────┘    └──────────────────────────────┘
```

**Profiles change what plays first** (the content is the same for everyone):

| Profile | Shows first |
|---|---|
| **Abhishek** (main) | The full series, in order |
| **Recruiter** | Screenplay (resume), Experience, Awards, Skills |
| **Developer** | Originals (projects), Skill Universe, GitHub |
| **Explorer** | My Journey, About, Top Picks |

## 2. Sections (home page, top to bottom in the main profile)

| # | Section | Streaming idea | Your content |
|---|---|---|---|
| 0 | **Navbar** | Logo "A · SERIES", links, profile avatar (switch profile) | Home, Originals, Skills, Journey, Contact |
| 1 | **Billboard (hero)** | Huge name, "THE SERIES", info pills, description, buttons | ABHISHEK · *Full-Stack Developer • MERN • AI/ML* · pills: 2023–Present · M.Tech @ NIT Jalandhar · 3 Originals · GATE 93.2%ile · buttons: ▶ Play Intro, View Resume, ⓘ |
| 2 | **Continue Exploring** | A row of "episode" cards with progress bars | Ep 01 The Full Story · Ep 02 Experience · Ep 03 Skills · Ep 04 Originals · Ep 05 About · Ep 06 Journey |
| 3 | **The Screenplay: The Full Story** | Your resume laid out like a script page + side panel | Education, experience, projects, skills · **Download resume** · stats: 1 yr industry · 3 Originals · GATE 93.2 |
| 4 | **Previously On… (Experience)** | One "featured episode" | Yantram Medtech, Full Stack Developer (Aug 2023 – Jul 2024), clinic management app |
| 5 | **Awards & Credentials** | Gold laurel award cards + certificate row | GATE 2025 (93.2 percentile) · Full Stack Bootcamp (Udemy) · GfG certifications (C++, SQL, Python) |
| 6 | **Genres: My Skill Universe** | Genre list on the left, skill tiles on the right | Languages · Frontend · Backend · Databases · Data/ML · Tools · CS Fundamentals · *Now learning: System Design* |
| 7 | **Originals (projects)** | Big movie-poster cards, horizontal scroll, red progress bar | Eventora · AI Cold Email Generator · Precision Irrigation Intelligence · *Coming soon: Student Tracker* |
| 8 | **The Pilot: About Me** | Portrait + big serif quote | Your story in 2–3 lines |
| 9 | **Character card** | "Cast" profile card | Now: M.Tech (M&C), NIT Jalandhar · Previously: B.Tech in Computer Science and Engineering · Programming languages: C, C++, JavaScript, SQL, Python · Interests: Software Development & Artificial Intelligence |
| 10 | **5 Seasons: My Journey** | Season tabs, episodes per season | S01 The Beginning (B.Tech CSE '19–'23) · S02 First Job (Yantram) · S03 Leveling Up (GATE 2025) · S04 Building Real Products (M.Tech + projects) · S05 What's Next (backend & system design) |
| 11 | **Top Picks** | Huge outlined numbers 1–5 behind posters | 1 Eventora · 2 AI Cold Email Gen · 3 GATE 93.2 · 4 Clinic app · 5 Irrigation ML |
| 12 | **To Be Continued…** | Giant letters that build up as you scroll, then contact buttons | Email · LinkedIn · GitHub · "Let's build something" |

## 3. Look & feel (design system)

- **Colors:** near-black background `#0b0b0f`, cards `#18181b`, white text, accent red `#ff2a36`, plus gradient "poster" colors (purple, crimson, teal, amber, green).
- **Fonts (free):** *Bebas Neue* for the big condensed titles, *Inter* for body text, *Instrument Serif* italic for quotes.
- **Section titles:** a small red label above ("THE SCREENPLAY", "ORIGINALS"…) and a huge condensed title below.
- **Cursor:** the normal mouse pointer. A custom cursor was tried on 31 Oct and dropped by choice: the normal pointer is clearer.
- **Cards:** 3D tilt on hover, posters scale up, and rows scroll sideways (by touch on phones).

## 4. Tech stack

| Tool | Why |
|---|---|
| **Vite + React 19** | Fast dev server, component-based UI ✅ installed |
| **Tailwind CSS 4** | Styling with utility classes (you already know it) ✅ installed |
| **GSAP 3.15 + @gsap/react** | All animation. Plugins: ScrollTrigger, SplitText, Flip, ScrambleText (all free now) ✅ installed |
| **Three.js + React Three Fiber + Drei** | The 3D intro ✅ installed |
| **@fontsource** packages | Self-hosted fonts (faster, no Google tracking) to install in M1 |

Content lives in `src/data/*.js`, so the UI components only *display* data. Changing your projects
later means editing one file.

## 5. Who builds what (hybrid)

- **Claude:** project setup ✅ and the **3D intro scene** (Three.js), plus reviews of everything you write.
  *Decided 2026-10-28:* the 3D centrepiece is the **3D name intro**. The earlier morphing-shape idea was dropped because it doesn't fit the cinematic theme.
- **You:** every section (JSX + Tailwind) and **all the GSAP animations**, one small task at a time. I explain the concept, you write it, I review.

## 6. Milestones

| M | What | You learn |
|---|---|---|
| ✅ M0 | Setup: Vite, React, Tailwind, GSAP, Three.js installed | — |
| ✅ M1 | **Design system:** fonts, color tokens in Tailwind `@theme`, a reusable `SectionTitle` component | Tailwind 4 theming, components & props |
| ✅ M2 | **Content as data:** `src/data/` files built from content.md | JS modules, arrays of objects, `map()` |
| ✅ M3 | **App shell:** Navbar, empty sections with ids, footer, smooth anchor links | Layout, sticky nav, semantic HTML in JSX |
| ✅ M4 | **Billboard hero** + entrance animation | `useGSAP`, timelines, stagger, cleanup |
| ✅ M5 | **Episode row** + card hover/tilt *(custom cursor tried and dropped)* | `gsap.quickTo`, mouse events, CSS 3D transforms |
| ✅ M6 | **3D intro** (Claude) + skip button, plays once per session | R3F basics (reading Claude's code), sessionStorage |
| ✅ M7 | **Who's watching?** gate + section reordering | Lifting state, conditional rendering, GSAP **Flip** |
| ✅ M8 | **Screenplay** + **Experience** + **Awards** | Layout with Grid, ScrollTrigger reveal on scroll |
| ✅ M9 | **Skill Universe** (genre tabs) | Accessible tabs, animating between states |
| ✅ M10 | **Originals:** pinned horizontal-scroll posters + red progress bar | ScrollTrigger **pin + scrub** |
| ✅ M11 | **The Pilot** + **Character card** | **SplitText** line-by-line reveal |
| ✅ M12 | **My Journey** seasons | Tabs + list transitions |
| ✅ M13 | **Top Picks** | Big outlined numbers (CSS text-stroke), hover effects |
| ✅ M14 | **To Be Continued…** finale + contact | Scrubbed text scaling, CTAs |
| ✅ M15 | **Mobile, reduced motion, accessibility, speed:** lazy-load the 3D, test on a phone | `prefers-reduced-motion`, keyboard nav, code splitting |
| ✅ M16 | **Git + deploy:** GitHub repo, live on Vercel | Git workflow, CI deploys |
| M17 | **Backend bonus:** contact form → your own Node/Express API that emails you | Ties into Phase 2 of your backend roadmap |

Rough pace: one milestone every 1–3 sessions.

## 7. What I need from you

- [ ] **1–3 portrait photos** (good light, plain background). The design uses your photo in the billboard, the About page and the character card. A cut-out PNG with the background removed looks best.
- [ ] **Your GitHub username**, plus GitHub and live links for each project (if they exist)
- [ ] **A public resume PDF without your phone number** for the "Download resume" button
- [ ] Any more certificates or achievements you want on the Awards shelf
- [ ] Your **About Me** quote in your own words (I can help you draft it)
