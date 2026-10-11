# Portfolio

A single-page portfolio built on React Router 8 (framework mode, SSR) + Vite + Tailwind CSS 4,
with a scroll-driven three.js centrepiece and anime.js motion.

## Getting started

```bash
nvm use            # Node from .nvmrc (React Router 8 needs >= 22.22)
corepack enable    # pnpm version pinned in package.json
pnpm install
pnpm dev           # http://localhost:5173
```

## Make it yours

All copy — name, headline, about text, stats, skills, projects, experience, socials, email —
lives in [`app/content/portfolio.ts`](app/content/portfolio.ts). Nothing else needs touching to
personalise the page.

## How it fits together

| Path                              | What                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/routes/home.tsx`             | The one page: nav, sections, canvas, cursor                                                                      |
| `app/three/portfolio-scene.ts`    | three.js scene — shader core, wire shell, rings, particles                                                       |
| `app/components/scene-canvas.tsx` | Loads the scene client-side and maps scroll → per-section keyframes                                              |
| `app/motion/use-reveals.ts`       | anime.js entrances (`data-split` / `data-reveal` / `data-stagger` / `data-count`), hero timeline, magnetic hover |
| `app/components/*`                | Sections (hero, about, work, experience, contact) and UI pieces                                                  |
| `app/app.css`                     | Theme tokens, split-text masks, cards, cursor, grain                                                             |

To retune how the 3D object behaves per section, edit `KEYFRAMES` in `scene-canvas.tsx` (one
entry per `[data-scene]` section, in page order). The page respects `prefers-reduced-motion`
and degrades gracefully without WebGL or JavaScript.

## Scripts

| Script           | Purpose                        |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Dev server                     |
| `pnpm build`     | Production build               |
| `pnpm start`     | Serve the production build     |
| `pnpm typecheck` | `react-router typegen` + `tsc` |
| `pnpm lint`      | ESLint                         |
| `pnpm format`    | Prettier (write)               |

## Docker

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 portfolio
```
