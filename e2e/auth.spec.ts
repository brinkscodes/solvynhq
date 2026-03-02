import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("valid login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("you@example.com").fill(process.env.TEST_USER_EMAIL!);
    await page.getByPlaceholder("Enter password").fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL("/", { timeout: 15_000 });
  });

  test("invalid login shows error", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("you@example.com").fill("wrong@example.com");
    await page.getByPlaceholder("Enter password").fill("wrongpassword");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Invalid login credentials")).toBeVisible({ timeout: 10_000 });
  });

  test("authenticated user on /login is redirected to /", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(process.env.TEST_USER_EMAIL!);
    await page.getByPlaceholder("Enter password").fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL("/", { timeout: 15_000 });

    // Now visit /login while authenticated
    await page.goto("/login");
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });

  test("logout redirects to /login", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(process.env.TEST_USER_EMAIL!);
    await page.getByPlaceholder("Enter password").fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL("/", { timeout: 15_000 });

    // Click logout
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("signup page renders correctly", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("At least 6 characters")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  test("login page links to signup", async ({ page }) => {
    await page.goto("/login");

    const signupLink = page.getByRole("link", { name: "Sign up" });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute("href", "/signup");
  });
});
