# CLAUDE.md

Personal portfolio — a single page built on React Router 8 (framework mode, SSR), Vite,
Tailwind CSS 4, three.js and anime.js. No database, no auth, no backend.

## Commands

```bash
pnpm dev | pnpm build | pnpm start | pnpm typecheck | pnpm lint | pnpm format
```

Node from `.nvmrc` (React Router 8 needs >= 22.22); pnpm pinned via `packageManager`.

## Layout

- `app/content/portfolio.ts` — every piece of copy. Change content here, not in components.
- `app/routes/home.tsx` — the only route; `app/routes.ts` registers it as the index.
- `app/three/portfolio-scene.ts` — three.js scene class. Imported dynamically from
  `components/scene-canvas.tsx` so it never runs during SSR and ships in its own chunk.
- `components/scene-canvas.tsx` `KEYFRAMES` — one keyframe per `[data-scene]` section, in DOM
  order. Adding/removing a section means adding/removing a keyframe.
- `app/routes/terminal.tsx` — `/terminal`, the same content as a terminal session. Its
  `SECTIONS` list sets each section's command, side (alternating) and ASCII shape;
  `app/terminal/ascii-model.ts` is the character renderer, `app/terminal/commands.tsx` the
  hero mini-shell's commands. Terminal-only copy (`asciiName`, `skillGroups`, `education`)
  lives at the bottom of `portfolio.ts`.
- `app/motion/use-reveals.ts` — anime.js. Markup opts in via `data-split` (with `<SplitText>`),
  `data-reveal`, `data-stagger`, `data-count`, `data-hero`, `data-magnetic`. Hidden "before"
  states live in `app.css` behind `.js` + `prefers-reduced-motion: no-preference`.

## Conventions

- Imports use the `~/` alias (relative imports are banned by ESLint), except `./+types/*`,
  same-directory CSS, and `app/routes.ts`.
- Theme tokens (`ink`, `paper`, `mute`, `line`, `ember`, `iris`, `lime`) and fonts are defined
  in `app/app.css` `@theme`. Use them rather than raw colours.
- Prettier: double quotes, semicolons, 100-char width, Tailwind class sorting.
- Keep everything usable with reduced motion, without WebGL, and without JavaScript.
