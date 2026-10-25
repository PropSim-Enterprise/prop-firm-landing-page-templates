import { useId } from "react";
import { flagshipOf } from "../../core/catalog";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { ACCENT, Arrow, Brand, BTN_PRIMARY, BTN_SECONDARY, CONTAINER, FAINT, MUTED } from "./ui";

/* ── Announcement + nav ──────────────────────────────────────────────── */

export function Announcement({ text }: { text: string }) {
  return (
    <div className="border-b border-onyx-ink/[0.06] bg-onyx-surface px-5 py-2.5 text-center text-[13px] text-onyx-soft">
      <span className={`mr-2 ${ACCENT}`} aria-hidden="true">
        ●
      </span>
      {text}
    </div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["challenges", "Accounts"]);
  if (view.sections.howItWorks) links.push(["how", "How it works"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "FAQ"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button:
    "flex h-11 w-11 items-center justify-center rounded-full text-onyx-fg transition-colors hover:bg-onyx-ink/[0.06]",
  panel: "border-b border-onyx-ink/[0.08] bg-onyx-bg px-5 pb-6 pt-2 shadow-[var(--o-shadow)]",
  link: "flex h-12 w-full items-center border-b border-onyx-ink/[0.06] text-[16px] text-onyx-soft",
  signIn:
    "mt-5 flex h-12 w-full items-center justify-center rounded-full border border-onyx-ink/10 text-[15px] font-medium",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-onyx-ink/[0.07] bg-[var(--o-nav)] backdrop-blur-xl"
          : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className={`${CONTAINER} flex h-16 items-center justify-between gap-6`}
      >
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="flex min-h-11 min-w-0 items-center"
          aria-label={`${view.firm.name} home`}
        >
          <Brand brand={view.firm} showName={view.firm.showName} />
        </button>
        {links.length > 0 && (
          <ul className="hidden items-center gap-7 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className={`text-[14px] transition-colors hover:text-onyx-fg ${MUTED}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="shrink-0 flex items-center gap-2">
          <SfLink
            href={host.loginHref()}
            className="hidden h-9 items-center rounded-full px-3.5 text-[14px] text-onyx-soft transition-colors hover:text-onyx-fg @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-11 items-center gap-1.5 rounded-full bg-onyx-primary px-3 @sm:px-4 @md:h-9 text-[14px] font-medium text-onyx-onprimary transition-colors hover:bg-onyx-primaryhover"
          >
            Get started
          </SfLink>
          <MobileMenu links={links} style={MENU} />
        </div>
      </nav>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────── */

/** The secondary button signs in when it says so; otherwise it explains. */
function SecondaryCta({ label }: { label: string }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  if (/sign|log/i.test(label)) {
    return (
      <SfLink href={host.loginHref()} className={BTN_SECONDARY}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_SECONDARY}>
      {label}
    </button>
  );
}

function heroFacts(view: StorefrontView): string[] {
  const c = view.challenges;
  if (!c.length) return [];
  const sizes = c.map((x) => x.size);
  const prices = c.map((x) => x.price);
  const currency = c[0]?.currency ?? "USD";
  const facts = [
    `Accounts ${compactMoney(Math.min(...sizes), currency)} – ${compactMoney(Math.max(...sizes), currency)}`,
  ];
  facts.push(`From ${money(Math.min(...prices), currency)}`);
  const phases = new Set(c.map((x) => x.phases.filter((p) => !p.funded).length));
  if (phases.size === 1) {
    const n = [...phases][0] ?? 1;
    facts.push(n === 1 ? "One-phase evaluation" : `${n}-phase evaluation`);
  }
  return facts;
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const { hero } = view.content;
  const flagship = flagshipOf(view.challenges);
  const facts = heroFacts(view);
  const titleId = useId();
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="onyx-hero-bg pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="onyx-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]"
      />
      <div
        className={`${CONTAINER} grid items-center gap-14 pb-20 pt-14 @md:pb-28 @md:pt-20 @lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] @lg:gap-12 @lg:pt-24`}
      >
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-onyx-ink/10 bg-onyx-ink/[0.03] py-1 pl-2 pr-3.5 text-[13px] text-onyx-soft">
            <span
              className="h-1.5 w-1.5 rounded-full bg-onyx-accent onyx-dot-glow"
              aria-hidden="true"
            />
            {hero.eyebrow}
          </p>
          <h1
            id={titleId}
            className="mt-7 text-balance text-[clamp(2.6rem,7.4cqi,5rem)] font-semibold leading-[1.0] tracking-[-0.045em]"
          >
            {hero.title}
          </h1>
          <p
            className={`mt-6 max-w-[36rem] text-pretty text-[17px] leading-[1.65] @md:text-[18px] ${MUTED}`}
          >
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_PRIMARY}>
              {hero.primaryCta}
              <Arrow />
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
          {facts.length > 0 && (
            <ul
              className={`onyx-mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.1em] ${FAINT}`}
            >
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </div>
        {flagship && <SpecCard challenge={flagship} />}
      </div>
    </section>
  );
}

/* ── The hero's spec card: the firm's own flagship account, real numbers ─ */

function specRows(c: ChallengeView): [string, string][] {
  const first = c.phases[0];
  const rows: [string, string | undefined][] = [
    ["Profit target", first?.target === undefined ? undefined : percent(first.target)],
    ["Daily loss limit", first?.dailyLoss === undefined ? undefined : percent(first.dailyLoss)],
    ["Maximum loss", first?.maxLoss === undefined ? undefined : percent(first.maxLoss)],
    ["Minimum days", first?.minDays ? String(first.minDays) : undefined],
    ["Leverage", first?.leverage ? `1:${first.leverage}` : undefined],
  ];
  return rows.filter((r): r is [string, string] => r[1] !== undefined);
}

function PhaseTrack({ challenge }: { challenge: ChallengeView }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="Evaluation path">
      {challenge.phases.map((p, i) => (
        <li key={p.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true" className="h-px w-3 bg-onyx-ink/15" />}
          <span
            className={`onyx-mono rounded-full border px-2.5 py-1 text-[12px] uppercase tracking-[0.08em] ${
              p.funded
                ? "border-onyx-accent/40 bg-onyx-accent/10 text-onyx-accent"
                : "border-onyx-ink/10 text-onyx-soft"
            }`}
          >
            {p.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SpecCard({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  const rows = specRows(challenge);
  return (
    <div className="relative mx-auto w-full max-w-[440px] @lg:mx-0 @lg:justify-self-end">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[40px] bg-onyx-accent/[0.07] blur-3xl"
      />
      <div className="onyx-beam onyx-panel rounded-[22px] border border-onyx-ink/10 bg-onyx-surface/90 p-6 shadow-[var(--o-shadow)] backdrop-blur-xl @md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`onyx-mono text-[12px] uppercase tracking-[0.14em] ${FAINT}`}>
              {challenge.group}
            </p>
            <p className="onyx-num mt-2 text-[40px] font-semibold leading-none tracking-[-0.04em]">
              {money(challenge.size, challenge.currency)}
            </p>
            <p className={`mt-2 text-[14px] ${MUTED}`}>{challenge.name}</p>
          </div>
          {challenge.profitSplit !== undefined && (
            <div className="text-right">
              <p className="onyx-num text-[28px] font-semibold leading-none tracking-[-0.03em] text-onyx-accent">
                {percent(challenge.profitSplit)}
              </p>
              <p className={`mt-1.5 text-[12px] ${FAINT}`}>profit split</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <PhaseTrack challenge={challenge} />
        </div>
        {rows.length > 0 && (
          <dl className="mt-6 divide-y divide-onyx-ink/[0.06] border-y border-onyx-ink/[0.06]">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 text-[14px]">
                <dt className={MUTED}>{label}</dt>
                <dd className="onyx-num font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="onyx-num text-[22px] font-semibold tracking-[-0.02em]">
              {money(challenge.price, challenge.currency)}
            </p>
            <p className={`text-[12px] ${FAINT}`}>Evaluation fee</p>
          </div>
          <SfLink
            href={host.registerHref(challenge.id)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-onyx-primary px-4 text-[14px] font-medium text-onyx-onprimary transition-colors hover:bg-onyx-primaryhover"
          >
            Start
            <Arrow />
          </SfLink>
        </div>
      </div>
    </div>
  );
}
