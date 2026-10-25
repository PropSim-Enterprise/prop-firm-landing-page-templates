import type { ComponentType, ReactNode } from "react";

/* ── What a firm stores (branding.storefront) ─────────────────────────── */

export const SECTION_KEYS = ["stats", "howItWorks", "rules", "faq", "testimonials"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type SectionSwitches = Record<SectionKey, boolean>;

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail?: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface StorefrontContent {
  hero: HeroContent;
  about: { heading: string; body: string };
  announcement: string;
  faq: FaqItem[];
  testimonials: Testimonial[];
}

export interface StorefrontConfig {
  version: 1;
  templateId: string | null;
  sections: SectionSwitches;
  content: StorefrontContent;
}

/* ── What the public API returns (/public/firm/:slug and /products) ───── */

export interface PublicRule {
  code?: string;
  type?: string;
  value?: number;
  valueType?: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
}

export interface PublicPhase {
  phase: string;
  startingBalance: number;
  currency: string;
  leverage: number;
  profitSplit: number | null;
  maxDurationDays: number | null;
  rules: PublicRule[];
}

export interface PublicChallengeTemplate {
  id: string;
  name: string;
  phase: string;
  startingBalance: number;
  currency: string;
  leverage: number;
  profitSplit?: number | null;
  maxDurationDays?: number | null;
  rules?: PublicRule[];
  phases?: PublicPhase[];
}

export interface PublicProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  group?: string | null;
  template?: PublicChallengeTemplate | null;
}

export interface PublicFirmStats {
  totalTraders?: number;
  tradersPassed?: number;
  totalAccounts?: number;
  totalPayouts?: number;
}

export interface PublicFirm {
  name: string;
  slug: string;
  branding?: unknown;
  stats?: PublicFirmStats;
}

/* ── What a template renders from (built by buildStorefrontView) ──────── */

export interface PhaseView {
  label: string;
  funded: boolean;
  target?: number;
  dailyLoss?: number;
  maxLoss?: number;
  trailing?: boolean;
  minDays?: number;
  maxDays?: number;
  leverage?: number;
  profitSplit?: number;
}

export interface ChallengeView {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  group: string;
  size: number;
  phases: PhaseView[];
  /** The funded share of profit, when the firm has set one. */
  profitSplit?: number;
}

export interface StatView {
  key: string;
  label: string;
  value: number;
  format: "count" | "money";
}

export interface StepView {
  title: string;
  body: string;
}

export interface RuleView {
  key: string;
  label: string;
  value: string;
  body: string;
}

export interface SocialLink {
  key: string;
  label: string;
  href: string;
}

export interface LegalLink {
  slug: string;
  title: string;
  href: string;
}

export interface BrandView {
  name: string;
  /** Logo for dark backgrounds (logoUrlDark, else logoUrl). */
  logoUrl?: string;
  /** Logo for light backgrounds (logoUrlLight, else logoUrl). */
  logoUrlLight?: string;
  logoHeight: number;
}

export interface FirmView extends BrandView {
  slug: string;
  showName: boolean;
  showMenu: boolean;
  social: SocialLink[];
  legal: LegalLink[];
}

export interface StorefrontView {
  firm: FirmView;
  /** Operator content with sensible, data-derived defaults filled in. */
  content: StorefrontContent;
  /** Effective switches: on AND has something real to show. */
  sections: SectionSwitches;
  challenges: ChallengeView[];
  groups: string[];
  stats: StatView[];
  steps: StepView[];
  rules: RuleView[];
  faq: FaqItem[];
}

/* ── The contract between a host app and a template ──────────────────── */

export interface StorefrontHost {
  registerHref: (productId?: string) => string;
  loginHref: () => string;
  /** Client-side navigation for internal links ("/legal/…", "/register…"). */
  navigate?: (href: string) => void;
  /** Back-office previews: links and buttons do nothing. */
  inert?: boolean;
  /** Open absolute links (checkout, dashboard) in the same tab instead of a new one. */
  sameTab?: boolean;
}

export interface LandingProps {
  view: StorefrontView;
}

export interface AuthFrameProps {
  brand: BrandView;
  title: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export interface TemplateManifest {
  id: string;
  name: string;
  description: string;
  tags: string[];
  tone: "dark" | "light";
  /** Background, text and accent: drawn on the picker card. */
  swatch: [string, string, string];
  /** Hex colour for the host form's primary button inside the sign-up/sign-in frame. */
  formAccent: string;
  sections: SectionKey[];
}

export interface TemplateModule {
  Landing: ComponentType<LandingProps>;
  AuthFrame: ComponentType<AuthFrameProps>;
}
