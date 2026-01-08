# Pinpoint - Travel Companion App

## 📍 Contexto do Projeto
App PWA offline-first para salvar atrações turísticas com endereços em chinês.
Desenvolvido para viagem à China onde acesso a internet é limitado.
Foco em performance, usabilidade mobile e funcionamento 100% offline.

## 🛠️ Tech Stack
- React 18+ com Vite
- TypeScript (strict mode)
- Tailwind CSS
- React Router v6
- localStorage para persistência
- PWA com service worker

## 🎨 Design System
**SEMPRE consultar e seguir `docs/design-system.md`**

## 📁 Arquitetura de Pastas
```
/src
  /components      # Componentes reutilizáveis (Button, Card, Badge, etc)
  /pages          # Páginas principais (Home, Details, Form, Menu)
  /hooks          # Custom hooks (useLocalStorage, useAttractions, etc)
  /utils          # Helpers e funções puras
  /lib            # Design tokens, constantes, tipos
  /contexts       # Context providers (AttractionContext, ThemeContext)
```

## ✅ Melhores Práticas - TypeScript

### Tipagem
- **Strict mode obrigatório** - sem `any`, usar `unknown` quando necessário
- **Interfaces para props** - sempre tipar props de componentes
- **Types para dados** - criar types/interfaces para entidades (Attraction, Category, etc)
- **Generics quando apropriado** - especialmente em hooks e utilitários
- **Evitar type assertions** - preferir type guards e validações

```typescript
// ✅ BOM
interface AttractionCardProps {
  attraction: Attraction;
  onCopy: (text: string) => void;
  onOpenMap?: (coords: Coordinates) => void;
}

// ❌ RUIM
function Card(props: any) { }
```

### Imports
- **Importações absolutas** - usar @ alias configurado no tsconfig
- **Agrupar imports** - React primeiro, depois bibliotecas, depois internos
- **Named exports** - preferir sobre default exports (exceto pages)

```typescript
// ✅ BOM
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useAttractions } from '@/hooks/useAttractions';

// ❌ RUIM - tudo misturado
import { useAttractions } from '@/hooks/useAttractions';
import { useState } from 'react';
import { Button } from '@/components/Button';
```

## ✅ Melhores Práticas - React

### Componentes
- **Componentes funcionais sempre** - hooks, não classes
- **Props interface separada** - antes do componente
- **Destructuring de props** - no parâmetro da função
- **Early returns** - para condições simples (loading, error)
- **Componentes pequenos e focados** - uma responsabilidade por componente
- **Composição sobre herança** - children props, render props quando necessário

```typescript
// ✅ BOM
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false 
}: ButtonProps) {
  if (disabled) return <button disabled>{children}</button>;
  
  return (
    <button 
      className={getButtonStyles(variant)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ❌ RUIM
export default function Button(props) {
  return <button className="...">{props.children}</button>;
}
```

### Hooks
- **Custom hooks para lógica reutilizável** - prefixo "use"
- **Dependências corretas** - sempre revisar array de dependências
- **useCallback para funções passadas como props** - evitar re-renders
- **useMemo para cálculos custosos** - não abusar
- **useEffect apenas quando necessário** - preferir event handlers

```typescript
// ✅ BOM
export function useAttractions() {
  const [attractions, setAttractions] = useLocalStorage<Attraction[]>('attractions', []);
  
  const addAttraction = useCallback((attraction: Omit<Attraction, 'id'>) => {
    const newAttraction = { ...attraction, id: generateId() };
    setAttractions(prev => [...prev, newAttraction]);
  }, [setAttractions]);
  
  return { attractions, addAttraction };
}
```

### State Management
- **useState para state local** - não elevar prematuramente
- **Context para state compartilhado** - poucos contexts, bem definidos
- **Reducer para state complexo** - quando múltiplas ações relacionadas
- **Evitar prop drilling** - usar Context ou composição

### Performance
- **Lazy loading de páginas** - React.lazy() para rotas
- **Memoização consciente** - React.memo apenas quando necessário
- **Evitar re-renders desnecessários** - props estáveis, callbacks memoizados
- **Listas com key única e estável** - nunca index como key se lista muda
- **Debounce em buscas** - usar debounce para input de busca

```typescript
// ✅ BOM - lazy loading
const DetailPage = lazy(() => import('@/pages/DetailPage'));

// ✅ BOM - keys estáveis
{attractions.map(attraction => (
  <AttractionCard key={attraction.id} attraction={attraction} />
))}

// ❌ RUIM - index como key
{attractions.map((attraction, index) => (
  <AttractionCard key={index} attraction={attraction} />
))}
```

## ✅ Melhores Práticas - Tailwind CSS

### Uso de Classes
- **Design tokens sempre** - usar classes do Tailwind configuradas no design system
- **Componentes para estilos repetidos** - não duplicar classes
- **Responsive mobile-first** - breakpoints quando necessário
- **Evitar valores arbitrários** - usar apenas tokens predefinidos
- **clsx/cn para classes condicionais** - helper para concatenar classes

```typescript
// ✅ BOM
<button className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg">

// ❌ RUIM - valores arbitrários
<button className="bg-[#3b82f6] hover:bg-[#2563eb] px-[24px] py-[12px]">
```

### Organização
- **Ordem consistente** - layout → spacing → sizing → visual → interação
- **Extrair para componentes** - quando >8 classes ou muito repetido

```typescript
// ✅ BOM - ordem lógica
className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"

// ❌ RUIM - bagunçado
className="hover:shadow-md p-4 rounded-lg gap-4 flex w-full shadow-sm items-center border-gray-200 bg-white border"
```

### CSS States e Event Handling
- **Usar variantes Tailwind** - `hover:`, `active:`, `focus:`, `disabled:` ao invés de manipular DOM
- **Nunca manipular `style` direto** - evitar `onMouseEnter` com `style.backgroundColor = ...`
- **Usar conditional classes** - template literals ou ternários para classes dinâmicas
- **Transitions em Tailwind** - `transition-colors`, `transition-all` para animações suaves
- **Estados compostos** - combinar variantes para diferentes estados (hover, active, disabled)

```typescript
// ✅ BOM - usar variantes Tailwind
<button className="bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors">
  Clique aqui
</button>

// ✅ BOM - classes dinâmicas com template literals
<div className={`p-4 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
  Conteúdo
</div>

// ✅ BOM - states de inputs
<input
  className="border border-neutral-300 px-3 py-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
  type="text"
/>

// ❌ RUIM - manipular DOM com JavaScript
<button
  onMouseEnter={(e) => {
    (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
  }}
  onMouseLeave={(e) => {
    (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
  }}
>
  Não faça assim!
</button>

// ❌ RUIM - inline styles ao invés de Tailwind
<button style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px' }}>
  Evitar estilos inline
</button>
```

## ✅ Melhores Práticas - React Router v7

### Estrutura de Rotas
- **Layout Routes com Outlet** - use parent routes para layouts compartilhados
- **Children routes** - agrupe rotas relacionadas under a parent layout
- **Lazy loading** - use `React.lazy()` para code splitting de pages
- **Suspense boundaries** - sempre envolver lazy-loaded components
- **Basename aware** - considerar apps em subpaths

```typescript
// ✅ BOM - layout route pattern (React Router v7)
import { Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';

function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const router = createBrowserRouter([
  {
    element: <LayoutRoute />,
    children: [
      {
        path: '/',
        element: <PageWithSuspense Page={Home} />,
      },
      {
        path: '/attraction/:id',
        element: <PageWithSuspense Page={AttractionDetail} />,
      },
      // ... mais rotas
    ],
  },
]);

// ❌ RUIM - repetindo Layout em cada rota
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/attraction/:id',
    element: (
      <Layout>
        <AttractionDetail />
      </Layout>
    ),
  },
  // ... repetição para cada rota
]);
```

### Lazy Loading Pages
- **Dynamic imports** - carregar pages sob demanda
- **Suspense fallback** - mostrar loader durante carregamento
- **Componentes wrapper** - para DRY (evitar repetição de Suspense)

```typescript
// ✅ BOM - lazy loading com wrapper
const Home = lazy(() => import('@/pages/Home'));

function PageWithSuspense({ Page }: { Page: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  );
}

// ❌ RUIM - repetir Suspense em cada rota
{
  path: '/',
  element: (
    <Suspense fallback={<PageLoader />}>
      <Home />
    </Suspense>
  ),
},
```

### Error Boundaries em Rotas
- **errorElement** - para tratar erros de rotas e componentes
- **useRouteError** - acessar informações do erro
- **Recovery options** - botão para voltar ou home

```typescript
// ✅ BOM - error boundary
function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Layout>
      <div className="p-8 text-center">
        <h1>Algo deu errado</h1>
        <p>{error?.message || 'Erro desconhecido'}</p>
        <Link to="/">Voltar para Home</Link>
      </div>
    </Layout>
  );
}

export const router = createBrowserRouter([
  {
    element: <LayoutRoute />,
    errorElement: <ErrorBoundary />,
    children: [/* ... */],
  },
]);
```

## ✅ Melhores Práticas - WAI-ARIA e Acessibilidade

### Princípios Fundamentais
- **Semântica HTML** - usar tags apropriadas (button, nav, section, article, aside) ao invés de divs genéricos
- **Aria quando necessário** - ARIA é suplemento a HTML semântico, não substituto
- **Keyboard accessible** - todas as funcionalidades devem funcionar via teclado
- **Focus visible** - sempre fornecer indicadores visuais de foco
- **Screen reader friendly** - conteúdo deve ser compreensível para leitores de tela

### Elementos Semânticos
```typescript
// ✅ BOM - usar tags semânticas apropriadas
<header role="banner">
  <nav aria-label="Navegação principal">
    <Link>Home</Link>
  </nav>
</header>

<main>
  <article>
    <section aria-labelledby="section-title">
      <h2 id="section-title">Título da Seção</h2>
    </section>
  </article>
</main>

<aside aria-label="Informações adicionais">
  Conteúdo supplementar
</aside>

// ❌ RUIM - divs genéricos sem semântica
<div>
  <div>
    <a>Home</a>
  </div>
</div>
```

### ARIA Labels
- **aria-label** - descrevê elemento quando não há texto visível
- **aria-labelledby** - referencia elemento de ID que rotula o container
- **aria-describedby** - adiciona descrição supplementar
- **aria-hidden** - oculta elementos decorativos de leitores de tela

```typescript
// ✅ BOM - labels descritivos
<button aria-label="Abrir menu de opções">
  <MenuIcon />
</button>

<section aria-label="Lista de atrações">
  {attractions.map(attraction => (
    <article key={attraction.id} aria-label={`${attraction.name}: Avaliação ${attraction.rating} de 5`}>
      {/* ... */}
    </article>
  ))}
</section>

<div aria-hidden="true">
  {/* SVG decorativo, ícone visual apenas */}
</div>

// ❌ RUIM - sem labels
<button>
  <MenuIcon />
</button>

<div>
  {attractions.map(attraction => (
    <div>
      {/* ... */}
    </div>
  ))}
</div>
```

### Estados de Foco e Keyboard Navigation
- **focus:ring-2 focus:ring-offset-2** - indicador visual de foco claro
- **focus:outline-none** - remover outline padrão ao usar ring
- **Ordem de tabulação lógica** - ordem visual deve corresponder a DOM order
- **Teclado deve navegar** - Enter/Space em botões, arrows em menus

```typescript
// ✅ BOM - foco acessível
<button className="bg-primary-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2">
  Clique-me
</button>

<Link
  to="/"
  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600"
>
  Link acessível
</Link>

// ❌ RUIM - foco invisível
<button className="bg-primary-600 px-4 py-2 rounded-lg">
  Clique-me
</button>
```

### Formulários Acessíveis
- **label associado** - sempre usar <label> com atributo `for` vinculado ao `id` do input
- **aria-required** - indicar campos obrigatórios
- **aria-describedby** - vincular hints e mensagens de erro
- **Estrutura fieldset/legend** - para grupos de inputs relacionados
- **aria-invalid** - indicar estado de validação

```typescript
// ✅ BOM - formulário acessível
<form aria-label="Formulário de criação de atração">
  <fieldset>
    <legend className="sr-only">Informações da Atração</legend>

    <div>
      <label htmlFor="name">
        Nome <span aria-label="campo obrigatório">*</span>
      </label>
      <input
        id="name"
        type="text"
        aria-required="true"
        aria-describedby="name-hint"
        className="border border-neutral-300 focus:ring-2 focus:ring-primary-600"
      />
      <div id="name-hint" className="sr-only">
        Digite o nome da atração (máximo 100 caracteres)
      </div>
    </div>

    <div>
      <label htmlFor="description">Descrição</label>
      <textarea
        id="description"
        aria-describedby="description-hint"
        className="border border-neutral-300 focus:ring-2 focus:ring-primary-600"
      />
      <div id="description-hint" className="sr-only">
        Descreva a atração (até 500 caracteres)
      </div>
    </div>

    <button type="submit" className="focus:ring-2 focus:ring-offset-2 focus:ring-primary-600">
      Salvar Atração
    </button>
  </fieldset>
</form>

// ❌ RUIM - inputs sem labels ou aria
<form>
  <input type="text" placeholder="Nome" />
  <textarea placeholder="Descrição" />
  <button>Salvar</button>
</form>
```

### Regions e Live Areas
- **role="region"** - marcar áreas de conteúdo importante
- **aria-label** - nomear a region para contexto
- **aria-live="polite"** - anunciar atualizações de conteúdo dinâmico
- **aria-live="assertive"** - para mensagens críticas de erro/warning

```typescript
// ✅ BOM - regions e live areas
<section aria-label="Lista de atrações" role="region">
  {attractions.length === 0 && (
    <div aria-live="polite" className="text-center py-8">
      Nenhuma atração salva ainda. Clique em "Nova Atração" para começar!
    </div>
  )}
  {attractions.map(attraction => (
    <article key={attraction.id}>
      {/* ... */}
    </article>
  ))}
</section>

<div aria-live="assertive" aria-label="Mensagens de erro">
  {formError && <p className="text-red-600">{formError}</p>}
</div>
```

### Rating e Indicadores Visuais
- **aria-label** - descrever valor numérico em palavras
- **role="progressbar"** - para indicadores visuais de progresso
- **aria-valuenow/aria-valuemin/aria-valuemax** - valores numéricos do progresso

```typescript
// ✅ BOM - rating acessível
<div className="flex items-center gap-2">
  <div
    role="progressbar"
    aria-valuenow={rating}
    aria-valuemin={0}
    aria-valuemax={5}
    aria-label={`Avaliação: ${rating.toFixed(1)} de 5 estrelas`}
    className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden"
  >
    <div
      className="h-full bg-yellow-400 transition-all"
      style={{ width: `${(rating / 5) * 100}%` }}
    />
  </div>
  <span aria-hidden="true">{rating.toFixed(1)}</span>
</div>
```

### Skip Links e Navegação
- **skip-to-content** - link invisível para pular header
- **sr-only class** - ocultar visualmente mas manter acessível
- **Link nav e estrutura clara** - hierarquia de navegação óbvia

```typescript
// ✅ BOM - skip link
export default function Layout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-blue-600 focus:text-white focus:p-2"
      >
        Pular para conteúdo principal
      </a>

      <header role="banner">
        {/* ... */}
      </header>

      <main id="main-content">
        {/* ... */}
      </main>
    </>
  );
}
```

### Screen Reader Only Content
- **sr-only class** - conteúdo só para leitores de tela
- **Adicionar contexto** - complementar texto visual quando necessário
- **Evitar redundância** - não duplicar informações já visíveis

```typescript
// ✅ BOM - sr-only content
<div>
  <label htmlFor="location" className="sr-only">
    Localização: (Endereço em chinês)
  </label>
  <div id="location">
    <span aria-hidden="true">📍</span>
    {attraction.chineseAddress}
  </div>
</div>

<button>
  ❤️
  <span className="sr-only">Adicionar aos favoritos</span>
</button>
```

## ✅ Melhores Práticas - Gerais

### Nomenclatura
- **camelCase** - variáveis, funções, props
- **PascalCase** - componentes, types, interfaces
- **UPPER_SNAKE_CASE** - constantes globais
- **Nomes descritivos** - preferir clareza sobre brevidade
- **Prefixos consistentes** - is/has para booleans, handle para event handlers

```typescript
// ✅ BOM
const isVisible = true;
const handleClick = () => {};
const CATEGORIES = ['museum', 'restaurant'];

// ❌ RUIM
const v = true;
const click = () => {};
const categories = ['museum', 'restaurant']; // deveria ser const
```

### Funções
- **Funções pequenas e focadas** - uma responsabilidade
- **Arrow functions** - preferir para callbacks e funções curtas
- **Function declarations** - para funções utilitárias exportadas
- **Early returns** - reduzir aninhamento
- **Parâmetros claros** - evitar mais de 3 parâmetros, usar objeto

```typescript
// ✅ BOM
export function formatAddress(address: string, maxLength: number = 50): string {
  if (!address) return '';
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
}

// ❌ RUIM
export function format(a: any, b?: any, c?: any) {
  if (a) {
    if (b) {
      if (c) {
        // muito aninhamento
      }
    }
  }
}
```

### Tratamento de Erros
- **Try-catch para operações que podem falhar** - localStorage, JSON.parse
- **Validações explícitas** - não assumir dados sempre válidos
- **Mensagens de erro claras** - para debugging e UX
- **Fallbacks graceful** - app não deve quebrar totalmente

```typescript
// ✅ BOM
export function getStoredAttractions(): Attraction[] {
  try {
    const stored = localStorage.getItem('attractions');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load attractions:', error);
    return [];
  }
}
```

### Comentários
- **Apenas quando necessário** - código deve ser auto-explicativo
- **Explicar "porquê", não "o quê"** - o código já mostra o que faz
- **TODO com contexto** - incluir contexto e responsável se relevante
- **Remover código comentado** - usar git para histórico

```typescript
// ✅ BOM - explica decisão não óbvia
// Usando GCJ-02 converter porque AMap usa sistema de coordenadas chinês
const convertedCoords = convertGCJ02toWGS84(coords);

// ❌ RUIM - óbvio demais
// Define a função para adicionar atração
function addAttraction() { }
```

## 🚀 Performance - Específico do Projeto

### localStorage
- **Não abusar de writes** - agrupar múltiplas alterações quando possível
- **Parse/stringify com segurança** - sempre try-catch
- **Limite de tamanho** - alertar usuário se aproximar de 5MB
- **Debounce em autosave** - se implementar

### PWA e Offline
- **Cache assets críticos** - service worker deve cachear bundle principal
- **Lazy load images** - usar loading="lazy" se adicionar fotos
- **Fallback offline** - páginas devem funcionar sem internet
- **Manifest completo** - ícones, cores, nome

### Bundle Size
- **Code splitting por rota** - React.lazy() nas páginas
- **Tree shaking** - importações named, não namespace
- **Evitar bibliotecas pesadas** - avaliar alternativas leves
- **Analisar bundle** - usar rollup-plugin-visualizer se necessário

## 🎯 Padrões Específicos do Pinpoint

### Modelo de Dados
```typescript
interface Attraction {
  id: string;
  name: string;
  chineseAddress: string;
  coordinates?: Coordinates;
  category: Category;
  notes?: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

type Category = 
  | 'monument' 
  | 'museum' 
  | 'restaurant' 
  | 'temple' 
  | 'hotel' 
  | 'shopping' 
  | 'other';

interface Coordinates {
  latitude: number;
  longitude: number;
}
```

### Funcionalidades Core
1. **CRUD de atrações** - criar, ler, atualizar, deletar
2. **Copiar endereço** - clipboard API, toast feedback
3. **Abrir no mapa** - URLs para Google Maps, Apple Maps, AMap
4. **Busca e filtros** - busca por nome/endereço, filtro por categoria
5. **Exportar/importar** - JSON para compartilhar
6. **Marcar como visitado** - toggle simples

### UX Crítica
- **Feedback imediato** - toasts para ações (copiado, salvo, deletado)
- **Estados vazios amigáveis** - mensagens encorajadoras quando sem dados
- **Loading states** - skeleton ou spinner quando necessário
- **Confirmação para delete** - modal ou alert
- **Toque amigável** - botões mínimo 44x44px

## 🧪 Testes (quando implementar)

### Prioridades
1. **Funções utilitárias** - helpers, formatters, validators
2. **Hooks customizados** - useLocalStorage, useAttractions
3. **Componentes críticos** - Form validation, data display

### Não priorizar
- Testes de integração complexos (projeto pequeno)
- Coverage 100% (desnecessário para MVP)

## 📝 Git e Commits

### Commits
- **Mensagens descritivas** - usar conventional commits se possível
- **Commits atômicos** - uma funcionalidade/fix por commit
- **Não commitar console.logs** - limpar antes de commitar

```bash
# ✅ BOM
feat: add search functionality to attractions list
fix: correct coordinates conversion for AMap
chore: update design tokens with new colors

# ❌ RUIM
update
fix bug
changes
```

## 🎓 Diretrizes Adicionais

### Acessibilidade
- **Alt text** - em imagens (se adicionar)
- **Labels em inputs** - sempre associar label com input
- **Focus visible** - estados de foco claros
- **Cores com contraste** - WCAG AA mínimo (já garantido no design system)
- **Semantic HTML** - usar tags apropriadas (button, nav, main)

### Internacionalização
- **Não hardcoded** - preparar para i18n se necessário no futuro
- **Aceitar caracteres chineses** - validações devem permitir
- **UTF-8 encoding** - garantir em todos os arquivos

### Segurança
- **Sanitizar inputs** - especialmente se permitir HTML no futuro
- **Validar dados importados** - não confiar cegamente em JSON externo
- **Não expor dados sensíveis** - localStorage é acessível por JS

### Manutenibilidade
- **DRY (Don't Repeat Yourself)** - mas sem over-engineering
- **KISS (Keep It Simple)** - simplicidade > cleverness
- **YAGNI (You Aren't Gonna Need It)** - não adicionar features não solicitadas
- **Code review próprio** - revisar antes de marcar como pronto

## 🚨 O Que Evitar

### Anti-patterns React
- ❌ Prop drilling excessivo (usar Context)
- ❌ State elevado desnecessariamente
- ❌ useEffect para lógica de evento (usar handlers)
- ❌ Mutação direta de state
- ❌ Lógica complexa em JSX (extrair para funções)

### Anti-patterns Gerais
- ❌ God components (componentes fazendo tudo)
- ❌ Magic numbers/strings (usar constantes)
- ❌ Nested ternários profundos (extrair para função)
- ❌ Callback hell (usar async/await)
- ❌ Premature optimization

## 📚 Recursos de Referência
- React docs: https://react.dev
- TypeScript handbook: https://www.typescriptlang.org/docs/
- Tailwind docs: https://tailwindcss.com/docs
- Web.dev (PWA): https://web.dev/progressive-web-apps/

---

**Nota:** Este é um projeto MVP focado em funcionalidade e usabilidade. 
Priorizar: funcional > perfeito. Ship iterativamente e refatore conforme necessário.