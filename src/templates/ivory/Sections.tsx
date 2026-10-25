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
import { Arrow, CONTAINER, FAINT, GREEN, Heading, MUTED } from "./ui";

const RULED = "border-t border-[#161512]/[0.12] py-24 @md:py-32";

/* ── Stats ───────────────────────────────────────────────────────────── */

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="pb-8">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-x-8 gap-y-10 @lg:grid-cols-4`}>
        {stats.map((s) => (
          <div key={s.key} className="border-t border-[#161512] pt-5">
            <dd className="ivory-serif ivory-num text-[clamp(2.8rem,5.4cqi,4rem)] leading-none tracking-[-0.02em]">
              {statValue(s, currency)}
            </dd>
            <dt className={`mt-3 text-[14px] ${MUTED}`}>{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── How it works: a timeline ────────────────────────────────────────── */

export function HowItWorks({ steps }: { steps: StepView[] }) {
  const id = useId();
  return (
    <section data-sf-section="how" aria-labelledby={id} className={RULED}>
      <div
        className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @lg:gap-20`}
      >
        <div className="@lg:sticky @lg:top-28 @lg:self-start">
          <Heading
            id={id}
            kicker="How it works"
            title="From first trade to funded account"
            sub="The same path for every trader, with the same published rules."
          />
        </div>
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[27px] top-6 w-px bg-[#161512]/15"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-7 pb-10 last:pb-0">
              <span
                className={`ivory-serif relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-[24px] italic ${
                  i === steps.length - 1
                    ? "border-[#1d5c46] bg-[#1d5c46] text-[#f6f3ec]"
                    : "border-[#161512]/20 bg-[#f6f3ec]"
                }`}
              >
                {i + 1}
              </span>
              <Reveal delay={i * 60} className="pt-2.5">
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">{s.title}</h3>
                <p className={`mt-2 max-w-[34rem] text-[16px] leading-relaxed ${MUTED}`}>
                  {s.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Rules: a ledger with dotted leaders ─────────────────────────────── */

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={RULED}>
      <div className={CONTAINER}>
        <Heading
          id={id}
          kicker="Trading rules"
          title="The rules, in plain words"
          sub={
            example
              ? `Phase 1 of the ${example} account. Every account is compared above.`
              : undefined
          }
        />
        <dl className="mt-14 grid gap-x-16 @lg:grid-cols-2">
          {rules.map((r) => (
            <div key={r.key} className="border-b border-[#161512]/[0.12] py-6">
              <div className="flex items-baseline">
                <dt className="text-[17px] font-medium">{r.label}</dt>
                <span aria-hidden="true" className="ivory-leader" />
                <dd
                  className={`ivory-serif ivory-num text-[30px] leading-none ${r.key === "split" ? GREEN : ""}`}
                >
                  {r.value}
                </dd>
              </div>
              <p className={`mt-2 max-w-[30rem] text-[15px] leading-relaxed ${MUTED}`}>{r.body}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── Testimonials: pull quotes (only ever the operator's own) ────────── */

export function Testimonials({ items }: { items: Testimonial[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={RULED}>
      <div className={CONTAINER}>
        <Heading id={id} kicker="Traders" title="In their own words" />
        <div className="mt-14 grid gap-x-16 gap-y-14 @lg:grid-cols-2">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className="border-l-2 border-[#1d5c46] pl-7"
            >
              <blockquote className="ivory-serif text-pretty text-[clamp(1.6rem,3cqi,2.1rem)] leading-[1.2]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[14px]">
                <span className="font-medium">{t.name}</span>
                {t.detail && <span className={`ml-2 ${MUTED}`}>{t.detail}</span>}
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
    <section aria-label="About" className={RULED}>
      <div className={`${CONTAINER} mx-auto max-w-[52rem] text-center`}>
        <h2 className="ivory-serif text-balance text-[clamp(2.2rem,4.8cqi,3.4rem)] leading-[1.05]">
          {heading || "About us"}
        </h2>
        {body && (
          <p className={`mt-7 whitespace-pre-line text-[18px] leading-[1.75] ${MUTED}`}>{body}</p>
        )}
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="ivory-faq border-b border-[#161512]/[0.12]">
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
        <span className="ivory-serif text-[clamp(1.35rem,2.4cqi,1.65rem)] leading-snug">
          {item.question}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="ivory-faq-icon h-4 w-4 shrink-0 text-[#1d5c46] transition-transform duration-300"
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <p className={`max-w-[42rem] pb-7 text-[16px] leading-[1.7] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={RULED}>
      <div className={`${CONTAINER} mx-auto max-w-[56rem]`}>
        <Heading id={id} kicker="Questions" title="Asked and answered" center />
        <div className="mt-14 border-t border-[#161512]/[0.12]">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
        <p className={`mt-10 text-center text-[15px] ${MUTED}`}>
          Something else?{" "}
          <SfLink
            href={host.loginHref()}
            className="font-medium text-[#161512] underline decoration-[#161512]/25 underline-offset-4 transition-colors hover:decoration-[#161512]"
          >
            Sign in and open a support ticket
          </SfLink>
          .
        </p>
      </div>
    </section>
  );
}

/* ── Closing band ────────────────────────────────────────────────────── */

export function FinalCta({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const host = useHost();
  const id = useId();
  return (
    <section aria-labelledby={id} className="bg-[#161512] py-24 text-[#f6f3ec] @md:py-32">
      <div className={`${CONTAINER} text-center`}>
        <h2
          id={id}
          className="ivory-serif mx-auto max-w-[16ch] text-balance text-[clamp(2.8rem,7.4cqi,5.6rem)] leading-[0.98] tracking-[-0.02em]"
        >
          Begin your evaluation <em className="italic text-[#9cc9b4]">today.</em>
        </h2>
        <p className="mx-auto mt-7 max-w-[34rem] text-[18px] leading-relaxed text-[#f6f3ec]/65">
          Choose an account, pass the evaluation and trade with {view.firm.name}.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo("challenges")}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f6f3ec] px-6 text-[15px] font-medium text-[#161512] transition-colors hover:bg-white"
          >
            {view.content.hero.primaryCta}
            <Arrow />
          </button>
          <SfLink
            href={host.loginHref()}
            className="inline-flex h-12 items-center rounded-full border border-[#f6f3ec]/25 px-6 text-[15px] font-medium transition-colors hover:border-[#f6f3ec]/60"
          >
            Sign in
          </SfLink>
        </div>
        <p className={`mt-12 text-[12px] uppercase tracking-[0.16em] ${FAINT}`}>
          {view.content.hero.eyebrow}
        </p>
      </div>
    </section>
  );
}
