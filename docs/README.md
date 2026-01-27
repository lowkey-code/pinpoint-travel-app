# Documentação

Este diretório contém documentação do Design System e recursos relacionados.

## 📁 Estrutura

```
docs/
├── folio-design-system.html    # Showcase visual do Design System (atual)
└── archive/                     # Versões antigas arquivadas
    ├── DESIGN_SYSTEM.md
    ├── design-showcase.html
    └── design-showcase-passport.html
```

## 🎨 Design System Atual

**Folio Design System v3.7** — "Functional Nostalgia"

- **Showcase Visual**: `folio-design-system.html` (abra no navegador)
- **Guidelines para IAs**: `/DESIGN_GUIDELINES.md` (raiz do projeto)
- **Instruções de Implementação**: `/CLAUDE.md` (raiz do projeto)

### Como visualizar o showcase

```bash
# Opção 1: Abrir diretamente no navegador
open docs/folio-design-system.html

# Opção 2: Servir com Python
cd docs
python3 -m http.server 8000
# Acesse http://localhost:8000/folio-design-system.html
```

## 🔮 Futuro: Storybook

**Status:** Planejado (ver `/TODO.md`)

Atualmente usamos um HTML estático para showcase. Em breve será implementado:

- **Storybook** para documentação interativa de componentes React
- Stories com controles para todas as props
- Testes de acessibilidade integrados (a11y addon)
- Testes visuais automatizados (Chromatic)
- Documentação gerada automaticamente de JSDoc/TSDoc

### Por que Storybook?

- ✅ Desenvolvimento isolado de componentes
- ✅ Documentação sempre atualizada (código como fonte única de verdade)
- ✅ Facilita design review sem rodar app completa
- ✅ Onboarding mais rápido para novos desenvolvedores
- ✅ Integração com CI/CD para visual regression testing

### Preparando componentes para Storybook

Ao criar novos componentes, siga estas boas práticas:

1. **Interfaces claras**: Props bem definidas com TypeScript
2. **JSDoc completo**: Documente props e exemplos de uso
3. **Componentes isolados**: Minimize dependências externas
4. **Variantes explícitas**: Use props para variações, não lógica interna complexa
5. **Estados documentados**: Loading, error, empty, success, etc.

Exemplo:

```typescript
/**
 * Boarding Pass Card component for displaying trip activities
 *
 * @example
 * ```tsx
 * <BoardingPassCard
 *   title="Fushimi Inari Taisha"
 *   status="visited"
 *   startTime="08:00"
 *   cost="Free"
 * />
 * ```
 */
export interface BoardingPassCardProps {
  /** Activity or place name */
  title: string;
  /** Current status badge */
  status: 'visited' | 'planned' | 'skipped';
  /** Start time in HH:MM format */
  startTime: string;
  /** Cost label (e.g., "Free", "$20") */
  cost: string;
}
```

## 🗂️ Archive

A pasta `archive/` contém iterações antigas do design system:

- **Earth Meets Sky** (rejeitado): Design muito quente/emocional
- **Passport Stamps v1** (evoluiu): Base para o Folio atual

Mantido apenas para referência histórica.

---

**Última atualização:** Janeiro 2025
