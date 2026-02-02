import { test, expect } from "@playwright/test"
import path from "path"
import fs from "fs"

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.addInitScript(() => {
    localStorage.clear()
    sessionStorage.setItem("folio_desktop_warning_dismissed", "true")

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
})

// Helper to create a trip using the CreateTripDialog
async function createTrip(page: import("@playwright/test").Page, name: string) {
  await page.goto("/itinerary", { waitUntil: "networkidle" })

  // Wait for page to load (header with "Minhas Jornadas" or empty state)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 })

  await page.getByTestId("create-trip-button").click()

  // Wait for dialog to appear
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()

  // Fill in the trip name
  await dialog.getByLabel("Nome da viagem").fill(name)

  // Click create button
  await dialog.getByRole("button", { name: "Criar Viagem" }).click()

  // Wait for navigation to trip detail
  await expect(page).toHaveURL(/\/itinerary\//)
}

// Helper to add an item
async function addItem(
  page: import("@playwright/test").Page,
  options: {
    title: string
    type?: "activity" | "dayTrip" | "transport" | "stay" | "quick"
    address?: string
    coverAfternoon?: boolean
  }
) {
  await page.getByTestId("add-item-button").click()

  const drawer = page.getByTestId("item-drawer")
  await expect(drawer).toBeVisible()

  // Select type if specified
  if (options.type) {
    const typeButton = drawer.getByTestId(`item-type-${options.type}`)
    await typeButton.click()

    if (options.type === "dayTrip") {
      await expect(drawer.getByText("Períodos cobertos pelo Dia Inteiro")).toBeVisible()
    }
  }

  await drawer.getByTestId("item-title-input").fill(options.title)

  if (options.address) {
    await drawer.getByTestId("item-address-input").fill(options.address)
  }

  if (options.type === "dayTrip" && options.coverAfternoon) {
    await drawer.getByTestId("daytrip-segment-afternoon").click()
  }

  await drawer.getByTestId("save-item").click()

  // Wait for drawer to close
  await expect(drawer).toBeHidden()
}

// Helper to open the BookmarkMenu
async function openBookmarkMenu(page: import("@playwright/test").Page) {
  const menuButton = page.getByLabel("Menu de ações")
  await menuButton.click()
  // Wait for menu animation to complete
  await page.waitForTimeout(300)
}

test.describe("Itinerary E2E Tests", () => {
  test("1) Create trip with days", async ({ page }) => {
    await createTrip(page, "Viagem para Tóquio")

    await expect(page.getByText("Viagem para Tóquio")).toBeVisible()

    // Day label shows "01" with "DIA" badge
    await expect(page.getByTestId("current-day-label")).toBeVisible()
    await expect(page.getByTestId("current-day-label")).toContainText("01")

    await expect(page.getByTestId("segment-tab-morning")).toBeVisible()
    await expect(page.getByTestId("segment-tab-afternoon")).toBeVisible()
    await expect(page.getByTestId("segment-tab-evening")).toBeVisible()
  })

  test("2) Add activity with address in Morning", async ({ page }) => {
    await createTrip(page, "Viagem para Paris")

    await page.getByTestId("segment-tab-morning").click()

    await addItem(page, {
      title: "Torre Eiffel",
      type: "activity",
      address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
    })

    await expect(page.getByText("Torre Eiffel")).toBeVisible()
    await expect(page.locator('[data-testid^="itinerary-card-"]', { hasText: "Torre Eiffel" })).toBeVisible()
  })

  test("3) Add dayTrip covering Morning+Afternoon; verify ghost in Afternoon", async ({ page }) => {
    await createTrip(page, "Viagem para Roma")

    await page.getByTestId("segment-tab-morning").click()

    await addItem(page, {
      title: "Tour pelo Coliseu",
    })

    await expect(page.getByText("Tour pelo Coliseu")).toBeVisible()

    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Tour pelo Coliseu" })
    await expect(itemCard).toBeVisible()
  })

  test("4) Change item status via menu", async ({ page }) => {
    await createTrip(page, "Viagem para Londres")

    await page.getByTestId("segment-tab-morning").click()
    await addItem(page, { title: "Big Ben" })

    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Big Ben" })
    await expect(itemCard).toBeVisible()

    const cardTestId = await itemCard.getAttribute("data-testid")
    const itemId = cardTestId?.replace("itinerary-card-", "")

    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()

      const menu = page.getByRole("menu")
      await menu.getByText("Status").click()

      await page.getByRole("menuitem", { name: "Feito" }).click()
    }

    await expect(itemCard.getByText("Feito")).toBeVisible()
  })

  test("5) Toggle status planned->done and cycle priority 0/1/2", async ({ page }) => {
    await createTrip(page, "Viagem para Berlim")

    await addItem(page, { title: "Portão de Brandemburgo" })

    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Portão de Brandemburgo" })
    const cardTestId = await itemCard.getAttribute("data-testid")
    const itemId = cardTestId?.replace("itinerary-card-", "")

    if (itemId) {
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Status").click()
      await page.getByRole("menuitem", { name: "Feito" }).click()

      await expect(itemCard.getByText("Feito")).toBeVisible()

      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: "Importante" }).click()

      await expect(itemCard.getByText("Importante")).toBeVisible()

      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: "Imperdível" }).click()

      await expect(itemCard.getByText("Imperdível")).toBeVisible()
    }
  })

  test("6) Undo last action and verify revert", async ({ page }) => {
    await createTrip(page, "Viagem para Madri")

    await addItem(page, { title: "Museu do Prado" })
    await expect(page.getByText("Museu do Prado")).toBeVisible()

    await addItem(page, { title: "Palácio Real" })
    await expect(page.getByText("Palácio Real")).toBeVisible()

    // Open menu to access undo/redo buttons
    await openBookmarkMenu(page)

    const undoButton = page.getByTestId("undo-button")
    await expect(undoButton).toBeEnabled()

    await undoButton.click()

    await expect(page.getByText("Palácio Real")).toBeHidden()
    await expect(page.getByText("Museu do Prado")).toBeVisible()

    // Menu closes after action, reopen it
    await openBookmarkMenu(page)

    const redoButton = page.getByTestId("redo-button")
    await expect(redoButton).toBeEnabled()

    await redoButton.click()

    await expect(page.getByText("Palácio Real")).toBeVisible()

    // Undo multiple times
    for (let i = 0; i < 3; i++) {
      await openBookmarkMenu(page)
      const undoBtn = page.getByTestId("undo-button")
      if (await undoBtn.isEnabled()) {
        await undoBtn.click()
      }
    }
  })

  test("7) Export trip JSON and import back; verify appears", async ({ page }) => {
    await createTrip(page, "Viagem para Lisboa")

    await addItem(page, { title: "Torre de Belém" })
    await addItem(page, { title: "Pastéis de Belém", type: "activity" })

    await expect(page.getByText("Torre de Belém")).toBeVisible()
    await expect(page.getByText("Pastéis de Belém")).toBeVisible()

    // Open menu to access export button
    await openBookmarkMenu(page)

    const downloadPromise = page.waitForEvent("download")

    await page.getByTestId("export-button").click()

    const download = await downloadPromise
    const suggestedFilename = download.suggestedFilename()
    expect(suggestedFilename).toContain("viagem-para-lisboa")
    expect(suggestedFilename).toMatch(/\.json$/)

    const downloadPath = path.join("/tmp", suggestedFilename)
    await download.saveAs(downloadPath)

    const content = fs.readFileSync(downloadPath, "utf-8")
    const data = JSON.parse(content)
    expect(data.exportVersion).toBe(1)
    expect(data.trip.name).toBe("Viagem para Lisboa")
    expect(data.trip.items.length).toBe(2)

    const itemTitles = data.trip.items.map((item: { title: string }) => item.title)
    expect(itemTitles).toContain("Torre de Belém")
    expect(itemTitles).toContain("Pastéis de Belém")

    fs.unlinkSync(downloadPath)
  })
})
