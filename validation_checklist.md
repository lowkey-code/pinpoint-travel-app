# 📋 Checklist de Validação Cross-Platform

## 🌐 Web
**Comando:** `cd pinpoint && yarn dev:web`

- [ ] **Console**: App carrega sem erros de runtime ou alertas de compilação.
- [ ] **Tema**: O toggle de tema (Sol/Lua) alterna cores instantaneamente.
- [ ] **Persistência**: Ao adicionar um lugar e dar Refresh (F5), o dado continua lá (via `localStorage`).
- [ ] **Renderização**: Componentes Tamagui (Sheets, Buttons, Cards) mantêm a fidelidade visual.
- [ ] **URL**: A barra de endereços reflete as rotas do Expo Router corretamente.
- [ ] **Responsividade**: Layout se ajusta ao redimensionar a janela do browser.

## 🍎 iOS (Simulador ou Device)
**Comando:** `cd pinpoint && yarn dev:ios`

- [ ] **Cold Start**: App inicia corretamente no Simulator/iPhone sem crashar no splash.
- [ ] **Safe Areas**: O cabeçalho não fica sob o Notch e o FAB não fica sob a Home Indicator bar.
- [ ] **Interações**: Gestos de "swipe to back" do iOS funcionam entre telas.
- [ ] **MMKV**: Fechar o app (matar o processo) e reabrir mantém os lugares salvos.
- [ ] **Clipboard**: Ao clicar em "Copiar Endereço", o texto está disponível no Cmd+V do Mac (se usando Handoff) ou em outros apps do iOS.
- [ ] **Deep Linking**: Botão "Abrir AMap" dispara a URL corretamente (abre o browser ou o app se instalado).

## 🤖 Android (Emulador ou Device)
**Comando:** `cd pinpoint && yarn dev:android`

- [ ] **Cold Start**: App inicia sem erros de Gradle ou runtime no Android Studio Emulator.
- [ ] **Hardware Back**: O botão físico/virtual de "Voltar" do Android fecha os Sheets/Modais corretamente.
- [ ] **MMKV**: Persistência de dados validada após limpar o app da lista de recentes.
- [ ] **Clipboard**: Toast de confirmação ou validação de cópia funciona via `expo-clipboard`.
- [ ] **Deep Linking**: Intent do Android abre o navegador ou app de mapas configurado.
- [ ] **Performance**: Scroll da lista de lugares flui suavemente (60 FPS).

---

## 🛠 Comandos de Execução

| Plataforma | Comando de Desenvolvimento | Comando de Build |
| :--- | :--- | :--- |
| **Geral / Metro** | `yarn dev` | - |
| **Web** | `yarn dev:web` | `yarn build:web` |
| **iOS** | `yarn dev:ios` | `eas build --platform ios` |
| **Android** | `yarn dev:android` | `eas build --platform android` |
