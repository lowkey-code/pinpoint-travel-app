import { test, expect } from '@playwright/test';

test.describe('Bug Hunt - Manual Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => localStorage.clear());
  });

  test('1. Home page redirects to /itinerary', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForURL('**/itinerary');

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/01-home-redirect.png', fullPage: true });

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    expect(page.url()).toContain('/itinerary');
  });

  test('2. Trip list page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/02-trip-list.png', fullPage: true });

    // Check if empty state is visible or if trips are listed
    const emptyState = page.getByText(/nenhuma viagem/i);
    const newTripButton = page.getByRole('button', { name: /nova viagem/i });

    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasNewTripButton = await newTripButton.isVisible().catch(() => false);

    console.log('Empty state visible:', hasEmptyState);
    console.log('New trip button visible:', hasNewTripButton);
  });

  test('3. Create a new trip', async ({ page }) => {
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    // Click "Nova Viagem" button
    const newTripButton = page.getByRole('button', { name: /nova viagem/i });
    await newTripButton.click();

    // Wait for dialog/form
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/03a-new-trip-dialog.png', fullPage: true });

    // Fill in trip details
    const titleInput = page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i));
    await titleInput.fill('Viagem de Teste');

    const startDateInput = page.getByLabel(/data.*início/i).or(page.locator('input[type="date"]').first());
    await startDateInput.fill('2026-02-01');

    const endDateInput = page.getByLabel(/data.*fim/i).or(page.locator('input[type="date"]').last());
    await endDateInput.fill('2026-02-05');

    await page.screenshot({ path: 'tests/screenshots/03b-new-trip-filled.png', fullPage: true });

    // Submit
    const createButton = page.getByRole('button', { name: /criar/i });
    await createButton.click();

    // Wait for navigation or trip to appear
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/03c-trip-created.png', fullPage: true });
  });

  test('4. Navigate to trip detail page', async ({ page }) => {
    // Create a trip first
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    const newTripButton = page.getByRole('button', { name: /nova viagem/i });
    await newTripButton.click();
    await page.waitForTimeout(500);

    const titleInput = page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i));
    await titleInput.fill('Viagem Detalhada');

    const startDateInput = page.locator('input[type="date"]').first();
    await startDateInput.fill('2026-03-01');

    const endDateInput = page.locator('input[type="date"]').last();
    await endDateInput.fill('2026-03-03');

    const createButton = page.getByRole('button', { name: /criar/i });
    await createButton.click();
    await page.waitForTimeout(1000);

    // Click on the trip to open detail
    const tripCard = page.getByText('Viagem Detalhada');
    await tripCard.click();

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/04-trip-detail.png', fullPage: true });
  });

  test('5. Add items in different segments', async ({ page }) => {
    // Setup: Create trip and navigate to detail
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    const newTripButton = page.getByRole('button', { name: /nova viagem/i });
    await newTripButton.click();
    await page.waitForTimeout(500);

    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Completa');
    await page.locator('input[type="date"]').first().fill('2026-04-01');
    await page.locator('input[type="date"]').last().fill('2026-04-02');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);

    await page.getByText('Viagem Completa').click();
    await page.waitForTimeout(1000);

    // Try to add activity in Morning
    const morningAddButton = page.getByRole('button', { name: /adicionar.*manhã/i }).first();
    await morningAddButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/05a-add-morning-dialog.png', fullPage: true });

    // Fill activity details
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill('Café da Manhã');
    await page.getByLabel(/endereço/i).or(page.getByPlaceholder(/endereço/i)).fill('Rua das Flores, 123');

    await page.screenshot({ path: 'tests/screenshots/05b-add-morning-filled.png', fullPage: true });

    const saveButton = page.getByRole('button', { name: /salvar|adicionar/i });
    await saveButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/05c-morning-item-added.png', fullPage: true });

    // Try to add activity in Afternoon
    const afternoonAddButton = page.getByRole('button', { name: /adicionar.*tarde/i }).first();
    await afternoonAddButton.click();
    await page.waitForTimeout(500);

    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill('Almoço');
    await page.getByRole('button', { name: /salvar|adicionar/i }).click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/05d-afternoon-item-added.png', fullPage: true });

    // Try to add activity in Evening
    const eveningAddButton = page.getByRole('button', { name: /adicionar.*noite/i }).first();
    await eveningAddButton.click();
    await page.waitForTimeout(500);

    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill('Jantar');
    await page.getByRole('button', { name: /salvar|adicionar/i }).click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/05e-evening-item-added.png', fullPage: true });
  });

  test('6. Test item menu (status, priority)', async ({ page }) => {
    // Setup with items
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    // Create trip with items (abbreviated setup)
    await page.getByRole('button', { name: /nova viagem/i }).click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Menu Test');
    await page.locator('input[type="date"]').first().fill('2026-05-01');
    await page.locator('input[type="date"]').last().fill('2026-05-01');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Viagem Menu Test').click();
    await page.waitForTimeout(1000);

    // Add an item
    await page.getByRole('button', { name: /adicionar/i }).first().click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill('Item de Teste');
    await page.getByRole('button', { name: /salvar|adicionar/i }).click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/06a-item-for-menu-test.png', fullPage: true });

    // Try to find and click item menu
    const menuButton = page.getByRole('button', { name: /menu|mais/i }).first();
    await menuButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/06b-item-menu-open.png', fullPage: true });
  });

  test('7. Test reorder mode', async ({ page }) => {
    // Setup with multiple items
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    // Create and navigate to trip
    await page.getByRole('button', { name: /nova viagem/i }).click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Reorder');
    await page.locator('input[type="date"]').first().fill('2026-06-01');
    await page.locator('input[type="date"]').last().fill('2026-06-01');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Viagem Reorder').click();
    await page.waitForTimeout(1000);

    // Add multiple items
    for (let i = 1; i <= 3; i++) {
      await page.getByRole('button', { name: /adicionar/i }).first().click();
      await page.waitForTimeout(500);
      await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill(`Item ${i}`);
      await page.getByRole('button', { name: /salvar|adicionar/i }).click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: 'tests/screenshots/07a-items-before-reorder.png', fullPage: true });

    // Try to activate reorder mode
    const reorderButton = page.getByRole('button', { name: /reordenar|reorganizar/i });
    const hasReorderButton = await reorderButton.isVisible().catch(() => false);

    if (hasReorderButton) {
      await reorderButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/07b-reorder-mode-active.png', fullPage: true });
    } else {
      console.log('Reorder button not found');
      await page.screenshot({ path: 'tests/screenshots/07b-no-reorder-button.png', fullPage: true });
    }
  });

  test('8. Test grid view', async ({ page }) => {
    // Setup
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /nova viagem/i }).click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Grid');
    await page.locator('input[type="date"]').first().fill('2026-07-01');
    await page.locator('input[type="date"]').last().fill('2026-07-03');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Viagem Grid').click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/08a-default-view.png', fullPage: true });

    // Try to switch to grid view
    const gridViewButton = page.getByRole('button', { name: /grade|grid/i });
    const hasGridButton = await gridViewButton.isVisible().catch(() => false);

    if (hasGridButton) {
      await gridViewButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/08b-grid-view.png', fullPage: true });
    } else {
      console.log('Grid view button not found');
      await page.screenshot({ path: 'tests/screenshots/08b-no-grid-button.png', fullPage: true });
    }
  });

  test('9. Test undo/redo functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /nova viagem/i }).click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Undo');
    await page.locator('input[type="date"]').first().fill('2026-08-01');
    await page.locator('input[type="date"]').last().fill('2026-08-01');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Viagem Undo').click();
    await page.waitForTimeout(1000);

    // Add an item
    await page.getByRole('button', { name: /adicionar/i }).first().click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).first().fill('Item para Desfazer');
    await page.getByRole('button', { name: /salvar|adicionar/i }).click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/09a-before-undo.png', fullPage: true });

    // Try undo
    const undoButton = page.getByRole('button', { name: /desfazer|undo/i });
    const hasUndoButton = await undoButton.isVisible().catch(() => false);

    if (hasUndoButton) {
      await undoButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/09b-after-undo.png', fullPage: true });

      // Try redo
      const redoButton = page.getByRole('button', { name: /refazer|redo/i });
      const hasRedoButton = await redoButton.isVisible().catch(() => false);

      if (hasRedoButton) {
        await redoButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'tests/screenshots/09c-after-redo.png', fullPage: true });
      }
    } else {
      console.log('Undo button not found');
      await page.screenshot({ path: 'tests/screenshots/09b-no-undo-button.png', fullPage: true });
    }
  });

  test('10. Test export/import functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /nova viagem/i }).click();
    await page.waitForTimeout(500);
    await page.getByLabel(/título/i).or(page.getByPlaceholder(/título/i)).fill('Viagem Export');
    await page.locator('input[type="date"]').first().fill('2026-09-01');
    await page.locator('input[type="date"]').last().fill('2026-09-01');
    await page.getByRole('button', { name: /criar/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Viagem Export').click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/10a-trip-before-export.png', fullPage: true });

    // Try to find export button
    const exportButton = page.getByRole('button', { name: /exportar|export/i });
    const hasExportButton = await exportButton.isVisible().catch(() => false);

    if (hasExportButton) {
      await exportButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/10b-export-clicked.png', fullPage: true });
    } else {
      console.log('Export button not found');
      await page.screenshot({ path: 'tests/screenshots/10b-no-export-button.png', fullPage: true });
    }

    // Try to find import button
    const importButton = page.getByRole('button', { name: /importar|import/i });
    const hasImportButton = await importButton.isVisible().catch(() => false);

    if (hasImportButton) {
      await page.screenshot({ path: 'tests/screenshots/10c-import-button-found.png', fullPage: true });
    } else {
      console.log('Import button not found');
    }
  });

  test('11. Visual inspection and console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`Page Error: ${error.message}`);
    });

    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/11a-initial-page.png', fullPage: true });

    // Navigate through the app
    await page.goto('http://localhost:5173/itinerary');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/11b-itinerary-page.png', fullPage: true });

    console.log('Console Errors:', consoleErrors);
    console.log('Console Warnings:', consoleWarnings);

    // Write errors to file
    const fs = require('fs');
    fs.writeFileSync(
      'tests/screenshots/console-errors.json',
      JSON.stringify({ errors: consoleErrors, warnings: consoleWarnings }, null, 2)
    );
  });
});
