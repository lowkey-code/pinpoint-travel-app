# Pinpoint - Travel App

Aplicativo PWA para organizar pontos de interesse de viagem.

## Requisitos

- **Node.js**: >= 20.0.0 (LTS)
- **pnpm**: >= 10.0.0

Recomenda-se usar um gerenciador de versões Node:
- **nvm** (Linux/macOS): `nvm use` (lê automático de `.nvmrc`)
- **fnm** (Multi-plataforma): `fnm use` (lê automático de `.nvmrc`)
- **nvm-windows** (Windows): Use `.nvmrc` manualmente ou `.node-version`

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

## Instalação e Setup

### 1. Clone o repositório
```bash
git clone https://github.com/mcsolha/pinpoint-travel-app.git
cd pinpoint-travel-app
```

### 2. Verifique a versão do Node.js
```bash
# Com nvm
nvm use

# Com fnm
fnm use

# Ou manualmente
node --version   # Deve ser >= 20.0.0
pnpm --version   # Deve ser >= 10.0.0
```

### 3. Instale o pnpm (se necessario)
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

### 4. Instale as dependencias
```bash
pnpm install
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## Scripts Disponíveis

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview

# Lint
pnpm run lint
```

## Fontes

O projeto utiliza fontes do Google Fonts:
- **Plus Jakarta Sans** (500, 600, 700, 800)
- **Inter** (400, 500, 600, 700)
