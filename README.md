# kevaldhol.com

Keval Dhol's portfolio: one page styled as a terminal session, with a scroll-driven 3D model
rendered in ASCII characters. Built on React Router 8 (framework mode, prerendered to static
HTML), Vite and Tailwind CSS 4.

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

| Path                                       | What                                                           |
| ------------------------------------------ | -------------------------------------------------------------- |
| `app/routes/home.tsx`                      | The page: `SECTIONS` (command, label, ASCII shape per section) |
| `app/terminal/ascii-model.ts`              | ASCII 3D renderer and the per-section models                   |
| `app/components/terminal/ascii-canvas.tsx` | Maps scroll to morphing, rotation and left/right placement     |
| `app/terminal/commands.tsx`                | Commands for the interactive mini shell                        |
| `app/components/terminal/*`                | Section bodies, typed-command sections, mini shell, tmux bar   |
| `app/app.css`                              | Theme tokens and terminal effects                              |

The page respects `prefers-reduced-motion` and works without JavaScript (content is prerendered).

## Scripts

| Script           | Purpose                        |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Dev server                     |
| `pnpm build`     | Static build → `build/client`  |
| `pnpm start`     | Preview the static build       |
| `pnpm typecheck` | `react-router typegen` + `tsc` |
| `pnpm lint`      | ESLint                         |
| `pnpm format`    | Prettier (write)               |

## Deploy (Cloudflare Pages)

The site has no server code: `pnpm build` prerenders every route listed in
`react-router.config.ts` into `build/client`, which Cloudflare Pages serves as static files
(`public/_headers` sets caching, `404.html` handles unknown URLs).

| Pages setting    | Value          |
| ---------------- | -------------- |
| Build command    | `pnpm build`   |
| Output directory | `build/client` |
| `NODE_VERSION`   | `22.23.2`      |

Pushes to `main` deploy to production; other branches get preview URLs.
