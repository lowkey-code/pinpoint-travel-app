# Ark UI Migration Prompts

Prompts otimizados para o modelo Haiku para migrar componentes do projeto para Ark UI mantendo o tema Tailwind existente.

## Visao Geral

| Fase | Componente | Prioridade | Commit Message |
|------|------------|------------|----------------|
| 1 | Setup | ALTA | `chore: setup Ark UI and configure Tailwind data-attribute variants` |
| 2 | Toast | ALTA | `refactor: migrate Toast to Ark UI with existing API` |
| 3A | Input | ALTA | `refactor: migrate Input to Ark UI Field` |
| 3B | Textarea | ALTA | `refactor: migrate Textarea to Ark UI Field` |
| 4 | Select | MEDIA | `feat: add Ark UI Select component and update AttractionForm` |
| 5A | Dialog | BAIXA | `feat: add ConfirmDialog component for delete confirmation` |
| 5B | Tooltip | BAIXA | `feat: add Tooltip component with Ark UI` |
| 6 | Validacao | ALTA | `test: validate Ark UI migration` |

---

## Fase 1: Setup do Projeto

```
TAREFA: Configurar Ark UI no projeto React + Tailwind

PASSOS:
1. Instalar @ark-ui/react via yarn
2. Editar tailwind.config.js adicionando plugin com variantes:
   - data-open: '&[data-state="open"]'
   - data-closed: '&[data-state="closed"]'
   - data-highlighted: '&[data-highlighted]'
   - data-disabled: '&[data-disabled]'
   - data-invalid: '&[data-invalid]'
   - data-checked: '&[data-checked]'

3. Adicionar em src/index.css apos os imports existentes:
   - Keyframe fade-in (opacity 0 -> 1)
   - Keyframe scale-in (scale 0.95/opacity 0 -> scale 1/opacity 1)

4. Verificar instalacao rodando: yarn build

ARQUIVOS:
- tailwind.config.js
- src/index.css
- package.json

NAO modificar componentes existentes ainda.
Fazer commit: "chore: setup Ark UI and configure Tailwind data-attribute variants"
```

---

## Fase 2: Migracao do Toast

```
TAREFA: Migrar Toast para Ark UI mantendo API existente

CONTEXTO:
- Toast atual: src/components/ui/Toast.tsx
- Usa: ToastContext, ToastProvider, useToast hook
- 4 tipos: success, error, info, warning
- Auto-dismiss: 3 segundos
- Posicao: top-right

CRIAR ESTRUTURA:
src/components/ui/toast/
├── index.ts (barrel export)
├── toast-provider.tsx
├── use-toast.ts
└── toast-styles.ts

REQUISITOS:
1. toast-provider.tsx:
   - Usar Toast de @ark-ui/react/toast
   - Criar toaster com Toast.createToaster({ placement: 'top-end', duration: 3000 })
   - Renderizar Toast.Root, Toast.Title, Toast.Description, Toast.CloseTrigger

2. use-toast.ts:
   - Exportar hook useToast() com MESMA assinatura atual:
     { showToast: (message: string, type?: 'success'|'error'|'info'|'warning') => void }
   - Usar toaster.create() internamente

3. toast-styles.ts:
   - Manter classes Tailwind atuais:
     success: 'bg-green-600 text-white'
     error: 'bg-red-600 text-white'
     info: 'bg-primary-600 text-white'
     warning: 'bg-amber-500 text-white'
   - Container: 'rounded-lg shadow-lg p-4 min-w-[300px]'

4. index.ts:
   - Exportar: ToastProvider, useToast, toastStyles

5. Atualizar src/components/ui/index.ts para exportar do novo path

6. Atualizar src/App.tsx se necessario (manter ToastProvider envolvendo app)

MANTER compatibilidade com uso em AttractionCard.tsx (useToast().showToast)

Commit: "refactor: migrate Toast to Ark UI with existing API"
```

---

## Fase 3A: Migracao do Input

```
TAREFA: Migrar Input para Ark UI Field mantendo props existentes

CONTEXTO:
- Input atual: src/components/ui/Input.tsx
- Props: label, errorMessage, helperText, leftIcon, rightIcon, size, fullWidth, disabled
- Sizes: sm, md, lg
- Usa forwardRef

CRIAR:
src/components/ui/field/
├── index.ts
├── Input.tsx
└── field-styles.ts

REQUISITOS Input.tsx:
1. Importar { Field } from '@ark-ui/react/field'
2. Manter TODAS as props atuais (InputProps interface)
3. Estrutura:
   <Field.Root invalid={!!errorMessage} disabled={disabled}>
     {label && <Field.Label className="...">{label}</Field.Label>}
     <div className="relative">
       {leftIcon && <span className="absolute left-3...">{leftIcon}</span>}
       <Field.Input
         ref={ref}
         className={cn(baseStyles, sizeStyles[size], iconPadding, className)}
         {...props}
       />
       {rightIcon && <span className="absolute right-3...">{rightIcon}</span>}
     </div>
     {helperText && !errorMessage && <Field.HelperText>{helperText}</Field.HelperText>}
     <Field.ErrorText>{errorMessage}</Field.ErrorText>
   </Field.Root>

4. Manter estilos Tailwind atuais de sizeStyles e baseStyles
5. Usar data-invalid: para estilo de erro no input

field-styles.ts:
- Exportar sizeStyles, baseInputStyles, labelStyles

index.ts:
- Exportar Input e InputProps

Atualizar src/components/ui/index.ts

Commit: "refactor: migrate Input to Ark UI Field"
```

---

## Fase 3B: Migracao do Textarea

```
TAREFA: Migrar Textarea para Ark UI Field

CONTEXTO:
- Textarea atual: src/components/ui/Textarea.tsx
- Props: label, errorMessage, helperText, size, rows, autoResize, disabled
- Muito similar ao Input

CRIAR em src/components/ui/field/:
- Textarea.tsx

REQUISITOS:
1. Importar { Field } from '@ark-ui/react/field'
2. Manter props existentes (TextareaProps)
3. Estrutura similar ao Input:
   <Field.Root invalid={!!errorMessage} disabled={disabled}>
     {label && <Field.Label>{label}</Field.Label>}
     <Field.Textarea
       ref={ref}
       rows={rows}
       className={cn(baseStyles, sizeStyles[size], autoResize && 'resize-none', className)}
       {...props}
     />
     {helperText && !errorMessage && <Field.HelperText>{helperText}</Field.HelperText>}
     <Field.ErrorText>{errorMessage}</Field.ErrorText>
   </Field.Root>

4. Manter logica de autoResize se existir (useEffect com scrollHeight)
5. Reutilizar estilos de field-styles.ts onde possivel

Atualizar field/index.ts para exportar Textarea
Atualizar src/components/ui/index.ts

Commit: "refactor: migrate Textarea to Ark UI Field"
```

---

## Fase 4: Adicionar Select

```
TAREFA: Criar componente Select com Ark UI para substituir <select> nativo

CONTEXTO:
- AttractionForm.tsx usa <select> nativo (linhas ~218-231)
- Categorias: monument, museum, restaurant, temple, hotel, shopping, other
- Precisa ser estilizado consistentemente com outros form fields

CRIAR:
src/components/ui/select/
├── index.ts
├── Select.tsx
└── select-styles.ts

REQUISITOS Select.tsx:
1. Importar { Select, createListCollection } from '@ark-ui/react/select'
2. Props interface:
   - label?: string
   - options: Array<{ value: string; label: string }>
   - value?: string
   - onChange?: (value: string) => void
   - placeholder?: string
   - errorMessage?: string
   - disabled?: boolean
   - size?: 'sm' | 'md' | 'lg'

3. Estrutura:
   const collection = createListCollection({ items: options })

   <Select.Root
     collection={collection}
     value={value ? [value] : []}
     onValueChange={(details) => onChange?.(details.value[0])}
     disabled={disabled}
   >
     {label && <Select.Label className="...">{label}</Select.Label>}
     <Select.Control>
       <Select.Trigger className={cn(triggerStyles, sizeStyles[size])}>
         <Select.ValueText placeholder={placeholder} />
         <Select.Indicator><ChevronDownIcon /></Select.Indicator>
       </Select.Trigger>
     </Select.Control>
     <Select.Positioner>
       <Select.Content className={contentStyles}>
         {options.map((item) => (
           <Select.Item key={item.value} item={item} className={itemStyles}>
             <Select.ItemText>{item.label}</Select.ItemText>
             <Select.ItemIndicator><CheckIcon /></Select.ItemIndicator>
           </Select.Item>
         ))}
       </Select.Content>
     </Select.Positioner>
   </Select.Root>

select-styles.ts:
- triggerStyles: similar ao Input (border, rounded, bg-white, focus ring)
- contentStyles: 'bg-white rounded-md shadow-lg border py-1 z-50'
- itemStyles: 'px-3 py-2 cursor-pointer data-highlighted:bg-primary-50'
- sizeStyles: sm/md/lg matching Input sizes

4. Atualizar AttractionForm.tsx:
   - Importar Select de '@/components/ui'
   - Substituir <select> nativo pelo novo componente
   - Passar CATEGORY_OPTIONS como options prop

Atualizar src/components/ui/index.ts

Commit: "feat: add Ark UI Select component and update AttractionForm"
```

---

## Fase 5A: Dialog de Confirmacao (Opcional)

```
TAREFA: Criar ConfirmDialog com Ark UI para confirmacao de exclusao

CONTEXTO:
- DetailView.tsx tem botao "Deletar" que chama onDelete diretamente
- Melhorar UX pedindo confirmacao antes de deletar

CRIAR:
src/components/ui/dialog/
├── index.ts
└── ConfirmDialog.tsx

REQUISITOS ConfirmDialog.tsx:
1. Importar { Dialog } from '@ark-ui/react/dialog'
2. Props:
   - open: boolean
   - onOpenChange: (open: boolean) => void
   - title: string
   - description: string
   - confirmLabel?: string (default: "Confirmar")
   - cancelLabel?: string (default: "Cancelar")
   - onConfirm: () => void
   - variant?: 'danger' | 'warning' | 'default'

3. Estrutura:
   <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
     <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
     <Dialog.Positioner className="fixed inset-0 flex items-center justify-center z-50">
       <Dialog.Content className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
         <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
         <Dialog.Description className="mt-2 text-neutral-600">{description}</Dialog.Description>
         <div className="mt-6 flex gap-3 justify-end">
           <Dialog.CloseTrigger asChild>
             <Button variant="secondary">{cancelLabel}</Button>
           </Dialog.CloseTrigger>
           <Button
             variant={variant === 'danger' ? 'primary' : 'primary'}
             className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
             onClick={() => { onConfirm(); onOpenChange(false); }}
           >
             {confirmLabel}
           </Button>
         </div>
       </Dialog.Content>
     </Dialog.Positioner>
   </Dialog.Root>

4. Atualizar DetailView.tsx:
   - Adicionar state: const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   - Botao Deletar: onClick={() => setShowDeleteDialog(true)}
   - Renderizar ConfirmDialog com onConfirm={onDelete}

Commit: "feat: add ConfirmDialog component for delete confirmation"
```

---

## Fase 5B: Tooltip (Opcional)

```
TAREFA: Criar wrapper Tooltip com Ark UI

CONTEXTO:
- IconButtons em AttractionCard.tsx tem aria-label mas sem tooltip visual
- Melhorar acessibilidade mostrando tooltip no hover

CRIAR:
src/components/ui/tooltip/
├── index.ts
└── Tooltip.tsx

REQUISITOS Tooltip.tsx:
1. Importar { Tooltip } from '@ark-ui/react/tooltip'
2. Props:
   - content: string
   - children: React.ReactElement
   - side?: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
   - delayDuration?: number (default: 300)

3. Estrutura:
   <Tooltip.Root openDelay={delayDuration}>
     <Tooltip.Trigger asChild>
       {children}
     </Tooltip.Trigger>
     <Tooltip.Positioner>
       <Tooltip.Content
         className="bg-neutral-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50"
       >
         {content}
       </Tooltip.Content>
     </Tooltip.Positioner>
   </Tooltip.Root>

4. Exemplo de uso em AttractionCard.tsx (nao modificar agora, apenas documentar):
   <Tooltip content="Copiar endereco">
     <IconButton aria-label="Copiar endereco" onClick={handleCopy}>
       <CopyIcon />
     </IconButton>
   </Tooltip>

Atualizar src/components/ui/index.ts

Commit: "feat: add Tooltip component with Ark UI"
```

---

## Fase 6: Validacao e Testes

```
TAREFA: Validar migracao Ark UI e garantir funcionamento

CHECKLIST:
1. Build do projeto:
   yarn build
   - Deve completar sem erros

2. Verificar exports em src/components/ui/index.ts:
   - Toast/ToastProvider/useToast
   - Input/InputProps
   - Textarea/TextareaProps
   - Select/SelectProps
   - ConfirmDialog (se implementado)
   - Tooltip (se implementado)
   - Button, IconButton, Card, Badge (mantidos)

3. Testar AttractionForm:
   - Abrir /attractions/new
   - Preencher todos os campos
   - Verificar validacao de erros
   - Verificar Select de categoria funciona
   - Submeter form

4. Testar Toast:
   - Em AttractionCard, clicar em copiar endereco
   - Toast deve aparecer top-right
   - Deve auto-fechar apos 3s
   - Testar botao X para fechar manual

5. Testar Dialog (se implementado):
   - Abrir detalhes de uma atracao
   - Clicar Deletar
   - Dialog deve abrir
   - Cancelar deve fechar
   - Confirmar deve deletar

6. Acessibilidade:
   - Navegar forms com Tab
   - Select deve abrir com Enter/Space
   - Escape deve fechar Select/Dialog

Se encontrar erros, corrigi-los antes de finalizar.

Commit final: "test: validate Ark UI migration"
```

---

## Estrutura Final de Arquivos

```
src/components/ui/
├── index.ts                    # Exports atualizados
├── Button.tsx                  # Manter (sem alteracao)
├── IconButton.tsx              # Manter (sem alteracao)
├── Card.tsx                    # Manter (sem alteracao)
├── Badge.tsx                   # Manter (sem alteracao)
├── field/
│   ├── index.ts
│   ├── Input.tsx               # Ark UI Field
│   ├── Textarea.tsx            # Ark UI Field
│   └── field-styles.ts
├── toast/
│   ├── index.ts
│   ├── toast-provider.tsx      # Ark UI Toaster
│   ├── use-toast.ts            # Hook wrapper
│   └── toast-styles.ts
├── select/
│   ├── index.ts
│   ├── Select.tsx              # Ark UI Select
│   └── select-styles.ts
├── dialog/                     # Opcional
│   ├── index.ts
│   └── ConfirmDialog.tsx
└── tooltip/                    # Opcional
    ├── index.ts
    └── Tooltip.tsx
```

---

## Componentes que NAO serao migrados

| Componente | Motivo |
|------------|--------|
| Button | Componente de apresentacao simples, bem implementado |
| IconButton | Componente de apresentacao simples |
| Card | Componente de layout, sem comportamento complexo |
| Badge | Componente de apresentacao simples |
| Container | Utility de layout |
| Layout | Componente especifico do app |
| SearchBar | Composicao customizada |

---

## Referencias

- [Ark UI Docs](https://ark-ui.com/)
- [Ark UI GitHub](https://github.com/chakra-ui/ark)
- [Ark UI + Tailwind Guide](https://ark-ui.com/docs/guides/styling)
- [Park UI (Ark UI + Tailwind presets)](https://park-ui.com)
