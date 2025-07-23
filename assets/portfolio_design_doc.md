# Portfolio Website Design Document (v3 — Minimal Stack)

> **Scope** · This document specifies *what* the portfolio site is and *how it should look & behave*. It deliberately omits any build or execution instructions so that downstream agents can decide the best implementation workflow.

---

## 1 · Purpose & Goals

| Goal ID | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
|  G‑1    | Present a single‑page portfolio that feels like a live Linux terminal (Hyprland tiling aesthetic). |
|  G‑2    | Showcase projects, work experience, skills, and education to technical recruiters at a glance.     |
|  G‑3    | Keep total transferred size ≤ 200 kB gzipped and hit Lighthouse ≥ 95 (Perf & Accessibility).       |
|  G‑4    | Host as a **purely static** site on GitHub Pages—no build pipeline or backend required.            |

---

## 2 · Target Audience

* Hiring managers & recruiters evaluating technical depth.
* Fellow developers browsing your work.

---

## 3 · Minimal Tech Stack

| Layer      | Choice                                                                    | Rationale (fits G‑3 & G‑4)                                                |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Host       | **GitHub Pages**                                                          | Free, version‑controlled, HTTPS, custom domain.                           |
| Markup     | **HTML5** (semantic)                                                      | Delivers static content without a framework.                              |
| Style      | **CSS3** + **Tailwind CSS via CDN** (optional)                            | Utility classes with zero build step; easily removed if pure CSS desired. |
| Script     | **Vanilla JS (ES6 modules)**                                              | Eliminates bundlers; can be inlined or loaded as single `app.js`.         |
| Animations | `typed.js` (≈2.5 kB gz) for typewriter; CSS keyframes for fades/slide‑ins | Lightweight, no React/Framer required.                                    |
| Fonts      | **JetBrains Mono Nerd Font** (`woff2` self‑host)                          | Monospace hacker aesthetic; Nerd icons baked‑in.                          |
| Icons      | Nerd glyphs + minimal inline SVGs                                         | No heavy icon libraries.                                                  |

*No build tools, transpilers, test frameworks, or CI pipelines are assumed.*

---

## 4 · Theming — Gruvbox Dark (Gogh variant)

Define palette as CSS custom properties (can live in `<style>` or an external `theme.css`).

```css
:root {
  --bg:        #1d2021; /* background */
  --bg-hl:     #282828; /* highlighted window */
  --fg:        #ebdbb2; /* primary text */
  --accent1:   #b8bb26; /* green */
  --accent2:   #83a598; /* blue */
  --accent3:   #fe8019; /* orange */
  --accent-red:#fb4934; /* red */
  --cursor:    var(--accent3);
}
body { background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; }
```

* Dark‑mode only; `prefers-color-scheme` respected but not required.
* Hyprland‑style 2 px window borders use `--accent2`.

---

## 5 · Information Architecture & Required Content

Each logical chunk is a `<section>` tagged with the **Section ID**. Content is fed from a `profile.json` (see §6), but may also be hard‑coded.

| Section ID   | Terminal Label               | Required Fields (from JSON)                                                                                    | Display Notes                                                                        |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `intro`      | `$ whoami`                   | `full_name`, `tagline` (≤80 chars), `bio` (≤120 words), `location`                                             | `<h1>` typewriter for `full_name`; subtitle shows `tagline`; paragraph for `bio`.    |
| `experience` | `$ history`                  | `jobs[]` → `{title, company, location, start_date, end_date, bullets[] (≤5)}`                                  | Reverse‑chronological list with collapsible details per job.                         |
| `projects`   | `$ ls projects/`             | `projects[]` → `{name, year, repo_url, live_url, stack[], summary (≤40 words), highlights[] (≤3), image_path}` | Responsive grid; card flips on hover to show `highlights`.                           |
| `skills`     | `$ cat skills.txt`           | `skills` object → `{languages[], frameworks[], tools[], devops[], cloud[]}`                                    | Render as tag cloud; color‑code proficiency (green = strong, orange = intermediate). |
| `education`  | `$ grep -i education resume` | `schools[]` → `{degree, field, institution, location, grad_year, gpa?}`                                        | Simple list.                                                                         |
| `contact`    | `$ ping me`                  | `contact` → `{email, linkedin_url, github_url, resume_pdf_url?, phone?}`                                       | Terminal‑style prompt; clicking email copies to clipboard and flashes `accent1`.     |

---

## 6 · Content JSON Skeleton

Agents can populate the following and inject into the page via `<script type="application/json" id="profile-data">` or fetch a separate file.

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
      "live_url": "https://<project>.github.io",
      "stack": ["HTML", "CSS", "JS"],
      "summary": "<short>",
      "highlights": ["<feat1>", "<feat2>"],
      "image_path": "assets/<project>.webp"
    }
  ],
  "skills": {
    "languages": ["Python", "TypeScript"],
    "frameworks": ["Tailwind"],
    "tools": ["Git"],
    "devops": [""],
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
    "resume_pdf_url": "assets/resume.pdf"
  }
}
```

---

## 7 · Layout & Interaction Design

### Window Layout

* Sections are faux windows with 2 px border (`--accent2`) and 8 px gap.
* `scroll-snap-type: y mandatory` on `<main>`; each window uses `scroll-snap-align: start`.
* Fixed side nav on desktops; collapses to hamburger below 768 px.

### Animation Catalogue

| Element                    | Effect                               | Tech          | Duration |
| -------------------------- | ------------------------------------ | ------------- | -------- |
| Section headers (`h2`)     | Typewriter cursor blink              | typed.js      | dynamic  |
| Section appear in viewport | Fade + translate‑Y                   | CSS keyframes | 450 ms   |
| Project card hover         | Fade in                              | CSS           | 400 ms   |
| Inline links               | Underline‑grow on hover              | CSS           | 150 ms   |
| `prefers-reduced-motion`   | All transforms disabled; opacity = 1 | CSS media     | —        |

---

**END OF DOCUMENT**
