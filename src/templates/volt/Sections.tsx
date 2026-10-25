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
import { Arrow, CONTAINER, FAINT, Heading, LIME, MUTED } from "./ui";

const SECTION = "border-t-2 border-[#f4f4f0]/[0.08] py-24 @md:py-32";

/* ── Stats ───────────────────────────────────────────────────────────── */

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="pb-6 pt-20">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-y-10 @lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`flex flex-col-reverse pr-6 ${i % 2 === 1 ? "border-l-2 border-[#f4f4f0]/10 pl-6" : ""} ${
              i === 2 ? "@lg:border-l-2 @lg:border-[#f4f4f0]/10 @lg:pl-6" : ""
            }`}
          >
            <dt className={`mt-3 text-[12px] font-bold uppercase tracking-[0.14em] ${MUTED}`}>
              {s.label}
            </dt>
            <dd className={`volt-display volt-num text-[clamp(3.4rem,7cqi,5.6rem)] ${LIME}`}>
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
        <Heading id={id} tag="How it works" title="Pass. Get funded. Get paid." />
        <ol
          className={`mt-14 grid gap-4 @md:grid-cols-2 ${STEP_COLS[steps.length] ?? "@lg:grid-cols-4"}`}
        >
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li key={s.title}>
                <Reveal
                  delay={i * 70}
                  className={`h-full rounded-[26px] border-2 p-6 @md:p-7 ${
                    last
                      ? "border-[#d7ff3d] bg-[#d7ff3d] text-[#0b0b0c]"
                      : "border-[#f4f4f0]/[0.12]"
                  }`}
                >
                  <span
                    className={`volt-display volt-num block text-[84px] ${last ? "" : "volt-outline"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-[20px] font-bold uppercase tracking-[0.02em]">
                    {s.title}
                  </h3>
                  <p
                    className={`mt-2 text-[15px] leading-relaxed ${last ? "text-[#0b0b0c]/75" : MUTED}`}
                  >
                    {s.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── Rules: a bento of big numbers ───────────────────────────────────── */

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading
          id={id}
          tag="Trading rules"
          title="No small print."
          sub={
            example
              ? `Phase 1 of the ${example} account. Every account's full rule sheet is on its tile above.`
              : undefined
          }
        />
        <dl className="mt-14 grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
          {rules.map((r) => {
            const split = r.key === "split";
            return (
              <div
                key={r.key}
                className={`rounded-[26px] border-2 p-6 @md:p-7 ${
                  split ? "border-[#d7ff3d] bg-[#d7ff3d] text-[#0b0b0c]" : "border-[#f4f4f0]/[0.12]"
                }`}
              >
                <dt className="text-[12px] font-bold uppercase tracking-[0.14em] opacity-70">
                  {r.label}
                </dt>
                <dd>
                  <p className="volt-display volt-num mt-4 text-[64px]">{r.value}</p>
                  <p
                    className={`mt-3 text-[14px] leading-relaxed ${split ? "text-[#0b0b0c]/75" : MUTED}`}
                  >
                    {r.body}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
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
        <Heading id={id} tag="Traders" title="Their words." />
        <div className="mt-14 columns-1 gap-4 @md:columns-2 @lg:columns-3">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className="mb-4 break-inside-avoid rounded-[26px] border-2 border-[#f4f4f0]/[0.12] p-7"
            >
              <span
                aria-hidden="true"
                className={`volt-display block text-[72px] leading-[0.6] ${LIME}`}
              >
                “
              </span>
              <blockquote className="mt-2 text-pretty text-[17px] leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-[13px] font-bold uppercase tracking-[0.1em]">
                {t.name}
                {t.detail && (
                  <span className={`ml-2 font-normal normal-case tracking-normal ${FAINT}`}>
                    {t.detail}
                  </span>
                )}
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
      <div className={`${CONTAINER} grid gap-10 @lg:grid-cols-2 @lg:gap-16`}>
        <h2 className="volt-display text-balance text-[clamp(2.8rem,6cqi,4.6rem)]">
          {heading || "About us"}
        </h2>
        {body && <p className={`whitespace-pre-line text-[18px] leading-[1.7] ${MUTED}`}>{body}</p>}
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="volt-faq border-b-2 border-[#f4f4f0]/10">
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[19px] font-bold transition-colors hover:text-[#d7ff3d]">
        {item.question}
        <span
          aria-hidden="true"
          className="volt-faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#f4f4f0]/20 text-[20px] leading-none transition-transform duration-300"
        >
          +
        </span>
      </summary>
      <p className={`max-w-[44rem] pb-7 text-[16px] leading-[1.7] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div
        className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @lg:gap-16`}
      >
        <div>
          <Heading id={id} tag="FAQ" title="Got questions?" size="column" />
          <p className={`mt-6 text-[16px] ${MUTED}`}>
            Something else?{" "}
            <SfLink
              href={host.loginHref()}
              className="font-bold text-[#d7ff3d] underline decoration-[#d7ff3d]/40 underline-offset-4 hover:decoration-[#d7ff3d]"
            >
              Sign in and open a support ticket
            </SfLink>
            .
          </p>
        </div>
        <div className="border-t-2 border-[#f4f4f0]/10">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Lime finish ─────────────────────────────────────────────────────── */

export function FinalCta({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const host = useHost();
  const id = useId();
  return (
    <section aria-labelledby={id} className="bg-[#d7ff3d] py-20 text-[#0b0b0c] @md:py-28">
      <div
        className={`${CONTAINER} flex flex-col gap-10 @lg:flex-row @lg:items-end @lg:justify-between`}
      >
        <h2 id={id} className="volt-display text-[clamp(4rem,13cqi,10rem)]">
          Get funded.
        </h2>
        <div className="max-w-[26rem] @lg:pb-4">
          <p className="text-[18px] font-medium leading-relaxed text-[#0b0b0c]/75">
            Choose an account, pass the evaluation and trade with {view.firm.name}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollTo("challenges")}
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-[#0b0b0c] px-7 text-[15px] font-bold uppercase tracking-[0.04em] text-[#d7ff3d] transition-colors hover:bg-[#1d1d1f]"
            >
              {view.content.hero.primaryCta}
              <Arrow />
            </button>
            <SfLink
              href={host.loginHref()}
              className="inline-flex h-14 items-center rounded-full border-2 border-[#0b0b0c] px-7 text-[15px] font-bold uppercase tracking-[0.04em] transition-colors hover:bg-[#0b0b0c]/10"
            >
              Sign in
            </SfLink>
          </div>
        </div>
      </div>
    </section>
  );
}
