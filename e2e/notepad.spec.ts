import { test, expect } from "@playwright/test";

test.describe("Notepad", () => {
  test("toggle notepad open and close", async ({ page }) => {
    await page.goto("/");

    // Find the floating notepad button (bottom-right)
    const toggleBtn = page.locator("button.fixed.bottom-6.right-6");
    await expect(toggleBtn).toBeVisible({ timeout: 10_000 });

    // Open notepad
    await toggleBtn.click();
    await expect(page.getByPlaceholder("Quick notes, ideas, reminders...")).toBeVisible();

    // Close notepad — panel hides via CSS opacity/pointer-events transition
    await toggleBtn.click();
    await expect(page.locator(".pointer-events-none").filter({ has: page.getByPlaceholder("Quick notes, ideas, reminders...") })).toBeVisible();
  });

  test("notes persist after reload", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.locator("button.fixed.bottom-6.right-6");
    await toggleBtn.click();

    const textarea = page.getByPlaceholder("Quick notes, ideas, reminders...");
    await expect(textarea).toBeVisible();

    const testText = `E2E test note ${Date.now()}`;
    await textarea.fill(testText);

    // Wait for debounced save (600ms + network)
    await page.waitForTimeout(1500);

    // Reload and check persistence
    await page.reload();
    await toggleBtn.click();
    await expect(textarea).toHaveValue(testText, { timeout: 10_000 });
  });

  test("shows saving indicator", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.locator("button.fixed.bottom-6.right-6");
    await toggleBtn.click();

    const textarea = page.getByPlaceholder("Quick notes, ideas, reminders...");
    await expect(textarea).toBeVisible();

    // Type to trigger save
    await textarea.fill(`Saving test ${Date.now()}`);

    // "Saving..." should appear (within the debounce + save window)
    await expect(page.getByText("Saving...")).toBeVisible({ timeout: 5_000 });
  });
});
