import { useId } from "react";
import { flagshipOf } from "../../core/catalog";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, Brand, BTN_BLUE, BTN_GHOST, CONTAINER, FAINT, MUTED, Pill } from "./ui";

export function Announcement({ text }: { text: string }) {
  return (
    <div className="bg-[#0b1533] px-5 py-2.5 text-center text-[13px] font-medium text-white">
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
    "flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-[#0b1533] shadow-[inset_0_0_0_1px_rgba(11,21,51,0.1)]",
  panel: "bg-white px-5 pb-6 pt-2 shadow-[0_20px_40px_-20px_rgba(11,21,51,0.3)]",
  link: "flex h-12 w-full items-center rounded-[12px] px-3 text-[16px] font-medium text-[#0b1533] hover:bg-[#eef1f8]",
  signIn:
    "mt-4 flex h-12 w-full items-center justify-center rounded-[14px] text-[15px] font-semibold text-[#0b1533] shadow-[inset_0_0_0_1px_rgba(11,21,51,0.12)]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled ? "bg-white/80 shadow-[0_1px_0_rgba(11,21,51,0.08)] backdrop-blur-xl" : ""}`}
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
          <ul className="hidden items-center gap-1 rounded-full bg-white/70 p-1 shadow-[inset_0_0_0_1px_rgba(11,21,51,0.08)] @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors hover:bg-[#eef1f8] hover:text-[#0b1533] ${MUTED}`}
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
            className="hidden h-10 items-center rounded-[12px] px-4 text-[14px] font-semibold transition-colors hover:bg-[#eef1f8] @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-10 items-center rounded-[12px] bg-[#2547f4] px-3 @sm:px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#1d3be0]"
          >
            Get started
          </SfLink>
          <MobileMenu links={links} style={MENU} />
        </div>
      </nav>
    </header>
  );
}

function SecondaryCta({ label }: { label: string }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  if (/sign|log/i.test(label)) {
    return (
      <SfLink href={host.loginHref()} className={BTN_GHOST}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_GHOST}>
      {label}
    </button>
  );
}

/** Three real accounts from the main programme: smallest, middle, largest. */
function fanOf(view: StorefrontView): ChallengeView[] {
  const group = view.challenges.filter((c) => c.group === view.groups[0]);
  const mid = flagshipOf(view.challenges);
  const picks = [group[0], mid, group[group.length - 1]].filter((c): c is ChallengeView =>
    Boolean(c),
  );
  return [...new Map(picks.map((c) => [c.id, c])).values()];
}

const FAN = [
  "@md:-rotate-6 @md:translate-x-2 @md:translate-y-8",
  "relative z-10",
  "@md:rotate-6 @md:-translate-x-2 @md:translate-y-8",
];

function MiniCard({ c, featured }: { c: ChallengeView; featured: boolean }) {
  const first = c.phases[0];
  return (
    <div
      className={`w-full rounded-[22px] p-5 shadow-[0_24px_48px_-20px_rgba(11,21,51,0.35)] ${featured ? "bg-[#2547f4] text-white" : "bg-white"}`}
    >
      <p className={`text-[12px] font-semibold ${featured ? "text-white/70" : FAINT}`}>{c.group}</p>
      <p className="cobalt-num mt-2 text-[34px] font-extrabold leading-none tracking-[-0.03em]">
        {compactMoney(c.size, c.currency)}
      </p>
      <dl className={`mt-4 space-y-1.5 text-[13px] ${featured ? "text-white/85" : MUTED}`}>
        {first?.target !== undefined && (
          <div className="flex justify-between">
            <dt>Target</dt>
            <dd className="cobalt-num font-semibold">{percent(first.target)}</dd>
          </div>
        )}
        {c.profitSplit !== undefined && (
          <div className="flex justify-between">
            <dt>Split</dt>
            <dd className="cobalt-num font-semibold">{percent(c.profitSplit)}</dd>
          </div>
        )}
      </dl>
      <p className="cobalt-num mt-4 text-[15px] font-bold">{money(c.price, c.currency)}</p>
    </div>
  );
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  const fan = fanOf(view);
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="cobalt-sky relative isolate -mt-[72px] overflow-hidden pt-[72px]"
    >
      <div
        className={`${CONTAINER} grid items-center gap-14 pb-20 pt-12 @md:pt-20 @lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] @lg:pb-28`}
      >
        <div>
          <Pill>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2547f4]" />
            {hero.eyebrow}
          </Pill>
          <h1
            id={titleId}
            className="mt-6 text-balance text-[clamp(2.7rem,6.8cqi,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
          >
            {hero.title}
          </h1>
          <p className={`mt-6 max-w-[34rem] text-pretty text-[18px] leading-[1.65] ${MUTED}`}>
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_BLUE}>
              {hero.primaryCta}
              <Arrow />
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
        {fan.length > 0 && (
          <div
            aria-hidden="true"
            className="mx-auto grid w-full max-w-[520px] grid-cols-1 gap-3 @md:grid-cols-3 @md:gap-0"
          >
            {fan.map((c, i) => (
              <div
                key={c.id}
                className={`${fan.length === 3 ? FAN[i] : ""} ${i === 1 ? "" : "hidden @md:block"}`}
              >
                <MiniCard c={c} featured={i === 1 || fan.length === 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
