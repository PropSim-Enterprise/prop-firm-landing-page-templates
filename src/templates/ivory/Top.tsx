import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Arrow, Brand, BTN_INK, CONTAINER, Kicker, MUTED } from "./ui";

/* ── Announcement + nav ──────────────────────────────────────────────── */

export function Announcement({ text }: { text: string }) {
  return (
    <div className="bg-[#1d5c46] px-5 py-2.5 text-center text-[13px] text-[#f6f3ec]">{text}</div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["challenges", "Accounts"]);
  if (view.sections.howItWorks) links.push(["how", "How it works"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "Questions"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button:
    "flex h-11 w-11 items-center justify-center rounded-full text-[#161512] transition-colors hover:bg-[#161512]/[0.05]",
  panel: "border-b border-[#161512]/[0.12] bg-[#f6f3ec] px-5 pb-6 pt-2",
  link: "ivory-serif flex h-14 w-full items-center border-b border-[#161512]/10 text-[24px]",
  signIn:
    "mt-5 flex h-12 w-full items-center justify-center rounded-full border border-[#161512]/20 text-[15px] font-medium",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-[#161512]/10 bg-[#f6f3ec]/85 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className={`${CONTAINER} flex h-[72px] items-center justify-between gap-6`}
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
          <ul className="hidden items-center gap-8 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className={`text-[14px] transition-colors hover:text-[#161512] ${MUTED}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="shrink-0 flex items-center gap-1.5">
          <SfLink
            href={host.loginHref()}
            className="hidden h-10 items-center rounded-full px-4 text-[14px] text-[#161512] transition-colors hover:bg-[#161512]/[0.05] @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-10 items-center rounded-full bg-[#161512] px-3 @sm:px-5 text-[14px] font-medium text-[#f6f3ec] transition-colors hover:bg-[#2a2823]"
          >
            Get funded
          </SfLink>
          <MobileMenu links={links} style={MENU} />
        </div>
      </nav>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────── */

/** "Trade our capital. Keep up to 90%…" → the first sentence upright, the rest in italic. */
function splitTitle(title: string): [string, string] {
  const match = /^(.+?[.!?])\s+(.+)$/.exec(title.trim());
  return match ? [match[1] ?? title, match[2] ?? ""] : [title, ""];
}

function SecondaryCta({ label }: { label: string }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const className =
    "inline-flex h-12 items-center gap-2 px-2 text-[15px] font-medium text-[#161512] underline decoration-[#161512]/25 underline-offset-[6px] transition-colors hover:decoration-[#161512]";
  if (/sign|log/i.test(label)) {
    return (
      <SfLink href={host.loginHref()} className={className}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={className}>
      {label}
    </button>
  );
}

function ledgerFacts(view: StorefrontView): [string, string][] {
  const c = view.challenges;
  if (!c.length) return [];
  const currency = c[0]?.currency ?? "USD";
  const sizes = c.map((x) => x.size);
  const facts: [string, string][] = [
    [
      "Accounts",
      `${compactMoney(Math.min(...sizes), currency)} – ${compactMoney(Math.max(...sizes), currency)}`,
    ],
    ["Evaluations from", money(Math.min(...c.map((x) => x.price)), currency)],
  ];
  const splits = c.map((x) => x.profitSplit).filter((s): s is number => s !== undefined);
  if (splits.length) facts.push(["Profit split up to", percent(Math.max(...splits))]);
  return facts;
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  const [upright, italic] = splitTitle(hero.title);
  const facts = ledgerFacts(view);
  return (
    <section data-sf-section="top" aria-labelledby={titleId} className="relative isolate">
      <div aria-hidden="true" className="ivory-wash pointer-events-none absolute inset-0 -z-10" />
      <div className={`${CONTAINER} pb-16 pt-16 text-center @md:pb-24 @md:pt-24`}>
        <Kicker center>{hero.eyebrow}</Kicker>
        <h1
          id={titleId}
          className="ivory-serif mx-auto mt-8 max-w-[15ch] text-balance text-[clamp(3.1rem,9.4cqi,7rem)] leading-[0.95] tracking-[-0.025em]"
        >
          {upright}
          {italic && (
            <>
              {" "}
              <em className="italic text-[#1d5c46]">{italic}</em>
            </>
          )}
        </h1>
        <p className={`mx-auto mt-8 max-w-[38rem] text-pretty text-[18px] leading-[1.65] ${MUTED}`}>
          {hero.description}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => scrollTo("challenges")} className={BTN_INK}>
            {hero.primaryCta}
            <Arrow />
          </button>
          <SecondaryCta label={hero.secondaryCta} />
        </div>
        {facts.length > 0 && (
          <dl className="mx-auto mt-16 grid max-w-[54rem] border-y border-[#161512]/[0.12] @md:grid-cols-3">
            {facts.map(([label, value], i) => (
              <div
                key={label}
                className={`px-6 py-5 ${i > 0 ? "border-t border-[#161512]/[0.12] @md:border-l @md:border-t-0" : ""}`}
              >
                <dt className={`text-[12px] uppercase tracking-[0.14em] ${MUTED}`}>{label}</dt>
                <dd className="ivory-serif ivory-num mt-1.5 text-[30px] leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
