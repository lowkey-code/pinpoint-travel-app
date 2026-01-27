# TODO & Roadmap

## Design System

### 🔜 Próximos Passos

- [ ] **Implementar Storybook**
  - Substituir `/docs/folio-design-system.html` por Storybook interativo
  - Documentar todos os componentes React criados
  - Adicionar controles interativos para props
  - Incluir testes de acessibilidade (a11y addon)
  - Integrar testes visuais (Chromatic ou similar)
  - Gerar documentação automática a partir de JSDoc/TSDoc
  - **Benefícios:**
    - Desenvolvimento isolado de componentes
    - Documentação viva e sempre atualizada
    - Testes visuais automatizados
    - Facilita onboarding de novos desenvolvedores
    - Permite design review sem rodar a aplicação completa

### 📚 Componentes para Documentar

Quando o Storybook for implementado, documentar:
- Boarding Pass Card
- Stamp Badge
- City Tag
- Perforated Divider
- Button variants (primary, outline, ghost)
- Input fields
- Dark mode toggle
- Day View Tabs
- Grid Day Column
- Place Card
- Transport Card
- (Adicionar novos componentes conforme criados)

### 🎨 Design System Evolution

- [ ] Criar variantes de Boarding Pass Card (compact, expanded, minimal)
- [ ] Definir sistema de grid/layout patterns
- [ ] Adicionar animações de transição entre estados
- [ ] Criar biblioteca de ilustrações SVG para empty states
- [ ] Definir padrões de loading states e skeletons

## Features

### 🚀 Futuras Features (Avaliar)

- [ ] Integração Google Places API (prioridade alta)
- [ ] Mapa integrado aprimorado
- [ ] Painel de detalhes rico para lugares
- [ ] Exportar roteiro como PDF
- [ ] Compartilhamento colaborativo (modo offline-first)

## Infraestrutura

- [ ] Configurar CI/CD para deploy automático
- [ ] Adicionar testes E2E com Playwright em CI
- [ ] Configurar análise de bundle size
- [ ] Desenvolver estratégia de error tracking para PWA offline
- [ ] Implementar error tracking (Sentry ou similar)

---

**Nota:** Este arquivo deve ser mantido atualizado conforme o projeto evolui.
**Prioridade atual:** Implementação do Storybook para melhor documentação de componentes.
