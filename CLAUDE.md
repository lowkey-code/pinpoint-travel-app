# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run start        # Run production server (port 3000)
npm run typecheck    # Type-check with TypeScript
npm run test:e2e     # Run Playwright E2E tests
```

Run a single E2E test:
```bash
npx playwright test tests/smoke.spec.ts --headed
```

## Stack

- **React Router 7** (Remix-style, SPA mode with `ssr: false`)
- **React 19**
- **Tailwind CSS v4** with OKLCH color palette
- **@ark-ui/react** for accessible primitives (Dialog, Menu, Tabs, etc.)
- **lucide-react** for icons
- **Vite 7** for bundling
- **Playwright** for E2E tests

## Architecture

### Directory Structure

```
app/
  root.tsx              # App shell, links, error boundary
  routes.ts             # Route definitions
  app.css               # Tailwind + CSS custom properties
  routes/               # Page components
  components/           # Shared components
    ui/                 # Reusable primitives (Card, Input, etc.)
  features/             # Feature modules (places, itinerary)
    <feature>/
      components/       # Feature-specific UI
      hooks/            # Feature hooks
      lib/              # Types, utils, constants
  lib/                  # Shared utilities
  hooks/                # Shared hooks
```

### Path Aliases

Use `~/` for imports from the `app/` directory (configured in `tsconfig.json`).

### Data Flow

- **Offline-first**: All data persists to `localStorage`
- **State**: Local React state; no external state management
- **No SSR**: Client-only SPA (`ssr: false` in `react-router.config.ts`)

## Design System

**Folio Design System v3.7** — "Functional Nostalgia" aesthetic (Passport warmth + Swiss precision)

- **Complete Guidelines**: See `/DESIGN_GUIDELINES.md` for AI agents
- **Visual Showcase**: See `/docs/folio-design-system.html` for interactive preview
- **Future**: Storybook planned for React component documentation (see `/TODO.md`)
- **Theme**: Paper & Ink (Light mode) / Passport Navy (Dark mode)
- **Typography Triad**:
  - Nunito (`font-sans`) for headings/brands
  - Inter (`font-body`) for body/UI elements
  - JetBrains Mono (`font-mono`) for data/timestamps/codes
- **Icons**: Phosphor Icons (`ph-bold`, `ph-fill`)
- **Core Component**: Boarding Pass Cards with perforated dividers
- **Labels**: Portuguese (PT-BR)
- **Accessibility**: WCAG 2.1 AA compliant (min 4.5:1 contrast)

## Performance Guidelines

### Critical (Must Follow)

**Async & Data Loading**
- Use `Promise.all()` for independent async operations
- Move `await` into branches where actually used
- Use Suspense boundaries to stream content

**Bundle Size**
- Import directly from modules, avoid barrel files (`index.ts` re-exports)
- Use `React.lazy()` or `next/dynamic` for heavy components
- Defer third-party scripts (analytics, logging) until after hydration
- Preload on hover/focus for perceived speed

### High Priority

**Server/Client Boundary**
- Minimize data serialized to client components
- Parallelize fetches by restructuring components

**Client-Side Data**
- Deduplicate global event listeners
- Use SWR for automatic request deduplication when needed

### Medium Priority

**Re-renders**
- Don't subscribe to state only used in callbacks
- Extract expensive work into memoized components
- Use primitive dependencies in effects
- Subscribe to derived booleans, not raw values
- Use `startTransition` for non-urgent updates
- Pass function to `useState` for expensive initial values

**Rendering**
- Animate `transform`/`opacity` only; avoid `transition: all`
- Use `content-visibility: auto` for long lists (>50 items)
- Hoist static JSX outside components
- Use ternary (`? :`) not `&&` for conditionals with numbers

## Accessibility Requirements

- Icon-only buttons require `aria-label`
- Form controls need `<label>` or `aria-label`
- Use `<button>` for actions, `<a>`/`<Link>` for navigation
- Interactive elements need visible focus indicators (`focus-visible:ring-*`)
- Never remove `outline` without replacement; use `:focus-visible`
- Inputs need `autocomplete`, correct `type`, and `inputmode`
- Never block paste
- Images require explicit `width` and `height`; use `loading="lazy"` below fold
- Large lists (>50 items): virtualize with `content-visibility: auto`

## Forms

- Labels must be clickable (`htmlFor` or wrapping)
- Disable spellcheck on codes/usernames
- Submit button enabled until request starts; show spinner during
- Errors inline; focus first error on submit
- Placeholders end with `…` showing example pattern
- Warn before navigation with unsaved changes

## Animation

- Honor `prefers-reduced-motion`
- Animate only `transform`/`opacity`
- List properties explicitly; never `transition: all`
- Animations must be interruptible

## Typography

- Use `…` not `...`
- Curly quotes `"` `"` not straight
- Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`
- Loading states: `"Loading…"`, `"Saving…"`
- Use `font-variant-numeric: tabular-nums` for number columns

## Dark Mode

- Theme toggle in header; persisted to `localStorage` as `pinpoint_theme`
- Dark class applied to `<html>` element
- Use CSS custom properties from `app.css`

## Testing

- Use Playwright for E2E
- Prefer `data-testid` selectors for stability
- Tests in `tests/` directory
- Dev server starts automatically during test runs

## Anti-Patterns to Avoid

- `transition: all` (list properties explicitly)
- `outline-none` without replacement
- `<div>`/`<span>` with click handlers (use `<button>`)
- Images without dimensions
- Form inputs without labels
- Icon buttons without `aria-label`
- Hardcoded date/number formats (use `Intl`)
- Barrel file imports when direct imports work

## Design Implementation Rules

- **Always follow Folio Design System**: Read `/DESIGN_GUIDELINES.md` before creating new UI
- **Component Reusability (CRITICAL)**:
  - **NEVER create a new component without checking if it exists first**
  - Search `app/components/` and `app/features/*/components/` for similar patterns
  - Reuse existing components; extend with props if needed
  - Only create new components if no similar pattern exists
  - Check `/docs/folio-design-system.html` for visual reference
  - Goal: Make design system grow organically and stay maintainable
- **Use Semantic Tokens**: `bg-paper-card`, `text-ink-primary`, `border-paper-line` (auto dark mode)
- **Typography Hierarchy**: Nunito (headings) → Inter (body) → JetBrains Mono (data only)
- **Boarding Pass Pattern**: Cards with perforated dividers for activities/places
- **Stamp Badges**: Status indicators with `border-2`, slight rotation, semantic colors
- **Spacing**: Base 16px; follow design system spacing scale
- **Accessibility First**: Min 4.5:1 contrast; never use dark ink colors on dark backgrounds
- **Do not introduce new visual patterns** beyond Folio guidelines without asking

## OUTPUT RULES (token-saving)
- Never print full code, large snippets, or diffs
- After applying changes, output ONLY:
  1) Files touched (paths only)
  2) Summary of what changed (max 10 bullets)
  3) TODOs / assumptions (max 5 bullets)
- If code is absolutely necessary, show at most 30 lines total

## Feature rules (Itinerary)
- Offline-first, localStorage-based.
- Segments are fixed (morning/afternoon/evening).
- Multiple cities and multiple stays in the same day are supported (city/hotel are per item, not day header).
- Support dayTrip blocks that cover segments (primarySegment + coversSegments) with ghost indicators in covered segments.
- Status: planned/done/skipped. Priority: 0/1/2.
- Undo stack: 10 steps.
- Sharing: Export/Import JSON file (schemaVersion + migrations).