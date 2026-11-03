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

    for (const status of [
      "passes",
      "violations",
      "incomplete",
      "inapplicable",
    ] as const) {
      console.log(`\n${status.toUpperCase()} (${results[status].length})`);

      for (const rule of results[status]) {
        console.log(`${rule.id}: ${rule.description}`);
      }
    }

    console.log(
      "         *******************EXPLANATION OF RESULTS:*******************",
    );

    for (const rule of results.incomplete) {
      console.log(`Needs review: ${rule.id}`);

      for (const node of rule.nodes) {
        console.log("Element:", node.target.join(" > "));

        for (const check of [...node.any, ...node.all, ...node.none]) {
          console.log("Reason:", check.message);
        }
      }
    }

    expect(results.violations).toEqual([]);
  });
});
