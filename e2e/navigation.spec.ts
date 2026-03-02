import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigate to Content page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").getByText("Content").click();
    await expect(page).toHaveURL("/content");
  });

  test("navigate to Marketing page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").getByText("Marketing").click();
    await expect(page).toHaveURL("/product-context");
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

    // Dashboard link should have active styling (bg-white/[0.08])
    const dashboardLink = page.locator("aside a[href='/']");
    await expect(dashboardLink).toHaveClass(/bg-white/);

    // Content link should not have active styling
    const contentLink = page.locator("aside a[href='/content']");
    await expect(contentLink).not.toHaveClass(/bg-white\/\[0\.08\]/);
  });
});
