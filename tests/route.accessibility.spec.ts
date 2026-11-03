import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

// 📍 Select one route or all previously registered routes.
const testAllRoutes = process.env.A11Y_ALL_ROUTES === "1";

const routes: string[] = testAllRoutes
  ? JSON.parse(
      readFileSync(new URL("./a11y-routes.json", import.meta.url), "utf8"),
    )
  : [process.env.A11Y_ROUTE ?? "/"];

// ♿ Create a separate accessibility test for each selected route.
for (const route of routes) {
  test.describe(`♿ Accessibility scan: ${route}`, () => {
    test("has no automatically detectable WCAG 2.2 A/AA violations", async ({
      page,
    }) => {
      // 📍 Confirm the requested page loads successfully.
      const response = await page.goto(route);

      expect(response?.ok(), `Route ${route} must load successfully`).toBe(
        true,
      );

      // 🔎 Run axe-core against the selected page.
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      // 📊 Display all rule results.
      const categories = [
        { key: "passes", label: "✅ PASSES" },
        { key: "violations", label: "❌ VIOLATIONS" },
        { key: "incomplete", label: "⚠️ INCOMPLETE" },
        { key: "inapplicable", label: "➖ INAPPLICABLE" },
      ] as const;

      console.log(`\n📍 === RESULTS FOR: ${route} ===`);

      for (const { key, label } of categories) {
        console.log(`\n${label} (${results[key].length})`);

        for (const rule of results[key]) {
          console.log(`${rule.id}: ${rule.description}`);
        }
      }

      // 🔍 Explain findings requiring additional review.
      console.log("\n🔍 === FINDINGS REQUIRING REVIEW ===\n");

      if (results.incomplete.length === 0) {
        console.log("✅ No incomplete checks reported.");
      }

      for (const rule of results.incomplete) {
        console.log(`\n⚠️ Needs review: ${rule.id}`);

        for (const node of rule.nodes) {
          console.log("📍 Element:", node.target.join(" > "));

          for (const check of [...node.any, ...node.all, ...node.none]) {
            console.log("   Reason:", check.message);
          }
        }
      }

      // ✅ Fail this route's test if axe-core detects violations.
      expect(results.violations).toEqual([]);
    });
  });
}
