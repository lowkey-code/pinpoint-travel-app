# Design System - Componentes UI

Componentes reutilizáveis seguindo os design tokens definidos em `src/lib/design-tokens.js`.

## Instalação

Todos os componentes podem ser importados do barrel export:

```tsx
import { Button, Badge, Card, Input, Textarea, IconButton } from '@/components/ui';
```

---

## Button

Botão com múltiplas variantes e tamanhos.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `fullWidth` | `boolean` | `false` | Largura total |
| `isLoading` | `boolean` | `false` | Estado de carregamento |
| `leftIcon` | `ReactNode` | - | Ícone à esquerda |
| `rightIcon` | `ReactNode` | - | Ícone à direita |

### Exemplos

```tsx
// Variantes
<Button variant="primary">Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Voltar</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>

// Com ícones
<Button leftIcon={<PlusIcon />}>Adicionar</Button>
<Button rightIcon={<ArrowRightIcon />}>Próximo</Button>

// Estados
<Button isLoading>Salvando...</Button>
<Button disabled>Desabilitado</Button>
<Button fullWidth>Largura Total</Button>
```

---

## IconButton

Botão circular para ícones. Requer `aria-label` para acessibilidade.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'default' \| 'primary' \| 'ghost'` | `'default'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `aria-label` | `string` | **obrigatório** | Label de acessibilidade |

### Exemplos

```tsx
<IconButton aria-label="Pesquisar">
  <SearchIcon />
</IconButton>

<IconButton variant="primary" aria-label="Adicionar">
  <PlusIcon />
</IconButton>

<IconButton variant="ghost" size="lg" aria-label="Menu">
  <MenuIcon />
</IconButton>
```

---

## Badge

Badge para categorias e labels com cores semânticas.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `category` | `'monument' \| 'museum' \| 'restaurant' \| 'temple' \| 'hotel' \| 'shopping' \| 'other'` | `'other'` | Categoria (define a cor) |
| `size` | `'sm' \| 'md'` | `'md'` | Tamanho |

### Cores por Categoria

| Categoria | Cor de Fundo | Cor do Texto |
|-----------|--------------|--------------|
| `monument` | Azul claro | Azul escuro |
| `museum` | Índigo claro | Índigo escuro |
| `restaurant` | Âmbar claro | Âmbar escuro |
| `temple` | Rosa claro | Rosa escuro |
| `hotel` | Ciano claro | Ciano escuro |
| `shopping` | Roxo claro | Roxo escuro |
| `other` | Cinza claro | Cinza escuro |

### Exemplos

```tsx
<Badge category="monument">Monumento</Badge>
<Badge category="museum">Museu</Badge>
<Badge category="restaurant">Restaurante</Badge>
<Badge category="temple">Templo</Badge>
<Badge category="hotel">Hotel</Badge>
<Badge category="shopping">Shopping</Badge>
<Badge category="other">Outro</Badge>

// Tamanho pequeno
<Badge category="monument" size="sm">Monumento</Badge>
```

---

## Card

Container para agrupar conteúdo relacionado.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Estilo visual |
| `hoverable` | `boolean` | `false` | Efeito hover |
| `noPadding` | `boolean` | `false` | Remove padding interno |

### Sub-componentes

- `CardHeader` - Cabeçalho com borda inferior
- `CardBody` - Corpo principal
- `CardFooter` - Rodapé com borda superior

### Exemplos

```tsx
// Card simples
<Card>
  <p>Conteúdo do card</p>
</Card>

// Card com hover
<Card hoverable>
  <p>Card clicável</p>
</Card>

// Card estruturado
<Card>
  <CardHeader>
    <h3>Título</h3>
    <IconButton aria-label="Opções">
      <MoreIcon />
    </IconButton>
  </CardHeader>
  <CardBody>
    <p>Conteúdo principal</p>
  </CardBody>
  <CardFooter>
    <Button variant="ghost">Cancelar</Button>
    <Button variant="primary">Salvar</Button>
  </CardFooter>
</Card>

// Variantes
<Card variant="outlined">Apenas borda</Card>
<Card variant="elevated">Sombra elevada</Card>

// Sem padding (útil para imagens)
<Card noPadding>
  <img src="..." alt="..." />
</Card>
```

---

## Input

Campo de entrada com label, texto auxiliar e tratamento de erros.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `label` | `string` | - | Label do campo |
| `helperText` | `string` | - | Texto auxiliar |
| `hasError` | `boolean` | `false` | Estado de erro |
| `errorMessage` | `string` | - | Mensagem de erro |
| `leftIcon` | `ReactNode` | - | Ícone à esquerda |
| `rightIcon` | `ReactNode` | - | Ícone à direita |
| `fullWidth` | `boolean` | `false` | Largura total |

### Exemplos

```tsx
// Básico
<Input placeholder="Digite aqui" />

// Com label
<Input label="Nome" placeholder="Seu nome completo" />

// Com texto auxiliar
<Input
  label="Email"
  helperText="Nunca compartilharemos seu email"
  type="email"
/>

// Com erro
<Input
  label="Senha"
  type="password"
  hasError
  errorMessage="A senha deve ter no mínimo 8 caracteres"
/>

// Com ícones
<Input
  leftIcon={<SearchIcon />}
  placeholder="Pesquisar..."
/>

<Input
  rightIcon={<EyeIcon />}
  type="password"
  label="Senha"
/>

// Tamanhos
<Input size="sm" placeholder="Pequeno" />
<Input size="md" placeholder="Médio" />
<Input size="lg" placeholder="Grande" />

// Largura total
<Input fullWidth label="Endereço" />

// Desabilitado
<Input disabled label="Campo desabilitado" value="Valor fixo" />
```

---

## Textarea

Área de texto multilinha com label, texto auxiliar e tratamento de erros.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `label` | `string` | - | Label do campo |
| `helperText` | `string` | - | Texto auxiliar |
| `hasError` | `boolean` | `false` | Estado de erro |
| `errorMessage` | `string` | - | Mensagem de erro |
| `fullWidth` | `boolean` | `false` | Largura total |
| `autoResize` | `boolean` | `false` | Redimensiona automaticamente |

### Exemplos

```tsx
// Básico
<Textarea placeholder="Digite sua mensagem..." />

// Com label e helper
<Textarea
  label="Descrição"
  helperText="Máximo 500 caracteres"
  placeholder="Descreva a atração..."
/>

// Com erro
<Textarea
  label="Comentário"
  hasError
  errorMessage="O comentário é obrigatório"
/>

// Tamanhos (afeta altura mínima)
<Textarea size="sm" placeholder="80px de altura" />
<Textarea size="md" placeholder="120px de altura" />
<Textarea size="lg" placeholder="160px de altura" />

// Largura total
<Textarea fullWidth label="Observações" />
```

---

## Utilitário: cn()

Função para mesclar classes CSS de forma segura.

```tsx
import { cn } from '@/lib/cn';

// Uso básico
cn('classe1', 'classe2') // "classe1 classe2"

// Com condicionais
cn('base', isActive && 'active') // "base active" ou "base"

// Filtra valores falsy
cn('a', undefined, null, false, 'b') // "a b"
```
