import { useId } from "react";
import { compactCount, compactMoney, count } from "../../core/format";
import { Reveal, SfLink, useHost, useScrollToSection } from "../../core/runtime";
import type {
  FaqItem,
  RuleView,
  StatView,
  StepView,
  StorefrontView,
  Testimonial,
} from "../../core/types";
import {
  ACCENT,
  Arrow,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CONTAINER,
  FAINT,
  MUTED,
  SectionHeading,
} from "./ui";

const SECTION = "border-t border-onyx-ink/[0.06] py-24 @md:py-32";

/* ── Stats ───────────────────────────────────────────────────────────── */

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

const STAT_COLS: Record<number, string> = {
  1: "",
  2: "@md:grid-cols-2",
  3: "@md:grid-cols-3",
  4: "@md:grid-cols-4",
};

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="Firm figures" className="border-t border-onyx-ink/[0.06]">
      <dl
        className={`${CONTAINER} grid grid-cols-2 ${STAT_COLS[stats.length] ?? "@md:grid-cols-4"}`}
      >
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`py-10 @md:py-12 ${i % 2 === 1 ? "pl-5 @md:pl-8" : ""} ${i > 0 ? "@md:border-l @md:border-onyx-ink/[0.06] @md:pl-8" : ""}`}
          >
            <dt className={`text-[13px] ${MUTED}`}>{s.label}</dt>
            <dd className="onyx-num mt-2 text-[clamp(1.9rem,4cqi,2.6rem)] font-semibold leading-none tracking-[-0.04em]">
              {statValue(s, currency)}
            </dd>
          </div>
        ))}
      </dl>
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
    <section data-sf-section="how" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <SectionHeading id={id} eyebrow="How it works" title="From evaluation to funded account" />
        <ol
          className={`mt-14 grid gap-4 @md:grid-cols-2 ${STEP_COLS[steps.length] ?? "@lg:grid-cols-4"}`}
        >
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal
                delay={i * 70}
                className="onyx-panel h-full rounded-[20px] border border-onyx-ink/[0.08] p-6"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`onyx-mono text-[12px] tracking-[0.1em] ${i === steps.length - 1 ? ACCENT : FAINT}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-r from-onyx-ink/15 to-transparent"
                  />
                </div>
                <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${MUTED}`}>{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Rules at a glance ───────────────────────────────────────────────── */

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <SectionHeading
          id={id}
          eyebrow="Trading rules"
          title="Rules you can read in a minute"
          sub={
            example
              ? `Phase 1 rules for the ${example} account. Every phase of every account is in the table above.`
              : undefined
          }
        />
        {/* Each cell draws its own right/bottom hairline; the outer edge clips them. */}
        <div className="mt-14 overflow-hidden rounded-[22px] border border-onyx-ink/[0.08]">
          <dl className="-mb-px -mr-px grid @md:grid-cols-2 @lg:grid-cols-3">
            {rules.map((r) => (
              <div key={r.key} className="p-6 shadow-[inset_-1px_-1px_0_var(--o-hair)] @md:p-7">
                <dt className={`text-[14px] ${MUTED}`}>{r.label}</dt>
                <dd>
                  <p
                    className={`onyx-num mt-3 text-[32px] font-semibold leading-none tracking-[-0.035em] ${r.key === "split" ? ACCENT : ""}`}
                  >
                    {r.value}
                  </p>
                  <p className={`mt-3 text-[14px] leading-relaxed ${FAINT}`}>{r.body}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials (only ever the operator's own) ─────────────────────── */

export function Testimonials({ items }: { items: Testimonial[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <SectionHeading id={id} eyebrow="Traders" title="In their words" />
        <div className="mt-14 columns-1 gap-4 @md:columns-2 @lg:columns-3">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className="onyx-panel mb-4 break-inside-avoid rounded-[20px] border border-onyx-ink/[0.08] p-6"
            >
              <blockquote className="text-pretty text-[16px] leading-relaxed text-onyx-strong">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[14px]">
                <span className="font-medium">{t.name}</span>
                {t.detail && <span className={`ml-2 ${FAINT}`}>{t.detail}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────────────────── */

export function About({ heading, body }: { heading: string; body: string }) {
  return (
    <section aria-label="About" className={SECTION}>
      <div
        className={`${CONTAINER} grid gap-8 @lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] @lg:gap-16`}
      >
        <h2 className="text-balance text-[clamp(1.8rem,3.8cqi,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          {heading || "About us"}
        </h2>
        {body && (
          <p className={`whitespace-pre-line text-[17px] leading-[1.75] ${MUTED}`}>{body}</p>
        )}
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="onyx-faq group border-b border-onyx-ink/[0.08]">
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[16px] font-medium transition-colors hover:text-onyx-fg">
        {item.question}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="onyx-faq-icon h-4 w-4 shrink-0 text-onyx-muted transition-transform duration-300"
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <p className={`max-w-[44rem] pb-6 text-[15px] leading-[1.7] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div
        className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] @lg:gap-16`}
      >
        <div>
          <SectionHeading id={id} eyebrow="FAQ" title="Questions, answered" />
          <p className={`mt-5 text-[15px] leading-relaxed ${MUTED}`}>
            Something else?{" "}
            <SfLink
              href={host.loginHref()}
              className="text-onyx-fg underline decoration-onyx-ink/25 underline-offset-4 transition-colors hover:decoration-onyx-fg"
            >
              Sign in and open a support ticket
            </SfLink>
            .
          </p>
        </div>
        <div className="border-t border-onyx-ink/[0.08]">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing call to action ──────────────────────────────────────────── */

export function FinalCta({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const host = useHost();
  const id = useId();
  return (
    <section aria-labelledby={id} className="pb-24 @md:pb-32">
      <div className={CONTAINER}>
        <Reveal className="onyx-cta-bg relative overflow-hidden rounded-[28px] border border-onyx-ink/[0.08] px-6 py-16 text-center @md:px-12 @md:py-24">
          <h2
            id={id}
            className="mx-auto max-w-[44rem] text-balance text-[clamp(2.1rem,5.4cqi,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            Ready when you are.
          </h2>
          <p className={`mx-auto mt-5 max-w-[32rem] text-[17px] leading-relaxed ${MUTED}`}>
            Choose an account, pass the evaluation and trade with {view.firm.name}.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_PRIMARY}>
              {view.content.hero.primaryCta}
              <Arrow />
            </button>
            <SfLink href={host.loginHref()} className={BTN_SECONDARY}>
              Sign in
            </SfLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
