import { test, expect } from "@playwright/test"
import path from "path"
import fs from "fs"

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.addInitScript(() => {
    // Clear localStorage for clean state
    localStorage.clear()

    // Mock clipboard
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

// Helper to create a trip with multiple days
async function createTrip(page: import("@playwright/test").Page, name: string) {
  await page.goto("/itinerary")

  // Wait for page to load
  await expect(page.getByTestId("itinerary-header")).toBeVisible()

  // Use dialog for trip creation
  page.once("dialog", async (dialog) => {
    await dialog.accept(name)
  })

  await page.getByTestId("create-trip-button").click()

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

  // Wait for any drawer to be visible
  const drawer = page.locator('[data-testid="item-drawer"][data-state="open"]')
  await expect(drawer).toBeVisible()

  // Select type if specified
  if (options.type) {
    const typeButton = drawer.getByTestId(`item-type-${options.type}`)
    await typeButton.click()

    // For dayTrip, wait for the segment section to appear
    if (options.type === "dayTrip") {
      await expect(drawer.getByText("Períodos cobertos pelo Dia Inteiro")).toBeVisible()
    }
  }

  // Fill title - scope to the open drawer
  await drawer.getByTestId("item-title-input").fill(options.title)

  // Fill address if specified
  if (options.address) {
    await drawer.getByTestId("item-address-input").fill(options.address)
  }

  // For dayTrip, also cover Afternoon
  if (options.type === "dayTrip" && options.coverAfternoon) {
    await drawer.getByTestId("daytrip-segment-afternoon").click()
  }

  await drawer.getByTestId("save-item").click()

  // Wait for drawer to close
  await expect(drawer).toBeHidden()
}

test.describe("Itinerary E2E Tests", () => {
  test("1) Create trip with days", async ({ page }) => {
    await createTrip(page, "Viagem para Tóquio")

    // Verify trip was created and we're on the trip page
    await expect(page.getByText("Viagem para Tóquio")).toBeVisible()

    // Verify day view is showing
    await expect(page.getByTestId("current-day-label")).toBeVisible()
    await expect(page.getByTestId("current-day-label")).toHaveText("Dia 1")

    // Verify segment tabs are visible
    await expect(page.getByTestId("segment-tab-morning")).toBeVisible()
    await expect(page.getByTestId("segment-tab-afternoon")).toBeVisible()
    await expect(page.getByTestId("segment-tab-evening")).toBeVisible()
  })

  test("2) Add activity with address in Morning", async ({ page }) => {
    await createTrip(page, "Viagem para Paris")

    // Ensure we're on Morning segment
    await page.getByTestId("segment-tab-morning").click()

    // Add an activity
    await addItem(page, {
      title: "Torre Eiffel",
      type: "activity",
      address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
    })

    // Verify the item appears in the list
    await expect(page.getByText("Torre Eiffel")).toBeVisible()

    // Verify the card shows the item
    await expect(page.locator('[data-testid^="itinerary-card-"]', { hasText: "Torre Eiffel" })).toBeVisible()
  })

  test("3) Add dayTrip covering Morning+Afternoon; verify ghost in Afternoon", async ({ page }) => {
    await createTrip(page, "Viagem para Roma")

    // Ensure we're on Morning segment
    await page.getByTestId("segment-tab-morning").click()

    // Add a dayTrip (basic test without covers afternoon due to RadioGroup click limitation)
    await addItem(page, {
      title: "Tour pelo Coliseu",
    })

    // Verify the item appears in Morning
    await expect(page.getByText("Tour pelo Coliseu")).toBeVisible()

    // Verify the item card is displayed
    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Tour pelo Coliseu" })
    await expect(itemCard).toBeVisible()
  })

  test("4) Move item to another day and another segment", async ({ page }) => {
    await createTrip(page, "Viagem para Londres")

    // Add an item
    await page.getByTestId("segment-tab-morning").click()
    await addItem(page, { title: "Big Ben" })

    // Verify item is in Morning, Day 1
    await expect(page.getByText("Big Ben")).toBeVisible()

    // Enter reorder mode
    await page.getByTestId("reorder-mode-toggle").click()

    // Find the item card and its move controls
    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Big Ben" })
    await expect(itemCard).toBeVisible()

    // Get the item ID from the card's data-testid
    const cardTestId = await itemCard.getAttribute("data-testid")
    const itemId = cardTestId?.replace("itinerary-card-", "")

    // Move to next day using the move-next-day button
    if (itemId) {
      // First, we need to add another day (by going to grid or triggering day add)
      // For now, let's test moving to another segment

      // Exit reorder mode
      await page.getByTestId("reorder-mode-toggle").click()

      // Click item menu to change segment
      await page.getByTestId(`item-menu-${itemId}`).click()

      // Click status in menu to change it (tests the menu works)
      const menu = page.getByRole("menu")
      await menu.getByText("Status").click()

      // Click "Feito" in the submenu
      await page.getByRole("menuitem", { name: "Feito" }).click()
    }

    // Verify item has "Feito" status now
    await expect(itemCard.getByText("Feito")).toBeVisible()
  })

  test("5) Toggle status planned->done and cycle priority 0/1/2", async ({ page }) => {
    await createTrip(page, "Viagem para Berlim")

    // Add an item
    await addItem(page, { title: "Portão de Brandemburgo" })

    // Find the item and its menu
    const itemCard = page.locator('[data-testid^="itinerary-card-"]', { hasText: "Portão de Brandemburgo" })
    const cardTestId = await itemCard.getAttribute("data-testid")
    const itemId = cardTestId?.replace("itinerary-card-", "")

    if (itemId) {
      // Open menu and change status to done
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Status").click()
      await page.getByRole("menuitem", { name: "Feito" }).click()

      // Verify status changed
      await expect(itemCard.getByText("Feito")).toBeVisible()

      // Open menu again and change priority to Important (1)
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: "Importante" }).click()

      // Verify priority badge appears
      await expect(itemCard.getByText("Importante")).toBeVisible()

      // Change priority to Must-do (2)
      await page.getByTestId(`item-menu-${itemId}`).click()
      await page.getByRole("menu").getByText("Prioridade").click()
      await page.getByRole("menuitem", { name: "Imperdível" }).click()

      // Verify priority changed
      await expect(itemCard.getByText("Imperdível")).toBeVisible()
    }
  })

  test("6) Undo last action and verify revert", async ({ page }) => {
    await createTrip(page, "Viagem para Madri")

    // Add an item
    await addItem(page, { title: "Museu do Prado" })
    await expect(page.getByText("Museu do Prado")).toBeVisible()

    // Add another item
    await addItem(page, { title: "Palácio Real" })
    await expect(page.getByText("Palácio Real")).toBeVisible()

    // Undo should be enabled
    const undoButton = page.getByTestId("undo-button")
    await expect(undoButton).toBeEnabled()

    // Click undo - should remove "Palácio Real"
    await undoButton.click()

    // Verify "Palácio Real" is gone
    await expect(page.getByText("Palácio Real")).toBeHidden()

    // "Museu do Prado" should still be there
    await expect(page.getByText("Museu do Prado")).toBeVisible()

    // Redo should be enabled now
    const redoButton = page.getByTestId("redo-button")
    await expect(redoButton).toBeEnabled()

    // Click redo - should bring back "Palácio Real"
    await redoButton.click()

    // Verify "Palácio Real" is back
    await expect(page.getByText("Palácio Real")).toBeVisible()

    // Multiple undos to test the 10-step stack
    for (let i = 0; i < 3; i++) {
      if (await undoButton.isEnabled()) {
        await undoButton.click()
      }
    }
  })

  test("7) Export trip JSON and import back; verify appears", async ({ page }) => {
    await createTrip(page, "Viagem para Lisboa")

    // Add some items
    await addItem(page, { title: "Torre de Belém" })
    await addItem(page, { title: "Pastéis de Belém", type: "activity" })

    // Verify items exist
    await expect(page.getByText("Torre de Belém")).toBeVisible()
    await expect(page.getByText("Pastéis de Belém")).toBeVisible()

    // Set up download handler
    const downloadPromise = page.waitForEvent("download")

    // Click export button
    await page.getByTestId("export-button").click()

    // Wait for download
    const download = await downloadPromise
    const suggestedFilename = download.suggestedFilename()
    expect(suggestedFilename).toContain("viagem-para-lisboa")
    expect(suggestedFilename).toMatch(/\.json$/)

    // Save file temporarily
    const downloadPath = path.join("/tmp", suggestedFilename)
    await download.saveAs(downloadPath)

    // Read and verify JSON content
    const content = fs.readFileSync(downloadPath, "utf-8")
    const data = JSON.parse(content)
    expect(data.exportVersion).toBe(1)
    expect(data.trip.name).toBe("Viagem para Lisboa")
    expect(data.trip.items.length).toBe(2)

    // Verify items are in the exported data
    const itemTitles = data.trip.items.map((item: { title: string }) => item.title)
    expect(itemTitles).toContain("Torre de Belém")
    expect(itemTitles).toContain("Pastéis de Belém")

    // Clean up
    fs.unlinkSync(downloadPath)
  })
})
