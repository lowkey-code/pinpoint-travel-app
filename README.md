# Pinpoint - Travel App

Aplicativo PWA para organizar pontos de interesse de viagem.

## Tecnologias

- **React** 19 + **TypeScript**
- **Vite** 7 - Build tool
- **Tailwind CSS** 4 - Estilização
- Design System customizado com tokens reutilizáveis

## Estrutura do Projeto

```
src/
├── components/    # Componentes React reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── utils/         # Funções utilitárias
├── lib/           # Bibliotecas e configurações
│   └── design-tokens.js  # Tokens do design system
└── index.css      # Estilos globais com Tailwind
```

## Design System

O projeto utiliza um design system customizado com:

- **Paleta de cores**: Primary (azul), Secondary (verde), Accent (âmbar)
- **Tipografia**: Plus Jakarta Sans (headings) + Inter (body)
- **Tokens**: Espaçamento, bordas, sombras, componentes

Consulte `/src/lib/design-tokens.js` para todos os tokens disponíveis.

## Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Fontes

O projeto utiliza fontes do Google Fonts:
- **Plus Jakarta Sans** (500, 600, 700, 800)
- **Inter** (400, 500, 600, 700)
