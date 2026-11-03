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

This project uses **Playwright** and **axe-core** to implement automated accessibility regression testing targeting WCAG 2.2 Level AA.

Automated testing supplements previously completed manual accessibility evaluations covering keyboard navigation, semantic HTML, visual accessibility, and Safari VoiceOver.

### Testing Tools

- **Playwright (`@playwright/test`):** Browser automation, test execution, and assertions.
- **axe-core (`@axe-core/playwright`):** Automated WCAG accessibility rule checks integrated with Playwright.
- **Chromium:** Browser environment for local automated testing.

### Running the Tests

Install project dependencies:

```bash
npm install
```

Install Playwright's Chromium browser:

```bash
npx playwright install chromium
```

Run the automated tests:

```bash
npx playwright test
```

Playwright automatically starts the local Astro development server when needed, launches Chromium, and executes the tests.
