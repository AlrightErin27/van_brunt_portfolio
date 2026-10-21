import type { ImageMetadata } from "astro";
import svMarketBanner from "../../../assets/audits/scotts-valley-market/svMarket-banner.webp";

/* Individual PDF report information */
export type AuditReport = {
  title: string;
  description: string;
  pageCount: number;
  pdfHref: string;
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
  pdfHref: string;
  videoUrl: string;
  reflectionUrl: string;
};

export const audits: Audit[] = [
  {
    slug: "public-sector",
    title: "Public-Sector Accessibility Audit",
    siteName: "Site name coming soon",
    category: "Public Sector",
    introduction:
      "A short explanation of the site and why I selected it for this accessibility audit.",
    scope: "A representative set of pages and user flows will be evaluated.",
    methodology: [
      "Keyboard testing",
      "VoiceOver testing",
      "Zoom and reflow testing",
      "Automated accessibility testing",
      "Manual WCAG 2.2 Level AA review",
    ],
    pdfHref: "",
    videoUrl: "",
    reflectionUrl: "",
  },

  {
    slug: "portfolio",
    title: "Portfolio Accessibility Audit",
    siteName: "Erin Van Brunt Accessibility Portfolio",
    category: "Portfolio",
    introduction:
      "An accessibility audit of my own portfolio, including remediation and retesting.",
    scope:
      "The portfolio will be evaluated across its primary pages and core navigation.",
    methodology: [
      "Keyboard testing",
      "VoiceOver testing",
      "Zoom and reflow testing",
      "Automated accessibility testing",
      "Manual WCAG 2.2 Level AA review",
    ],
    pdfHref: "",
    videoUrl: "",
    reflectionUrl: "",
  },
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
    reports: [
      {
        title: "Keyboard Accessibility Evaluation",
        description:
          "A 28-page manual keyboard accessibility evaluation covering the homepage, shared components, product detail, shopping cart, and checkout entry. Includes confirmed WCAG 2.2 findings, reproduction steps, user impact, and remediation recommendations.",
        pageCount: 28,
        pdfHref: "/audits/ScottsValleyMarketKeyboardEvaluation.pdf",
      },
      {
        title: "Semantic HTML & Accessible Name Review",
        description:
          "A 16-page evaluation of the homepage's semantic structure, landmarks, headings, interactive elements, and accessible names. Includes confirmed findings, recommendations, WCAG coverage documentation, and limitations resulting from the website redesign.",
        pageCount: 16,
        pdfHref: "/audits/ScottsValleyMarketSemanticEvaluation.pdf",
      },
    ],
    pdfHref: "",
    videoUrl: "",
    reflectionUrl:
      "https://medium.com/@erinmontybruce/when-the-website-changes-mid-audit-reflections-on-scotts-valley-market-670da1b73ff7?postPublishedType=initial",
  },
];
