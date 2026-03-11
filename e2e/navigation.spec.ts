import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigate to Content page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").getByText("Content").click();
    await expect(page).toHaveURL("/content");
  });

  test("navigate to Marketing page", async ({ page }) => {
    await page.goto("/");
    // Marketing is a collapsible section — clicking expands it
    await page.locator("aside").getByText("Marketing").click();
    // Verify sub-items appear after expanding
    await expect(page.locator("aside").getByText("Brand Identity")).toBeVisible({ timeout: 5_000 });
  });

  test("navigate to SEO Research page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").getByText("SEO Research").click();
    await expect(page).toHaveURL("/seo");
  });

  test("navigate to Meetings page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").getByText("Meetings").click();
    await expect(page).toHaveURL("/meetings");
  });

  test("navigate back to Dashboard from another page", async ({ page }) => {
    await page.goto("/content");
    await page.locator("aside").getByText("Dashboard").click();
    await expect(page).toHaveURL("/");
  });

  test("active nav item has correct styling", async ({ page }) => {
    await page.goto("/");

    // Dashboard link should have active styling (text-primary)
    const dashboardLink = page.locator("aside a[href='/']");
    await expect(dashboardLink).toHaveClass(/text-\[var\(--solvyn-text-primary\)\]/);

    // Content link should have inactive styling (text-tertiary)
    const contentLink = page.locator("aside a[href='/content']");
    await expect(contentLink).toHaveClass(/text-\[var\(--solvyn-text-tertiary\)\]/);
  });
});
