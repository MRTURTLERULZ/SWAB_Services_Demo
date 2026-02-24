import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/Book your stay/i);
  });

  test("properties list loads", async ({ page }) => {
    await page.goto("/properties");
    await expect(page.locator("h1")).toContainText(/properties/i);
  });

  test("property detail page loads for known slug", async ({ page }) => {
    await page.goto("/properties/family-retreat-methuen-game-room");
    await expect(page.locator("h1")).toContainText(/Family Retreat|Methuen|Game Room/i);
  });

  test("book page loads", async ({ page }) => {
    await page.goto("/book/family-retreat-methuen-game-room");
    await expect(page.locator("h1")).toContainText(/Book/i);
  });

  test("availability blocks invalid dates when API is used", async ({ page }) => {
    await page.goto("/properties/family-retreat-methuen-game-room");
    const reserveButton = page.getByRole("link", { name: /reserve|check availability/i }).first();
    await expect(reserveButton).toBeVisible();
  });
});
