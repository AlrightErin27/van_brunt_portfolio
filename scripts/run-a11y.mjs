import { createInterface } from "node:readline/promises";
import { stdin, stdout, stderr } from "node:process";
import { spawn } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  appendFileSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";

const terminal = createInterface({ input: stdin, output: stdout });

const registryPath = join("tests", "a11y-routes.json");
let reportPath = null;

try {
  console.log("\n♿ === Accessibility QA Runner ===\n");

  // 🔎 Select the testing scope.
  const choice = (
    await terminal.question(
      "🔎 Test (1) a specific route or (2) all registered routes? ",
    )
  ).trim();

  if (!["1", "2"].includes(choice)) {
    throw new Error("Please select 1 or 2.");
  }

  let route = null;

  // 📍 Request a route for single-page testing.
  if (choice === "1") {
    route = (
      await terminal.question("📍 Enter page route (e.g. /resume): ")
    ).trim();

    if (!route.startsWith("/") || route.startsWith("//")) {
      throw new Error("Enter a local route beginning with /.");
    }
  }

  // 📚 Load the registered testing routes.
  const registeredRoutes = JSON.parse(readFileSync(registryPath, "utf8"));

  if (
    !Array.isArray(registeredRoutes) ||
    !registeredRoutes.every(
      (item) => typeof item === "string" && item.startsWith("/"),
    )
  ) {
    throw new Error("The accessibility route registry is invalid.");
  }

  if (choice === "2" && registeredRoutes.length === 0) {
    throw new Error("No routes have been registered yet.");
  }

  // 📝 Capture a note for the testing history.
  const note = (await terminal.question("📝 Testing note (required): ")).trim();

  if (!note) {
    throw new Error("A testing note is required.");
  }

  const timestamp = new Date().toISOString();
  const testRoutes = choice === "1" ? [route] : registeredRoutes;

  console.log("\n📋 === Test Run Details ===");
  console.log(`🕒 Timestamp: ${timestamp}`);
  console.log(`📍 Scope: ${choice === "1" ? route : "All registered routes"}`);
  console.log(`📝 Note: ${note}`);

  if (choice === "2") {
    console.log("\n📚 Registered routes:");
    for (const path of registeredRoutes) {
      console.log(`   • ${path}`);
    }
  }

  // 📁 Save each report as a timestamped file using local time.
  const date = new Date(timestamp);
  const month = date.toLocaleString("en-US", { month: "short" });
  const pad = (value) => String(value).padStart(2, "0");

  const fileName =
    `${month}${pad(date.getDate())}_${date.getFullYear()}_` +
    `${pad(date.getHours())}-${pad(date.getMinutes())}-` +
    `${pad(date.getSeconds())}.txt`;

  mkdirSync("a11y-reports", { recursive: true });

  reportPath = join("a11y-reports", fileName);

  // 📋 Save the testing context.
  writeFileSync(
    reportPath,
    [
      "♿ ACCESSIBILITY QA TEST REPORT",
      "===================================",
      `Started: ${timestamp}`,
      `Scope: ${choice === "1" ? "Single route" : "All registered routes"}`,
      `Routes: ${testRoutes.join(", ")}`,
      `Testing Note: ${note}`,
      "",
      "=== PLAYWRIGHT & AXE-CORE RESULTS ===",
      "",
    ].join("\n"),
    "utf8",
  );

  // 🚀 Release terminal input and start Playwright.
  terminal.close();

  console.log("\n🚀 === Running Accessibility Tests ===\n");

  const child = spawn(
    "npx",
    ["playwright", "test", "tests/route.accessibility.spec.ts"],
    {
      env: {
        ...process.env,
        A11Y_ROUTE: route ?? "/",
        A11Y_ALL_ROUTES: choice === "2" ? "1" : "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  // 📊 Display verbose results and save them to the report.
  const saveOutput = (stream, destination) => {
    stream.on("data", (chunk) => {
      destination.write(chunk);
      appendFileSync(reportPath, chunk);
    });
  };

  saveOutput(child.stdout, stdout);
  saveOutput(child.stderr, stderr);

  // ⏳ Wait for Playwright to finish.
  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => resolve(code ?? 1));
  });

  process.exitCode = exitCode;

  // 📌 Register new routes only after successful single-route tests.
  if (choice === "1" && exitCode === 0) {
    if (!registeredRoutes.includes(route)) {
      registeredRoutes.push(route);

      writeFileSync(
        registryPath,
        JSON.stringify(registeredRoutes, null, 2) + "\n",
      );

      console.log(`\n📌 New route registered: ${route}`);
      appendFileSync(reportPath, `\nRegistered route: ${route}\n`);
    } else {
      console.log(`\n📌 Route already registered: ${route}`);
    }
  }

  // ✅ Record the final test verdict.
  const verdict =
    exitCode === 0
      ? "PASS — No automated test failures detected"
      : "FAIL — Review the accessibility test results";

  appendFileSync(
    reportPath,
    [
      "",
      "=== FINAL VERDICT ===",
      `Completed: ${new Date().toISOString()}`,
      `Result: ${verdict}`,
      "",
    ].join("\n"),
  );

  console.log(
    exitCode === 0
      ? "\n✅ Accessibility tests passed!"
      : "\n❌ Accessibility tests failed. Review the findings.",
  );

  console.log(`\n📁 Detailed report saved to: ${reportPath}`);
} catch (error) {
  console.error(`\n❌ Error: ${error.message}`);

  if (reportPath) {
    appendFileSync(reportPath, `\nERROR: ${error.message}\n`);
  }

  process.exitCode = 1;
} finally {
  terminal.close();
}
