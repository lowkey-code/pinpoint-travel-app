# Usando Commitizen (GUI) no projeto Pinpoint

Este guia mostra como instalar e usar a interface amigável do Commitizen no projeto.

Requisitos
- Node >= 20.19 (veja `package.json`)
- yarn (v1.x) ou `npx` disponível

Passos de instalação (usar `yarn`):

1. Instalar dependências dev
```bash
yarn add -D commitizen cz-conventional-changelog
```

2. Inicializar (opcional, alternativo ao passo acima)
```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

3. Já adicionado no `package.json`:
- `config.commitizen.path` apontando para `cz-conventional-changelog`
- script `commit` que executa `git-cz`

Usar a interface CLI (fluxo interativo)
- Rode:
```bash
yarn commit
# ou
npx git-cz
```
- Siga os prompts para escolher `type`, `scope`, `subject`, `body`, `breaking` e `issues`.

Usar GUI dentro do VS Code (opcional)
- Instale a extensão "Commitizen" (`vscode-commitizen`) no VS Code.
- Abra o Command Palette (Ctrl+Shift+P) e execute `Commitizen: Commit`.
- A extensão mostra um formulário/GUI semelhante aos prompts e cria o commit seguindo a convenção.

Commitlint (removido)
- Este projeto agora usa apenas Commitizen para criar mensagens de commit. O `commitlint` e seu hook foram removidos para simplificar o fluxo.
- Use `yarn commit` ou `npx git-cz` para garantir mensagens no formato convencional.

Dicas rápidas
- Para pular a interface e criar um commit manualmente: `git commit -m "feat: mensagem"` (mas pode ser bloqueado por husky/commitlint hooks).
- Para usar sem instalação global: `npx git-cz`.

Se quiser, eu instalo as dependências dev agora e deixo tudo pronto para você usar.  
