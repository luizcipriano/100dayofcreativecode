---
name: 100days-creative-code
description: Conventions, structure, and tech stack for the 100 Days of Creative Code project. Use when creating a new day experiment, adding a day to the grid, working with canvas/particles/flow fields/SVG/scroll effects, or using Three.js, React Three Fiber, Drei, GSAP, or WebGL in this project.
---

# 100 Days of Creative Code

One creative web experiment per day, for 100 days. Each day is a self-contained HTML/CSS/JS project. No build step — pure static files.

## Project structure

```
100dayofcreativecode/
├── index.html        # Landing page (auto-generates the day grid)
├── main.js           # DAYS array — source of truth for the grid
├── style.css         # Landing page styles
├── netlify.toml      # Static deploy config (no build command)
└── dayN/             # One folder per day
    ├── index.html
    ├── style.css
    └── script.js
```

## Adding a new day

**Checklist:**

- [ ] Create `dayN/` with `index.html`, `style.css`, `script.js`
- [ ] Add an entry to the `DAYS` array in `main.js`

Entry shape:

```js
{
  n:     2,
  title: "Experiment Title",
  desc:  "One-line description shown on the card.",
  tags:  ["canvas", "particles"],   // kebab-case, lowercase
  path:  "./day2/"
}
```

Once saved, the card appears automatically on the landing page.

## Technology stack

### Vanilla (default — no bundler)

- **Canvas 2D API** — particles, generative drawing, pixel manipulation
- **SVG** — path animations, morphing, generative shapes
- **Vanilla JS** — ES modules via `<script type="module">` when needed
- **GSAP** (CDN) — timeline animations, scroll triggers, morphing

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### 3D / WebGL

**Three.js** — load via CDN import map (no bundler needed):

```html
<script type="importmap">
  { "imports": { "three": "https://esm.sh/three@0.171.0" } }
</script>
<script type="module">
  import * as THREE from 'three';
</script>
```

**React Three Fiber (R3F)** — React renderer for Three.js. Use when a day's complexity warrants a component model. Load React + R3F + Drei from a CDN (e.g. esm.sh) or use Vite for that day's subfolder if preferred.

**Drei** — helpers and abstractions for R3F (`@react-three/drei`). Provides ready-made controls, loaders, shaders, and environment presets on top of R3F.

Preferred tags for 3D days: `"three-js"`, `"r3f"`, `"drei"`, `"webgl"`

### Noise / math

- Perlin / Simplex noise for flow fields and organic motion
- Use `simplex-noise` (ESM CDN) or a small self-contained inline implementation

```js
// ESM CDN example
import { createNoise2D } from 'https://esm.sh/simplex-noise@4.0.3';
const noise2D = createNoise2D();
```

## Techniques catalogue

| Technique | Common tools | Example tags |
|---|---|---|
| Particles & flow fields | Canvas 2D, Perlin noise | `particles`, `flow-field` |
| SVG animation | SVG + GSAP / CSS | `svg`, `gsap` |
| Scroll-driven effects | GSAP ScrollTrigger | `scroll`, `gsap` |
| Generative / procedural art | Canvas 2D, math | `generative` |
| 3D scenes | Three.js, R3F | `three-js`, `r3f` |
| Shader effects | GLSL, Three.js ShaderMaterial, WebGL | `glsl`, `shader`, `webgl` |
| Typography / text art | Canvas 2D, SVG | `typography` |
| Audio-reactive | Web Audio API + Canvas | `audio` |

## Conventions

- **Self-contained days** — no shared JS between `dayN/` folders
- **Tags** — kebab-case lowercase in the DAYS array
- **CDN-first** for libraries; avoid npm/bundlers unless a day specifically needs it
- **Local dev** — `npx serve .` from the repo root (no build step)
- **Deploy** — Netlify static, config in `netlify.toml`; live at `https://codetddia.netlify.app/`
- Day 1 (Flow Field) is the reference implementation for Canvas + Perlin noise patterns
