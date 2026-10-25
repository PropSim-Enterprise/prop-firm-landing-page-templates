import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, BTN_INK, BTN_WHITE, CONTAINER, MUTED, Sticker } from "./ui";

export function Announcement({ text }: { text: string }) {
  return (
    <div className="border-b-[2.5px] border-[#111] bg-[#ff5c8a] px-5 py-2.5 text-center text-[14px] font-bold">
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
    "flex h-11 w-11 items-center justify-center rounded-[12px] border-[2.5px] border-[#111] bg-white text-[#111]",
  panel: "border-b-[2.5px] border-[#111] bg-[#fff6e5] px-5 pb-6 pt-2",
  link: "flex h-14 w-full items-center border-b-[2.5px] border-[#111]/10 text-[20px] font-bold",
  signIn:
    "pop-press mt-5 flex h-12 w-full items-center justify-center rounded-[14px] border-[2.5px] border-[#111] bg-white text-[16px] font-bold shadow-[4px_4px_0_#111]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b-[2.5px] transition-colors duration-200 ${scrolled ? "border-[#111] bg-[#fff6e5]" : "border-transparent"}`}
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
          <ul className="hidden items-center gap-2 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className="rounded-full border-[2.5px] border-transparent px-4 py-1.5 text-[15px] font-bold transition-colors hover:border-[#111] hover:bg-white"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="shrink-0 flex items-center gap-3">
          <SfLink
            href={host.loginHref()}
            className="hidden text-[15px] font-bold underline decoration-[2.5px] underline-offset-4 @sm:inline"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap pop-press inline-flex items-center rounded-[12px] border-[2.5px] border-[#111] bg-[#ffd23f] px-3 @sm:px-4 py-2 text-[15px] font-bold shadow-[4px_4px_0_#111]"
          >
            Get funded
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
      <SfLink href={host.loginHref()} className={BTN_WHITE}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_WHITE}>
      {label}
    </button>
  );
}

/** Stickers carry real numbers only: top split, lowest fee, largest account. */
function stickers(view: StorefrontView): [string, string, string][] {
  const c = view.challenges;
  if (!c.length) return [];
  const currency = c[0]?.currency ?? "USD";
  const out: [string, string, string][] = [];
  const split = Math.max(0, ...c.map((x) => x.profitSplit ?? 0));
  if (split) out.push([`Up to ${percent(split)} split`, "bg-[#ff5c8a]", "-rotate-6"]);
  out.push([
    `From ${money(Math.min(...c.map((x) => x.price)), currency)}`,
    "bg-[#4d96ff]",
    "rotate-3",
  ]);
  out.push([
    `Accounts to ${compactMoney(Math.max(...c.map((x) => x.size)), currency)}`,
    "bg-[#7ee081]",
    "-rotate-2",
  ]);
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
      className="pop-dots border-b-[2.5px] border-[#111]"
    >
      <div
        className={`${CONTAINER} grid items-center gap-12 pb-20 pt-12 @md:pt-16 @lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]`}
      >
        <div>
          <Sticker>{hero.eyebrow}</Sticker>
          <h1
            id={titleId}
            className="mt-7 text-balance text-[clamp(3rem,8.4cqi,6.4rem)] font-bold leading-[0.95] tracking-[-0.05em]"
          >
            {hero.title}
          </h1>
          <p className={`mt-7 max-w-[34rem] text-pretty text-[19px] leading-[1.6] ${MUTED}`}>
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_INK}>
              {hero.primaryCta} →
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
        <ul
          aria-label="At a glance"
          className="flex flex-wrap gap-4 @lg:flex-col @lg:items-start @lg:gap-6"
        >
          {stickers(view).map(([text, color, tilt]) => (
            <li key={text}>
              <span
                className={`inline-block rounded-[18px] border-[2.5px] border-[#111] px-6 py-4 text-[clamp(1.3rem,2.6cqi,2rem)] font-bold shadow-[6px_6px_0_#111] ${color} ${tilt}`}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
