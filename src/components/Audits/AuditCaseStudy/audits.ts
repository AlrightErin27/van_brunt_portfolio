import type { ImageMetadata } from "astro";
import svMarketBanner from "../../../assets/audits/scotts-valley-market/svMarket-banner.jpg";
import evbPortfolioBanner from "../../../assets/audits/evb-portfolio/evbPortfolio-banner.jpg";

/* =========================================================
   AUDIT TYPES
   ========================================================= */

// Individual PDF report information.
// page groups reports by evaluated page.
// role distinguishes consolidated reports from supporting evaluations.
export type AuditReport = {
  title: string;
  description: string;
  pageCount: number;
  pdfHref: string;
  page?: string;
  role?: "main" | "supporting";
};

/* Blog posts associated with an accessibility audit */
export type AuditReflectionPost = {
  title: string;
  url: string;
};

export type Audit = {
  slug: string;
  title: string;
  heroImg?: ImageMetadata;
  siteName: string;
  siteUrl?: string;
  category: string;
  introduction: string;
  scope: string;
  methodology: string[];
  reports?: AuditReport[];
  disclaimer?: string;
  videoUrl?: string;
  reflectionPosts?: AuditReflectionPost[];
};

/* =========================================================
   ACCESSIBILITY AUDITS
   ========================================================= */

export const audits: Audit[] = [
  // {
  //   slug: "public-sector",
  //   title: "Public-Sector Accessibility Audit",
  //   siteName: "Site name coming soon",
  //   category: "Public Sector",
  //   introduction:
  //     "A short explanation of the site and why I selected it for this accessibility audit.",
  //   scope:
  //     "A representative set of pages and user flows will be evaluated.",
  //   methodology: [
  //     "Keyboard testing",
  //     "VoiceOver testing",
  //     "Zoom and reflow testing",
  //     "Automated accessibility testing",
  //     "Manual WCAG 2.2 Level AA review",
  //   ],
  //   disclaimer: "",
  //   videoUrl: "",
  //   reflectionUrl: "",
  // },

  /* =======================================================
     ERIN VAN BRUNT PORTFOLIO
     ======================================================= */

  {
    slug: "evb-portfolio",
    title: "Portfolio Accessibility Audit",
    heroImg: evbPortfolioBanner,
    siteName: "Erin Van Brunt Accessibility Portfolio",
    siteUrl: "https://van-brunt-portfolio.vercel.app/",
    category: "Personal Portfolio",

    introduction:
      "An ongoing accessibility evaluation of my professional portfolio, built with Astro. The completed Home page audit examines keyboard accessibility, semantic HTML, visual and responsive accessibility, screen-reader compatibility, and automated test results against WCAG 2.2 Level A and AA. The evaluation documents my testing methodology, evidence, and findings, with additional portfolio pages to be evaluated as development progresses.",

    scope:
      "The completed evaluation covers the Home page, including its shared header, primary navigation, main content, and footer. Testing includes keyboard interactions, semantic HTML and accessibility-tree inspection, visual contrast, responsive behavior, zoom, pointer interactions, Safari with VoiceOver, and automated accessibility analysis. Selected cross-page consistency checks were also performed. Other portfolio routes will be evaluated separately. The completed Home page evaluation identified no confirmed WCAG 2.2 Level A or AA failures within its documented testing scope.",

    methodology: [
      "Manual keyboard navigation, focus, and interaction testing",
      "Semantic HTML, ARIA, and accessibility-tree inspection using Chrome DevTools",
      "Visual contrast, zoom, text spacing, and responsive reflow testing",
      "Assistive technology evaluation using Safari with VoiceOver",
      "Automated accessibility testing using axe DevTools, WAVE, Playwright, and axe-core",
      "W3C HTML validation and targeted WCAG 2.2 Level A/AA assessment",
    ],

    reports: [
      /* HOME — MAIN CONSOLIDATED REPORT */

      {
        page: "Home",
        role: "main",
        title: "Home Page Accessibility Evaluation Report",
        description:
          "Consolidated results, methodology, observations, and final assessment.",
        pageCount: 4,
        pdfHref: "/audits/evb-portfolio/EvbPortfolioAccessibilityAudit.pdf",
      },

      /* HOME — SUPPORTING EVALUATIONS */

      {
        page: "Home",
        role: "supporting",
        title: "Keyboard Accessibility Evaluation",
        description:
          "Manual keyboard navigation, focus order, activation, skip links, and keyboard operability.",
        pageCount: 2,
        pdfHref: "/audits/evb-portfolio/EvbPortfolioKeyboardEvaluation.pdf",
      },

      {
        page: "Home",
        role: "supporting",
        title: "Semantic HTML Evaluation",
        description:
          "Document structure, landmarks, headings, accessible names, ARIA, and accessibility-tree inspection.",
        pageCount: 3,
        pdfHref: "/audits/evb-portfolio/EvbPortfolioSemanticEvaluation.pdf",
      },

      {
        page: "Home",
        role: "supporting",
        title: "Visual & VoiceOver Evaluation",
        description:
          "Color contrast, responsive behavior, zoom, text spacing, pointer interactions, and Safari with VoiceOver.",
        pageCount: 4,
        pdfHref:
          "/audits/evb-portfolio/EvbPortfolioVisualAccessibilityEvaluation.pdf",
      },

      {
        page: "Home",
        role: "supporting",
        title: "Automated Accessibility Evaluation",
        description:
          "Playwright and axe-core automated testing, rule-level results, and documented observations.",
        pageCount: 3,
        pdfHref: "/audits/evb-portfolio/EvbPortfolioAutomatedEvaluation.pdf",
      },
    ],

    videoUrl: "",

    reflectionPosts: [
      {
        title: "I Built an Accessibility Testing Framework for My Portfolio.",
        url: "https://medium.com/@erinmontybruce/i-built-an-accessibility-testing-framework-for-my-portfolio-748e7c75f03c?sharedUserId=erinmontybruce",
      },
    ],
  },

  /* =======================================================
     SCOTTS VALLEY MARKET
     ======================================================= */

  {
    slug: "scotts-valley-market",
    title: "Scotts Valley Market Accessibility Audit",
    heroImg: svMarketBanner,
    siteName: "Scotts Valley Market",
    siteUrl: "https://www.scottsvalleymarket.com/",
    category: "E-Commerce",

    introduction:
      "Scotts Valley Market is a locally owned grocery store with an online shopping experience. I selected this website to evaluate accessibility across everyday e-commerce interactions, including navigation, product selection, shopping cart functionality, and checkout entry. During the evaluation, the website underwent a significant redesign, preventing completion of the original audit. This case study documents the testing completed and findings confirmed before the redesign.",

    scope:
      "The completed evaluation covered keyboard accessibility across the homepage, shared navigation and interactive components, a product detail page, the shopping cart, and checkout entry. A separate semantic HTML and accessible-name review examined the homepage. Testing was conducted against WCAG 2.2 Level A and AA success criteria within the evaluated scope. The redesign interrupted the remaining planned testing, so this evaluation does not establish full WCAG conformance.",

    methodology: [
      "Manual keyboard testing using Chrome on macOS",
      "Keyboard navigation, activation, focus order, and focus visibility testing",
      "Semantic HTML and document structure inspection",
      "Accessible name and role inspection using Chrome DevTools",
      "WCAG-EM-informed evaluation and targeted WCAG 2.2 A/AA findings documentation",
    ],

    // No main report yet: retain standalone PDF cards.
    reports: [
      {
        title: "Keyboard Accessibility Evaluation",
        description:
          "A 28-page manual keyboard accessibility evaluation covering the homepage, shared components, product detail, shopping cart, and checkout entry. Includes confirmed WCAG 2.2 findings, reproduction steps, user impact, and remediation recommendations.",
        pageCount: 28,
        pdfHref:
          "/audits/scotts-valley-market/ScottsValleyMarketKeyboardEvaluation.pdf",
      },
      {
        title: "Semantic HTML & Accessible Name Review",
        description:
          "A 16-page evaluation of the homepage's semantic structure, landmarks, headings, interactive elements, and accessible names. Includes confirmed findings, recommendations, WCAG coverage documentation, and limitations resulting from the website redesign.",
        pageCount: 16,
        pdfHref:
          "/audits/scotts-valley-market/ScottsValleyMarketSemanticEvaluation.pdf",
      },
    ],

    disclaimer:
      "This independent accessibility evaluation was conducted in October 2026 solely for educational purposes and inclusion in my personal professional portfolio. It was not commissioned, sponsored, authorized, or endorsed by Scotts Valley Market, and no affiliation with the business is implied. The findings document observations made during testing of the website as it existed at that time, before a significant redesign interrupted the evaluation. Results are limited to the specific pages, components, and interactions examined and should not be interpreted as a comprehensive WCAG conformance assessment, a legal compliance determination, or a representation of the accessibility of the current website. All findings and recommendations are presented in good faith for technical analysis, professional development, and accessibility education.",
    reflectionPosts: [
      {
        title:
          "When the Website Changes Mid-Audit: Reflections on Scotts Valley Market",
        url: "https://medium.com/@erinmontybruce/when-the-website-changes-mid-audit-reflections-on-scotts-valley-market-670da1b73ff7?sharedUserId=erinmontybruce",
      },
    ],
  },
];
