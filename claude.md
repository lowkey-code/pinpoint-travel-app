# Pinpoint - Travel Companion App

## Contexto
PWA offline-first para salvar atrações turísticas com endereços em chinês (viagem à China).
**Consultar `docs/design-system.md` para tokens de design.**

## Stack
React 18+ | Vite | TypeScript (strict) | Tailwind | React Router v7 | localStorage | PWA

## Arquitetura
```
/src
  /components   # Reutilizáveis (Button, Card, Badge)
  /pages        # Home, Details, Form, Menu
  /hooks        # useLocalStorage, useAttractions
  /utils        # Helpers puros
  /lib          # Tokens, constantes, tipos
  /contexts     # AttractionContext, ThemeContext
```

## Modelo de Dados
```typescript
interface Attraction {
  id: string;
  name: string;
  chineseAddress: string;
  coordinates?: { latitude: number; longitude: number };
  category: 'monument' | 'museum' | 'restaurant' | 'temple' | 'hotel' | 'shopping' | 'other';
  notes?: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## TypeScript
- Strict mode, sem `any` (usar `unknown`)
- Interfaces para props, types para entidades
- Imports: `@/` alias, agrupados (React → libs → internos), named exports

```typescript
// ✅
interface CardProps {
  attraction: Attraction;
  onCopy: (text: string) => void;
}
```

## React
- Componentes funcionais, props destructured, early returns
- Custom hooks com prefixo `use`, deps corretas
- `useCallback` para props de função, `useMemo` só quando necessário
- Context para state compartilhado, useState para local
- Lazy loading: `React.lazy()` + `Suspense` para páginas
- Keys: sempre `id`, nunca index

```typescript
// Lazy loading
const Home = lazy(() => import('@/pages/Home'));

// Router v7 - Layout pattern
const router = createBrowserRouter([{
  element: <LayoutRoute />,
  errorElement: <ErrorBoundary />,
  children: [
    { path: '/', element: <Suspense fallback={<Loader />}><Home /></Suspense> },
  ],
}]);
```

## Tailwind
- Usar apenas tokens do design system, não valores arbitrários
- Ordem: layout → spacing → sizing → visual → interação
- **Estados via variantes** (`hover:`, `focus:`, `active:`), nunca manipular `style` via JS
- `clsx`/`cn` para classes condicionais
- Transitions: `transition-colors`, `transition-all`

```typescript
// ✅
<button className="bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">

// ❌ Nunca
onMouseEnter={(e) => e.target.style.backgroundColor = '...'}
```

## Acessibilidade (WAI-ARIA)
- HTML semântico: `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`
- `aria-label` em botões com ícone, `aria-labelledby` para seções
- Focus visível: `focus:ring-2 focus:ring-offset-2`
- Forms: `<label htmlFor>`, `aria-required`, `aria-describedby`
- Skip link, `sr-only` para contexto extra
- `aria-live="polite"` para updates dinâmicos

```typescript
// ✅
<button aria-label="Abrir menu"><MenuIcon /></button>
<label htmlFor="name">Nome *</label>
<input id="name" aria-required="true" />
```

## Convenções
| Tipo | Formato | Exemplo |
|------|---------|---------|
| Variáveis/funções | camelCase | `isVisible`, `handleClick` |
| Componentes/Types | PascalCase | `AttractionCard`, `Coordinates` |
| Constantes | UPPER_SNAKE | `CATEGORIES` |
| Booleans | is/has prefix | `isLoading`, `hasError` |
| Handlers | handle prefix | `handleSubmit` |

## Erros e localStorage
```typescript
// Sempre try-catch para localStorage/JSON
function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}
```

## UX Core
- Feedback: toasts para ações (copiado, salvo, deletado)
- Estados vazios amigáveis
- Confirmação para delete
- Touch targets: mínimo 44x44px
- Funcionalidades: CRUD, copiar endereço, abrir mapa (Google/Apple/AMap), busca/filtros, export/import JSON, toggle visitado

## Performance
- Code splitting por rota
- Debounce em buscas
- Cache PWA para assets críticos
- Tree shaking (imports named)

## Commits
```bash
feat: add search functionality
fix: correct coordinates conversion
chore: update design tokens
```

## Evitar
- `any`, prop drilling, useEffect para eventos, mutação de state
- God components, magic strings, ternários aninhados
- Código comentado, console.logs em commits
- Valores Tailwind arbitrários (`bg-[#xxx]`)

---
**MVP: funcional > perfeito. Ship iterativamente.**
