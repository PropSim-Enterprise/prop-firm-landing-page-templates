import { useId } from "react";
import { flagshipOf } from "../../core/catalog";
import { money, percent } from "../../core/format";
import { MobileMenu, type MobileMenuStyle } from "../../core/menu";
import { evaluationPhases } from "../../core/picker";
import { SfLink, useHost, useScrolled, useScrollToSection } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { AMBER, Brand, BTN_AMBER, BTN_LINE, CONTAINER, DIM, FAINT, GREEN, Pane } from "./ui";

export function Announcement({ text }: { text: string }) {
  return (
    <div className="border-b border-[#1e2630] bg-[#ffb000]/10 px-4 py-2 text-center text-[12px] text-[#ffcf66]">
      <span className="font-bold">NOTICE</span> <span className={FAINT}>│</span> {text}
    </div>
  );
}

function navLinks(view: StorefrontView): [string, string][] {
  const links: [string, string][] = [];
  if (view.challenges.length) links.push(["challenges", "Accounts"]);
  if (view.sections.howItWorks) links.push(["how", "Process"]);
  if (view.sections.rules) links.push(["rules", "Rules"]);
  if (view.sections.faq) links.push(["faq", "FAQ"]);
  return links;
}

const MENU: MobileMenuStyle = {
  button: "flex h-11 w-11 items-center justify-center border border-[#2c3744] text-[#d6dde6]",
  panel: "border-b border-[#1e2630] bg-[#0c0f14] px-4 pb-5 pt-1",
  link: "flex h-12 w-full items-center gap-3 border-b border-[#1e2630] text-[14px] uppercase tracking-[0.08em] text-[#d6dde6]",
  signIn:
    "mt-4 flex h-12 w-full items-center justify-center border border-[#2c3744] text-[13px] font-bold uppercase tracking-[0.08em] text-[#d6dde6]",
};

export function Nav({ view }: { view: StorefrontView }) {
  const host = useHost();
  const scrollTo = useScrollToSection();
  const scrolled = useScrolled();
  const links = view.firm.showMenu ? navLinks(view) : [];
  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#1e2630] transition-colors duration-200 ${scrolled ? "bg-[#0c0f14]/95 backdrop-blur" : "bg-[#0c0f14]"}`}
    >
      <nav
        aria-label="Main"
        className={`${CONTAINER} flex h-14 items-center justify-between gap-4`}
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
          <ul className="hidden items-center gap-1 @lg:flex">
            {links.map(([section, label], i) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => scrollTo(section)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[12px] uppercase tracking-[0.08em] text-[#9aa6b4] transition-colors hover:bg-[#151b24] hover:text-[#d6dde6]"
                >
                  <span className="border border-[#2c3744] px-1 text-[12px] text-[#7d8896]">
                    F{i + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="shrink-0 flex items-center gap-2">
          <SfLink
            href={host.loginHref()}
            className="hidden h-9 items-center px-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#9aa6b4] transition-colors hover:text-[#d6dde6] @sm:inline-flex"
          >
            Sign in
          </SfLink>
          <SfLink
            href={host.registerHref()}
            className="whitespace-nowrap inline-flex h-11 items-center bg-[#ffb000] px-3 @sm:px-4 @md:h-9 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0c0f14] transition-colors hover:bg-[#ffc23d]"
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
      <SfLink href={host.loginHref()} className={BTN_LINE}>
        [ {label} ]
      </SfLink>
    );
  }
  return (
    <button type="button" onClick={() => scrollTo("how")} className={BTN_LINE}>
      [ {label} ]
    </button>
  );
}

/** The flagship account as a config file: real values only, keys skipped when unset. */
function specLines(c: ChallengeView): [string, string, boolean][] {
  const lines: [string, string, boolean][] = [
    ["account.size", money(c.size, c.currency), false],
    ["account.fee", money(c.price, c.currency), false],
  ];
  evaluationPhases(c).forEach((p, i) => {
    if (p.target !== undefined) lines.push([`phase_${i + 1}.target`, percent(p.target), false]);
  });
  const first = c.phases[0];
  if (first?.dailyLoss !== undefined)
    lines.push(["limit.daily_loss", percent(first.dailyLoss), false]);
  if (first?.maxLoss !== undefined) lines.push(["limit.max_loss", percent(first.maxLoss), false]);
  if (first?.leverage) lines.push(["account.leverage", `1:${first.leverage}`, false]);
  if (c.profitSplit !== undefined)
    lines.push(["funded.profit_split", percent(c.profitSplit), true]);
  return lines;
}

function SpecSheet({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  return (
    <Pane
      title={`${challenge.group.toLowerCase().replace(/\s+/g, "_")}.conf`}
      aside={<span className={`text-[12px] ${GREEN}`}>● loaded</span>}
    >
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.9] quant-scrollbar-none">
        <code>
          <span className={FAINT}># {challenge.name}</span>
          {"\n"}
          {specLines(challenge).map(([key, value, good]) => (
            <span key={key}>
              <span className="text-[#8fb3ff]">{key.padEnd(20, " ")}</span>
              <span className={FAINT}>= </span>
              <span className={good ? GREEN : AMBER}>{value}</span>
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
      <div className="border-t border-[#1e2630] p-3">
        <SfLink href={host.registerHref(challenge.id)} className={`${BTN_AMBER} w-full`}>
          Start this account →
        </SfLink>
      </div>
    </Pane>
  );
}

export function Hero({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const titleId = useId();
  const { hero } = view.content;
  const flagship = flagshipOf(view.challenges);
  return (
    <section
      data-sf-section="top"
      aria-labelledby={titleId}
      className="quant-scanlines relative border-b border-[#1e2630]"
    >
      <div
        className={`${CONTAINER} grid items-start gap-10 py-14 @md:py-20 @lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] @lg:gap-14`}
      >
        <div>
          <p className={`text-[13px] ${DIM}`}>
            <span className={GREEN}>{view.firm.slug}@funded</span>
            <span className={FAINT}>:~$ </span>
            <span className="text-[#d6dde6]">{hero.eyebrow.toLowerCase()}</span>
            <span aria-hidden="true" className="quant-cursor" />
          </p>
          <h1
            id={titleId}
            className="mt-7 text-balance text-[clamp(2.3rem,6cqi,4.2rem)] font-bold leading-[1.06] tracking-[-0.04em]"
          >
            {hero.title}
          </h1>
          <p className={`mt-6 max-w-[38rem] text-pretty text-[15px] leading-[1.85] ${DIM}`}>
            {hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_AMBER}>
              [ {hero.primaryCta} ]
            </button>
            <SecondaryCta label={hero.secondaryCta} />
          </div>
        </div>
        {flagship && <SpecSheet challenge={flagship} />}
      </div>
    </section>
  );
}
