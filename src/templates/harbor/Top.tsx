import { useId } from "react";
import { money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { evaluationPhases, sizeLabels, type useChallengePicker } from "../../core/picker";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, Brand, BTN_GLASS, BTN_NAVY, BTN_WHITE, CARD, CONTAINER, FAINT, MUTED } from "./ui";

export type Picker = ReturnType<typeof useChallengePicker>;

export function Announcement({ text }: { text: string }) {
  return (
    <div className="bg-[#5b8def] px-5 py-2.5 text-center text-[13px] font-medium text-white">
      {text}
    </div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["programs", "Programs"]);
  if (view.sections.howItWorks) links.push(["how", "How it works"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "FAQ"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button: "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white",
  panel: "border-b border-white/10 bg-[#0f1d33] px-5 pb-6 pt-2",
  link: "flex h-12 w-full items-center border-b border-white/10 text-[16px] font-medium text-white/85",
  signIn:
    "mt-5 flex h-12 w-full items-center justify-center rounded-full bg-white/10 text-[15px] font-semibold text-white",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 text-white transition-[background-color,box-shadow] duration-300 ${scrolled ? "bg-[#0f1d33]/95 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl" : "bg-[#0a1526]"}`}
    >
      <nav
        aria-label="Main"
        className={`${CONTAINER} flex h-[70px] items-center justify-between gap-6`}
      >
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="flex min-h-11 min-w-0 items-center"
          aria-label={`${view.firm.name} home`}
        >
          <Brand brand={view.firm} showName={view.firm.showName} onDark />
        </button>
        {links.length > 0 && (
          <ul className="hidden items-center gap-8 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className="text-[14px] font-medium text-white/70 transition-colors hover:text-white"
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
            className="hidden h-10 items-center rounded-full px-4 text-[14px] font-semibold text-white/85 transition-colors hover:text-white @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-10 items-center rounded-full bg-white px-3 @sm:px-5 text-[14px] font-semibold text-[#0f1d33] transition-colors hover:bg-[#e8eef7]"
          >
            Open account
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
      <SfLink href={host.loginHref()} className={BTN_GLASS}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_GLASS}>
      {label}
    </button>
  );
}

/** The chosen account written like a bank statement: real values only. */
function lines(c: ChallengeView): [string, string][] {
  const out: [string, string][] = [];
  evaluationPhases(c).forEach((p, i) => {
    if (p.target !== undefined) out.push([`Profit target, phase ${i + 1}`, percent(p.target)]);
  });
  const first = c.phases[0];
  if (first?.dailyLoss !== undefined) out.push(["Daily loss limit", percent(first.dailyLoss)]);
  if (first?.maxLoss !== undefined) out.push(["Maximum loss", percent(first.maxLoss)]);
  if (first?.minDays) out.push(["Minimum trading days", String(first.minDays)]);
  if (c.profitSplit !== undefined) out.push(["Profit split when funded", percent(c.profitSplit)]);
  return out;
}

function Tabs({
  items,
  active,
  onPick,
  label,
  dark = false,
}: {
  items: [string, string][];
  active: string;
  onPick: (v: string) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <fieldset className="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 harbor-scrollbar-none">
      <legend className="sr-only">{label}</legend>
      {items.map(([value, text]) => (
        <button
          key={value}
          type="button"
          aria-pressed={value === active}
          onClick={() => onPick(value)}
          className={`h-11 shrink-0 rounded-full px-4 text-[13px] font-semibold @md:h-9 transition-colors ${
            value === active
              ? dark
                ? "bg-[#0f1d33] text-white"
                : "bg-[#e8eef7] text-[#0f1d33]"
              : `${MUTED} hover:bg-[#f1f4f9]`
          }`}
        >
          {text}
        </button>
      ))}
    </fieldset>
  );
}

function Statement({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const host = useHost();
  const { group, inGroup, current, pickGroup, pick } = picker;
  if (!current) {
    return (
      <div className={`p-8 text-center ${CARD} ${MUTED}`}>
        Accounts are being set up. Check back soon.
      </div>
    );
  }
  const labels = sizeLabels(inGroup);
  return (
    <div className={`overflow-hidden shadow-[0_40px_80px_-40px_rgba(15,29,51,0.45)] ${CARD}`}>
      {view.groups.length > 1 && (
        <div className="border-b border-[#0f1d33]/[0.08] px-4 py-3">
          <Tabs
            label="Program"
            items={view.groups.map((g) => [g, g])}
            active={group}
            onPick={pickGroup}
          />
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)] @md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="border-b border-[#0f1d33]/[0.08] p-7 @md:border-b-0 @md:border-r @md:p-9">
          <p className={`text-[13px] font-semibold ${FAINT}`}>Account size</p>
          <p className="mt-2 text-[clamp(2.6rem,6cqi,3.6rem)] font-semibold leading-none tracking-[-0.035em]">
            {money(current.size, current.currency)}
          </p>
          <p className={`mt-2 text-[14px] ${MUTED}`}>{current.name}</p>
          <div className="mt-7">
            <Tabs
              label="Account size"
              items={inGroup.map((c) => [c.id, labels.get(c.id) ?? ""])}
              active={current.id}
              onPick={pick}
              dark
            />
          </div>
        </div>
        <div className="flex flex-col p-7 @md:p-9">
          <p className={`text-[13px] font-semibold ${FAINT}`}>Statement</p>
          <dl className="mt-3 divide-y divide-[#0f1d33]/[0.06]">
            {lines(current).map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 py-2.5 text-[14px]"
              >
                <dt className={MUTED}>{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t-2 border-[#0f1d33] pt-4">
            <span className="text-[15px] font-semibold">Evaluation fee</span>
            <span className="text-[26px] font-semibold tracking-[-0.02em]">
              {money(current.price, current.currency)}
            </span>
          </div>
          <SfLink href={host.registerHref(current.id)} className={`${BTN_NAVY} mt-6 w-full`}>
            Open this account
            <Arrow />
          </SfLink>
        </div>
      </div>
    </div>
  );
}

export function Hero({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  return (
    <section data-sf-section="top" aria-labelledby={titleId}>
      <div className="harbor-night pb-[200px] pt-16 text-white @md:pt-24">
        <div className={`${CONTAINER} text-center`}>
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
            {hero.eyebrow}
          </p>
          <h1
            id={titleId}
            className="mx-auto mt-7 max-w-[18ch] text-balance text-[clamp(2.6rem,6.6cqi,4.6rem)] font-semibold leading-[1.04] tracking-[-0.035em]"
          >
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[36rem] text-pretty text-[18px] leading-[1.65] text-white/70">
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_WHITE}>
              {hero.primaryCta}
              <Arrow />
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
      </div>
      <div
        data-sf-section="challenges"
        className={`${CONTAINER} relative z-10 -mt-[150px] max-w-[940px]`}
      >
        <Statement view={view} picker={picker} />
      </div>
    </section>
  );
}
