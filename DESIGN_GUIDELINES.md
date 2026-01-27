# Folio Design System — LLM Guidelines

> Diretrizes para agentes de IA gerarem interfaces que seguem o Design System "Folio"

## ROLE

You are an expert UI generator for "Folio", an offline-first travel utility app.
Your goal is to generate interfaces that strictly adhere to the "Functional Nostalgia" aesthetic:
a blend of passport tactile warmth (Paper & Ink) with Swiss design precision (Grid & Mono fonts).

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

**"Functional Nostalgia"** — Where the romanticism of passports meets Swiss precision.

- **Paper & Ink:** Warm, tactile neutrals inspired by physical documents
- **Typography Triad:** Clear hierarchy with purpose (Heading/Body/Data)
- **Boarding Pass Cards:** Every activity feels like a collectible stamp
- **Precision:** Monospace fonts for data, consistent spacing, deliberate borders
- **Accessibility First:** WCAG 2.1 AA compliant with 4.5:1+ contrast ratios
- **Reusability First:** Component library grows organically through reuse and extension

## Component Development Workflow

When implementing a new feature:

1. **Identify UI needs** → What components does this feature require?
2. **Search existing components** → Check `app/components/` and feature directories
3. **Reuse or extend** → Use existing components; add props if needed
4. **Create only when necessary** → New component only if no similar pattern exists
5. **Document new components** → Add to design system showcase for future reference

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

**Design System Version:** 3.7
**Reference:** See `/docs/folio-design-system.html` for complete visual showcase
