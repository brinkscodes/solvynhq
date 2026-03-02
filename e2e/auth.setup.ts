import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate test user", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("you@example.com").fill(process.env.TEST_USER_EMAIL!);
  await page.getByPlaceholder("Enter password").fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole("button", { name: "Continue" }).click();

  // Wait for redirect to dashboard
  await page.waitForURL("/", { timeout: 15_000 });

  // Save auth state
  await page.context().storageState({ path: authFile });
});
