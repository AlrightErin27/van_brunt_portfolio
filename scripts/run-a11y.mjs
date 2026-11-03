import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
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

  if (choice === "1") {
    route = (
      await terminal.question("📍 Enter page route (e.g. /resume): ")
    ).trim();

    if (!route.startsWith("/") || route.startsWith("//")) {
      throw new Error("Enter a local route beginning with /.");
    }
  }

  // 📚 Load registered routes.
  const registeredRoutes = JSON.parse(readFileSync(registryPath, "utf8"));

  if (
    !Array.isArray(registeredRoutes) ||
    !registeredRoutes.every(
      (item) =>
        typeof item === "string" &&
        item.startsWith("/") &&
        !item.startsWith("//"),
    )
  ) {
    throw new Error("The accessibility route registry is invalid.");
  }

  if (choice === "2" && registeredRoutes.length === 0) {
    throw new Error("No routes have been registered yet.");
  }

  // 📝 Capture the testing note.
  const note = (await terminal.question("📝 Testing note (required): ")).trim();

  if (!note) {
    throw new Error("A testing note is required.");
  }

  const date = new Date();
  const timestamp = date.toISOString();
  const testRoutes = choice === "1" ? [route] : registeredRoutes;

  console.log("\n📋 === Test Run Details ===");
  console.log(`🕒 Timestamp: ${timestamp}`);
  console.log(`📍 Routes: ${testRoutes.join(", ")}`);
  console.log(`📝 Note: ${note}`);

  if (choice === "2") {
    console.log("\n📚 Registered routes:");

    for (const path of registeredRoutes) {
      console.log(`   • ${path}`);
    }
  }

  // 🚀 Run Playwright before creating a report.
  terminal.close();
  console.log("\n🚀 Running accessibility tests...\n");

  const child = spawn(
    "npx",
    ["playwright", "test", "tests/route.accessibility.spec.ts", "--workers=1"],
    {
      env: {
        ...process.env,
        A11Y_ROUTE: route ?? "/",
        A11Y_ALL_ROUTES: choice === "2" ? "1" : "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  // 📋 Capture complete output for possible reporting.
  let capturedOutput = "";

  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", (chunk) => {
      capturedOutput += chunk.toString("utf8");
    });
  }

  // ⏳ Wait for Playwright to finish.
  let exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => resolve(code ?? 1));
  });

  // 📊 Extract completed axe-core scans.
  console.log("\n📊 === Accessibility Scan Summary ===\n");

  const sections = capturedOutput.split(/📍 === RESULTS FOR: (.+?) ===/g);

  const scannedRoutes = [];

  for (let i = 1; i < sections.length; i += 2) {
    const scannedRoute = sections[i].trim();
    const details = sections[i + 1] ?? "";

    const getCount = (category) => {
      const match = details.match(new RegExp(`${category} \\((\\d+)\\)`));

      return match ? Number(match[1]) : null;
    };

    const passes = getCount("PASSES");
    const violations = getCount("VIOLATIONS");
    const incomplete = getCount("INCOMPLETE");
    const inapplicable = getCount("INAPPLICABLE");

    if (
      passes === null ||
      violations === null ||
      incomplete === null ||
      inapplicable === null
    ) {
      console.log(`⚠️ ${scannedRoute}: Results unavailable\n`);
      continue;
    }

    scannedRoutes.push(scannedRoute);

    console.log(`${violations === 0 ? "✅" : "❌"} Route: ${scannedRoute}`);
    console.log(`   ✅ Passing rules: ${passes}`);
    console.log(`   ❌ Violations: ${violations}`);
    console.log(`   ⚠️ Incomplete rules: ${incomplete}`);
    console.log(`   ➖ Inapplicable rules: ${inapplicable}\n`);
  }

  // ⚠️ Never treat missing scan results as a successful test.
  const allScansCompleted = testRoutes.every((path) =>
    scannedRoutes.includes(path),
  );

  if (exitCode === 0 && !allScansCompleted) {
    exitCode = 1;
  }

  process.exitCode = exitCode;

  if (scannedRoutes.length === 0) {
    console.log("⚠️ No valid route completed an axe-core scan.");
  }

  // 🚨 Show concise violations while keeping the full report.
  if (exitCode !== 0) {
    console.log("\n🚨 === Accessibility Violations ===\n");

    const violationBlocks = [
      ...capturedOutput.matchAll(
        /🚨 === VIOLATION DETAILS FOR: ([^\r\n]+) ===\r?\n([\s\S]*?)\r?\n🚨 === END VIOLATION DETAILS ===/g,
      ),
    ];

    if (violationBlocks.length > 0) {
      for (const [, failedRoute, details] of violationBlocks) {
        console.log(`📍 Route: ${failedRoute}`);
        console.log(details.trim());
        console.log("");
      }
    } else {
      // 🔍 Show useful errors if no axe-core violation was logged.
      const errors = capturedOutput
        .split(/\r?\n/)
        .filter((line) =>
          /Error:|Route .*must load successfully|Expected:|Received:/.test(
            line,
          ),
        )
        .slice(0, 8);

      console.log(
        errors.join("\n") || "No completed violation details available.",
      );
    }

    // 🧩 Preserve the failing Playwright assertion and its code location.
    const failingLine = capturedOutput.match(/^\s*>\s*\d+\s*\|.*$/m);

    const sourceLocation = capturedOutput.match(
      /^\s*at (.*tests\/[^\r\n]+\.spec\.ts:\d+:\d+)\s*$/m,
    );

    if (failingLine || sourceLocation) {
      console.log("\n🧩 === Test Failure Location ===");

      if (failingLine) {
        console.log(failingLine[0].trim());
      }

      if (sourceLocation) {
        console.log(sourceLocation[1]);
      }
    }

    if (scannedRoutes.length > 0) {
      console.log("\n📁 Full failure details will be saved in the report.");
    }
  }

  const verdict =
    exitCode === 0
      ? "PASS — No automated test failures detected"
      : "FAIL — Review the accessibility test results";

  // 📁 Save a report only if an axe-core scan completed.
  if (scannedRoutes.length > 0) {
    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const pad = (value) => String(value).padStart(2, "0");

    const fileName =
      `${month}${pad(date.getDate())}_${date.getFullYear()}_` +
      `${pad(date.getHours())}-${pad(date.getMinutes())}-` +
      `${pad(date.getSeconds())}-${pad(date.getMilliseconds())}.txt`;

    mkdirSync("a11y-reports", { recursive: true });
    reportPath = join("a11y-reports", fileName);

    writeFileSync(
      reportPath,
      [
        "♿ ACCESSIBILITY QA TEST REPORT",
        "===================================",
        `Started: ${timestamp}`,
        `Completed: ${new Date().toISOString()}`,
        `Scope: ${choice === "1" ? "Single route" : "All registered routes"}`,
        `Requested Routes: ${testRoutes.join(", ")}`,
        `Scanned Routes: ${scannedRoutes.join(", ")}`,
        `Testing Note: ${note}`,
        "",
        "=== PLAYWRIGHT & AXE-CORE RESULTS ===",
        "",
        capturedOutput,
        "",
        "=== FINAL VERDICT ===",
        `Result: ${verdict}`,
        "",
      ].join("\n"),
      "utf8",
    );
  }

  // 📌 Register valid routes, even when accessibility tests fail.
  if (choice === "1" && scannedRoutes.includes(route)) {
    if (!registeredRoutes.includes(route)) {
      registeredRoutes.push(route);

      writeFileSync(
        registryPath,
        JSON.stringify(registeredRoutes, null, 2) + "\n",
      );

      console.log(`📌 New route registered: ${route}`);

      if (reportPath) {
        appendFileSync(reportPath, `Registered route: ${route}\n`);
      }
    } else {
      console.log(`📌 Route already registered: ${route}`);
    }
  }

  // ✅ Display the final verdict.
  console.log(
    exitCode === 0
      ? "\n✅ Accessibility tests passed!"
      : "\n❌ Accessibility tests failed.",
  );

  if (reportPath) {
    console.log(`\n📁 Detailed report saved to: ${reportPath}`);
  } else {
    console.log("\n📁 No report created — no valid route completed a scan.");
  }
} catch (error) {
  console.error(`\n❌ Error: ${error.message}`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
