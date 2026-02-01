# Code Refinement TODOs

Based on the code quality audit from 2026-01-31, here are the items that should be refined:

---

## Priority: Medium (Should Fix)

### 1. Extract duplicated utility functions to shared location
**Files affected:**
- `app/routes/_index.tsx`
- `app/routes/itinerary/_index.tsx`

**Functions to extract:**
- `getTripDuration(trip: Trip): number`
- `getTripProgress(trip: Trip): { current: number; total: number }`
- `getDaysUntil(dateStr: string): number`
- `formatDateRange(startDate?: string, endDate?: string): string`

**Suggested location:** `app/lib/trip-utils.ts`

**Rationale:** These functions are duplicated across route files, violating DRY principles. Extracting them will make maintenance easier and reduce bundle size.

---

### 2. Remove debug console.log statement
**File:** `app/features/itinerary/components/ItineraryMenu.tsx:32`

**Current code:**
```typescript
const handleMenuSelect = (details: { value: string }) => {
  console.log("Menu onSelect called with:", details)  // REMOVE THIS
  const { value } = details
  // ...
}
```

**Rationale:** Debug logging should not be present in production code.

---

### 3. Fix flaky test timeout
**File:** `tests/itinerary.spec.ts:93`

**Current code:**
```typescript
async function openBookmarkMenu(page: import("@playwright/test").Page) {
  const menuButton = page.getByLabel("Menu de ações")
  await menuButton.click()
  // Wait for menu animation to complete
  await page.waitForTimeout(300)  // REPLACE THIS
}
```

**Suggested fix:**
```typescript
async function openBookmarkMenu(page: import("@playwright/test").Page) {
  const menuButton = page.getByLabel("Menu de ações")
  await menuButton.click()
  // Wait for menu to be visible
  await expect(page.locator('[role="menu"]')).toBeVisible()
}
```

**Rationale:** Hardcoded timeouts create race conditions and flaky tests. Using Playwright's built-in waiting mechanisms is more reliable.

---

## Priority: Low (Nice to Have)

### 4. Add useMemo for expensive date calculations
**Files:** Route components with date calculations

**Rationale:** Date calculations can be expensive and may cause unnecessary re-renders. Consider memoizing if performance issues arise.

---

### 5. Add React.memo() to list item components
**Files:** `app/features/itinerary/components/ItineraryCard.tsx` and related

**Rationale:** If lists grow large, memoizing item components can improve performance. Only needed if profiling indicates a problem.

---

## Completed Items

- [x] Audit React components for best practices and accessibility
- [x] Review TypeScript types and interfaces
- [x] Check for security vulnerabilities
- [x] Analyze performance patterns
- [x] Review test coverage and quality
- [x] Check for code duplication and DRY violations
- [x] Validate error handling patterns
- [x] Review state management and data flow
- [x] Create code review report
- [x] Create refinement TODO list

---

## How to Use This List

1. Start with Priority: Medium items
2. Each item can be addressed independently
3. Check off items as they are completed
4. Update this file or remove completed items

**Estimated time to complete all Medium priority items:** ~30 minutes
