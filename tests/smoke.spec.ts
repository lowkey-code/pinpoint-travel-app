import { test, expect } from "@playwright/test"

type PlaceInput = {
  name: string
  address: string
  note?: string
  category: string
}

const placeA: PlaceInput = {
  name: "Museu do Amanhã",
  address: "Praça Mauá, 1 - Centro, Rio de Janeiro",
  note: "Chegar cedo",
  category: "museum",
}

const placeB: PlaceInput = {
  name: "Feira da Glória",
  address: "R. Augusto Severo, Glória, Rio de Janeiro",
  note: "Domingo",
  category: "food",
}

async function addPlace(page: import("@playwright/test").Page, place: PlaceInput) {
  await page.getByTestId("add-place-button").click()
  await expect(page.getByTestId("add-place-sheet")).toBeVisible()
  await page.getByTestId("add-place-name").fill(place.name)
  await page.getByTestId("add-place-address").fill(place.address)
  if (place.note) {
    await page.getByTestId("add-place-note").fill(place.note)
  }
  await page.getByTestId(`add-category-${place.category}`).click()
  await page.getByTestId("add-place-save").click()
}

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("e2e_seeded")) {
      localStorage.clear()
      sessionStorage.setItem("e2e_seeded", "1")
    }
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
    const originalOpen = window.open
    window.open = ((url?: string | URL | undefined) => {
      if (url) {
        ;(window as typeof window & { __lastOpenedUrl?: string }).__lastOpenedUrl = url.toString()
      }
      return originalOpen ? originalOpen(url as string) : null
    }) as typeof window.open
  })
  await page.goto("/")
  await expect(page.getByTestId("header")).toBeVisible()
})

test("renderiza rota / com layout base", async ({ page }) => {
  await expect(page.getByTestId("header")).toBeVisible()
  await expect(page.getByTestId("search-input")).toBeVisible()
  await expect(page.getByTestId("category-all")).toBeVisible()
  await expect(page.getByTestId("empty-state")).toBeVisible()
})

test("adiciona, edita e remove lugares", async ({ page }) => {
  await addPlace(page, placeA)
  await addPlace(page, placeB)

  await expect(page.getByText(placeA.name)).toBeVisible()
  await expect(page.getByText(placeB.name)).toBeVisible()

  const placeACard = page.locator('[data-testid^="place-card-"]', { hasText: placeA.name })
  await placeACard.getByTestId(/^place-menu-/).click()
  await page.getByTestId(/^place-edit-/).click()
  await expect(page.getByTestId("edit-place-sheet")).toBeVisible()
  await page.getByTestId("edit-place-name").fill(`${placeA.name} Editado`)
  await page.getByTestId("edit-place-save").click()
  await expect(page.getByText(`${placeA.name} Editado`)).toBeVisible()

  const placeBCard = page.locator('[data-testid^="place-card-"]', { hasText: placeB.name })
  await placeBCard.getByTestId(/^place-menu-/).click()
  await page.getByTestId(/^place-delete-/).click()
  await expect(page.getByText(placeB.name)).toBeHidden()
})

test("filtra por categoria e busca por nome/endereco/nota", async ({ page }) => {
  await addPlace(page, placeA)
  await addPlace(page, placeB)

  await page.getByTestId("category-museum").click()
  await expect(page.getByText(placeA.name)).toBeVisible()
  await expect(page.getByText(placeB.name)).toBeHidden()

  await page.getByTestId("category-all").click()
  await page.getByTestId("search-input").fill("Glória")
  await expect(page.getByText(placeB.name)).toBeVisible()
  await expect(page.getByText(placeA.name)).toBeHidden()

  await page.getByTestId("search-clear").click()
  await page.getByTestId("search-input").fill("Chegar cedo")
  await expect(page.getByText(placeA.name)).toBeVisible()
})

test("tema claro/escuro persiste em localStorage", async ({ page }) => {
  await page.getByTestId("theme-toggle").click()
  await expect.poll(async () => {
    return page.evaluate(() => document.documentElement.classList.contains("dark"))
  }).toBeTruthy()

  await page.reload()
  await expect.poll(async () => {
    return page.evaluate(() => localStorage.getItem("pinpoint_theme"))
  }).toBe("dark")
})

test("copia endereco e abre AMap", async ({ page }) => {
  await addPlace(page, placeA)

  const placeCard = page.locator('[data-testid^="place-card-"]', { hasText: placeA.name })
  const copyButton = placeCard.getByTestId(/^place-copy-/)
  await copyButton.click()
  await expect(page.getByText("Copied!")).toBeVisible()
  const clipboard = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboard).toContain(placeA.address)

  await placeCard.getByTestId(/^place-amap-/).click()
  await expect.poll(async () => {
    return page.evaluate(() => (window as typeof window & { __lastOpenedUrl?: string }).__lastOpenedUrl)
  }).toMatch(/uri\.amap\.com\/search/)
})

test("error boundary renderiza quando forca erro", async ({ page }) => {
  await page.goto("/?e2eError=1")
  await expect(page.getByTestId("error-boundary")).toBeVisible()
})
