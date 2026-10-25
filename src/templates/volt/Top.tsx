import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, Brand, BTN_LIME, BTN_OUTLINE, CONTAINER, MUTED } from "./ui";

/* ── Announcement + nav ──────────────────────────────────────────────── */

export function Announcement({ text }: { text: string }) {
  return (
    <div className="bg-[#d7ff3d] px-5 py-2.5 text-center text-[13px] font-bold uppercase tracking-[0.06em] text-[#0b0b0c]">
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
    "flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#f4f4f0]/20 text-[#f4f4f0]",
  panel: "border-b-2 border-[#f4f4f0]/10 bg-[#0b0b0c] px-5 pb-6 pt-2",
  link: "volt-display flex h-14 w-full items-center border-b-2 border-[#f4f4f0]/[0.08] text-[30px]",
  signIn:
    "mt-5 flex h-14 w-full items-center justify-center rounded-full border-2 border-[#d7ff3d] text-[14px] font-bold uppercase tracking-[0.08em] text-[#d7ff3d]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b-2 transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-[#f4f4f0]/10 bg-[#0b0b0c]/90 backdrop-blur-xl" : "border-transparent"
      }`}
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
          <ul className="hidden items-center gap-8 @lg:flex">
            {links.map(([section, label]) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f4f0]/70 transition-colors hover:text-[#d7ff3d]"
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
            className="hidden h-11 items-center px-4 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:text-[#d7ff3d] @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-11 items-center rounded-full bg-[#d7ff3d] px-3 @sm:px-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#0b0b0c] transition-colors hover:bg-[#e4ff73]"
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

/** "Trade our capital. Keep up to 90%…" → the first sentence plain, the rest highlighted. */
function splitTitle(title: string): [string, string] {
  const match = /^(.+?[.!?])\s+(.+)$/.exec(title.trim());
  return match ? [match[1] ?? title, match[2] ?? ""] : [title, ""];
}

function SecondaryCta({ label }: { label: string }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  if (/sign|log/i.test(label)) {
    return (
      <SfLink href={host.loginHref()} className={BTN_OUTLINE}>
        {label}
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_OUTLINE}>
      {label}
    </button>
  );
}

const topSplit = (c: ChallengeView[]) =>
  Math.max(0, ...c.map((x) => x.profitSplit ?? 0)) || undefined;

/** A circular badge whose text turns slowly around the firm's top split. */
function SplitBadge({ split }: { split?: number }) {
  // A local id: several previews can sit on one back-office page.
  const ringId = `volt-ring-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const ring = split ? `Profit split up to ${percent(split)} · ` : "Funded trader program · ";
  return (
    <div className="relative h-[168px] w-[168px] shrink-0" aria-hidden="true">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="volt-spin absolute inset-0 h-full w-full"
      >
        <defs>
          <path id={ringId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#d7ff3d" />
        <text fill="#0b0b0c" fontSize="15.5" fontWeight="800" letterSpacing="2.6">
          <textPath href={`#${ringId}`}>{`${ring}${ring}`.toUpperCase()}</textPath>
        </text>
      </svg>
      <span className="volt-display volt-num absolute inset-0 flex items-center justify-center text-[44px] text-[#0b0b0c]">
        {split ? percent(split) : "★"}
      </span>
    </div>
  );
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  const [plain, marked] = splitTitle(hero.title);
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="volt-grain pointer-events-none absolute inset-0 -z-10" />
      <div className={`${CONTAINER} pb-16 pt-12 @md:pb-24 @md:pt-20`}>
        <div className="flex items-start justify-between gap-8">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-[#d7ff3d]">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#d7ff3d]" />
            {hero.eyebrow}
          </p>
          <div className="hidden @lg:block">
            <SplitBadge split={topSplit(view.challenges)} />
          </div>
        </div>
        <h1
          id={titleId}
          className="volt-display mt-6 max-w-[14ch] text-[clamp(3.6rem,11.6cqi,9.6rem)] @lg:-mt-16"
        >
          {plain}
          {marked && (
            <>
              {" "}
              <span className="volt-mark">{marked}</span>
            </>
          )}
        </h1>
        <div className="mt-10 grid gap-8 @lg:grid-cols-[minmax(0,34rem)_auto] @lg:items-end @lg:justify-between">
          <p className={`text-pretty text-[19px] leading-[1.6] ${MUTED}`}>{hero.description}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_LIME}>
              {hero.primaryCta}
              <Arrow />
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── A moving band of real accounts ──────────────────────────────────── */

function MarqueeItems({
  challenges,
  hidden = false,
}: {
  challenges: ChallengeView[];
  hidden?: boolean;
}) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {challenges.map((c) => (
        <li key={c.id} className="flex items-center gap-4 whitespace-nowrap px-6">
          <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#0b0b0c]/60">
            {c.group}
          </span>
          <span className="volt-display volt-num text-[38px] text-[#0b0b0c]">
            {compactMoney(c.size, c.currency)}
          </span>
          <span className="volt-num text-[15px] font-bold text-[#0b0b0c]">
            {money(c.price, c.currency)}
          </span>
          <span aria-hidden="true" className="pl-2 text-[22px] text-[#0b0b0c]">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ challenges }: { challenges: ChallengeView[] }) {
  if (challenges.length === 0) return null;
  return (
    <section
      data-sf-overflow="intentional"
      aria-label="Accounts and fees"
      className="volt-marquee relative left-[-2%] w-[104%] -rotate-1 overflow-hidden bg-[#d7ff3d] py-4"
    >
      <div className="volt-marquee-track flex w-max">
        <MarqueeItems challenges={challenges} />
        <MarqueeItems challenges={challenges} hidden />
      </div>
    </section>
  );
}
