import { useId } from "react";
import { compactCount, compactMoney, count, money } from "../../core/format";
import { evaluationPhases, metricsFor } from "../../core/picker";
import { Reveal, SfLink, useHost, useScrollToSection } from "../../core/runtime";
import type {
  ChallengeView,
  FaqItem,
  RuleView,
  StatView,
  StepView,
  StorefrontView,
  Testimonial,
} from "../../core/types";
import type { Picker } from "./Top";
import {
  Arrow,
  BTN_GRADIENT,
  BTN_SOFT,
  CARD,
  Check,
  CONTAINER,
  FAINT,
  Heading,
  MUTED,
  SKY,
} from "./ui";

const SECTION = "py-24 @md:py-28";

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="pt-4">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-4 @lg:grid-cols-4`}>
        {stats.map((s) => (
          <div key={s.key} className={`flex flex-col-reverse justify-end p-6 ${CARD}`}>
            <dt className={`mt-1.5 text-[14px] ${MUTED}`}>{s.label}</dt>
            <dd className="azure-text-gradient text-[clamp(2rem,4.2cqi,2.8rem)] font-bold leading-none tracking-[-0.03em]">
              {statValue(s, currency)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Pricing cards: every size of the chosen program, in step with the configurator ── */

/** One value when every phase agrees, otherwise the values in phase order. */
function phaseValues(values: (string | undefined)[]): string {
  const set = values.filter((v): v is string => Boolean(v));
  return new Set(set).size === 1 ? (set[0] ?? "") : set.join(" → ");
}

function Tier({
  c,
  active,
  onSelect,
}: {
  c: ChallengeView;
  active: boolean;
  onSelect: () => void;
}) {
  const host = useHost();
  const evals = evaluationPhases(c).length;
  const checks = metricsFor(c.phases)
    .map((m) => [m.label, phaseValues(c.phases.map((p) => m.cell(p)))] as const)
    .filter(([, v]) => v);
  return (
    <li
      className={`flex h-full flex-col p-6 transition-[box-shadow,transform] duration-300 ${CARD} ${active ? "ring-2 ring-[#0284c7]" : "hover:-translate-y-1"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-[14px] font-semibold ${SKY}`}>
          {evals === 1 ? "1-step" : `${evals}-step`}
        </p>
        {active && (
          <span className="azure-gradient rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-white">
            Selected
          </span>
        )}
      </div>
      <h3 className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.035em]">
        {money(c.size, c.currency)}
      </h3>
      <p className="mt-3 text-[15px]">
        <span className="text-[22px] font-bold tracking-[-0.02em]">
          {money(c.price, c.currency)}
        </span>
        <span className={`ml-1.5 ${FAINT}`}>fee</span>
      </p>
      <ul className="mt-6 space-y-2.5 text-[14px]">
        {checks.map(([label, value]) => (
          <li key={label} className="flex items-start gap-2.5">
            <Check />
            <span>
              <span className={MUTED}>{label}</span> <span className="font-semibold">{value}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-2 pt-7">
        <SfLink
          href={host.registerHref(c.id)}
          className={`${BTN_GRADIENT} h-11 flex-1 px-4 text-[14px]`}
        >
          Start
          <Arrow />
        </SfLink>
        {!active && (
          <button type="button" onClick={onSelect} className={`${BTN_SOFT} h-11 px-4 text-[14px]`}>
            Configure
          </button>
        )}
      </div>
    </li>
  );
}

export function Pricing({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const id = useId();
  const scrollTo = useScrollToSection();
  if (!picker.current) {
    return (
      <section data-sf-section="pricing" className={SECTION}>
        <p className={`${CONTAINER} p-8 text-center ${CARD} ${MUTED}`}>
          Accounts are being set up. Check back soon.
        </p>
      </section>
    );
  }
  const select = (cId: string) => {
    picker.pick(cId);
    scrollTo("top");
  };
  return (
    <section data-sf-section="pricing" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading
          id={id}
          eyebrow="Pricing"
          title={`Every ${picker.group} account`}
          sub="Clear rules for every size. Pick one to start, or configure it above."
          center
        />
        {view.groups.length > 1 && (
          <p className={`mt-4 text-center text-[14px] ${FAINT}`}>
            Switch program in the configurator at the top of the page.
          </p>
        )}
        <ul className="mt-12 grid gap-5 @md:grid-cols-2 @xl:grid-cols-3">
          {picker.inGroup.map((c) => (
            <Tier
              key={c.id}
              c={c}
              active={c.id === picker.current?.id}
              onSelect={() => select(c.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────────────── */

const STEP_COLS: Record<number, string> = {
  3: "@lg:grid-cols-3",
  4: "@lg:grid-cols-4",
  5: "@lg:grid-cols-5",
};

export function HowItWorks({ steps }: { steps: StepView[] }) {
  const id = useId();
  return (
    <section data-sf-section="how" aria-labelledby={id} className={`${SECTION} bg-white`}>
      <div className={CONTAINER}>
        <Heading id={id} eyebrow="How it works" title="Your path to a funded account" center />
        <ol
          className={`mt-14 grid gap-5 @md:grid-cols-2 ${STEP_COLS[steps.length] ?? "@lg:grid-cols-4"}`}
        >
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 60} className="h-full rounded-[22px] bg-[#f4f8ff] p-6">
                <span className="azure-gradient flex h-11 w-11 items-center justify-center rounded-[14px] text-[18px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(79,70,229,0.7)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em]">{s.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${MUTED}`}>{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Rules ───────────────────────────────────────────────────────────── */

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading
          id={id}
          eyebrow="Trading rules"
          title="Rules you'll actually understand"
          sub={
            example
              ? `Phase 1 of the ${example} account. Every size's rules are on its pricing card.`
              : undefined
          }
          center
        />
        <dl className="mx-auto mt-12 grid max-w-[60rem] gap-4 @md:grid-cols-2">
          {rules.map((r) => (
            <div key={r.key} className={`flex items-start gap-4 p-5 ${CARD}`}>
              <Check />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[16px] font-semibold">{r.label}</dt>
                  <dd
                    className={`text-[20px] font-bold tracking-[-0.02em] ${r.key === "split" ? "azure-text-gradient" : ""}`}
                  >
                    {r.value}
                  </dd>
                </div>
                <dd className={`mt-1 text-[14px] leading-relaxed ${MUTED}`}>{r.body}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`${SECTION} bg-white`}>
      <div className={CONTAINER}>
        <Heading id={id} eyebrow="Traders" title="Loved by traders" center />
        <div className="mt-12 columns-1 gap-5 @md:columns-2 @lg:columns-3">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className="mb-5 break-inside-avoid rounded-[22px] bg-[#f4f8ff] p-6"
            >
              <blockquote className="text-pretty text-[16px] leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[14px]">
                <span className="font-semibold">{t.name}</span>
                {t.detail && <span className={`ml-2 ${FAINT}`}>{t.detail}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({ heading, body }: { heading: string; body: string }) {
  return (
    <section aria-label="About" className={SECTION}>
      <div className={`${CONTAINER} mx-auto max-w-[48rem] text-center`}>
        <h2 className="text-balance text-[clamp(2rem,4.4cqi,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          {heading || "About us"}
        </h2>
        {body && (
          <p className={`mt-6 whitespace-pre-line text-[17px] leading-[1.75] ${MUTED}`}>{body}</p>
        )}
      </div>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="azure-faq border-b border-[#0b1a33]/[0.08] last:border-0">
      <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-[17px] font-semibold">
        {item.question}
        <span
          aria-hidden="true"
          className="azure-faq-icon azure-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[18px] leading-none text-white transition-transform duration-300"
        >
          +
        </span>
      </summary>
      <p className={`px-6 pb-6 text-[15px] leading-[1.7] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
        <div>
          <Heading id={id} eyebrow="FAQ" title="Questions? Answers." />
          <p className={`mt-5 text-[15px] ${MUTED}`}>
            Something else?{" "}
            <SfLink href={host.loginHref()} className={`font-semibold ${SKY} hover:underline`}>
              Sign in and open a support ticket
            </SfLink>
            .
          </p>
        </div>
        <div className={`overflow-hidden ${CARD}`}>
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const host = useHost();
  const id = useId();
  return (
    <section aria-labelledby={id} className="pb-24 @md:pb-28">
      <div className={CONTAINER}>
        <Reveal className="azure-gradient relative overflow-hidden rounded-[32px] px-6 py-16 text-center text-white @md:px-12 @md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl"
          />
          <h2
            id={id}
            className="relative mx-auto max-w-[34rem] text-balance text-[clamp(2.2rem,5.4cqi,3.8rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
          >
            Ready to trade with {view.firm.name}?
          </h2>
          <p className="relative mx-auto mt-5 max-w-[30rem] text-[17px] text-white/80">
            Configure an account, pass the evaluation, get funded.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("top")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0b1a33] transition-colors hover:bg-[#eaf2ff]"
            >
              {view.content.hero.primaryCta}
              <Arrow />
            </button>
            <SfLink
              href={host.loginHref()}
              className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] transition-colors hover:bg-white/10"
            >
              Sign in
            </SfLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
