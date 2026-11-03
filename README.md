# Van Brunt Portfolio

My personal portfolio website, built with Astro and React and deployed with Vercel.

This site documents my software engineering work and my transition into digital accessibility, with a focus on accessibility evaluation, inclusive development, and quality assurance.

## Live Site

https://van-brunt-portfolio.vercel.app/

## Tech Stack

- Astro
- React
- TypeScript
- Vercel

## Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

The site will be available locally at:

`http://localhost:4321`

Build the site for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The site is deployed through Vercel.

Changes pushed to the `main` branch on GitHub automatically trigger a new production deployment.

## Accessibility Testing

This project implements automated accessibility regression testing using **Playwright** and **axe-core**, targeting applicable WCAG 2.2 Level A and AA success criteria.

The testing framework is designed to identify automatically detectable accessibility issues, document findings, and monitor previously tested pages as the website evolves.

Automated testing complements manual accessibility evaluations involving keyboard navigation, semantic HTML, visual accessibility, and Safari VoiceOver. Automated scans cannot establish full WCAG conformance on their own.

### Testing Tools

- **Playwright (`@playwright/test`):** Browser automation, test execution, and assertions.
- **axe-core (`@axe-core/playwright`):** Automated accessibility rule checks integrated with Playwright.
- **Chromium:** Browser environment used for automated testing.
- **Node.js:** Runs the interactive testing interface, manages the route registry, and generates reports.

### Setup

Install project dependencies:

```bash
npm install
```

Install Playwright's Chromium browser:

```bash
npx playwright install chromium
```

### Running Accessibility Tests

Start the interactive accessibility testing runner:

```bash
npm run test:a11y
```

The runner provides two testing options:

**Option 1 — Test a Specific Route**

Enter a local route, such as `/resume` or `/audits`, to perform an accessibility scan of that page.

Valid routes are automatically added to the testing registry after a completed scan, regardless of whether accessibility violations are detected.

**Option 2 — Test All Registered Routes**

Automatically scan every route listed in `tests/a11y-routes.json`.

This supports regression testing across previously evaluated pages following website changes.

Both options require a testing note to document the purpose or context of the execution.

Playwright automatically starts the local Astro development server when needed, launches Chromium, and executes the selected tests.

### Test Results and Reporting

The terminal provides a concise summary for each tested route, including:

- Number of passing accessibility rules.
- Number of detected violations.
- Number of incomplete checks requiring review.
- Number of inapplicable rules.

When violations are detected, the terminal also identifies the affected elements, provides explanations, and displays the Playwright test assertion location.

Complete results are saved as timestamped text files in the `a11y-reports/` directory.

Example:

```text
a11y-reports/
  Nov03_2026_12-27-11-519.txt
```

Each report includes:

- Test date, time, and scope.
- Routes evaluated.
- Testing note.
- Full axe-core rule results.
- Details of incomplete checks and detected violations.
- Playwright diagnostic output and final test verdict.

Reports are stored locally and excluded from version control.

Invalid routes that do not complete an accessibility scan are not registered and do not generate a report.

### Test Organization

```text
playwright.config.ts
scripts/
  run-a11y.mjs
tests/
  a11y-routes.json
  route.accessibility.spec.ts
a11y-reports/
  [timestamped report files]
```

- `playwright.config.ts` configures the browser, test environment, and local development server.
- `scripts/run-a11y.mjs` manages the interactive testing workflow and report generation.
- `tests/a11y-routes.json` stores previously evaluated routes for regression testing.
- `tests/route.accessibility.spec.ts` executes the axe-core accessibility checks.
- `a11y-reports/` contains locally generated testing records.

### Testing Scope and Limitations

Current automated tests use axe-core rules associated with WCAG 2.0, 2.1, and 2.2 Level A and AA.

Passing automated tests indicate that no violations were detected by the configured rules during that execution. They do not guarantee that a page fully conforms to WCAG 2.2 AA.

Incomplete findings are documented for manual review rather than treated as automatic failures.

Future improvements may include custom Playwright assertions for keyboard interaction, focus management, skip navigation, semantic structure, and interactive component accessibility.

Manual testing remains an essential part of the accessibility evaluation process.
