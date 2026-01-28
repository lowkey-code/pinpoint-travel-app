# Vellum Design System — LLM Guidelines

> Diretrizes para agentes de IA gerarem interfaces que seguem o Design System "Vellum" para o app "Folio"

## ROLE

You are an expert UI generator for "Folio", an offline-first travel utility app.
The design system is called **Vellum** — "The Archival Substrate".

Your goal is to generate interfaces that strictly adhere to the "Functional Nostalgia" aesthetic:
a blend of archival warmth (Paper & Ink) with Swiss design precision (Grid & Mono fonts).

### The Three Pillars of Vellum

1. **Texture (Organicity):** Warm off-whites (#FBF9F6), not clinical white. Ink absorbed, not floating.
2. **Translucency (Layers):** Cards as overlapping sheets creating physical depth with shadows.
3. **Permanence (Offline-First):** Robust like archival documents, built to last without connection.

### Theme Aliases (UI Copy Only)

- **Light Mode** → "Parchment Mode" (warm, tactile, sunlit)
- **Dark Mode** → "Blueprint Mode" (technical, precise, navy)

## COMPONENT REUSABILITY (CRITICAL)

**Before creating any new component:**

1. **Check if it exists**: Search the codebase for similar components in `app/components/` and `app/features/*/components/`
2. **Reuse first**: Always prefer using existing components over creating new ones
3. **Extend, don't duplicate**: If a component is close but needs modifications, extend it with props rather than duplicating
4. **Only create new when necessary**: Create a new component ONLY if:
   - No similar component exists in the design system
   - Existing components cannot be reasonably extended
   - The new component represents a genuinely new pattern

**Why this matters:**
- Maintains design system consistency
- Reduces bundle size and code duplication
- Makes the design system grow organically and remain maintainable
- Ensures all instances of a component can be updated in one place

**How to check:**
```bash
# Search for similar components
grep -r "ComponentName" app/components/
grep -r "similar-pattern" app/features/*/components/

# Check design system showcase
# See /docs/folio-design-system.html for visual reference
```

## DESIGN TOKENS

### Colors (Theme: Paper & Ink)

- Background: `bg-paper-base` (Use Tailwind Semantic Tokens)
- Card Surface: `bg-paper-card`
- Lines/Borders: `border-paper-line`
- Text Primary: `text-ink-primary`
- Text Secondary: `text-ink-secondary`
- Text Utility/Meta: `text-ink-utility`
- Action/Brand: `bg-action-blue` or `text-action-blue`

### Typography (The Triad)

1. **Nunito** (`font-sans`): Use for **Headings, City Names, Brand**. (Rounded, friendly).
2. **Inter** (`font-body`): Use for **Body text, UI elements**. (Readable, structured).
3. **JetBrains Mono** (`font-mono`): Use strictly for **Data** (Time, Cost, Coordinates, Codes).

### Iconography

- Library: Phosphor Icons
- Style: Use `ph-bold` for standard UI icons. Use `ph-fill` for active states.
- Implementation: `<i class="ph-bold ph-map-trifold"></i>`

## COMPONENT PATTERNS

### 1. Boarding Pass Card (The Core Component)

A card that mimics a physical ticket with a perforated line.

- **Container:** `bg-paper-card rounded-lg shadow-paper border border-paper-line`
- **Header:** Activity Name (Nunito Bold) + Stamp Badge.
- **Divider:** Dashed line with two semi-circle cutouts on sides.
- **Footer:** Grid of data points (Start Time, Cost) using JetBrains Mono.

### 2. Stamp Badges

Status indicators that look like passport ink stamps.

- **Structure:** Pill shape or Circle.
- **Border:** `border-2` (Thick ink).
- **Rotation:** Apply slight rotation (`-rotate-2` or `rotate-1`) for organic feel.
- **Colors:**
  - Done: `text-stamp-sage`
  - Plan: `text-stamp-navy`
  - Skip: `text-stamp-amber`

## ACCESSIBILITY RULES (WCAG 2.1 AA)

1. **Minimum Contrast:** Ensure all normal text has a contrast ratio of at least 4.5:1 against the background.
2. **Dark Mode Text:** NEVER use the standard Ink Utility color (#6B7785) on dark backgrounds. Use the adjusted `ink-utility` variable (Slate 400) which passes contrast checks.
3. **Stamps in Dark Mode:** Do not use dark ink colors (like standard Navy) on dark cards. Use lighter, pastel variants defined in the CSS variables (e.g., Blue 300 for Navy).
4. **Information Density:** Do not rely solely on color to convey state. Use icons and text labels (e.g., "Done" badge) along with color.

## IMPLEMENTATION SETUP (Tailwind Config)

Copy this configuration into your `tailwind.config.js`. It supports AUTOMATIC DARK MODE via CSS Variables.

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SEMANTIC COLOR SYSTEM (Auto-switching)
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
        action: {
          blue: 'var(--action-blue)',   // Light: #0055FF | Dark: #60A5FA
          hover: 'var(--action-hover)',
        },
        stamp: {
          sage: 'var(--stamp-sage)',    // Light: #4A7A67 | Dark: #6EE7B7
          amber: 'var(--stamp-amber)',  // Light: #B57B2E | Dark: #FCD34D
          navy: 'var(--stamp-navy)',    // Light: #2C4B70 | Dark: #93C5FD
          brick: 'var(--stamp-brick)'   // Light: #C93A3A | Dark: #FCA5A5
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

## CSS Variables Definition

Add these CSS variables to your global stylesheet (e.g., `app.css`):

```css
:root {
  /* Light Mode (Paper & Ink) */
  --paper-base: #FBF9F6;
  --paper-card: #FFFFFF;
  --paper-line: #E6E0D9;

  --ink-primary: #1C1E21;
  --ink-secondary: #54585F;
  --ink-utility: #364152;

  --action-blue: #0055FF;
  --action-hover: #0044CC;

  /* Stamps Light (Cores de Tinta) */
  --stamp-sage: #4A7A67;
  --stamp-amber: #B57B2E;
  --stamp-navy: #2C4B70;
  --stamp-brick: #C93A3A;
}

.dark {
  /* Dark Mode (Passport Navy) */
  --paper-base: #0E1A2B; /* Navy 900 */
  --paper-card: #1B2B44; /* Navy 700 */
  --paper-line: #2E466C; /* Navy 500 */

  --ink-primary: #FBF9F6; /* Paper Base (Invertido) - Contraste 13.5:1 */
  --ink-secondary: #CBD5E1; /* Slate 300 - Contraste ~9:1 */
  --ink-utility: #94A3B8; /* Slate 400 - Contraste 5.6:1 (Corrigido para passar AA) */

  --action-blue: #60A5FA; /* Blue 400 - Contraste melhor em fundo escuro */
  --action-hover: #93C5FD;

  /* Stamps Dark (Cores Pastel/Neon para contraste em fundo escuro) */
  --stamp-sage: #6EE7B7; /* Emerald 300 */
  --stamp-amber: #FCD34D; /* Amber 300 */
  --stamp-navy: #93C5FD; /* Blue 300 */
  --stamp-brick: #FCA5A5; /* Red 300 */
}
```

## Logo SVG

Use this logo structure with semantic tokens for automatic theme adaptation:

```html
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke-linecap="round" stroke-linejoin="round">
    <!-- 1. Borda Externa Grossa (Silhouette) -->
    <path d="M30 80 V20 H80 M30 50 H70" stroke="currentColor" stroke-width="22"/>

    <!-- 2. Máscara Vazada (Background Color) -->
    <path d="M30 80 V20 H80 M30 50 H70" class="stroke-paper-base" stroke-width="14"/>

    <!-- 3. Rota Interna (Thin Line) -->
    <path d="M30 80 V20 H80 M30 50 H70" stroke="currentColor" stroke-width="2"/>
  </g>

  <!-- 4. Nós (Stations) -->
  <circle cx="30" cy="80" r="3.5" class="fill-paper-base stroke-ink-primary" stroke-width="2"/>
  <circle cx="30" cy="50" r="3.5" class="fill-paper-base stroke-ink-primary" stroke-width="2"/>
  <circle cx="30" cy="20" r="3.5" class="fill-paper-base stroke-ink-primary" stroke-width="2"/>
  <circle cx="80" cy="20" r="3.5" class="fill-paper-base stroke-ink-primary" stroke-width="2"/>
  <circle cx="70" cy="50" r="3.5" class="fill-paper-base stroke-ink-primary" stroke-width="2"/>
</svg>
```

## Boarding Pass Card Example

```html
<div class="bg-paper-card rounded-lg shadow-paper overflow-hidden border border-paper-line relative">
  <!-- Header -->
  <div class="p-5">
    <div class="flex justify-between items-start mb-2">
      <span class="font-mono text-[10px] text-ink-utility uppercase tracking-widest bg-paper-base px-2 py-1 rounded">
        Activity
      </span>
      <div class="border-2 border-stamp-sage text-stamp-sage font-sans font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest -rotate-2">
        Visited
      </div>
    </div>
    <h3 class="font-sans font-bold text-lg text-ink-primary leading-tight mb-2">
      Fushimi Inari Taisha
    </h3>
    <p class="font-body text-sm text-ink-secondary leading-snug line-clamp-2">
      Santuário xintoísta famoso pelos milhares de portões torii vermelhos.
    </p>
  </div>

  <!-- Perforated Divider -->
  <div class="relative h-4 flex items-center">
    <div class="absolute left-0 w-3 h-6 bg-paper-base rounded-r-full -ml-1.5 border-r border-paper-line"></div>
    <div class="w-full h-px border-b border-dashed border-paper-line mx-2"></div>
    <div class="absolute right-0 w-3 h-6 bg-paper-base rounded-l-full -mr-1.5 border-l border-paper-line"></div>
  </div>

  <!-- Footer Data -->
  <div class="p-4 bg-paper-base/50 flex justify-between items-center">
    <div>
      <p class="font-mono text-[10px] text-ink-utility">START</p>
      <p class="font-mono text-sm font-medium text-ink-primary">08:00</p>
    </div>
    <div class="w-px h-8 bg-paper-line"></div>
    <div>
      <p class="font-mono text-[10px] text-ink-utility">COST</p>
      <p class="font-mono text-sm font-medium text-ink-primary">Free</p>
    </div>
    <div class="w-px h-8 bg-paper-line"></div>
    <button class="text-action-blue p-2 hover:bg-paper-line/20 rounded">
      <i class="ph-bold ph-map-trifold text-xl"></i>
    </button>
  </div>
</div>
```

## Design Philosophy

**"Functional Nostalgia"** — Where archival warmth meets Swiss precision.

- **Vellum Texture:** Warm, tactile neutrals inspired by archival documents (never #FFFFFF pure)
- **Typography Triad:** Clear hierarchy with purpose (Nunito/Inter/JetBrains Mono)
- **Boarding Pass Cards:** Every activity feels like a collectible travel stamp
- **Precision:** Monospace fonts for data, consistent spacing, deliberate borders
- **Accessibility First:** WCAG 2.1 AA compliant with 4.5:1+ contrast ratios
- **Reusability First:** Component library grows organically through reuse and extension

## Design Engineering Practices (Emil)

This project integrates **Emil's Design Engineering Principles** for polished, accessible interfaces. These guidelines complement Vellum and provide deep expertise in specific areas:

### Animation & Transitions

Follow Emil's easing principles for all motion:

- **User-initiated interactions:** `ease-out` (150-250ms)
- **Page transitions:** `ease-in-out` (max 300-400ms)
- **Hover/color changes:** `ease`
- **Skip animations for frequently-used interactions** (>100x daily)
- **Always support `prefers-reduced-motion`** — Never assume animation support

**Key rule:** Never use `transition: all` (already in Vellum, Emil reinforces)

*Reference:* Emil's `animations.md` module for springs, timing, and easing flowcharts

### Forms & Controls

Build robust, accessible forms:

- **Input minimum size:** 16px+ to prevent iOS auto-zoom
- **Submit on Enter or Cmd+Enter** (not just button clicks)
- **Button states:** Clear hover, active, disabled, loading states
- **Form validation:** Show errors clearly; don't block submission unnecessarily
- **Checkboxes/radios:** Use semantic `<input>` elements; enhance with Ark UI primitives

*Reference:* Emil's `forms-controls.md` module for input patterns, button states, and validation

### Touch & Keyboard Navigation

Ensure Folio works seamlessly on mobile and desktop:

- **Touch targets:** 44px minimum (Vellum suggests 48px; use 48px in Folio for safety)
- **Hover effects:** Use `@media (hover: hover)` to disable on touch devices
- **Keyboard navigation:** All interactive elements must be tab-accessible
- **Focus indicators:** Use `focus-visible:ring-*` (never remove with `outline: none`)
- **Icon-only buttons:** Always include `aria-label`
- **Keyboard scrolling:** Use `scrollIntoView()` to scroll focused elements into view

*Reference:* Emil's `touch-accessibility.md` module for mobile UX, keyboard patterns, and a11y

### UI Polish & Typography

Maintain visual consistency and prevent layout shift:

- **No layout shift:** Use hardcoded dimensions for dynamic content
- **Font weight consistency:** Never change weight on hover/selected (causes shift)
- **Numeric consistency:** Use `font-variant-numeric: tabular-nums` for changing numbers
- **Shadows & gradients:** Use semantic tokens; keep shadows subtle
- **Dark mode text:** Use adjusted `ink-utility` (Slate 400) on dark backgrounds for WCAG AA

*Reference:* Emil's `ui-polish.md` module for typography, shadows, gradients, dark mode

### Performance Optimization

Keep Folio fast for offline-first experience:

- **Virtualization:** Use for long lists (e.g., Itinerary with 100+ activities)
- **Preloading:** Lazy-load components that aren't immediately visible
- **Bundle size:** Prefer reusing components over creating new ones

*Reference:* Emil's `performance.md` module for virtualization patterns and optimization techniques

### Marketing Pages & Landing Pages

When building marketing surfaces (e.g., landing page, docs):

- **More elaborate animations allowed** (unlike product UI)
- **Follow Emil's marketing guidelines** for engagement while maintaining accessibility

*Reference:* Emil's `marketing.md` module for landing pages and promotional content

## Component Development Workflow

When implementing a new feature:

1. **Identify UI needs** → What components does this feature require?
2. **Search existing components** → Check `app/components/` and feature directories
3. **Reuse or extend** → Use existing components; add props if needed
4. **Create only when necessary** → New component only if no similar pattern exists
5. **Document new components** → Add to design system showcase for future reference

## Emil's Design Engineering Skill

For detailed guidance on specific design engineering topics, you can invoke Emil's Design Engineering Skill:

- **Animations:** Easing, timing, springs, reduced-motion support
- **Forms & Controls:** Input patterns, validation, button states
- **Touch & Accessibility:** Mobile UX, keyboard navigation, aria labels
- **UI Polish:** Typography, shadows, gradients, dark mode, layout shift prevention
- **Performance:** Virtualization, preloading, optimization
- **Marketing Pages:** Landing pages, elaborate animations, engagement

The skill is installed globally at `~/.claude/skills/emil-design-engineering/` and available for use in any project.

> **📚 Future: Storybook Integration**
>
> A implementação de Storybook está planejada para substituir o showcase HTML estático.
> Quando criado, todos os componentes React deverão ter:
> - Stories documentando variantes e estados
> - Controles interativos para props
> - Testes de acessibilidade integrados
> - Documentação JSDoc/TSDoc completa
>
> Enquanto isso, mantenha componentes bem estruturados e com interfaces claras.

---

**Vellum Design System v1.0** — *The Archival Substrate for Folio*
**Reference:** See `/docs/vellum-design-system.html` for complete visual showcase
