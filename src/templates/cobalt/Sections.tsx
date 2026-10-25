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
import { Arrow, BLUE, CARD, Check, CONTAINER, FAINT, Heading, MUTED } from "./ui";

const SECTION = "py-24 @md:py-32";

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className={CONTAINER}>
      <dl className="cobalt-blue-panel grid grid-cols-2 gap-y-8 rounded-[28px] px-6 py-10 text-white @lg:grid-cols-4 @lg:px-10">
        {stats.map((s) => (
          <div key={s.key} className="flex flex-col-reverse px-2">
            <dt className="mt-2 text-[14px] text-white/75">{s.label}</dt>
            <dd className="cobalt-num text-[clamp(2.2rem,4.6cqi,3.2rem)] font-extrabold leading-none tracking-[-0.03em]">
              {statValue(s, currency)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function HowItWorks({ steps }: { steps: StepView[] }) {
  const id = useId();
  return (
    <section data-sf-section="how" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading id={id} pill="How it works" title="Step by step to a funded account" />
        <ol className="mt-12 grid gap-5 @md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 60} className={`flex h-full gap-5 p-7 ${CARD}`}>
                <span
                  className={`cobalt-num text-[44px] font-extrabold leading-none tracking-[-0.04em] ${BLUE}`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[19px] font-bold tracking-[-0.01em]">{s.title}</h3>
                  <p className={`mt-2 text-[15px] leading-relaxed ${MUTED}`}>{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={SECTION}>
      <div
        className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @lg:gap-16`}
      >
        <Heading
          id={id}
          pill="Trading rules"
          title="Simple rules, clearly written"
          sub={
            example
              ? `Phase 1 of the ${example} account. Every phase of every account is in the path above.`
              : undefined
          }
        />
        <dl className={`divide-y divide-[#0b1533]/[0.08] px-7 ${CARD}`}>
          {rules.map((r) => (
            <div key={r.key} className="flex gap-4 py-5">
              <Check />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[16px] font-semibold">{r.label}</dt>
                  <dd
                    className={`cobalt-num text-[20px] font-extrabold tracking-[-0.02em] ${r.key === "split" ? BLUE : ""}`}
                  >
                    {r.value}
                  </dd>
                </div>
                <p className={`mt-1 text-[14px] leading-relaxed ${MUTED}`}>{r.body}</p>
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
    <section aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading id={id} pill="Traders" title="What traders say" center />
        <div className="mt-12 columns-1 gap-5 @md:columns-2 @lg:columns-3">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className={`mb-5 break-inside-avoid p-7 ${CARD}`}
            >
              <blockquote className="text-pretty text-[16px] leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[14px]">
                <span className="font-bold">{t.name}</span>
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
        <h2 className="text-balance text-[clamp(2rem,4.4cqi,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
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
    <details className={`cobalt-faq px-6 ${CARD}`}>
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[16px] font-semibold">
        {item.question}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="cobalt-faq-icon h-4 w-4 shrink-0 text-[#2547f4] transition-transform duration-300"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <p className={`pb-6 text-[15px] leading-[1.7] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div className={`${CONTAINER} mx-auto max-w-[52rem]`}>
        <Heading id={id} pill="FAQ" title="Frequently asked questions" center />
        <div className="mt-12 space-y-3">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
        <p className={`mt-8 text-center text-[15px] ${MUTED}`}>
          Something else?{" "}
          <SfLink href={host.loginHref()} className="font-semibold text-[#2547f4] hover:underline">
            Sign in and open a support ticket
          </SfLink>
          .
        </p>
      </div>
    </section>
  );
}

export function FinalCta({ view }: { view: StorefrontView }) {
  const scrollTo = useScrollToSection();
  const host = useHost();
  const id = useId();
  return (
    <section aria-labelledby={id} className="pb-24 @md:pb-32">
      <div className={CONTAINER}>
        <Reveal className="cobalt-blue-panel overflow-hidden rounded-[32px] px-6 py-16 text-center text-white @md:px-12 @md:py-24">
          <h2
            id={id}
            className="mx-auto max-w-[36rem] text-balance text-[clamp(2.2rem,5.4cqi,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.035em]"
          >
            Your funded account starts with one evaluation.
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-[17px] leading-relaxed text-white/80">
            Choose an account, pass the evaluation and trade with {view.firm.name}.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("challenges")}
              className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-white px-6 text-[15px] font-semibold text-[#2547f4] transition-colors hover:bg-[#eef1f8]"
            >
              {view.content.hero.primaryCta}
              <Arrow />
            </button>
            <SfLink
              href={host.loginHref()}
              className="inline-flex h-12 items-center rounded-[14px] px-6 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] transition-colors hover:bg-white/10"
            >
              Sign in
            </SfLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
