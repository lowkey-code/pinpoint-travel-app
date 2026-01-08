# Pinpoint - Travel App

Aplicativo PWA para organizar pontos de interesse de viagem.

## Requisitos

- **Node.js**: >= 20.0.0 (LTS)
- **npm**: >= 10.0.0

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
node --version  # Deve ser >= 20.0.0
npm --version   # Deve ser >= 10.0.0
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

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
