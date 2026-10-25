import { isTemplateId } from "../registry";
import {
  type FaqItem,
  type HeroContent,
  SECTION_KEYS,
  type SectionSwitches,
  type StorefrontConfig,
  type StorefrontContent,
  type Testimonial,
} from "./types";

/**
 * Reads a firm's stored branding into one StorefrontConfig.
 *
 * `branding.storefront` is the new home. Firms that have never saved one (and
 * fields the back office does not write there yet) fall back to the older flat
 * branding fields and layout switches, so every existing firm renders the same
 * content it has today. A field present in `storefront` always wins, even when
 * empty, so an operator can clear something.
 */

type Rec = Record<string, unknown>;

export const rec = (v: unknown): Rec =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : {};

const text = (v: unknown, max: number): string => (typeof v === "string" ? v.slice(0, max) : "");

/** The newer value when it is a string at all, otherwise the legacy one. */
const pick = (newer: unknown, older: string, max: number): string =>
  typeof newer === "string" ? newer.slice(0, max) : older;

const flag = (v: unknown, fallback: boolean): boolean => (typeof v === "boolean" ? v : fallback);

/** The template id stored on the firm, or null when it has never picked one. */
export function readTemplateId(branding: unknown): string | null {
  const id = rec(rec(branding).storefront).templateId;
  return typeof id === "string" && /^[a-z0-9-]{1,64}$/.test(id) ? id : null;
}

/**
 * The template that replaces a firm's old "page layout × colour theme" pick,
 * so a firm that never chose a template still gets the closest new one.
 */
const LEGACY_LAYOUTS: Record<string, string> = {
  surge: "volt",
  horizon: "ivory",
  apex: "aurum",
};
const LEGACY_THEMES: Record<string, string> = {
  default: "onyx",
  aurora: "azure",
  clean: "onyx-light",
  trader: "quant",
  prestige: "aurum",
  velocity: "volt",
};
export const DEFAULT_TEMPLATE_ID = "onyx";

export function legacyTemplateId(branding: unknown): string {
  const b = rec(branding);
  const layout =
    typeof b.frontendLayout === "string" ? LEGACY_LAYOUTS[b.frontendLayout] : undefined;
  const theme = typeof b.template === "string" ? LEGACY_THEMES[b.template] : undefined;
  return layout ?? theme ?? DEFAULT_TEMPLATE_ID;
}

/** The template to render: the firm's pick, else the closest match to its old design. */
export function resolveTemplateId(branding: unknown): string {
  const own = readTemplateId(branding);
  return own && isTemplateId(own) ? own : legacyTemplateId(branding);
}

function legacySections(b: Rec): SectionSwitches {
  const l = rec(b.layout);
  return {
    stats: flag(l.showHeroStats, true),
    howItWorks: flag(l.showHowItWorks, true),
    rules: flag(l.showRulesGrid, true),
    faq: flag(l.showFaq, true),
    testimonials: flag(l.showTestimonials, true),
  };
}

function readSections(b: Rec, stored: Rec): SectionSwitches {
  const legacy = legacySections(b);
  const out = { ...legacy };
  for (const key of SECTION_KEYS) out[key] = flag(stored[key], legacy[key]);
  return out;
}

function readHero(b: Rec, stored: Rec): HeroContent {
  return {
    eyebrow: pick(stored.eyebrow, text(b.tagline, 120), 120),
    title: pick(stored.title, text(b.heroTitle, 200), 200),
    description: pick(stored.description, text(b.heroDescription, 600), 600),
    primaryCta: pick(stored.primaryCta, text(b.ctaText, 40), 40),
    secondaryCta: pick(stored.secondaryCta, text(b.ctaSecondaryText, 40), 40),
  };
}

function readList<T>(v: unknown, read: (r: Rec) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, 30)
    .map((item) => read(rec(item)))
    .filter((item): item is T => item !== null);
}

function readFaq(r: Rec): FaqItem | null {
  const question = text(r.question, 300).trim();
  const answer = text(r.answer, 2000).trim();
  return question && answer ? { question, answer } : null;
}

function readTestimonial(r: Rec): Testimonial | null {
  const quote = text(r.quote, 1000).trim();
  const name = text(r.name, 120).trim();
  if (!quote || !name) return null;
  const detail = text(r.detail, 120).trim();
  return detail ? { quote, name, detail } : { quote, name };
}

function readContent(b: Rec, stored: Rec): StorefrontContent {
  const about = rec(stored.about);
  return {
    hero: readHero(b, rec(stored.hero)),
    about: {
      heading: pick(about.heading, text(b.aboutHeading, 200), 200),
      body: pick(about.body, text(b.aboutBody, 4000), 4000),
    },
    announcement: pick(stored.announcement, text(b.announcementBanner, 300), 300),
    faq: readList(stored.faq, readFaq),
    testimonials: readList(stored.testimonials, readTestimonial),
  };
}

export function resolveStorefront(branding: unknown): StorefrontConfig {
  const b = rec(branding);
  const stored = rec(b.storefront);
  return {
    version: 1,
    templateId: readTemplateId(branding),
    sections: readSections(b, rec(stored.sections)),
    content: readContent(b, rec(stored.content)),
  };
}
