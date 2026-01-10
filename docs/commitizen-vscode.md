# Commitizen no VS Code (vscode-commitizen)

Este guia mostra como instalar e configurar a extensão `vscode-commitizen` no VS Code e como usar a interface para criar commits convencionais.

Passo 1 — Instalar a extensão
- Abra o VS Code.
- Vá para a aba Extensions (Ctrl+Shift+X) e pesquise por `Commitizen` (autor: `vadimcn`).
- Clique em `Install`.
- Alternativamente, da linha de comando do VS Code:
  - `code --install-extension vadimcn.vscode-commitizen`

Passo 2 — Recomendações de workspace
- O repositório já inclui um arquivo de recomendações de extensões:
  - File: .vscode/extensions.json
  - Abra e clique em `Install` quando o VS Code sugerir instalar extensões recomendadas.

Passo 3 — Configurar a extensão
- O workspace tem `.vscode/settings.json` com configurações recomendadas:
  - `commitizen.adapter`: `cz-customizable`
  - `commitizen.customConfig`: `.cz-config.js`
- Se quiser editar as configurações globalmente, abra `Settings` → procure `commitizen` e ajuste.

Passo 4 — Usar a GUI da extensão
- Abra o Command Palette (Ctrl+Shift+P) e execute `Commitizen: Commit`.
- A interface mostra campos para `type`, `scope`, `subject`, `body`, `breaking` e `issues`.
- Preencha e confirme; a extensão chamará `git-cz` para criar o commit.

Passo 5 — Capturando screenshots (instruções)
- Abra o Command Palette e execute `Commitizen: Commit`.
- No macOS: `Cmd+Shift+4` e selecione a área.
- No Windows: `Win+Shift+S` e selecione a área.
- No Linux (GNOME): `PrtSc` ou use `gnome-screenshot`.
- Salve a imagem em `docs/screenshots/commitizen-01.png` e adicione a referência no final deste arquivo Markdown.

Passo 6 — Verificação rápida
- Rode `yarn commit` no terminal para usar a interface CLI como fallback.
- Ou `npx git-cz`.

Observações
- O workspace já está configurado para usar `cz-customizable` com `.cz-config.js`.
- Se a extensão não abrir o prompt esperado, verifique se `commitizen` está instalado nas dependências dev do projeto.

Exemplo de uso (linha de comando):
```bash
# interativo dentro do repositório
yarn commit
```

Se quiser, eu posso:
- Gerar imagens de exemplo localmente (simuladas) e adicioná-las em `docs/screenshots/`.
- Fornecer um pequeno GIF com o fluxo (emulando a interface) para documentação.

