import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, BTN_GOLD, BTN_LINE, CONTAINER, Frame, GOLD, Monogram, MUTED, Ornament } from "./ui";

export function Announcement({ text }: { text: string }) {
  return (
    <div className={`aurum-caps border-b border-[#c8a96a]/20 px-5 py-3 text-center ${GOLD}`}>
      {text}
    </div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["challenges", "Collection"]);
  if (view.sections.howItWorks) links.push(["how", "Process"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "Questions"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button: "flex h-11 w-11 items-center justify-center border border-[#c8a96a]/40 text-[#e9d3a1]",
  panel: "border-b border-[#c8a96a]/20 bg-[#0a0908] px-5 pb-7 pt-2 text-center",
  link: "aurum-serif flex h-14 w-full items-center justify-center border-b border-[#c8a96a]/15 text-[24px]",
  signIn:
    "aurum-caps mt-6 flex h-12 w-full items-center justify-center border border-[#c8a96a]/50 text-[#e9d3a1]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-500 ${scrolled ? "border-[#c8a96a]/20 bg-[#0a0908]/90 backdrop-blur-xl" : "border-transparent"}`}
    >
      <nav
        aria-label="Main"
        className={`${CONTAINER} flex h-[76px] items-center justify-between gap-6`}
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
          <ul className="hidden items-center gap-9 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className={`aurum-caps transition-colors hover:text-[#e9d3a1] ${MUTED}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="shrink-0 flex items-center gap-5">
          <SfLink
            href={host.loginHref()}
            className={`aurum-caps hidden transition-colors hover:text-[#e9d3a1] @sm:inline ${MUTED}`}
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap aurum-caps inline-flex h-10 items-center border border-[#c8a96a]/60 px-3 @sm:px-5 text-[#e9d3a1] transition-colors hover:bg-[#c8a96a] hover:text-[#0a0908]"
          >
            Apply
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
      <SfLink href={host.loginHref()} className={BTN_LINE}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_LINE}>
      {label}
    </button>
  );
}

function facts(view: StorefrontView): [string, string][] {
  const c = view.challenges;
  if (!c.length) return [];
  const currency = c[0]?.currency ?? "USD";
  const out: [string, string][] = [
    ["Accounts to", compactMoney(Math.max(...c.map((x) => x.size)), currency)],
    ["From", money(Math.min(...c.map((x) => x.price)), currency)],
  ];
  const split = Math.max(0, ...c.map((x) => x.profitSplit ?? 0));
  if (split) out.push(["Profit split to", percent(split)]);
  return out;
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="relative isolate px-3 pb-10 pt-4 @md:px-6"
    >
      <div aria-hidden="true" className="aurum-glow pointer-events-none absolute inset-0 -z-10" />
      <Frame>
        <div className="flex min-h-[min(calc(var(--sf-vh)-140px),820px)] flex-col items-center justify-center px-5 py-20 text-center">
          <Monogram name={view.firm.name} size={76} />
          <p className={`aurum-caps mt-8 ${GOLD}`}>{hero.eyebrow}</p>
          <h1
            id={titleId}
            className="aurum-serif mx-auto mt-6 max-w-[16ch] text-balance text-[clamp(3rem,8.6cqi,6.6rem)] leading-[0.98]"
          >
            {hero.title}
          </h1>
          <Ornament className="mt-8" />
          <p
            className={`mx-auto mt-8 max-w-[36rem] text-pretty text-[17px] leading-[1.75] ${MUTED}`}
          >
            {hero.description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_GOLD}>
              {hero.primaryCta}
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
          <dl className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6">
            {facts(view).map(([label, value]) => (
              <div key={label}>
                <dt className={`aurum-caps ${MUTED}`}>{label}</dt>
                <dd className="aurum-serif aurum-num aurum-gold mt-2 text-[34px] leading-none">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Frame>
    </section>
  );
}
