import { test, expect } from "@playwright/test"

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: "networkidle" })
  })

  test("shows onboarding for new users", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Should show first step
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible()
    await expect(page.getByText("Bem-vindo ao Folio")).toBeVisible()
  })

  test("can navigate through all steps", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Step 0 -> Step 1
    await page.getByTestId("onboarding-next-btn").click()
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible()
    await expect(page.getByText("Comece sua jornada")).toBeVisible()

    // Step 1 -> Step 2
    await page.getByTestId("onboarding-next-btn").click()
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible()
    await expect(page.getByText("Organize seu dia")).toBeVisible()

    // Step 2 -> Step 3
    await page.getByTestId("onboarding-next-btn").click()
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible()
    await expect(page.getByText("Sempre com você")).toBeVisible()

    // Should show "Começar" button on last step
    await expect(page.getByTestId("onboarding-complete-btn")).toBeVisible()
    await expect(page.getByTestId("onboarding-next-btn")).not.toBeVisible()
  })

  test("can go back to previous steps", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Navigate to step 2
    await page.getByTestId("onboarding-next-btn").click()
    await page.getByTestId("onboarding-next-btn").click()
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible()

    // Go back to step 1
    await page.getByTestId("onboarding-prev-btn").click()
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible()

    // Go back to step 0
    await page.getByTestId("onboarding-prev-btn").click()
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible()

    // Previous button should not be visible on step 0
    await expect(page.getByTestId("onboarding-prev-btn")).not.toBeVisible()
  })

  test("can skip onboarding", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Click skip
    await page.getByTestId("onboarding-skip-btn").click()

    // Dialog should close (wait for animation)
    await expect(dialog).not.toBeVisible({ timeout: 10000 })

    // Should be marked as completed in localStorage
    const completed = await page.evaluate(() =>
      localStorage.getItem("folio_onboarding_completed")
    )
    expect(completed).toBe("true")
  })

  test("completes onboarding on final step", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Navigate to final step
    await page.getByTestId("onboarding-next-btn").click()
    await page.getByTestId("onboarding-next-btn").click()
    await page.getByTestId("onboarding-next-btn").click()
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible()

    // Click "Começar"
    await page.getByTestId("onboarding-complete-btn").click()

    // Dialog should close (wait for animation)
    await expect(dialog).not.toBeVisible({ timeout: 10000 })

    // Should be marked as completed in localStorage
    const completed = await page.evaluate(() =>
      localStorage.getItem("folio_onboarding_completed")
    )
    expect(completed).toBe("true")
  })

  test("does not show after completion", async ({ page }) => {
    // Complete onboarding by skipping
    await page.getByTestId("onboarding-skip-btn").click()
    await expect(page.getByTestId("onboarding-dialog")).not.toBeVisible({ timeout: 10000 })

    // Reload the page
    await page.reload({ waitUntil: "networkidle" })

    // Dialog should not appear
    await expect(page.getByTestId("onboarding-dialog")).not.toBeVisible()
  })

  test("can navigate using dots", async ({ page }) => {
    const dialog = page.getByTestId("onboarding-dialog")
    await expect(dialog).toBeVisible()

    // Click on dot 2 (step 2)
    await page.getByTestId("onboarding-dot-2").click()
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible()

    // Click on dot 3 (step 3)
    await page.getByTestId("onboarding-dot-3").click()
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible()

    // Click on dot 0 (step 0)
    await page.getByTestId("onboarding-dot-0").click()
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible()
  })
})
