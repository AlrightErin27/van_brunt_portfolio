export type Audit = {
    slug: string;
    title: string;
    siteName: string;
    category: string;
    introduction: string;
    scope: string;
    methodology: string[];
    pdfHref: string;
    videoUrl: string;
    reflectionUrl: string;
};

export const audits: Audit[] = [
    {
        slug: "e-commerce",
        title: "E-Commerce Accessibility Audit",
        siteName: "Site name coming soon",
        category: "E-Commerce",
        introduction:
            "A short explanation of the site and why I selected it for this accessibility audit.",
        scope:
            "A representative set of pages and user flows will be evaluated.",
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
        slug: "public-sector",
        title: "Public-Sector Accessibility Audit",
        siteName: "Site name coming soon",
        category: "Public Sector",
        introduction:
            "A short explanation of the site and why I selected it for this accessibility audit.",
        scope:
            "A representative set of pages and user flows will be evaluated.",
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
];