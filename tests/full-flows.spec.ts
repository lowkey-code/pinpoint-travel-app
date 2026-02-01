import { test, expect } from "@playwright/test"
import type { Page } from "@playwright/test"

// ============================================
// TEST SETUP
// ============================================

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])

  // Mock clipboard
  await page.addInitScript(() => {
    const clipboardStore = { value: "" }
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          clipboardStore.value = text
          return Promise.resolve()
        },
        readText: () => Promise.resolve(clipboardStore.value),
      },
      configurable: true,
    })
  })

  // Clear localStorage before the first navigation
  await page.goto("/", { waitUntil: "networkidle" })
  await page.evaluate(() => localStorage.clear())
})

// ============================================
// HELPERS
// ============================================

async function createTrip(page: Page, name: string, options?: { description?: string }) {
  await page.goto("/itinerary", { waitUntil: "networkidle" })
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 })

  await page.getByTestId("create-trip-button").click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()

  await dialog.getByLabel("Nome da viagem").fill(name)

  if (options?.description) {
    await dialog.getByLabel("Descrição").fill(options.description)
  }

  await dialog.getByRole("button", { name: "Criar Viagem" }).click()
  await expect(page).toHaveURL(/\/itinerary\//)
}

async function addItem(page: Page, options: {
  title: string
  type?: "activity" | "dayTrip" | "transport" | "stay" | "quick"
  address?: string
  city?: string
  notes?: string
  timeLabel?: string
}) {
  await page.getByTestId("add-item-button").first().click()

  const drawer = page.getByTestId("item-drawer")
  await expect(drawer).toBeVisible()

  if (options.type) {
    await drawer.getByTestId(`item-type-${options.type}`).click()
  }

  await drawer.getByTestId("item-title-input").fill(options.title)

  if (options.address) {
    await drawer.getByTestId("item-address-input").fill(options.address)
  }

  if (options.city) {
    await drawer.getByTestId("item-city-input").fill(options.city)
  }

  if (options.notes) {
    await drawer.getByTestId("item-notes-input").fill(options.notes)
  }

  if (options.timeLabel) {
    await drawer.getByTestId("item-time-input").fill(options.timeLabel)
  }

  await drawer.getByTestId("save-item").click()
  await expect(drawer).toBeHidden()
}

async function openBookmarkMenu(page: Page) {
  const menuButton = page.getByLabel("Menu de ações")
  await menuButton.click()
  await page.waitForTimeout(350)
}

async function getItemId(page: Page, title: string): Promise<string | null> {
  const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: title })
  const cardTestId = await itemCard.getAttribute("data-testid")
  return cardTestId?.replace("itinerary-card-", "") || null
}

// ============================================
// FLOW 1: HOME PAGE
// ============================================

test.describe("Flow 1: Home Page", () => {
  test("1.1 - Home page loads with greeting", async ({ page }) => {
    await page.goto("/")

    // Should show greeting based on time of day
    const greeting = page.locator("text=/Bom dia|Boa tarde|Boa noite/")
    await expect(greeting).toBeVisible({ timeout: 10000 })
  })

  test("1.2 - Home shows empty state when no trips", async ({ page }) => {
    await page.goto("/")

    // Should show call to action button
    await expect(page.getByRole("button", { name: /planejar|viagem/i })).toBeVisible({ timeout: 10000 })
  })

  test("1.3 - Navigate to trips from home via URL", async ({ page }) => {
    await page.goto("/")
    await page.goto("/itinerary")
    await expect(page).toHaveURL("/itinerary")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("1.4 - Navigate to settings via URL", async ({ page }) => {
    await page.goto("/settings")
    await expect(page).toHaveURL("/settings")
  })
})

// ============================================
// FLOW 2: TRIP MANAGEMENT
// ============================================

test.describe("Flow 2: Trip Management", () => {
  test("2.1 - Create trip with name only", async ({ page }) => {
    await createTrip(page, "Viagem Teste")
    await expect(page.locator("text=Viagem Teste")).toBeVisible()
  })

  test("2.2 - Create trip with name and description", async ({ page }) => {
    await createTrip(page, "Férias de Verão", { description: "Roteiro pela Europa" })
    await expect(page.locator("text=Férias de Verão")).toBeVisible()
  })

  test("2.3 - Trip persists after page reload", async ({ page }) => {
    await createTrip(page, "Viagem Persistente")

    // Wait for debounced save (500ms + buffer)
    await page.waitForTimeout(700)

    // Reload the page
    await page.reload({ waitUntil: "networkidle" })

    // Should still see trip content
    await expect(page.getByTestId("current-day-label")).toBeVisible({ timeout: 10000 })
  })

  test("2.4 - Navigate back to trips list via bookmark menu", async ({ page }) => {
    await createTrip(page, "Viagem Navegação")

    await openBookmarkMenu(page)
    await page.getByRole("button", { name: /voltar ao início/i }).click()

    await expect(page).toHaveURL("/itinerary")
  })
})

// ============================================
// FLOW 3: DAY VIEW NAVIGATION
// ============================================

test.describe("Flow 3: Day View Navigation", () => {
  test("3.1 - Day header shows correct day number", async ({ page }) => {
    await createTrip(page, "Viagem Day View")

    await expect(page.getByTestId("current-day-label")).toContainText("01")
  })

  test("3.2 - Segment tabs are visible", async ({ page }) => {
    await createTrip(page, "Viagem Segments")

    await expect(page.getByTestId("segment-tab-morning")).toBeVisible()
    await expect(page.getByTestId("segment-tab-afternoon")).toBeVisible()
    await expect(page.getByTestId("segment-tab-evening")).toBeVisible()
  })

  test("3.3 - Switch between segments", async ({ page }) => {
    await createTrip(page, "Viagem Switch Segment")

    // Add item to morning
    await page.getByTestId("segment-tab-morning").click()
    await addItem(page, { title: "Atividade Manhã" })

    // Switch to afternoon
    await page.getByTestId("segment-tab-afternoon").click()

    // Morning item should not be visible (different segment)
    await expect(page.locator('[data-testid^="itinerary-card-"]', { hasText: "Atividade Manhã" })).toBeHidden()

    // Switch back to morning
    await page.getByTestId("segment-tab-morning").click()
    await expect(page.getByText("Atividade Manhã")).toBeVisible()
  })

  test("3.4 - Navigate to grid view", async ({ page }) => {
    await createTrip(page, "Viagem Grid Nav")

    // Look for grid button in GateHeader
    const gridButton = page.getByRole("button", { name: /grade/i })
    await gridButton.click()

    await expect(page).toHaveURL(/\/grid$/)
  })
})

// ============================================
// FLOW 4: ITEM CRUD
// ============================================

test.describe("Flow 4: Item CRUD Operations", () => {
  test("4.1 - Add activity item", async ({ page }) => {
    await createTrip(page, "Viagem CRUD")

    await addItem(page, {
      title: "Visita ao Museu",
      type: "activity",
      address: "Rua do Museu, 123"
    })

    await expect(page.getByText("Visita ao Museu")).toBeVisible()
  })

  test("4.2 - Add quick item", async ({ page }) => {
    await createTrip(page, "Viagem Quick")

    await addItem(page, {
      title: "Lembrete rápido",
      type: "quick"
    })

    await expect(page.getByText("Lembrete rápido")).toBeVisible()
  })

  test("4.3 - Add stay item", async ({ page }) => {
    await createTrip(page, "Viagem Stay")

    await addItem(page, {
      title: "Hotel Central",
      type: "stay"
    })

    await expect(page.getByText("Hotel Central")).toBeVisible()
  })

  test("4.4 - Edit item title via menu", async ({ page }) => {
    await createTrip(page, "Viagem Edit")

    await addItem(page, { title: "Item Original" })

    const itemId = await getItemId(page, "Item Original")
    if (itemId) {
      // Open menu and click edit
      await page.getByTestId(`item-menu-${itemId}`).click()

      // Wait for menu to be visible
      const editMenuItem = page.getByRole("menuitem", { name: /editar/i })
      await expect(editMenuItem).toBeVisible()
      await editMenuItem.click()

      // Wait for drawer to open (edit drawer has different testid)
      const drawer = page.getByTestId(`edit-item-drawer-${itemId}`)
      await expect(drawer).toBeVisible({ timeout: 5000 })

      // Edit the title (use drawer scope to avoid conflicts)
      await drawer.getByTestId("item-title-input").fill("Item Editado")
      await drawer.getByTestId("save-item").click()

      await expect(page.getByText("Item Editado")).toBeVisible()
    }
  })

  test("4.5 - Delete item with confirm dialog", async ({ page }) => {
    await createTrip(page, "Viagem Delete")

    await addItem(page, { title: "Item para Deletar" })
    await expect(page.getByText("Item para Deletar")).toBeVisible()

    const itemId = await getItemId(page, "Item para Deletar")
    if (itemId) {
      // Set up dialog handler before triggering delete
      page.on("dialog", async dialog => {
        expect(dialog.type()).toBe("confirm")
        await dialog.accept()
      })

      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menuitem", { name: /deletar/i }).click()

      await expect(page.getByText("Item para Deletar")).toBeHidden({ timeout: 5000 })
    }
  })
})

// ============================================
// FLOW 5: ITEM STATUS & PRIORITY
// ============================================

test.describe("Flow 5: Item Status & Priority", () => {
  test("5.1 - Change status to Done", async ({ page }) => {
    await createTrip(page, "Viagem Status")

    await addItem(page, { title: "Item Status Test" })

    const itemId = await getItemId(page, "Item Status Test")
    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Status").click()
      await page.getByRole("menuitem", { name: /feito/i }).click()

      const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Item Status Test" })
      await expect(itemCard.getByText("Feito")).toBeVisible()
    }
  })

  test("5.2 - Change status to Skipped", async ({ page }) => {
    await createTrip(page, "Viagem Skipped")

    await addItem(page, { title: "Item Skipped Test" })

    const itemId = await getItemId(page, "Item Skipped Test")
    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Status").click()
      await page.getByRole("menuitem", { name: /pulado/i }).click()

      const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Item Skipped Test" })
      await expect(itemCard.getByText("Pulado")).toBeVisible()
    }
  })

  test("5.3 - Set priority to Important", async ({ page }) => {
    await createTrip(page, "Viagem Priority")

    await addItem(page, { title: "Item Priority Test" })

    const itemId = await getItemId(page, "Item Priority Test")
    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: /importante/i }).click()

      const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Item Priority Test" })
      await expect(itemCard.getByText("Importante")).toBeVisible()
    }
  })

  test("5.4 - Set priority to Must-See", async ({ page }) => {
    await createTrip(page, "Viagem Must See")

    await addItem(page, { title: "Item Must See" })

    const itemId = await getItemId(page, "Item Must See")
    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: /imperdível/i }).click()

      const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Item Must See" })
      await expect(itemCard.getByText("Imperdível")).toBeVisible()
    }
  })
})

// ============================================
// FLOW 6: UNDO/REDO
// ============================================

test.describe("Flow 6: Undo/Redo", () => {
  test("6.1 - Undo add item", async ({ page }) => {
    await createTrip(page, "Viagem Undo")

    await addItem(page, { title: "Item para Undo" })
    await expect(page.getByText("Item para Undo")).toBeVisible()

    await openBookmarkMenu(page)
    await page.getByTestId("undo-button").click()

    await expect(page.getByText("Item para Undo")).toBeHidden()
  })

  test("6.2 - Redo undone action", async ({ page }) => {
    await createTrip(page, "Viagem Redo")

    await addItem(page, { title: "Item para Redo" })

    await openBookmarkMenu(page)
    await page.getByTestId("undo-button").click()
    await expect(page.getByText("Item para Redo")).toBeHidden()

    await openBookmarkMenu(page)
    await page.getByTestId("redo-button").click()
    await expect(page.getByText("Item para Redo")).toBeVisible()
  })

  test("6.3 - Undo button disabled when no history", async ({ page }) => {
    await createTrip(page, "Viagem No History")

    await openBookmarkMenu(page)
    const undoButton = page.getByTestId("undo-button")

    // Should be disabled or have disabled styling
    await expect(undoButton).toHaveClass(/disabled|opacity-40/)
  })
})

// ============================================
// FLOW 7: EXPORT/IMPORT
// ============================================

test.describe("Flow 7: Export/Import", () => {
  test("7.1 - Export trip generates JSON file", async ({ page }) => {
    await createTrip(page, "Viagem Export Test")
    await addItem(page, { title: "Item Exportado" })

    await openBookmarkMenu(page)

    const downloadPromise = page.waitForEvent("download")
    await page.getByTestId("export-button").click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain("viagem-export-test")
    expect(download.suggestedFilename()).toMatch(/\.json$/)
  })
})

// ============================================
// FLOW 8: GRID VIEW
// ============================================

test.describe("Flow 8: Grid View", () => {
  test("8.1 - Grid view shows days as columns", async ({ page }) => {
    await createTrip(page, "Viagem Grid")
    await addItem(page, { title: "Item Grid" })

    // Navigate to grid
    const gridButton = page.getByRole("button", { name: /grade/i })
    await gridButton.click()

    await expect(page).toHaveURL(/\/grid$/)
    await expect(page.getByText("Visão Geral")).toBeVisible()
  })

  test("8.2 - Grid view has reorder button", async ({ page }) => {
    await createTrip(page, "Viagem Reorder")

    const gridButton = page.getByRole("button", { name: /grade/i })
    await gridButton.click()

    await expect(page.getByRole("button", { name: /reordenar/i })).toBeVisible()
  })

  test("8.3 - Click day column navigates to day view", async ({ page }) => {
    await createTrip(page, "Viagem Day Click")

    const gridButton = page.getByRole("button", { name: /grade/i })
    await gridButton.click()

    // Click on day header should navigate back
    const dayHeader = page.locator("button", { hasText: /Dia 1/i })
    if (await dayHeader.isVisible()) {
      await dayHeader.click()
      await expect(page).not.toHaveURL(/\/grid$/)
    }
  })
})

// ============================================
// FLOW 9: SETTINGS
// ============================================

test.describe("Flow 9: Settings", () => {
  test("9.1 - Settings page loads", async ({ page }) => {
    await page.goto("/settings")

    // Should show settings heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("9.2 - Theme section is visible", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" })

    // Should have theme section with "Aparência" heading
    await expect(page.getByRole("heading", { name: /aparência/i })).toBeVisible({ timeout: 5000 })
  })
})

// ============================================
// FLOW 10: NAVIGATION (Mobile viewport)
// ============================================

test.describe("Flow 10: Bottom Navigation", () => {
  // Use mobile viewport for these tests since BottomNav has md:hidden
  test.use({ viewport: { width: 375, height: 667 } })

  test("10.1 - Bottom nav is visible on mobile", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("navigation")).toBeVisible()
  })

  test("10.2 - Nav links work on mobile", async ({ page }) => {
    await page.goto("/")

    // Navigate to trips
    await page.getByRole("link", { name: /viagens/i }).click()
    await expect(page).toHaveURL("/itinerary")

    // Navigate to settings
    await page.getByRole("link", { name: /ajustes/i }).click()
    await expect(page).toHaveURL("/settings")

    // Navigate to home
    await page.getByRole("link", { name: /início/i }).click()
    await expect(page).toHaveURL("/")
  })
})

// ============================================
// FLOW 11: CARD ACTIONS
// ============================================

test.describe("Flow 11: Card Actions", () => {
  test("11.1 - Item with address shows on card", async ({ page }) => {
    await createTrip(page, "Viagem Copy")

    await addItem(page, {
      title: "Item com Endereço",
      address: "Rua Teste, 123, Centro"
    })

    // Card should show address
    await expect(page.getByText("Rua Teste, 123, Centro")).toBeVisible()
  })
})

// ============================================
// FLOW 12: EMPTY STATES
// ============================================

test.describe("Flow 12: Empty States", () => {
  test("12.1 - Empty trips list shows call to action", async ({ page }) => {
    await page.goto("/itinerary")

    // Should show create trip button
    await expect(page.getByTestId("create-trip-button")).toBeVisible()
  })

  test("12.2 - Empty segment shows add button", async ({ page }) => {
    await createTrip(page, "Viagem Empty Segment")

    // Segment should show add button
    await expect(page.getByTestId("add-item-button")).toBeVisible()
  })
})

// ============================================
// FLOW 13: DATA PERSISTENCE
// ============================================

test.describe("Flow 13: Data Persistence", () => {
  test("13.1 - Items persist after page reload", async ({ page }) => {
    await createTrip(page, "Viagem Persistência")
    await addItem(page, { title: "Item Persistente" })

    await expect(page.getByText("Item Persistente")).toBeVisible()

    // Wait for debounced save (500ms + buffer)
    await page.waitForTimeout(700)

    // Reload page
    await page.reload({ waitUntil: "networkidle" })

    // Item should still be there
    await expect(page.getByText("Item Persistente")).toBeVisible({ timeout: 10000 })
  })

  test("13.2 - Status changes persist", async ({ page }) => {
    await createTrip(page, "Viagem Status Persist")
    await addItem(page, { title: "Item Status Persist" })

    const itemId = await getItemId(page, "Item Status Persist")
    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Status").click()
      await page.getByRole("menuitem", { name: /feito/i }).click()

      // Wait for debounced save (500ms + buffer)
      await page.waitForTimeout(700)

      await page.reload({ waitUntil: "networkidle" })

      const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Item Status Persist" })
      await expect(itemCard.getByText("Feito")).toBeVisible({ timeout: 10000 })
    }
  })
})
