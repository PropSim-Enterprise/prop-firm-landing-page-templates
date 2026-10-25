/**
 * EDIT THIS FILE to make the templates yours: firm name and logo, your
 * challenges and prices, where the buttons go, and your FAQ.
 *
 * Every template reads the same data, so you can switch designs at any time
 * without touching anything else. A template only shows what you give it: a
 * section with nothing real to show (no stats, no testimonials) is hidden.
 */
import type { PublicFirm, PublicPhase, PublicProduct, StorefrontConfig } from "../src";

/* ── 1. Demo mode ─────────────────────────────────────────────────────── */

/**
 * true: shows the demo bar and explains each button instead of following it.
 * Set to false before you put the site live.
 */
export const DEMO_MODE = true;

/* ── 2. Your firm ─────────────────────────────────────────────────────── */

export const FIRM: PublicFirm = {
  name: "Your Firm",
  slug: "your-firm",
  branding: {
    // Put your logo in /public and point to it. Without one, the name is shown.
    // logoUrl: "/logo.svg",        // used on both dark and light templates
    // logoUrlDark: "/logo-white.svg",
    // logoUrlLight: "/logo-dark.svg",
    logoHeight: 28,
    socialLinks: {
      // twitter: "https://x.com/yourfirm",
      // discord: "https://discord.gg/yourfirm",
      // telegram, instagram, youtube, tiktok, linkedin, website are supported too.
    },
    // Footer links. Each enabled page links to LINKS.legal[slug] below.
    legalPages: {
      "terms-of-service": { enabled: true, title: "Terms of Service" },
      "privacy-policy": { enabled: true, title: "Privacy Policy" },
      "risk-disclosure": { enabled: true, title: "Risk Disclosure" },
      "refund-policy": { enabled: true, title: "Refund Policy" },
    },
  },
  // SAMPLE NUMBERS. Replace them with your real figures, or delete `stats`
  // to hide the stats section. Never publish numbers you can't back up.
  stats: { totalTraders: 12_480, totalAccounts: 18_930, totalPayouts: 2_150_000 },
};

/* ── 3. Your challenges ───────────────────────────────────────────────── */

type Rule = PublicPhase["rules"][number];
const target = (percent: number): Rule => ({
  code: "PROFIT_TARGET",
  params: { targetPercent: percent },
});
const dailyLoss = (percent: number): Rule => ({
  code: "MAX_DAILY_LOSS",
  params: { maxPercent: percent },
});
const maxLoss = (percent: number): Rule => ({
  code: "MAX_OVERALL_LOSS",
  params: { maxPercent: percent },
});
const trailingLoss = (percent: number): Rule => ({
  code: "TRAILING_DRAWDOWN",
  params: { maxPercent: percent },
});
const minDays = (days: number): Rule => ({ code: "MIN_TRADING_DAYS", params: { minDays: days } });

const phase = (name: string, size: number, rules: Rule[], profitSplit: number | null = null) => ({
  phase: name,
  startingBalance: size,
  currency: "USD",
  leverage: 100,
  profitSplit,
  maxDurationDays: null,
  rules,
});

/** Two evaluation phases, then a funded account with an 80% profit split. */
const twoStep = (size: number): PublicPhase[] => [
  phase("PHASE_1", size, [target(8), dailyLoss(5), maxLoss(10), minDays(4)]),
  phase("PHASE_2", size, [target(5), dailyLoss(5), maxLoss(10), minDays(4)]),
  phase("FUNDED", size, [dailyLoss(5), maxLoss(10)], 0.8),
];

/** One evaluation phase with a trailing drawdown, then funded at 90%. */
const oneStep = (size: number): PublicPhase[] => [
  phase("PHASE_1", size, [target(10), dailyLoss(4), trailingLoss(6), minDays(3)]),
  phase("FUNDED", size, [dailyLoss(4), trailingLoss(6)], 0.9),
];

const challenge = (
  group: string,
  size: number,
  price: number,
  phases: PublicPhase[],
): PublicProduct => ({
  id: `${group.toLowerCase()}-${size / 1000}k`,
  name: `${size / 1000}K ${group} Challenge`,
  price,
  currency: "USD",
  group,
  template: {
    id: `${group.toLowerCase()}-${size}`,
    name: `${group} ${size}`,
    phase: "PHASE_1",
    startingBalance: size,
    currency: "USD",
    leverage: 100,
    phases,
  },
});

/** Your price list. The group name ("2-Step") becomes the program tab. */
export const PRODUCTS: PublicProduct[] = [
  challenge("2-Step", 10_000, 89, twoStep(10_000)),
  challenge("2-Step", 25_000, 189, twoStep(25_000)),
  challenge("2-Step", 50_000, 299, twoStep(50_000)),
  challenge("2-Step", 100_000, 499, twoStep(100_000)),
  challenge("2-Step", 200_000, 949, twoStep(200_000)),
  challenge("1-Step", 25_000, 229, oneStep(25_000)),
  challenge("1-Step", 50_000, 369, oneStep(50_000)),
  challenge("1-Step", 100_000, 599, oneStep(100_000)),
];

/* ── 4. Words on the page ─────────────────────────────────────────────── */

/**
 * Leave a hero field empty ("") to use a default written from your
 * challenges. FAQ entries you add come first; answers about your rules,
 * sizes and prices are added automatically.
 */
export const STOREFRONT: StorefrontConfig = {
  version: 1,
  templateId: null,
  sections: { stats: true, howItWorks: true, rules: true, faq: true, testimonials: true },
  content: {
    hero: { eyebrow: "", title: "", description: "", primaryCta: "", secondaryCta: "" },
    about: { heading: "", body: "" },
    announcement: "",
    faq: [
      {
        question: "Which platforms can I trade on?",
        answer: "Edit this answer in site/config.ts: list the trading platforms your firm offers.",
      },
    ],
    // Real testimonials only, with permission. The section stays hidden while this is empty.
    testimonials: [],
  },
};

/* ── 5. Where the buttons go ──────────────────────────────────────────── */

export const LINKS = {
  /** "Start challenge" buttons. productId is the id from PRODUCTS above. */
  register: (productId?: string) =>
    `https://your-checkout.example.com/${productId ? `?product=${productId}` : ""}`,
  /** "Sign in" in the menu. */
  login: "https://your-dashboard.example.com/login",
  /** Footer legal pages, by slug. */
  legal: {
    "terms-of-service": "/terms.html",
    "privacy-policy": "/privacy.html",
    "risk-disclosure": "/risk-disclosure.html",
    "refund-policy": "/refund-policy.html",
  } as Record<string, string>,
};
