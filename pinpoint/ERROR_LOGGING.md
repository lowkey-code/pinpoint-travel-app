# Sistema de Captura de Erros - Documentação

Este documento explica como o sistema automático de captura de erros funciona na aplicação Pinpoint.

## O que foi implementado?

Um sistema centralizado que captura automaticamente:

1. **Erros JavaScript globais** - Qualquer erro não tratado
2. **Rejeições de Promises** - Promises que rejeitam sem tratamento
3. **Erros React** - Erros que ocorrem no render e lifecycle
4. **Erros da Aplicação** - Erros capturados e logados manualmente

## Arquitetura

```
┌─────────────────────────────────────────┐
│  Aplicação                              │
└────────────┬────────────────────────────┘
             │
    ┌────────▼────────┐
    │  Error Boundary │ (Captura erros React)
    └────────┬────────┘
             │
    ┌────────▼─────────────────┐
    │   errorLogger.logError   │ (API centralizada)
    └────────┬─────────────────┘
             │
    ┌────────▼──────────┐
    │  useErrorsStore   │ (Zustand Store)
    │  (Persistência)   │
    └────────┬──────────┘
             │
    ┌────────▼──────────────┐
    │  Storage Universal    │
    │  (MMKV/AsyncStorage)  │
    └───────────────────────┘
```

## Como usar

### 1. Captura Automática

Erros não tratados são capturados automaticamente:

```typescript
// Erro JavaScript não tratado
throw new Error('Algo deu errado!');  // ✅ Capturado automaticamente

// Promise rejeitada não tratada
Promise.reject('Erro na promise');  // ✅ Capturado automaticamente
```

### 2. Logging Manual com Hook

Use o hook `useErrorLogger` em seus componentes:

```typescript
import { useErrorLogger } from '../hooks/useErrorLogger';

export function MyComponent() {
    const { logError } = useErrorLogger();

    const handleSave = async () => {
        try {
            await saveData();
        } catch (error) {
            logError(error as Error, {
                source: 'app',
                context: {
                    action: 'saveData',
                    userId: '123'
                }
            });
        }
    };

    return <button onPress={handleSave}>Salvar</button>;
}
```

### 3. Logging Direto com `errorLogger`

Para uso em contextos onde hooks não estão disponíveis:

```typescript
import { errorLogger } from '../lib/errorLogger';

try {
    someAsyncOperation();
} catch (error) {
    errorLogger.logError(error as Error, {
        source: 'app',
        context: { operationName: 'someAsyncOperation' }
    });
}
```

### 4. Acessar Logs de Erros

Os erros são armazenados no Zustand store e persistem no storage:

```typescript
import { useErrorsStore } from '../lib/stores/errors.store';

export function ErrorDashboard() {
    const { errors, clearErrors, removeError } = useErrorsStore();

    return (
        <div>
            <p>Total de erros: {errors.length}</p>
            {errors.map(error => (
                <div key={error.id}>
                    <p>{error.message}</p>
                    <button onClick={() => removeError(error.id)}>Remover</button>
                </div>
            ))}
            <button onClick={clearErrors}>Limpar Tudo</button>
        </div>
    );
}
```

## Tela de Erros

A aplicação tem uma tela dedicada para visualizar todos os erros capturados:

**Acesso:** Home → Botão "Ver Logs de Erros" → `/errors`

**Funcionalidades:**
- Lista todos os erros capturados (máximo 100)
- Mostra timestamp, fonte do erro, mensagem e stack trace
- Contexto adicional quando disponível
- Remover erros individuais
- Limpar todos os erros
- Tema responsivo (light/dark)

## Campos de um Erro

Cada erro capturado contém:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID único do erro |
| `message` | string | Mensagem de erro |
| `stack` | string \| undefined | Stack trace (quando disponível) |
| `source` | string | Fonte: 'javascript' \| 'promise' \| 'react' \| 'app' |
| `timestamp` | Date | Quando o erro ocorreu |
| `context` | object | Dados adicionais sobre o contexto |

## Exemplo Prático Completo

```typescript
import React, { useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useErrorLogger } from '../hooks/useErrorLogger';

export function ApiExample() {
    const { logError } = useErrorLogger();

    const fetchUserData = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            logError(error as Error, {
                source: 'app',
                context: {
                    action: 'fetchUserData',
                    userId,
                    timestamp: new Date().toISOString()
                }
            });
            throw error;
        }
    }, [logError]);

    return (
        <TouchableOpacity onPress={() => fetchUserData('123')}>
            <Text>Buscar Dados do Usuário</Text>
        </TouchableOpacity>
    );
}
```

## Persistência

Os erros são automaticamente persistidos usando:
- **Web:** `localStorage`
- **iOS/Android (Produção):** `MMKV`
- **iOS/Android (Fallback):** `AsyncStorage`

Os erros persistem mesmo após recarregar a aplicação, até que você limpe manualmente.

## Limitações

- Máximo de 100 erros armazenados (os mais recentes)
- Erros são capturados apenas após a inicialização do `errorLogger`
- Stack traces podem ser diferentes dependendo do ambiente (web vs native)

## Debug

Para ver todos os erros no console de desenvolvimento:

```typescript
import { useErrorsStore } from '../lib/stores/errors.store';

// Em qualquer componente
useEffect(() => {
    const unsubscribe = useErrorsStore.subscribe(
        (state) => state.errors,
        (errors) => console.log('Novos erros:', errors)
    );
    return unsubscribe;
}, []);
```

## Integração com Serviços Externos

Para enviar erros a um serviço externo (Sentry, LogRocket, etc):

```typescript
import { useErrorsStore } from '../lib/stores/errors.store';

// Em algum inicializador ou useEffect global
useEffect(() => {
    const unsubscribe = useErrorsStore.subscribe(
        (state) => state.errors,
        (errors) => {
            if (errors.length > 0) {
                const latestError = errors[0];
                // Enviar para seu serviço
                fetch('/api/errors', {
                    method: 'POST',
                    body: JSON.stringify(latestError)
                });
            }
        }
    );
    return unsubscribe;
}, []);
```
