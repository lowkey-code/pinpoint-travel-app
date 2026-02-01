# Folio - Fluxos do Aplicativo

Documentação de todos os fluxos e ações possíveis no aplicativo.

---

## 1. Home Screen

| ID | Ação | Descrição |
|----|------|-----------|
| 1.1 | Visualizar home | Página inicial com título e navegação |
| 1.2 | Criar nova viagem | Botão para iniciar criação de viagem |
| 1.3 | Acessar configurações | Link para página de ajustes |
| 1.4 | Ver viagens existentes | Lista de viagens criadas |
| 1.5 | Abrir viagem | Clicar em uma viagem para visualizar |

---

## 2. Gestão de Viagens

| ID | Ação | Descrição |
|----|------|-----------|
| 2.1 | Criar viagem simples | Apenas com nome obrigatório |
| 2.2 | Criar viagem completa | Com nome, descrição, datas |
| 2.3 | Editar viagem | Alterar dados da viagem |
| 2.4 | Arquivar viagem | Mover para arquivados |
| 2.5 | Exportar viagem | Gerar arquivo JSON |
| 2.6 | Importar viagem | Carregar de arquivo JSON |
| 2.7 | Duplicar viagem | Criar cópia da viagem |
| 2.8 | Deletar viagem | Remover permanentemente |

---

## 3. Day View (Visão Diária)

| ID | Ação | Descrição |
|----|------|-----------|
| 3.1 | Navegar próximo dia | Seta para direita |
| 3.2 | Navegar dia anterior | Seta para esquerda |
| 3.3 | Selecionar segmento manhã | Tab manhã |
| 3.4 | Selecionar segmento tarde | Tab tarde |
| 3.5 | Selecionar segmento noite | Tab noite |
| 3.6 | Ir para grid view | Botão de grade |
| 3.7 | Abrir calendário | Seletor de data |
| 3.8 | Voltar para lista | Via bookmark menu |

---

## 4. Item CRUD

| ID | Ação | Descrição |
|----|------|-----------|
| 4.1 | Adicionar atividade | Tipo padrão de item |
| 4.2 | Adicionar item rápido | Item simplificado (quick) |
| 4.3 | Adicionar hospedagem | Item tipo stay |
| 4.4 | Adicionar transporte | Item tipo transport |
| 4.5 | Adicionar day trip | Atividade de dia inteiro |
| 4.6 | Editar item | Via menu de contexto |
| 4.7 | Deletar item | Com confirmação |
| 4.8 | Converter quick → atividade | Expandir item rápido |

---

## 5. Campos do Item

| ID | Ação | Descrição |
|----|------|-----------|
| 5.1 | Definir título | Nome do item |
| 5.2 | Escolher tipo | Activity, transport, stay, quick, dayTrip |
| 5.3 | Selecionar emoji/ícone | Ícone personalizado |
| 5.4 | Definir horário | Label de tempo |
| 5.5 | Definir duração | Texto livre |
| 5.6 | Definir custo | Texto livre |
| 5.7 | Definir endereço | Texto livre |
| 5.8 | Definir cidade | Para multi-cidade |
| 5.9 | Adicionar notas | Texto longo |
| 5.10 | Adicionar links | URLs relacionadas |
| 5.11 | Coordenadas GPS | Latitude/longitude |

---

## 6. Status e Prioridade

| ID | Ação | Descrição |
|----|------|-----------|
| 6.1 | Status: Planejado | Estado inicial |
| 6.2 | Status: Feito | Marcar como concluído |
| 6.3 | Status: Pulado | Marcar como ignorado |
| 6.4 | Prioridade: Normal | Sem destaque |
| 6.5 | Prioridade: Importante | Destaque médio |
| 6.6 | Prioridade: Imperdível | Destaque máximo |

---

## 7. Undo/Redo

| ID | Ação | Descrição |
|----|------|-----------|
| 7.1 | Desfazer ação | Ctrl+Z ou botão |
| 7.2 | Refazer ação | Ctrl+Y ou botão |
| 7.3 | Histórico de 10 ações | Stack limitado |

---

## 8. Grid View (Visão em Grade)

| ID | Ação | Descrição |
|----|------|-----------|
| 8.1 | Visualizar todos os dias | Colunas por dia |
| 8.2 | Clicar em dia | Navegar para day view |
| 8.3 | Modo reordenação | Arrastar itens entre dias |
| 8.4 | Voltar para day view | Botão de lista |

---

## 9. Reordenação

| ID | Ação | Descrição |
|----|------|-----------|
| 9.1 | Mover item para cima | Dentro do segmento |
| 9.2 | Mover item para baixo | Dentro do segmento |
| 9.3 | Mover entre segmentos | Manhã ↔ Tarde ↔ Noite |
| 9.4 | Mover entre dias | Via grid view |

---

## 10. Card Actions

| ID | Ação | Descrição |
|----|------|-----------|
| 10.1 | Abrir menu de contexto | Três pontos |
| 10.2 | Copiar endereço | Se disponível |
| 10.3 | Copiar link | Se disponível |
| 10.4 | Ver no mapa | Se coordenadas |

---

## 11. Transporte

| ID | Ação | Descrição |
|----|------|-----------|
| 11.1 | Definir origem | Cidade de partida |
| 11.2 | Definir destino | Cidade de chegada |
| 11.3 | Horário partida | Campo "Horário" do formulário (usa data do dia) |
| 11.4 | Duração | Campo "Duração" do formulário |
| 11.5 | Chegada calculada | Auto-calculada: partida + duração |
| 11.6 | Ajuste manual chegada | Permite editar data/hora de chegada |
| 11.7 | Ghost card transporte | Indicador "Em trânsito" em outros segmentos |
| 11.8 | Ver item principal | Navegar do ghost para o card original |

### Comportamento de Cálculo Automático

O campo de chegada é calculado automaticamente com base no horário de partida e duração.

**Regra UX:** Se o usuário editar manualmente a chegada e depois alterar o horário ou duração, a chegada será **recalculada automaticamente**.

Isso segue o padrão de apps de viagem (Google Flights, Kayak) onde:
- Edição manual = ajuste fino (última etapa)
- Mudança em partida/duração = expectativa de recálculo

---

## 12. Ghost Cards (Day Trip)

| ID | Ação | Descrição |
|----|------|-----------|
| 12.1 | Day trip cobre segmentos | Ghost cards nos segmentos cobertos |
| 12.2 | Ver item principal | Navegar do ghost para o card original |

---

## 13. Hospedagem

| ID | Ação | Descrição |
|----|------|-----------|
| 13.1 | Definir hotel | Nome do local |
| 13.2 | Café incluso | Toggle de breakfast |

---

## 14. Configurações

| ID | Ação | Descrição |
|----|------|-----------|
| 14.1 | Trocar tema | Parchment ↔ Blueprint |
| 14.2 | Tema automático | Seguir sistema |
| 14.3 | Instalar PWA | Adicionar à home screen |
| 14.4 | Ver instruções iOS | Manual para Safari |

---

## 15. Navegação (Mobile)

| ID | Ação | Descrição |
|----|------|-----------|
| 15.1 | Bottom nav: Início | Ir para home |
| 15.2 | Bottom nav: Viagens | Ir para lista |
| 15.3 | Bottom nav: Ajustes | Ir para settings |

---

## 16. Empty States

| ID | Ação | Descrição |
|----|------|-----------|
| 16.1 | Lista vazia | CTA para criar viagem |
| 16.2 | Segmento vazio | Botão para adicionar item |
| 16.3 | Dia vazio | Indicador visual |

---

## 17. Persistência

| ID | Ação | Descrição |
|----|------|-----------|
| 17.1 | Auto-save | Debounce de 500ms |
| 17.2 | Persistir no reload | localStorage |
| 17.3 | Offline-first | Funciona sem internet |

---

## Testes E2E

**Arquivo:** `tests/full-flows.spec.ts`
**Total:** 44 testes cobrindo os fluxos principais

```bash
npm run test:e2e              # Rodar todos
npm run test:e2e -- --grep "4.4"  # Teste específico
npm run test:e2e -- --headed      # Modo visual
```
