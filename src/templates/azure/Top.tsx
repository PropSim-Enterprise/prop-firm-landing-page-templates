import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { evaluationPhases, type useChallengePicker } from "../../core/picker";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, Brand, BTN_GRADIENT, BTN_SOFT, CONTAINER, FAINT, MUTED } from "./ui";

export type Picker = ReturnType<typeof useChallengePicker>;

export function Announcement({ text }: { text: string }) {
  return (
    <div className="azure-gradient px-5 py-2.5 text-center text-[14px] font-medium text-white">
      {text}
    </div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["pricing", "Pricing"]);
  if (view.sections.howItWorks) links.push(["how", "How it works"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "FAQ"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button:
    "flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b1a33] shadow-[inset_0_0_0_1px_rgba(11,26,51,0.12)]",
  panel: "azure-glass px-5 pb-6 pt-2 shadow-[0_20px_40px_-20px_rgba(11,26,51,0.3)]",
  link: "flex h-12 w-full items-center rounded-[14px] px-3 text-[17px] font-medium text-[#0b1a33] hover:bg-white",
  signIn:
    "mt-4 flex h-12 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-[#0b1a33] shadow-[inset_0_0_0_1px_rgba(11,26,51,0.12)]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled ? "azure-glass shadow-[0_1px_0_rgba(11,26,51,0.08)]" : ""}`}
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
                  className={`text-[15px] font-medium transition-colors hover:text-[#0b1a33] ${MUTED}`}
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
            className="hidden h-10 items-center rounded-full px-4 text-[15px] font-semibold transition-colors hover:bg-white @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap azure-gradient inline-flex h-10 items-center rounded-full px-3 @sm:px-5 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110"
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
      <SfLink href={host.loginHref()} className={BTN_SOFT}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_SOFT}>
      {label}
    </button>
  );
}

/* ── The configurator: program → size → live summary, inside the hero ─── */

function Segmented({
  items,
  active,
  onPick,
  label,
}: {
  items: [string, string][];
  active: string;
  onPick: (v: string) => void;
  label: string;
}) {
  return (
    <fieldset className="flex gap-1 overflow-x-auto rounded-full bg-[#0b1a33]/[0.05] p-1 azure-scrollbar-none">
      <legend className="sr-only">{label}</legend>
      {items.map(([value, text]) => (
        <button
          key={value}
          type="button"
          aria-pressed={value === active}
          onClick={() => onPick(value)}
          className={`h-11 shrink-0 rounded-full px-3.5 text-[14px] font-semibold @md:h-9 transition-[background-color,color,box-shadow] duration-200 ${
            value === active
              ? "bg-white text-[#0b1a33] shadow-[0_2px_8px_rgba(11,26,51,0.12)]"
              : `${MUTED} hover:text-[#0b1a33]`
          }`}
        >
          {text}
        </button>
      ))}
    </fieldset>
  );
}

function summary(c: ChallengeView): [string, string][] {
  const evals = evaluationPhases(c);
  const targets = evals.map((p) => p.target).filter((t): t is number => t !== undefined);
  const first = c.phases[0];
  const rows: [string, string | undefined][] = [
    ["Profit target", targets.length ? targets.map(percent).join(" → ") : undefined],
    ["Daily loss", first?.dailyLoss === undefined ? undefined : percent(first.dailyLoss)],
    ["Max loss", first?.maxLoss === undefined ? undefined : percent(first.maxLoss)],
    ["Profit split", c.profitSplit === undefined ? undefined : percent(c.profitSplit)],
  ];
  return rows.filter((r): r is [string, string] => r[1] !== undefined);
}

function Configurator({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const host = useHost();
  const { group, inGroup, current, pickGroup, pick } = picker;
  if (!current) return null;
  return (
    <div className="azure-glass rounded-[28px] border border-white/80 p-5 shadow-[0_30px_70px_-30px_rgba(11,26,51,0.35)] @md:p-6">
      <p className={`text-[13px] font-semibold ${FAINT}`}>Configure your account</p>
      {view.groups.length > 1 && (
        <div className="mt-3">
          <Segmented
            label="Program"
            items={view.groups.map((g) => [g, g])}
            active={group}
            onPick={pickGroup}
          />
        </div>
      )}
      <div className="mt-2">
        <Segmented
          label="Account size"
          items={inGroup.map((c) => [c.id, compactMoney(c.size, c.currency)])}
          active={current.id}
          onPick={pick}
        />
      </div>
      <div className="mt-5 rounded-[20px] bg-white p-5 shadow-[inset_0_0_0_1px_rgba(11,26,51,0.06)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`text-[13px] ${FAINT}`}>{current.name}</p>
            <p className="mt-1 text-[38px] font-semibold leading-none tracking-[-0.035em]">
              {money(current.size, current.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="azure-text-gradient text-[28px] font-bold leading-none tracking-[-0.02em]">
              {money(current.price, current.currency)}
            </p>
            <p className={`mt-1 text-[12px] ${FAINT}`}>evaluation fee</p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          {summary(current).map(([label, value]) => (
            <div key={label} className="rounded-[14px] bg-[#f4f8ff] px-3.5 py-2.5">
              <dt className={`text-[12px] ${FAINT}`}>{label}</dt>
              <dd className="mt-0.5 text-[16px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <SfLink href={host.registerHref(current.id)} className={`${BTN_GRADIENT} mt-4 w-full`}>
        Start the {compactMoney(current.size, current.currency)} challenge
        <Arrow />
      </SfLink>
    </div>
  );
}

export function Hero({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="azure-sky relative -mt-[72px] overflow-hidden pt-[72px]"
    >
      <div
        className={`${CONTAINER} grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-20 pt-10 @md:pt-16 @lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] @lg:gap-14 @lg:pb-28`}
      >
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[14px] font-medium shadow-[0_1px_2px_rgba(11,26,51,0.06),inset_0_0_0_1px_rgba(11,26,51,0.06)]">
            <span aria-hidden="true" className="azure-gradient h-2 w-2 rounded-full" />
            {hero.eyebrow}
          </p>
          <h1
            id={titleId}
            className="mt-6 text-balance text-[clamp(2.7rem,6.6cqi,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            {hero.title}
          </h1>
          <p className={`mt-6 max-w-[34rem] text-pretty text-[18px] leading-[1.65] ${MUTED}`}>
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo("pricing")} className={BTN_GRADIENT}>
              {hero.primaryCta}
              <Arrow />
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
        <div data-sf-section="challenges">
          <Configurator view={view} picker={picker} />
        </div>
      </div>
    </section>
  );
}
