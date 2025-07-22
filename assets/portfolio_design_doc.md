# Portfolio Website Design Document (v2)

> **Note for AI implementers:** This document is intentionally explicit and uses machine‑readable structures (tables, JSON-schema snippets, clear IDs) so that autonomous agents can convert it directly into code. All placeholder values follow `<kebab‑case>` naming for easy string replacement once the final resume data is available.

---

## 1 · Purpose & Goals

| Goal ID | Description                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| G‑1     | Present a single‑page portfolio that feels like a living Linux terminal (Hyprland window‑manager aesthetic). |
| G‑2     | Showcase real‑world projects, work experience, skills, and education to recruiters.                          |
| G‑3     | Keep bundle ≤ 200 kB gzipped and achieve Lighthouse ≥ 95 on Performance & Accessibility.                     |
| G‑4     | Deploy seamlessly to GitHub Pages via `gh-pages` branch and CI workflow.                                     |

---

## 2 · Target Audience

- **Recruiters & Hiring Managers** looking to assess technical depth quickly.
- **Developers / OSS maintainers** interested in collaboration.

---

## 3 · Tech Stack

| Layer     | Choice                                                                | Rationale                                                       |
| --------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| Host      | **GitHub Pages**                                                      | Free, version‑controlled, custom domain, HTTPS.                 |
| Build     | **Vite + React (TypeScript)**                                         | Fast HMR, tree‑shaking, JSX ergonomics; produces static assets. |
| Styling   | **Tailwind CSS** + custom CSS vars                                    | Utility‑first, easy dark mode, JIT compiles only used classes.  |
| Animation | **typed.js** (header typing), **framer‑motion** (section transitions) | Lightweight yet expressive.                                     |
| Fonts     | **JetBrains Mono Nerd Font** (self‑host WOFF2)                        | Monospace aesthetic + Nerd icons.                               |
| Icons     | Nerd glyphs, **lucide‑react**                                         | Feather‑style SVGs for consistency.                             |
| Tooling   | ESLint, Prettier, Husky, Playwright (E2E)                             | Quality gates & tests.                                          |
| CI/CD     | GitHub Actions (`pages-build-deployment`)                             | Auto‑deploy on push to `main`.                                  |

---

## 4 · Theming – Gruvbox Dark (Gogh variant)

CSS variables defined in `` and consumed via Tailwind’s `theme.extend.colors`.

```css
:root {
  /* Gruvbox Dark (medium contrast) */
  --bg:        #1d2021; /* background */
  --bg-hl:     #282828; /* highlighted window */
  --fg:        #ebdbb2; /* primary text */
  --accent1:   #b8bb26; /* green */
  --accent2:   #83a598; /* blue */
  --accent3:   #fe8019; /* orange */
  --accent-red:#fb4934; /* red */
  --cursor:    var(--accent3);
}
```

- Dark‑mode only; `prefers-color-scheme` not needed but respected.
- Hyper‑land‑style window borders use `--accent2`.

---

## 5 · Information Architecture & Required Content

Each **Section** is a self‑contained React component (`<SectionWindow id="intro"/>`) and receives its data from a central JSON (see §6). All content *must* be supplied; leave empty arrays only when item count = 0.

| Section ID   | Terminal Label               | Required Fields                                                                                                        | Notes                                                                                           |
| ------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `intro`      | `$ whoami`                   | `full_name`, `tagline` (≤ 80 chars), `bio` (≤ 120 words), `location`                                                   | Typewriter animates `<full_name>` and `<tagline>`; cursor uses `--cursor`.                      |
| `experience` | `$ history`                  | Array `jobs[]` → `{ title, company, location, start_date, end_date, bullets[] (≤5) }`                                  | Render reverse‑chronological; collapsible accordion per job.                                    |
| `projects`   | `$ ls projects/`             | Array `projects[]` → `{ name, year, repo_url, live_url, stack[], summary (≤40 words), highlights[] (≤3), image_path }` | Responsive grid; hover flips card to show `highlights`.                                         |
| `skills`     | `$ cat skills.txt`           | Object `{ languages[], frameworks[], tools[], devops[], cloud[] }`                                                     | Display as tag cloud with syntax‑highlight‑like colors (green=proficient, orange=intermediate). |
| `education`  | `$ grep -i education resume` | Array `schools[]` → `{ degree, field, institution, location, grad_year, gpa? }`                                        | Minimal list.                                                                                   |
| `contact`    | `$ ping me`                  | `email`, `linkedin_url`, `github_url`, `resume_pdf_url?`, `phone?`                                                     | Prompt‑style input; clicking copies `email`.                                                    |

---

## 6 · Content JSON Schema (for AI ingestion)

`src/data/profile.json` example skeleton:

```json
{
  "full_name": "<name>",
  "tagline": "<one-liner>",
  "bio": "<short bio>",
  "location": "<city, country>",
  "jobs": [
    {
      "title": "<role>",
      "company": "<company>",
      "location": "<location>",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM | Present",
      "bullets": ["<achievement1>", "<achievement2>"]
    }
  ],
  "projects": [
    {
      "name": "<project>",
      "year": 2025,
      "repo_url": "https://github.com/<user>/<repo>",
      "live_url": "https://<project>.vercel.app",
      "stack": ["React", "Node.js"],
      "summary": "<short>",
      "highlights": ["<feat1>", "<feat2>"],
      "image_path": "/assets/<project>.webp"
    }
  ],
  "skills": {
    "languages": ["Python", "TypeScript"],
    "frameworks": ["React", "FastAPI"],
    "tools": ["Docker", "Git"],
    "devops": ["GitHub Actions"],
    "cloud": ["AWS"]
  },
  "schools": [
    {
      "degree": "M.S.",
      "field": "Computer Science",
      "institution": "Texas A&M University",
      "location": "College Station, TX, USA",
      "grad_year": 2025,
      "gpa": 3.9
    }
  ],
  "contact": {
    "email": "<email>",
    "linkedin_url": "https://linkedin.com/in/<user>",
    "github_url": "https://github.com/<user>",
    "resume_pdf_url": "/assets/resume.pdf"
  }
}
```

Agents should populate this JSON, import it, and pass props downward.

---

## 7 · Layout & Interaction Design

- **Hyprland‑inspired tiling:** Each section is a pseudo‑window with 2 px border (`--accent2`), 8 px gap, subtle drop shadow.
- **Scroll‑snap:** `scroll-snap-type: y mandatory;` on `<main>`; each window `scroll-snap-align: start;`.
- **Fixed left nav (**``**):** List of section labels; uses `accent3` underline for active.
- **Responsiveness:** Breakpoint `md` (768 px) collapses nav into hamburger in header.

### Animation Spec

| Element                | Effect                              | Library         | Timing          |
| ---------------------- | ----------------------------------- | --------------- | --------------- |
| Headers (`h2`)         | Typewriter then solid cursor        | typed.js        | dynamic         |
| Window mount           | Fade + translate‑Y                  | framer‑motion   | 0.45 s ease‑out |
| ProjectCard hover      | flip‑right 3D                       | CSS perspective | 0.4 s           |
| Links                  | underline grow                      | CSS             | 150 ms          |
| prefers‑reduced‑motion | All transforms → `opacity:1` static |                 |                 |

---

## 8 · Component List (directory structure)

```
src/
 ├─ components/
 │   ├─ TerminalHeader.tsx
 │   ├─ NavPrompt.tsx
 │   ├─ SectionWindow.tsx
 │   ├─ ProjectCard.tsx
 │   ├─ SkillBadge.tsx
 │   └─ ContactPrompt.tsx
 ├─ data/
 │   └─ profile.json
 ├─ pages/
 │   └─ index.tsx
 └─ styles/
     └─ theme.css
```

---

## 9 · Accessibility & SEO

- Contrast ratios checked against Gruvbox palette (≥ 4.5:1).
- All interactive elements reachable via keyboard.
- Skip‑to‑content link at top for screen readers.
- `aria-label` on icons & inputs.
- SEO meta (`title`, `description`, OpenGraph, canonical). JSON‑LD Person schema.

---

## 10 · Performance Budget & Tooling

| Metric       | Target   | Notes                                                     |
| ------------ | -------- | --------------------------------------------------------- |
| LCP (mobile) | ≤ 2.0 s  | Optimize hero image; use `loading="lazy"`.                |
| JS (gzip)    | ≤ 200 kB | Split vendor chunk; remove unused framer‑motion features. |
| CLS          | 0        | Avoid layout shift via fixed image dims.                  |

Add Playwright tests for nav focus order and contact copy‑to‑clipboard.

---

## 11 · Deployment

1. `pnpm i`
2. `pnpm build` → output `dist/`.
3. GitHub Action copies `dist` to `gh-pages` branch.
4. Configure repository → Pages → branch = `gh-pages`.

---

## 12 · Future Enhancements (Backlog)

| Pri | Item                            |
| --- | ------------------------------- |
|  P1 | Theme toggle (light Gruvbox).   |
|  P2 | Blog engine via Markdown → MDX. |
|  P3 | i18n (English / Spanish).       |

---

**END OF DOCUMENT**

