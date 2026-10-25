import { buildCatalog, flagshipOf } from "./catalog";
import { buildFaq, buildRules, buildStats, buildSteps, defaultHero } from "./copy";
import { rec, resolveStorefront } from "./resolve";
import type {
  FirmView,
  HeroContent,
  LegalLink,
  PublicFirm,
  PublicProduct,
  SectionSwitches,
  SocialLink,
  StorefrontConfig,
  StorefrontView,
} from "./types";

const SOCIAL_LABELS: Record<string, string> = {
  website: "Website",
  twitter: "X",
  discord: "Discord",
  telegram: "Telegram",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

/** Legal pages in footer order. */
const LEGAL_SLUGS = [
  "terms-of-service",
  "privacy-policy",
  "risk-disclosure",
  "refund-policy",
  "simulation-disclosure",
  "aml-statement",
  "kyc-policy",
  "affiliate-terms",
];

const titleCase = (slug: string) =>
  slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAml\b|\bKyc\b/g, (w) => w.toUpperCase());

function socialLinks(branding: Record<string, unknown>): SocialLink[] {
  const links = rec(branding.socialLinks);
  return Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
    const href = links[key];
    return typeof href === "string" && /^https?:\/\//i.test(href) ? [{ key, label, href }] : [];
  });
}

function legalLinks(branding: Record<string, unknown>): LegalLink[] {
  const pages = rec(branding.legalPages);
  return LEGAL_SLUGS.flatMap((slug) => {
    const page = rec(pages[slug]);
    if (page.enabled !== true) return [];
    const title =
      typeof page.title === "string" && page.title.trim() ? page.title.trim() : titleCase(slug);
    return [{ slug, title, href: `/legal/${slug}` }];
  });
}

const firstUrl = (...values: unknown[]): string | undefined =>
  values.find((v): v is string => typeof v === "string" && v.length > 0);

function firmView(firm: PublicFirm): FirmView {
  const b = rec(firm.branding);
  const layout = rec(b.layout);
  const logo = firstUrl(b.logoUrlDark, b.logoUrl);
  const logoLight = firstUrl(b.logoUrlLight, b.logoUrl);
  const height = typeof b.logoHeight === "number" ? b.logoHeight : 28;
  return {
    name: firm.name,
    slug: firm.slug,
    ...(logo ? { logoUrl: logo } : {}),
    ...(logoLight ? { logoUrlLight: logoLight } : {}),
    logoHeight: Math.min(Math.max(height, 16), 48),
    showName: layout.showFirmName !== false,
    showMenu: layout.showHeaderMenu !== false,
    social: socialLinks(b),
    legal: legalLinks(b),
  };
}

function withDefaults(own: HeroContent, fallback: HeroContent): HeroContent {
  return {
    eyebrow: own.eyebrow.trim() || fallback.eyebrow,
    title: own.title.trim() || fallback.title,
    description: own.description.trim() || fallback.description,
    primaryCta: own.primaryCta.trim() || fallback.primaryCta,
    secondaryCta: own.secondaryCta.trim() || fallback.secondaryCta,
  };
}

export interface BuildViewInput {
  firm: PublicFirm;
  products: PublicProduct[];
  /** Unsaved back-office edits, laid over what the firm has stored. */
  config?: StorefrontConfig;
}

export function buildStorefrontView({ firm, products, config }: BuildViewInput): StorefrontView {
  const resolved = config ?? resolveStorefront(firm.branding);
  const { challenges, groups } = buildCatalog(products);
  const flagship = flagshipOf(challenges);
  const stats = buildStats(firm.stats);
  const steps = buildSteps(flagship);
  const rules = buildRules(flagship);
  const faq = buildFaq(resolved.content.faq, challenges, flagship);
  const on = resolved.sections;
  const sections: SectionSwitches = {
    stats: on.stats && stats.length > 0,
    howItWorks: on.howItWorks && steps.length > 0,
    rules: on.rules && rules.length > 0,
    faq: on.faq && faq.length > 0,
    testimonials: on.testimonials && resolved.content.testimonials.length > 0,
  };
  return {
    firm: firmView(firm),
    content: {
      ...resolved.content,
      hero: withDefaults(resolved.content.hero, defaultHero(challenges)),
    },
    sections,
    challenges,
    groups,
    stats,
    steps,
    rules,
    faq,
  };
}
