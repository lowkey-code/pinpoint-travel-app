# Contributing to Pinpoint Travel App

Obrigado por seu interesse em contribuir com o Pinpoint! 🎉

## Requisitos do Desenvolvedor

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 20.0.0 (recomendado: LTS mais recente)
 - **Node.js** >= 20.19.0 (recomendado: LTS mais recente)
 - **yarn** >= 1.22.0
- **Git**

### Configurar ambiente local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mcsolha/pinpoint-travel-app.git
   cd pinpoint-travel-app
   ```

2. **Configure a versão Node.js**
   ```bash
   # Usando nvm (Linux/macOS)
   nvm use

   # Usando fnm
   fnm use

   # Verifique
   node --version   # >= 20.19.0
   yarn --version   # >= 1.22.0
   ```

3. **Instale o yarn (se necessario)**
   ```bash
   npm i -g yarn@latest
   ```

4. **Instale dependencias**
   ```bash
   yarn install
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   yarn dev
   ```

## Padrões de Código

Este projeto segue padrões rigorosos de código. **Sempre leia `claude.md` antes de contribuir!**

### TypeScript
- Strict mode obrigatório
- Sem `any` types
- Interfaces para props
- Types para dados

### React
- Componentes funcionais
- Hooks para lógica
- Props separadas em interfaces
- Preferir composição

### Tailwind CSS
- Usar design tokens (cores, espaçamento)
- Variantes Tailwind (`hover:`, `active:`, etc)
- NUNCA manipular DOM com `onMouseEnter`/`onMouseLeave`
- Classes em ordem lógica (layout → spacing → sizing → visual → interaction)

### Git Commits
Siga conventional commits:
```bash
feat: add search functionality
fix: correct validation error
refactor: improve component structure
docs: update setup instructions
chore: update dependencies
```

**⚠️ IMPORTANTE:** Git hooks automáticos validam seus commits:
- **commit-msg hook**: Valida o formato da mensagem (Conventional Commits)
- **pre-commit hook**: Executa ESLint apenas em arquivos modificados via lint-staged

Os hooks rodarão automaticamente quando você fizer commit. Se precisar contorná-los (não recomendado):
```bash
git commit --no-verify
```

**Como funciona o pre-commit hook:**
```bash
# Você faz suas mudanças
git add .

# Ao tentar commit:
git commit -m "feat: sua feature"

# O hook automáticamente:
# 1. Roda ESLint apenas nos arquivos modificados (lint-staged)
# 2. Se houver erros de linting → commit rejeitado
# 3. Se houver warnings → commit pode prosseguir
# 4. Se tudo passar → commit aceito
```

💡 Isso melhora performance pois não verifica todos os arquivos, apenas os que mudaram!

## Process de Desenvolvimento

1. **Crie uma feature branch**
   ```bash
   git checkout -b feat/sua-feature
   ```

2. **Implemente as mudanças**
   - Siga os padrões em `claude.md`
   - Use `yarn lint` para verificar
   - Use `yarn build` para testar o build

3. **Faça commits atômicos com Conventional Commits**
   ```bash
   git commit -m "feat: adicione nova funcionalidade"
   ```

   ✨ **Dica**: Use `npx commitizen` para guia interativo (opcional):
   ```bash
   npx commitizen init cz-conventional-changelog --save-dev
   yarn commit  # Substituir por npx cz commit
   ```

4. **Teste antes de fazer push**
   ```bash
   yarn lint    # Verifica o código (também roda no git hook)
   yarn build   # Compila TypeScript e cria bundle
   yarn dev     # Testa localmente
   ```

5. **Git hooks validam automaticamente**
   ```
   ✅ Pre-commit: ESLint passa
   ✅ Commit-msg: Mensagem segue Conventional Commits
   ```
   Se houver erro, o commit será rejeitado e você poderá corrigir.

5. **Faça push e crie um PR**
   ```bash
   git push origin feat/sua-feature
   ```

## Estrutura de Pastas

```
/src
  /components     # Componentes reutilizáveis
  /pages          # Páginas da aplicação
  /hooks          # Custom hooks
  /utils          # Funções utilitárias
  /lib            # Design tokens e constantes
  /contexts       # Context providers
```

## Design System

Consulte `/docs/design-system.md` para cores, tipografia, spacing, etc.

Sempre use design tokens em vez de valores arbitrários:

```typescript
// ✅ BOM
className="bg-primary-600 hover:bg-primary-700"

// ❌ RUIM
className="bg-[#2563eb] hover:bg-[#1d4ed8]"
```

## Performance

- Use lazy loading para páginas (`React.lazy()`)
- Memoize callbacks quando necessário (`useCallback`)
- Evite re-renders desnecessários
- Use keys estáveis em listas

## Acessibilidade

- Sempre adicione `aria-label` em ícones
- Use labels em inputs
- Garanta contraste de cores (WCAG AA)
- Teste com teclado

## Testes

Quando implementar testes:
- Prioritize funções utilitárias
- Teste componentes críticos
- Use React Testing Library

## Issues e PRs

- Use templates padronizados
- Descreva claramente o problema/solução
- Referencie issues relacionadas
- Adicione screenshots se for UI

## Dúvidas?

- Leia `claude.md` - tem quase tudo!
- Verifique issues abertas
- Crie uma nova issue com tag `question`

---

Muito obrigado por contribuir! 🙏
