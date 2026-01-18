<!-- Copilot / AI agent instructions for the Pinpoint project -->
# Pinpoint — AI assistant instructions

Quick, actionable guidance so an AI agent can be immediately productive in this repo.

1. Big picture
 - This is a TypeScript + React PWA (Vite) for saving travel attractions. Key runtime pieces live under `src/`: `components/`, `pages/`, `hooks/`, `lib/`, `utils/`, and `routes/`.
 - Routing uses React Router v7 with a `LayoutRoute` wrapper and lazy-loaded pages in `src/routes/index.tsx`.
 - The app is designed as an offline-first PWA; data persistence uses `localStorage` via custom hooks (see `claude.md`).

2. Developer workflows (commands you will run)
 - Install: `yarn install` (project requires Node >=20.19 and yarn >=1.22; `.nvmrc` sets a recommended version).
 - Dev server: `yarn dev` (Vite at localhost:5173)
 - Build: `yarn build` (runs `tsc -b` then `vite build`)
 - Preview: `yarn preview`
 - Lint: `yarn lint` (ESLint, pre-commit hooks run lint-staged)
 - Husky hooks: `prepare` script runs `husky install`; avoid skipping hooks unless necessary.
 - Preview: `yarn preview`
 - Lint: `yarn lint`

3. Important files and where to look
 - Project config: `package.json` (scripts, engines), `vite.config.ts` (alias `@` → `src`, `@vitejs/plugin-react`).
 - Entry points: `src/main.tsx`, `src/App.tsx`, `src/routes/index.tsx`.
 - Design tokens: `src/lib/design-tokens.js` (preferred Tailwind tokens and spacing rules).
 - Conventions / style: `claude.md` and `CONTRIBUTING.md` — these are the authoritative source for code style and patterns.

4. Project-specific conventions and patterns
 - TypeScript: strict mode; avoid `any`. Use interfaces for props and types for domain models (see `claude.md` for `Attraction` shape).
 - Components: functional components, destructured props, early returns, PascalCase for components.
 - Hooks: prefix with `use` and put shared logic in `src/hooks`.
 - Styling: Tailwind classes using design tokens in `src/lib/design-tokens.js`. Use `cn`/`clsx` helper (`src/lib/cn.ts`) for conditional classes.
 - Accessibility: Provide `aria-label` for icon buttons, labels for inputs, keyboard navigation and visible focus rings (see `claude.md` section).
 - Routing: use `PageWithSuspense` wrapper for lazy pages (see `src/routes/RouteComponents.tsx`).

5. Typical change areas and examples
 - Add a new page: create `src/pages/MyPage.tsx`, lazy-load it in `src/routes/index.tsx`, and add route entry. Wrap with `PageWithSuspense`.
 - Add a new design token: update `src/lib/design-tokens.js` and use the token via Tailwind classes.
 - Persisted data: add helpers under `src/utils` and update localStorage access with try/catch (pattern in `claude.md`).

6. Tests & quality gates
 - There are no test scripts by default; focus on lint and build verification (`yarn lint`, `yarn build`).
 - Commits must follow Conventional Commits — hooks (husky + commitlint) validate messages.
 - Commits should follow Conventional Commits. Commit message validation may be enforced by CI or local tooling.

7. Integration points & external dependencies
 - Map/Open actions: app mentions opening Google/Apple/AMap via external links — verify platform behavior when adding map features.
 - PWA: take care with caching and service worker behavior if you change assets — code splitting is used (lazy routes).
 - Fonts: Google Fonts used (Plus Jakarta Sans + Inter) — ensure font imports remain consistent with `index.html`.

8. When making pull requests
 - Follow Conventional Commits and branch naming (`feat/`, `fix/`).
 - Run `yarn lint` and `yarn build` locally before pushing.
 - Include visual diffs/screenshots for UI changes; mention accessibility considerations.

9. Quick reference snippets (copyable)
 - Lazy page + route:
 ```tsx
 const Example = lazy(() => import('@/pages/Example'));
 // in routes
 { path: '/example', element: <PageWithSuspense Page={Example} /> }
 ```

 - localStorage safe access:
 ```ts
 function getStored<T>(key: string, fallback: T): T {
   try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : fallback; } catch { return fallback; }
 }
 ```

10. Merge guidance (if file exists)
 - If `.github/copilot-instructions.md` already existed, preserve any unique guidance there and add missing repo-specific items above. Prefer `claude.md` as the canonical source for conventions.

If anything here is unclear or you want more examples (component patterns, common `cn` usage, or typical PR scope), tell me which area to expand.
