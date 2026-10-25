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
import { BTN_GOLD, BTN_LINE, CONTAINER, FAINT, Frame, GOLD, Heading, MUTED, Ornament } from "./ui";

const SECTION = "border-t border-[#c8a96a]/15 py-24 @md:py-32";
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="py-16">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-y-10 @lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`flex flex-col-reverse items-center justify-end text-center ${i > 0 ? "@lg:border-l @lg:border-[#c8a96a]/20" : ""}`}
          >
            <dt className={`aurum-caps mt-3 ${MUTED}`}>{s.label}</dt>
            <dd className="aurum-serif aurum-num aurum-gold text-[clamp(2.8rem,5cqi,3.8rem)] leading-none">
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
        <Heading id={id} kicker="The process" title="From evaluation to funded" />
        <ol className="mt-16 grid gap-12 @md:grid-cols-2 @lg:grid-flow-col @lg:auto-cols-fr @lg:grid-cols-none">
          {steps.map((s, i) => (
            <li key={s.title} className="text-center">
              <Reveal delay={i * 80}>
                <span className="aurum-serif aurum-gold block text-[56px] leading-none">
                  {ROMAN[i] ?? i + 1}
                </span>
                <h3 className="aurum-serif mt-5 text-[26px]">{s.title}</h3>
                <p className={`mx-auto mt-3 max-w-[18rem] text-[15px] leading-relaxed ${MUTED}`}>
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

export function Rules({ rules, example }: { rules: RuleView[]; example?: string }) {
  const id = useId();
  return (
    <section data-sf-section="rules" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Frame className="mx-auto max-w-[46rem]">
          <div className="px-6 py-14 @md:px-14">
            <Heading
              id={id}
              kicker="The rules"
              title="Clear terms"
              sub={example ? `Phase I of the ${example} account.` : undefined}
            />
            <dl className="mt-12 space-y-7">
              {rules.map((r) => (
                <div key={r.key} className="text-center">
                  <dt className="aurum-serif text-[24px]">
                    {r.label} <span className={`mx-2 text-[12px] ${GOLD}`}>✦</span>{" "}
                    <span className={`aurum-num ${r.key === "split" ? "aurum-gold" : ""}`}>
                      {r.value}
                    </span>
                  </dt>
                  <dd className={`mx-auto mt-1 max-w-[28rem] text-[14px] leading-relaxed ${FAINT}`}>
                    {r.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Frame>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading id={id} kicker="Traders" title="In their words" />
        <div className="mx-auto mt-14 max-w-[46rem] space-y-14 text-center">
          {items.map((t) => (
            <figure key={`${t.name}-${t.quote.slice(0, 16)}`}>
              <blockquote className="aurum-serif text-pretty text-[clamp(1.6rem,3.2cqi,2.2rem)] italic leading-[1.3]">
                “{t.quote}”
              </blockquote>
              <figcaption className={`aurum-caps mt-5 ${GOLD}`}>
                {t.name}
                {t.detail && <span className={`ml-3 ${FAINT}`}>{t.detail}</span>}
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
      <div className={`${CONTAINER} mx-auto max-w-[46rem] text-center`}>
        <h2 className="aurum-serif text-balance text-[clamp(2.2rem,4.8cqi,3.4rem)] leading-[1.08]">
          {heading || "About us"}
        </h2>
        <Ornament className="mt-6" />
        {body && (
          <p className={`mt-7 whitespace-pre-line text-[17px] leading-[1.8] ${MUTED}`}>{body}</p>
        )}
      </div>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="aurum-faq border-b border-[#c8a96a]/20">
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
        <span className="aurum-serif text-[22px] leading-snug">{item.question}</span>
        <span
          aria-hidden="true"
          className={`aurum-faq-icon text-[22px] leading-none transition-transform duration-300 ${GOLD}`}
        >
          +
        </span>
      </summary>
      <p className={`pb-7 text-[15px] leading-[1.75] ${MUTED}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div className={`${CONTAINER} mx-auto max-w-[50rem]`}>
        <Heading id={id} kicker="Questions" title="Asked and answered" />
        <div className="mt-12 border-t border-[#c8a96a]/20">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
        <p className={`mt-10 text-center text-[15px] ${MUTED}`}>
          Something else?{" "}
          <SfLink
            href={host.loginHref()}
            className="text-[#e9d3a1] underline decoration-[#c8a96a]/40 underline-offset-4 hover:decoration-[#c8a96a]"
          >
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
    <section aria-labelledby={id} className="px-3 pb-24 @md:px-6 @md:pb-32">
      <Frame className="mx-auto max-w-[1180px]">
        <div className="aurum-glow px-6 py-20 text-center @md:py-28">
          <p className={`aurum-caps ${GOLD}`}>{view.firm.name}</p>
          <h2
            id={id}
            className="aurum-serif mx-auto mt-6 max-w-[18ch] text-balance text-[clamp(2.6rem,6.4cqi,4.8rem)] leading-[1.02]"
          >
            Your evaluation awaits.
          </h2>
          <Ornament className="mt-8" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo("challenges")} className={BTN_GOLD}>
              {view.content.hero.primaryCta}
            </button>
            <SfLink href={host.loginHref()} className={BTN_LINE}>
              Sign in
            </SfLink>
          </div>
        </div>
      </Frame>
    </section>
  );
}
