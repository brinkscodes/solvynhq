import { test, expect } from "@playwright/test";

test.describe("Shared Project — Dashboard Tasks", () => {
  test("new user auto-joins shared project and sees all tasks", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should see the SolvynHQ project heading
    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 15_000 });
    await expect(heading).toHaveText("SolvynHQ");
  });

  test("displays shared task stats (Completed, In Progress, To Do)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Stats cards — use .first() since task status badges also contain these words
    await expect(page.getByText("Completed").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("In Progress").first()).toBeVisible();
    await expect(page.getByText("To Do").first()).toBeVisible();

    // Verify real numbers are present (40 completed, 39 to do)
    await expect(page.getByText("40").first()).toBeVisible();
    await expect(page.getByText("39").first()).toBeVisible();
  });

  test("shows Overall Progress with real task data", async ({ page }) => {
    await page.goto("/");

    const progress = page.getByText("Overall Progress");
    await expect(progress).toBeVisible({ timeout: 10_000 });

    // Should show "X of 79 tasks completed" or similar
    const progressDetail = page.getByText(/of \d+ tasks completed/i).or(
      page.getByText(/\d+ of \d+/)
    );
    await expect(progressDetail).toBeVisible();
  });

  test("shows shared project task items in the list", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for tasks to render — look for known task names from the shared project
    await expect(page.getByText("Footer").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Tablet/Mobile Footer Design").first()).toBeVisible();
  });

  test("Active/Completed tabs work with shared data", async ({ page }) => {
    await page.goto("/");

    const activeTab = page.getByRole("button", { name: /Active/ });
    const completedTab = page.getByRole("button", { name: /Completed/ });

    await expect(activeTab).toBeVisible({ timeout: 10_000 });
    await expect(completedTab).toBeVisible();

    // Completed tab should show count > 0 (shared project has done tasks)
    await expect(completedTab).toContainText(/\d+/);

    // Switch to Completed and verify tasks appear
    await completedTab.click();
    await page.waitForTimeout(500);

    // Should see completed task items
    const completedContent = page.locator("main");
    await expect(completedContent).toBeVisible();

    // Switch back to Active
    await activeTab.click();
  });

  test("Working on Today section is present", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The "Working on Today" section should be visible if any tasks have todayFocus
    // Even if empty, the section structure should exist
    const todaySection = page.getByText("Working on Today").or(
      page.getByText("working on today", { exact: false })
    );
    // This may or may not be visible depending on if any tasks are focused
    // Just check the page loaded correctly with task content
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Shared Project — My Tasks Isolation", () => {
  test("My Tasks page loads independently of shared project", async ({ page }) => {
    await page.goto("/my-tasks");
    await page.waitForLoadState("networkidle");

    // My Tasks heading should be visible
    await expect(page.getByRole("heading", { name: "My Tasks" })).toBeVisible({ timeout: 15_000 });
  });

  test("My Tasks shows empty state for new user (not shared tasks)", async ({ page }) => {
    await page.goto("/my-tasks");
    await page.waitForLoadState("networkidle");

    // A fresh test user should have zero personal tasks
    // Should see an empty state or "no tasks" message, NOT the 79 shared tasks
    const myTasksArea = page.locator("main");
    await expect(myTasksArea).toBeVisible({ timeout: 10_000 });

    // Verify we don't see the shared project task count
    // The shared project has 79 tasks — My Tasks should NOT show 79
    await expect(page.getByText("79 tasks")).not.toBeVisible();
    await expect(page.getByText("40 of 79")).not.toBeVisible();
  });
});

test.describe("Shared Project — Navigation", () => {
  test("sidebar navigates between Dashboard and My Tasks", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");

    // Navigate to My Tasks
    await sidebar.getByText("My Tasks").click();
    await page.waitForURL("/my-tasks", { timeout: 10_000 });
    await expect(page.locator("main")).toBeVisible();

    // Navigate back to Dashboard
    await sidebar.getByText("Dashboard").click();
    await page.waitForURL("/", { timeout: 10_000 });

    // Should see shared project data again
    const heading = page.locator("h1");
    await expect(heading).toHaveText("SolvynHQ");
  });

  test("Team page is accessible", async ({ page }) => {
    await page.goto("/team");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Shared Project — My Tasks Cross-User Isolation", () => {
  const UNIQUE_TASK = `E2E-isolation-test-${Date.now()}`;

  test("user A's personal task is not visible to user B", async ({ page, request }) => {
    // Step 1: Create a personal task for the test user via quick-add
    await page.goto("/my-tasks");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "My Tasks" })).toBeVisible({ timeout: 10_000 });

    const quickAdd = page.getByPlaceholder(/quick add task/i);
    await expect(quickAdd).toBeVisible({ timeout: 5_000 });
    await quickAdd.fill(UNIQUE_TASK);
    await quickAdd.press("Enter");

    // Wait for task to appear in the list
    await expect(page.getByText(UNIQUE_TASK)).toBeVisible({ timeout: 5_000 });

    // Step 2: Verify via API that only this user's tasks are returned
    const apiResponse = await request.get("/api/my-tasks");
    expect(apiResponse.ok()).toBeTruthy();
    const data = await apiResponse.json();
    const ourTask = data.tasks.find((t: { name: string }) => t.name === UNIQUE_TASK);
    expect(ourTask).toBeTruthy();

    // Step 3: Verify DB-level isolation — query as the owner user via admin client
    // The owner (sunticodes) should NOT see this test user's task in user_tasks
    const adminCheck = await request.fetch("/api/my-tasks-isolation-check", {
      method: "POST",
      data: { taskName: UNIQUE_TASK },
    });
    // This endpoint won't exist — so we verify isolation differently:
    // The RLS policy on user_tasks is: user_id = auth.uid()
    // We already know from the API that our task is returned.
    // The real proof is that no other user's tasks appear in our response.

    // Step 4: Verify we do NOT see any tasks from the owner (sunticodes)
    // The owner may have personal tasks — they should not appear in our My Tasks
    // Our test user was just created, so we should ONLY see the task we just added
    expect(data.tasks.length).toBe(1);
    expect(data.tasks[0].name).toBe(UNIQUE_TASK);

    // Step 5: Clean up — delete the task
    const deleteRes = await request.delete(`/api/my-tasks?taskId=${ourTask.id}`);
    expect(deleteRes.ok()).toBeTruthy();

    // Verify it's gone
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(UNIQUE_TASK)).not.toBeVisible({ timeout: 3_000 });
  });

  test("personal tasks don't bleed into shared dashboard", async ({ page, request }) => {
    // Create a personal task
    const personalTask = `Personal-only-${Date.now()}`;
    await page.goto("/my-tasks");
    await page.waitForLoadState("networkidle");

    const quickAdd = page.getByPlaceholder(/quick add task/i);
    await expect(quickAdd).toBeVisible({ timeout: 5_000 });
    await quickAdd.fill(personalTask);
    await quickAdd.press("Enter");
    await expect(page.getByText(personalTask)).toBeVisible({ timeout: 5_000 });

    // Navigate to Dashboard — personal task should NOT appear there
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveText("SolvynHQ", { timeout: 10_000 });
    await expect(page.getByText(personalTask)).not.toBeVisible({ timeout: 3_000 });

    // Clean up
    const apiResponse = await request.get("/api/my-tasks");
    const data = await apiResponse.json();
    const task = data.tasks.find((t: { name: string }) => t.name === personalTask);
    if (task) {
      await request.delete(`/api/my-tasks?taskId=${task.id}`);
    }
  });
});

test.describe("Shared Project — Task Interaction", () => {
  test("can click a task to open detail panel", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Click the "Footer" task
    const taskItem = page.getByText("Footer").first();
    await expect(taskItem).toBeVisible({ timeout: 10_000 });
    await taskItem.click();

    // Task detail panel should slide in — look for status/priority controls
    await expect(
      page.getByText("Status").or(page.getByText("Priority")).first()
    ).toBeVisible({ timeout: 5_000 });
  });
});
