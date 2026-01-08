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