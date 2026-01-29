# Itinerary Page Redesign

> Visão para reestruturação da página `/itinerary` — "Arquivo de Jornadas"

## Conceito

A página Itinerary funciona como um **arquivo pessoal de viagens**, diferente da Home que é um dashboard focado na viagem atual. Aqui o usuário gerencia todas as suas jornadas.

## Estrutura Visual

```
┌─────────────────────────────────────┐
│  MINHAS JORNADAS         [🔍] [➕] │
├─────────────────────────────────────┤
│                                     │
│  ● ATIVAS                           │
│  │                                  │
│  ├─● 🇯🇵 Japão 2025                │
│  │    12-24 Mar · 12 dias          │
│  │    ━━━━━━━▓▓▓░░░ 45%            │
│  │                                  │
│  ├─● 🇵🇹 Portugal 2024             │
│  │    15-22 Set · 8 dias           │
│  │    Planejamento                  │
│  │                                  │
│  └─○ 🇮🇹 Itália 2024               │
│       01-10 Jun · 10 dias          │
│       Planejamento                  │
│                                     │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─      │
│                                     │
│  ▼ MEMÓRIAS (2)                     │
│  │                                  │
│  ├─✓ 🇧🇷 Serra Gaúcha 2023        │
│  │                                  │
│  └─✓ 🇦🇷 Buenos Aires 2023        │
│                                     │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │  + Planejar Nova Viagem    │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                     │
└─────────────────────────────────────┘
```

## Elementos-Chave

### 1. Header Diferenciado
- Título "MINHAS JORNADAS" (não "Folio")
- Botão de busca/filtro
- Botão de criar viagem no header

### 2. Timeline Visual
- Linha vertical conectando viagens
- Dots preenchidos (●) para ativas
- Dots vazios (○) para última da seção
- Check (✓) para arquivadas/concluídas

### 3. Cards de Viagem Compactos
- Emoji do país
- Nome da viagem
- Período (datas)
- Duração
- Mini progress bar inline
- Status textual ("Planejamento", "Em andamento", etc.)

### 4. Seção "Memórias"
- Colapsável por padrão
- Visual sépia/opacity reduzida
- Contador no título
- Ações: Restaurar, Deletar

### 5. Empty State
Se não houver viagens:
```
     🗺️
    ╱  ╲
   📍  📍

"Nenhuma jornada ainda"
"Comece a planejar sua primeira aventura"

[+ Criar Viagem]
```

## Diferenças da Home

| Aspecto | Home | Itinerary |
|---------|------|-----------|
| Header | Logo Folio + saudação | "Minhas Jornadas" + ações |
| Viagem destaque | DepartureBoard (1 hero) | Nenhum destaque |
| Lista de viagens | ❌ | ✅ Todas com timeline |
| Próxima atividade | ✅ Preview | ❌ |
| Atalhos rápidos | ✅ 3 cards | ❌ |
| Arquivadas | ❌ | ✅ Seção "Memórias" |
| Progress bar | No DepartureBoard | Mini em cada trip |
| Criar viagem | Via atalho | Botão principal |

## Componentes Necessários

### Novo: `TripTimelineCard`
Card compacto para lista com:
- Timeline connector (linha + dot)
- Emoji + título
- Meta info (datas, duração)
- Mini progress bar
- Status badge opcional

### Novo: `TimelineConnector`
Elemento visual da linha vertical:
- Variantes: first, middle, last
- Estados: active, completed, pending

### Existente: `PerforatedDivider`
Usar entre seções Ativas e Memórias

## Interações

- **Tap no card**: Navega para `/itinerary/{tripId}`
- **Long press**: Menu de ações (Arquivar, Duplicar, Deletar)
- **Swipe left**: Revelar ações rápidas
- **Pull to refresh**: Recarregar lista (se houver sync futuro)

## Animações

- Stagger fade-up nos cards ao carregar
- Collapse/expand suave na seção Memórias
- Progress bar animada no primeiro render

## Próximos Passos

1. [x] Criar componente `TripTimelineCard`
2. [x] Criar componente `TimelineConnector` (integrado no TripTimelineCard)
3. [x] Refatorar `/itinerary/_index.tsx`
4. [x] Implementar seção colapsável "Memórias"
5. [ ] Adicionar busca/filtro (futuro)
