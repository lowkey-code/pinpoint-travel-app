import { test, expect } from "@playwright/test"

test.describe("Desktop Warning Dialog", () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage and set onboarding as completed
    await page.goto("/", { waitUntil: "networkidle" })
    await page.evaluate(() => {
      localStorage.setItem("folio_onboarding_completed", "true")
      sessionStorage.clear()
    })
  })

  test("shows warning on desktop viewport", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload({ waitUntil: "networkidle" })

    const dialog = page.getByTestId("desktop-warning-dialog")
    await expect(dialog).toBeVisible()
    await expect(page.getByText("Versão Desktop em Construção")).toBeVisible()
  })

  test("does not show warning on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload({ waitUntil: "networkidle" })

    const dialog = page.getByTestId("desktop-warning-dialog")
    await expect(dialog).not.toBeVisible()
  })

  test("can dismiss warning and continue", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload({ waitUntil: "networkidle" })

    const dialog = page.getByTestId("desktop-warning-dialog")
    await expect(dialog).toBeVisible()

    // Click continue button
    await page.getByTestId("desktop-warning-continue-btn").click()

    // Dialog should close
    await expect(dialog).not.toBeVisible()
  })

  test("does not show again after dismissal in same session", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload({ waitUntil: "networkidle" })

    // Dismiss the dialog
    await page.getByTestId("desktop-warning-continue-btn").click()
    await expect(page.getByTestId("desktop-warning-dialog")).not.toBeVisible()

    // Navigate to another page
    await page.goto("/itinerary", { waitUntil: "networkidle" })

    // Dialog should not appear
    await expect(page.getByTestId("desktop-warning-dialog")).not.toBeVisible()

    // Navigate back to home
    await page.goto("/", { waitUntil: "networkidle" })

    // Dialog should still not appear
    await expect(page.getByTestId("desktop-warning-dialog")).not.toBeVisible()
  })

  test("shows mobile recommendation message", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload({ waitUntil: "networkidle" })

    await expect(page.getByText("Recomendamos usar no celular")).toBeVisible()
  })

  test("shows session info message", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload({ waitUntil: "networkidle" })

    await expect(page.getByText("Este aviso não será exibido novamente nesta sessão")).toBeVisible()
  })
})
