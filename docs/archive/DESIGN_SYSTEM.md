# Pinpoint Travel — Design System 2026

## 🎯 Problema Atual

A interface do Pinpoint está **funcional mas fria**:
- ❌ Paleta laranja/sunset muito técnica e pouco emocional
- ❌ Cards muito rígidos (bordas, sombras duras)
- ❌ Pouca hierarquia visual
- ❌ Sensação de "ferramenta" ao invés de "experiência"
- ❌ Sem personalidade de marca
- ❌ Não convida à exploração

## 🌟 Nova Direção: "Jornada Humana"

**Conceito:** Transformar o Pinpoint de uma ferramenta técnica para um **companheiro de viagem amigável** que inspira e acolhe.

**Inspiração Visual:**
- 🌅 **Warmth** — tons quentes e terrosos que transmitem conforto
- ☁️ **Soft UI** — elementos táteis que parecem elevados, convites ao toque
- 🌿 **Natural** — paleta inspirada em paisagens (terra, céu, vegetação)
- ✨ **Playful** — microinterações delicadas que surpreendem
- 🎨 **Emotional** — interface que conecta emocionalmente com o usuário

---

## 🎨 Paleta de Cores

### Conceito: "Earth Meets Sky"

Combinação de tons terrosos (estabilidade, natureza) com azuis atmosféricos (viagem, céu, liberdade).

#### Cores Principais

```css
/* PRIMARY: Terracotta Warmth */
--primary: #E67E50;          /* Terracotta quente, pôr do sol */
--primary-light: #F29C73;    /* Variante clara */
--primary-dark: #C45A2E;     /* Variante escura */

/* SECONDARY: Sky Serenity */
--secondary: #6B9BD1;        /* Azul céu suave */
--secondary-light: #A3C4E8;  /* Azul claro, nuvens */
--secondary-dark: #4A7BA7;   /* Azul profundo */

/* ACCENT: Sage Calm */
--accent: #8FB99C;           /* Verde sálvia, vegetação */
--accent-light: #B5D4C1;     /* Verde menta suave */
--accent-dark: #6A9B7E;      /* Verde floresta */
```

#### Tons Neutros

```css
/* BACKGROUNDS: Warm Neutrals */
--bg-primary: #FBF8F3;       /* Off-white quente, areia clara */
--bg-secondary: #F5F0E8;     /* Bege muito claro */
--bg-tertiary: #EDE6DB;      /* Bege médio */

/* TEXT: Grounded Browns */
--text-primary: #3E3230;     /* Marrom escuro quente */
--text-secondary: #73625B;   /* Marrom médio */
--text-tertiary: #A89B94;    /* Marrom claro */

/* BORDERS: Subtle Earth */
--border-light: #E5DCD0;     /* Bege claro para divisores sutis */
--border-medium: #D4C5B3;    /* Tom médio para cards */
```

#### Dark Mode: "Night Journey"

```css
/* Dark mode com tons quentes */
--dark-bg-primary: #2B2522;     /* Marrom escuro quente */
--dark-bg-secondary: #3A3330;   /* Marrom médio */
--dark-bg-tertiary: #4A423D;    /* Marrom claro */

--dark-text-primary: #F5F0E8;   /* Off-white quente */
--dark-text-secondary: #D4C5B3; /* Bege claro */
--dark-text-tertiary: #A89B94;  /* Bege médio */

--dark-primary: #F29C73;        /* Terracotta mais claro */
--dark-secondary: #A3C4E8;      /* Azul mais claro */
--dark-accent: #B5D4C1;         /* Verde mais claro */
```

#### Cores Semânticas

```css
/* SUCCESS: Nature Green */
--success: #7FAA84;     /* Verde natural */
--success-bg: #EDF5EE;  /* Verde muito claro */

/* WARNING: Golden Sun */
--warning: #E3B448;     /* Dourado/mostarda */
--warning-bg: #FDF7E8;  /* Amarelo muito claro */

/* ERROR: Soft Red */
--error: #D17A6F;       /* Vermelho terracota suave */
--error-bg: #FBEAE8;    /* Rosa muito claro */

/* INFO: Ocean Blue */
--info: #6B9BD1;        /* Azul informação (= secondary) */
--info-bg: #EAF2FA;     /* Azul muito claro */
```

---

## 📝 Tipografia

### Fontes

**Conceito:** Tipografia humana e legível, com personalidade sem ser excessiva.

```css
/* HEADINGS: DM Sans (ou Inter) */
--font-display: "DM Sans", "Inter", system-ui, sans-serif;
/* Mais moderno e friendly que Nunito, mantém legibilidade */

/* BODY: Plus Jakarta Sans (ou continuar Open Sans) */
--font-body: "Plus Jakarta Sans", "Open Sans", system-ui, sans-serif;
/* Mais calorosa que Open Sans, excelente legibilidade */

/* MONO: Geist Mono (manter) */
--font-mono: "Geist Mono", "Fira Code", monospace;
```

### Escala Tipográfica

```css
/* Mobile-first, escala suave */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Line heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Pesos

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Uso:**
- **Display (H1):** DM Sans Bold, 2xl-4xl
- **Headings (H2-H4):** DM Sans Semibold, xl-2xl
- **Body:** Plus Jakarta Sans Regular, base
- **Emphasis:** Plus Jakarta Sans Medium
- **Labels:** Plus Jakarta Sans Medium, sm

---

## 🧩 Componentes

### Cards — Soft Elevation

**Antes:** Cards com bordas rígidas e sombras duras
**Depois:** Soft UI com elevação suave e bordas generosas

```css
/* Base Card */
.card {
  background: var(--bg-primary);
  border-radius: 20px; /* Mais arredondado que 12px atual */
  padding: 20px;

  /* Soft shadow — neumorphism light */
  box-shadow:
    8px 8px 16px rgba(62, 50, 48, 0.1),
    -4px -4px 12px rgba(255, 255, 255, 0.8);

  /* Borda sutil opcional */
  border: 1px solid rgba(229, 220, 208, 0.5);

  /* Transição suave */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  /* Elevação maior no hover */
  box-shadow:
    12px 12px 24px rgba(62, 50, 48, 0.12),
    -6px -6px 16px rgba(255, 255, 255, 0.9);

  /* Leve lift */
  transform: translateY(-2px);
}

/* Card em Dark Mode */
.dark .card {
  background: var(--dark-bg-secondary);
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.3),
    -4px -4px 12px rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 197, 179, 0.1);
}
```

### Buttons — Soft & Tactile

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #E67E50 0%, #F29C73 100%);
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;

  /* Soft shadow */
  box-shadow:
    0 4px 12px rgba(230, 126, 80, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);

  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    0 6px 16px rgba(230, 126, 80, 0.35),
    inset 0 -2px 4px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow:
    0 2px 8px rgba(230, 126, 80, 0.2),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Secondary Button — Soft UI */
.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;

  /* Neumorphic shadow */
  box-shadow:
    6px 6px 12px rgba(62, 50, 48, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.8);

  border: 1px solid rgba(229, 220, 208, 0.3);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  box-shadow:
    8px 8px 16px rgba(62, 50, 48, 0.12),
    -8px -8px 16px rgba(255, 255, 255, 0.9);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 10px 22px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: rgba(230, 126, 80, 0.1);
  border-color: var(--primary-dark);
  color: var(--primary-dark);
}
```

### Inputs — Soft & Inviting

```css
.input {
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--text-primary);

  /* Inset shadow — parece "pressed in" */
  box-shadow: inset 4px 4px 8px rgba(62, 50, 48, 0.06);

  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-primary);
  box-shadow:
    inset 2px 2px 4px rgba(62, 50, 48, 0.04),
    0 0 0 4px rgba(230, 126, 80, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
  font-weight: 400;
}
```

### Chips/Badges — Pillowy

```css
.chip {
  background: linear-gradient(135deg, rgba(230, 126, 80, 0.1) 0%, rgba(242, 156, 115, 0.15) 100%);
  color: var(--primary-dark);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  /* Soft shadow */
  box-shadow: 0 2px 6px rgba(230, 126, 80, 0.1);

  border: 1px solid rgba(230, 126, 80, 0.2);
}

/* City color chips — mantém borda colorida */
.chip-city {
  background: var(--bg-secondary);
  border-left: 3px solid var(--city-color);
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

---

## 📏 Espaçamento & Layout

### Grid Spacing

```css
/* Escala 4px base */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Regras de Espaçamento

**Cards:**
- Padding interno: `20px` (space-5)
- Gap entre cards: `16px` (space-4)
- Margem lateral (mobile): `16px`
- Margem lateral (desktop): `24px`

**Sections:**
- Gap entre seções: `32px` (space-8)
- Padding top/bottom: `24px` (space-6)

**Typography:**
- Gap entre heading e conteúdo: `12px` (space-3)
- Gap entre parágrafos: `16px` (space-4)

### Border Radius

```css
--radius-sm: 8px;   /* Small elements, chips */
--radius-md: 12px;  /* Inputs, small cards */
--radius-lg: 16px;  /* Buttons, medium cards */
--radius-xl: 20px;  /* Large cards, modals */
--radius-2xl: 24px; /* Hero elements */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 🎭 Iconografia

### Estilo: Rounded & Soft

**Biblioteca Recomendada:** [Lucide Icons](https://lucide.dev/) (já usado)
- Stroke width: 2px (padrão) ou 1.5px (mais delicado)
- Size: 20px (small), 24px (medium), 32px (large)
- Cor: sempre herda do texto parent ou usa --text-secondary

**Uso:**
- Icons sempre acompanhados de label (acessibilidade)
- Hover state: leve scale (1.05) + cor primary
- Icon-only buttons: padding generoso (12px mínimo)

### Icon Colors

```css
.icon-default { color: var(--text-secondary); }
.icon-primary { color: var(--primary); }
.icon-secondary { color: var(--secondary); }
.icon-success { color: var(--success); }
.icon-warning { color: var(--warning); }
.icon-error { color: var(--error); }
```

---

## ✨ Microinterações

### Hover States

```css
/* Subtle scale */
.interactive:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

/* Soft glow */
.card:hover {
  box-shadow:
    12px 12px 24px rgba(62, 50, 48, 0.12),
    -6px -6px 16px rgba(255, 255, 255, 0.9),
    0 0 20px rgba(230, 126, 80, 0.05); /* Glow sutil */
}

/* Icon rotation */
.icon-chevron {
  transition: transform 0.3s ease;
}
.expanded .icon-chevron {
  transform: rotate(180deg);
}
```

### Loading States

```css
/* Skeleton shimmer — warm tones */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease infinite;
  border-radius: 12px;
}
```

### Success Feedback

```css
/* Bounce in */
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.toast-success {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Focus States

```css
/* Soft ring — não usar outline padrão */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(230, 126, 80, 0.2);
  border-color: var(--primary);
}
```

---

## 🎨 Implementação Prática

### Exemplo: Card de Item (antes vs depois)

**ANTES (atual):**
```tsx
<div className="rounded-xl border border-border bg-card p-4 shadow-sm">
  <h3 className="font-serif font-bold">{title}</h3>
  <p className="text-sm text-muted-foreground">{description}</p>
</div>
```

**DEPOIS (novo design):**
```tsx
<div className="card-soft group">
  {/* City chip com cor */}
  <div className="flex items-center gap-2 mb-3">
    <span className="chip-city" style={{borderLeftColor: cityColor}}>
      {city}
    </span>
    <span className="chip">
      <Clock className="w-3 h-3" />
      {time}
    </span>
  </div>

  {/* Title com hierarquia */}
  <h3 className="text-xl font-display font-semibold text-primary mb-2 group-hover:text-primary-dark transition-colors">
    {title}
  </h3>

  {/* Description com espaço generoso */}
  <p className="text-base text-secondary leading-relaxed">
    {description}
  </p>

  {/* Meta info com icons */}
  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-light">
    <div className="flex items-center gap-1.5 text-tertiary">
      <Clock className="w-4 h-4" />
      <span className="text-sm">{duration}</span>
    </div>
    <div className="flex items-center gap-1.5 text-tertiary">
      <DollarSign className="w-4 h-4" />
      <span className="text-sm">{cost}</span>
    </div>
  </div>
</div>
```

**CSS para .card-soft:**
```css
.card-soft {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    8px 8px 16px rgba(62, 50, 48, 0.1),
    -4px -4px 12px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 220, 208, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-soft:hover {
  box-shadow:
    12px 12px 24px rgba(62, 50, 48, 0.12),
    -6px -6px 16px rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}
```

---

## 🗣️ Tom de Marca

### Personalidade: "Friendly Explorer"

**Voice:**
- 🌟 **Acolhedor** — "Bem-vindo de volta!" ao invés de "Login"
- 🎒 **Empático** — "Ainda não há itens aqui. Que tal adicionar o primeiro?"
- ✨ **Inspirador** — "Sua jornada começa aqui"
- 🤝 **Conversacional** — "Vamos planejar juntos?" ao invés de "Criar viagem"

**Empty States:**
```
❌ ANTES: "Nenhum item neste período"
✅ DEPOIS: "Este período está livre! ☀️
           Que tal adicionar uma atração?"
```

**Buttons:**
```
❌ ANTES: "Adicionar item"
✅ DEPOIS: "Adicionar parada +"
✅ ALT: "Explorar lugares 🗺️"
```

**Confirmações:**
```
❌ ANTES: "Deletar item?"
✅ DEPOIS: "Tem certeza? Esta parada será removida da sua viagem."
```

---

## 📱 Responsividade

### Breakpoints

```css
--mobile: 640px;
--tablet: 768px;
--laptop: 1024px;
--desktop: 1280px;
```

### Mobile-First Adjustments

**Cards:**
- Mobile: padding 16px, radius 16px
- Desktop: padding 20px, radius 20px

**Typography:**
- Mobile: text-base (16px) para body
- Desktop: text-lg (18px) para body em cards

**Spacing:**
- Mobile: gap 12px entre cards
- Desktop: gap 16px entre cards

---

## 🎯 Checklist de Implementação

### Fase 1: Foundation
- [ ] Criar novo arquivo `design-tokens.css` com variáveis
- [ ] Importar novas fontes (DM Sans + Plus Jakarta Sans)
- [ ] Atualizar paleta de cores (earth meets sky)
- [ ] Definir novos border-radius globais

### Fase 2: Components
- [ ] Redesenhar `.card` com soft shadows
- [ ] Atualizar todos os buttons (primary, secondary, ghost)
- [ ] Refazer inputs com inset shadow
- [ ] Criar `.chip` e `.chip-city` novos
- [ ] Adicionar estados hover/focus em todos

### Fase 3: Typography
- [ ] Aplicar nova hierarquia de headings
- [ ] Aumentar line-height para legibilidade
- [ ] Ajustar pesos de fonte (semibold para ênfase)
- [ ] Revisar cores de texto (warm browns)

### Fase 4: Microinteractions
- [ ] Adicionar transitions suaves (0.3s ease)
- [ ] Implementar hover states com transform
- [ ] Criar skeleton loaders com shimmer
- [ ] Adicionar focus rings customizados

### Fase 5: Polish
- [ ] Revisar espaçamento (aumentar breathing room)
- [ ] Testar dark mode com nova paleta
- [ ] Adicionar empty states com mensagens friendly
- [ ] Revisar toda copy (tom de marca)

---

## 🌐 Referências & Inspiração

### Design Trends 2026
- [Key Mobile App UI/UX Design Trends for 2026](https://www.elinext.com/services/ui-ux-design/trends/key-mobile-app-ui-ux-design-trends/)
- [The 2026 Visual Trends Report](https://sagedesigngroup.biz/the-2026-visual-trends-report-what-colors-fonts-and-styles-will-dominate-brand-identity/)
- [Neumorphism: The Soft UI Revolution](https://medium.com/@uviniranasinghe21/neumorphism-the-soft-ui-revolution-a-deep-dive-into-modern-design-trends-31cbca46864c)

### Color Palettes
- [25 Earth Tone Color Palettes](https://www.vandelaydesign.com/earth-tone-color-palettes/)
- [Aesthetic Colour Palettes for Wellness Brands](https://thebrandalchemists.com/blog/top-color-palettes-for-holistic-lifestyle-and-wellness-brands-updated-for-2025)
- [Color Trends for 2026](https://www.andacademy.com/resources/blog/graphic-design/color-trends-for-designers/)

### Travel App Design
- [Travel App UI Design on Dribbble](https://dribbble.com/tags/trip-planner-app)
- [Beautiful Travel App UI Case Studies](https://pixso.net/tips/travel-app-ui/)
- [Trip Planner App Projects on Behance](https://www.behance.net/search/projects/trip%20planner%20app)

---

## 🚀 Próximo Passo

Quer que eu:
1. **Implemente o novo design system** no código (atualizar `app.css` + componentes)?
2. **Crie protótipos visuais** de como ficariam os componentes principais?
3. **Comece com uma feature específica** (ex: redesenhar DayView primeiro)?

---

**Versão:** 1.0
**Última atualização:** 2026-01-27
**Status:** 🎨 Proposta para aprovação
