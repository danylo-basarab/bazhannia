import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://bazhannia.vercel.app/signin");

  await expect(page).toHaveTitle("бажання");
});
