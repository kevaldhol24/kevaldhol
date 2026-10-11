# CLAUDE.md

Keval Dhol's portfolio (kevaldhol.com) — a single page styled as a terminal session, built on
React Router 8 (framework mode, prerendered to static HTML), Vite and Tailwind CSS 4. No
database, no auth, no backend. Deployed as static files to Cloudflare Pages: new routes must be
added to `prerender` in `react-router.config.ts`, and loaders/actions won't work (`ssr: false`).

## Commands

```bash
pnpm dev | pnpm build | pnpm start | pnpm typecheck | pnpm lint | pnpm format
```

Node from `.nvmrc` (React Router 8 needs >= 22.22); pnpm pinned via `packageManager`.

## Layout

- `app/content/portfolio.ts` — every piece of copy. Change content here, not in components.
- `app/routes/home.tsx` — the only route. Its `SECTIONS` list sets each section's command,
  tmux label and ASCII shape, in page order; sides alternate left/right automatically.
- `app/terminal/ascii-model.ts` — the ASCII 3D renderer and one point-cloud model per section
  (`SAMPLERS`). Adding a section means picking or adding a `ShapeName`.
- `app/components/terminal/ascii-canvas.tsx` — runs the renderer client-side, maps scroll to
  morph/rotation and moves the model to the free side.
- `app/terminal/commands.tsx` — commands understood by the hero's mini shell.
- `app/components/terminal/` — section bodies, `TermSection` (typed command + reveal), mini
  shell, tmux bar. Hidden "before typing" states live in `app.css` behind `.js` +
  `prefers-reduced-motion: no-preference`.

## Conventions

- Imports use the `~/` alias (relative imports are banned by ESLint), except `./+types/*`,
  same-directory CSS, and `app/routes.ts`.
- Theme tokens (`ink`, `paper`, `mute`, `dim`, `line`, `ember`, `iris`, `mint`, `pink`, `gold`) and the
  JetBrains Mono font are defined
  in `app/app.css` `@theme`. Use them rather than raw colours.
- Prettier: double quotes, semicolons, 100-char width, Tailwind class sorting.
- Keep everything usable with reduced motion and without JavaScript.
