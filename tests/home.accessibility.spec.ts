import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home page accessibility", () => {
  test("has no automatically detectable WCAG 2.2 A/AA violations", async ({
    page,
  }) => {
    await page.goto("/");

    // Scan the Home page and shared components.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
