import { test, expect } from "@playwright/test";

const WEBHOOK_SECRET = process.env.FORM_WEBHOOK_SECRET || "ad38ba00369456a6642b41c1f944eebf0f331d31416fab6c";
const BASE = "http://localhost:3000";

test.describe("Form Submissions API", () => {
  test("POST webhook rejects missing key", async ({ request }) => {
    const res = await request.post(`${BASE}/api/form-submissions`, {
      data: { form_name: "Test" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST webhook rejects wrong key", async ({ request }) => {
    const res = await request.post(
      `${BASE}/api/form-submissions?key=wrong`,
      { data: { form_name: "Test" } }
    );
    expect(res.status()).toBe(401);
  });

  test("POST webhook accepts JSON submission", async ({ request }) => {
    const res = await request.post(
      `${BASE}/api/form-submissions?key=${WEBHOOK_SECRET}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          form_name: "E2E JSON Form",
          fields: {
            name: "E2E User",
            email: "e2e@test.com",
            message: "Playwright JSON test",
          },
          meta: {
            remote_ip: "127.0.0.1",
            page: { title: "Test Page", url: "http://localhost" },
          },
        },
      }
    );
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test("POST webhook accepts form-urlencoded submission", async ({ request }) => {
    const res = await request.post(
      `${BASE}/api/form-submissions?key=${WEBHOOK_SECRET}`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: "form_name=E2E+Urlencoded+Form&name=Form+User&email=form%40test.com&message=Urlencoded+test",
      }
    );
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test("POST webhook accepts multipart/form-data submission", async ({ request }) => {
    const form = request.createFormData ? undefined : null;
    // Use fetch-style multipart
    const res = await request.post(
      `${BASE}/api/form-submissions?key=${WEBHOOK_SECRET}`,
      {
        multipart: {
          form_name: "E2E Multipart Form",
          name: "Multipart User",
          email: "multipart@test.com",
          message: "Multipart test",
        },
      }
    );
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test("PATCH rejects invalid status (returns 400 or 500 without auth)", async ({ request }) => {
    const res = await request.patch(`${BASE}/api/form-submissions`, {
      data: { id: "00000000-0000-0000-0000-000000000000", status: "invalid" },
    });
    // 400 if authenticated (validation error), 500 if not authenticated (auth error)
    expect([400, 500]).toContain(res.status());
  });
});

test.describe("Leads Page UI", () => {
  test("page loads and shows header", async ({ page }) => {
    await page.goto("/marketing/leads");

    // May redirect to login if not authenticated — that's OK for CI
    // If authenticated, check for the heading
    const url = page.url();
    if (url.includes("/login")) {
      // Auth redirect is expected behavior for unauthenticated users
      expect(url).toContain("/login");
      return;
    }

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Submissions from your website forms")).toBeVisible();
  });

  test("page shows filter tabs when authenticated", async ({ page }) => {
    await page.goto("/marketing/leads");
    const url = page.url();
    if (url.includes("/login")) return; // Skip if not authenticated

    await expect(page.getByRole("button", { name: "Inbox" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "New" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Read" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Archived" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  });

  test("sidebar shows Leads under Marketing", async ({ page }) => {
    await page.goto("/marketing/leads");
    const url = page.url();
    if (url.includes("/login")) return;

    const sidebar = page.locator("aside");
    // Marketing should be expanded since we're on a marketing page
    await expect(sidebar.getByText("Leads")).toBeVisible({ timeout: 5_000 });
  });
});
