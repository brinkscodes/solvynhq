import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("displays project heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10_000 });
  });

  test("shows stats cards (Completed, In Progress, To Do)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Completed").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("To Do")).toBeVisible();
  });

  test("shows Overall Progress section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Overall Progress")).toBeVisible({ timeout: 10_000 });
  });

  test("has Active and Completed tab switcher", async ({ page }) => {
    await page.goto("/");
    const activeTab = page.getByRole("button", { name: /Active/ });
    const completedTab = page.getByRole("button", { name: /Completed/ });

    await expect(activeTab).toBeVisible({ timeout: 10_000 });
    await expect(completedTab).toBeVisible();

    // Switch to completed view
    await completedTab.click();
    // Switch back
    await activeTab.click();
  });

  test("sidebar has all nav items and Log out", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("aside");

    await expect(sidebar.getByText("Dashboard")).toBeVisible({ timeout: 10_000 });
    await expect(sidebar.getByText("Content")).toBeVisible();
    await expect(sidebar.getByText("Marketing")).toBeVisible();
    await expect(sidebar.getByText("SEO Research")).toBeVisible();
    await expect(sidebar.getByText("Meetings")).toBeVisible();
    await expect(sidebar.getByRole("button", { name: "Log out" })).toBeVisible();
  });
});
