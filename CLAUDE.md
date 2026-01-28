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

## Stack

- **React Router 7** (Remix-style, SPA mode with `ssr: false`)
- **React 19**
- **Tailwind CSS v4** with Vellum semantic tokens
- **@ark-ui/react** for accessible primitives (Dialog, Menu, Tabs, etc.)
- **Phosphor Icons** (`@phosphor-icons/react`)
- **Vite 7** for bundling
- **Playwright** for E2E tests

## Architecture

```
app/
  root.tsx              # App shell, links, error boundary
  routes.ts             # Route definitions
  app.css               # Tailwind + Vellum CSS variables
  routes/               # Page components
  components/ui/        # Shared primitives
    folio/              # Vellum design system components
  features/             # Feature modules
    <feature>/
      components/       # Feature-specific UI
      hooks/            # Feature hooks
      lib/              # Types, utils, constants
  lib/                  # Shared utilities
  hooks/                # Shared hooks
```

**Path Aliases:** Use `~/` for imports from the `app/` directory.

**Data Flow:** Offline-first with `localStorage`. Local React state only. No SSR.

---

## Vellum Design System

**Vellum** is the design system powering **Folio**, an offline-first travel utility app.

> *"The archival substrate. Balancing the warmth of parchment with the precision of technical blueprints."*

### Philosophy: "Functional Nostalgia"

- **Texture (Organicity):** Warm off-whites, not clinical #FFFFFF. Ink absorbed, not floating.
- **Translucency (Layers):** Cards as overlapping sheets creating physical depth.
- **Permanence (Offline-First):** Robust like archival documents, not dependent on connection.

### Technical vs Experience Layer

**CRITICAL:** Distinguish between code tokens and UI labels.

| Layer | Purpose | Example |
|-------|---------|---------|
| **Technical (Code)** | Tailwind tokens | `bg-paper-base`, `text-ink-primary` |
| **Experience (UI)** | Brand aliases | "Parchment Mode", "Blueprint Mode" |

### Code Tokens (Always Use These)

```javascript
// Correct usage in code
className="bg-paper-base text-ink-primary border-paper-line"

// NEVER invent names like: bg-parchment, bg-blueprint, text-light-mode
```

### Theme Aliases (UI Copy Only)

| Technical | Light Mode UI | Dark Mode UI |
|-----------|---------------|--------------|
| Theme | **Parchment Mode** | **Blueprint Mode** |
| Concept | Warm, tactile, sunlit | Technical, precise, navy |
| Toggle text | "View as Parchment" | "View as Blueprint" |
| Icons | `ph-scroll` | `ph-ruler` / `ph-compass` |

### Typography Triad

| Font | Token | Usage |
|------|-------|-------|
| Nunito | `font-sans` | Headings, city names, brand |
| Inter | `font-body` | Body text, UI elements |
| JetBrains Mono | `font-mono` | Data: times, costs, codes |

### Color Tokens Reference

```javascript
colors: {
  paper: {
    base: 'var(--paper-base)',   // Light: #FBF9F6 | Dark: #0E1A2B
    card: 'var(--paper-card)',   // Light: #FFFFFF | Dark: #1B2B44
    line: 'var(--paper-line)',   // Light: #E6E0D9 | Dark: #2E466C
  },
  ink: {
    primary: 'var(--ink-primary)',     // Light: #1C1E21 | Dark: #FBF9F6
    secondary: 'var(--ink-secondary)', // Light: #54585F | Dark: #CBD5E1
    utility: 'var(--ink-utility)',     // Light: #364152 | Dark: #94A3B8
  },
  stamp: { sage, amber, navy, brick }, // Status colors
  action: { blue, hover },             // Interactive elements
}
```

### Core Patterns

- **Boarding Pass Cards:** Perforated dividers, mono data footers
- **Stamp Badges:** `border-2`, slight rotation (`-rotate-2`), semantic colors
- **Icons:** Phosphor Icons with `weight="bold"` (default) or `weight="fill"` (active)

### Resources

- **Guidelines:** `/DESIGN_GUIDELINES.md`
- **Visual Showcase:** `/docs/folio-design-system.html`
- **UI Components:** `app/components/ui/folio/`
- **Emil's Design Engineering Skills:** Referenced in `DESIGN_GUIDELINES.md` for animations, forms, touch/a11y, UI polish, and performance

---

## Implementation Rules

### Component Reusability (CRITICAL)

1. **Search first:** Check `app/components/` and `app/features/*/components/`
2. **Reuse/extend:** Use existing components; add props if needed
3. **Create only when necessary:** No similar pattern exists

### Code Standards

- Always use semantic tokens (`bg-paper-card`, not hardcoded colors)
- Min 4.5:1 contrast ratio (WCAG 2.1 AA)
- Touch targets: 48px minimum
- Honor `prefers-reduced-motion`
- Animate only `transform`/`opacity`; never `transition: all`

### Accessibility

- Icon-only buttons require `aria-label`
- Form controls need `<label>` or `aria-label`
- Use `<button>` for actions, `<Link>` for navigation
- Focus indicators: `focus-visible:ring-*`

### Typography

- Ellipsis: `…` not `...`
- Curly quotes: `"` `"` not straight
- Loading: `"Carregando…"`, `"Salvando…"`
- Numbers: `tabular-nums` for columns

---

## Feature: Itinerary

- **Offline-first:** localStorage-based
- **Segments:** Fixed (morning/afternoon/evening)
- **Multi-city:** City/hotel per item, not day header
- **Day trips:** primarySegment + coversSegments with ghost indicators
- **Status:** planned/done/skipped
- **Priority:** 0 (none) / 1 (important) / 2 (must-see)
- **Undo:** 10-step stack
- **Sharing:** Export/Import JSON (schemaVersion + migrations)

---

## Dark Mode

- Persisted to `localStorage` as `folio_theme`
- Applied via `dark` class on `<html>`
- CSS variables auto-switch colors
- UI labels: "Parchment" (light) / "Blueprint" (dark)

---

## Testing

- Playwright for E2E in `tests/`
- Use `data-testid` selectors
- Dev server starts automatically

---

## Anti-Patterns

- `transition: all` → list properties explicitly
- `outline-none` → use `focus-visible:ring-*`
- `<div onClick>` → use `<button>`
- Hardcoded colors → use tokens
- New patterns → check Vellum first

---

## Output Rules (Token-Saving)

After changes, output ONLY:
1. Files touched (paths)
2. Summary (max 10 bullets)
3. TODOs/assumptions (max 5 bullets)
4. Code snippets only if essential (max 30 lines)
