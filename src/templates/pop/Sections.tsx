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
import { ACCENTS, BOX, BTN_INK, BTN_WHITE, CONTAINER, Heading, MUTED } from "./ui";

const SECTION = "border-b-[2.5px] border-[#111] py-20 @md:py-28";

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="border-b-[2.5px] border-[#111] py-14">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-5 @lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`flex flex-col-reverse justify-end rounded-[18px] border-[2.5px] border-[#111] p-5 shadow-[5px_5px_0_#111] ${ACCENTS[i % ACCENTS.length]}`}
          >
            <dt className="mt-1 text-[14px] font-bold">{s.label}</dt>
            <dd className="text-[clamp(2.2rem,4.6cqi,3.2rem)] font-bold leading-none tracking-[-0.05em]">
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
    <section data-sf-section="how" aria-labelledby={id} className={`${SECTION} pop-dots`}>
      <div className={CONTAINER}>
        <Heading id={id} sticker="How it works" color="bg-[#7ee081]" title="How you get funded." />
        <ol className="mt-12 grid gap-6 @md:grid-cols-2 @xl:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal
                delay={i * 70}
                className={`h-full p-6 ${BOX} ${i % 2 ? "@xl:translate-y-6" : ""}`}
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-[#111] text-[20px] font-bold ${ACCENTS[i % ACCENTS.length]}`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[21px] font-bold tracking-[-0.03em]">{s.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${MUTED}`}>{s.body}</p>
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
        <Heading
          id={id}
          sticker="Cheat sheet"
          color="bg-[#ff5c8a]"
          title="The rules, on one page"
          sub={
            example
              ? `Phase 1 of the ${example} account. Every account's rules are on its receipt above.`
              : undefined
          }
        />
        <dl className={`mt-12 overflow-hidden ${BOX}`}>
          {rules.map((r, i) => (
            <div
              key={r.key}
              className={`grid gap-1 px-6 py-5 @md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] @md:items-center @md:gap-6 ${i > 0 ? "border-t-[2.5px] border-[#111]" : ""} ${r.key === "split" ? "bg-[#ffd23f]" : ""}`}
            >
              <dt className="text-[17px] font-bold">{r.label}</dt>
              <dd className={`text-[15px] ${MUTED}`}>{r.body}</dd>
              <dd className="text-[28px] font-bold tracking-[-0.04em] @md:text-right">{r.value}</dd>
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
        <Heading id={id} sticker="Traders" title="Straight from traders" />
        <div className="mt-12 columns-1 gap-6 @md:columns-2 @lg:columns-3">
          {items.map((t, i) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 16)}`}
              className={`mb-6 break-inside-avoid p-6 ${BOX} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            >
              <blockquote className="text-pretty text-[17px] font-medium leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[14px] font-bold">
                {t.name}
                {t.detail && <span className={`ml-2 font-normal ${MUTED}`}>{t.detail}</span>}
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
      <div className={`${CONTAINER} grid gap-8 @lg:grid-cols-2 @lg:gap-14`}>
        <h2 className="text-balance text-[clamp(2.2rem,4.8cqi,3.4rem)] font-bold leading-[1] tracking-[-0.04em]">
          {heading || "About us"}
        </h2>
        {body && <p className={`whitespace-pre-line text-[18px] leading-[1.7] ${MUTED}`}>{body}</p>}
      </div>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="pop-faq rounded-[16px] border-[2.5px] border-[#111] bg-white transition-colors">
      <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-[18px] font-bold">
        {item.question}
        <span
          aria-hidden="true"
          className="pop-faq-icon text-[26px] leading-none transition-transform duration-200"
        >
          +
        </span>
      </summary>
      <p className="px-6 pb-6 text-[16px] leading-relaxed">{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div className={`${CONTAINER} mx-auto max-w-[56rem]`}>
        <Heading id={id} sticker="FAQ" color="bg-[#4d96ff]" title="You asked. We answered." />
        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </div>
        <p className="mt-8 text-[16px] font-medium">
          Something else?{" "}
          <SfLink
            href={host.loginHref()}
            className="font-bold underline decoration-[2.5px] underline-offset-4"
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
    <section
      aria-labelledby={id}
      className="border-b-[2.5px] border-[#111] bg-[#ffd23f] py-20 @md:py-28"
    >
      <div className={`${CONTAINER} text-center`}>
        <h2
          id={id}
          className="mx-auto max-w-[16ch] text-balance text-[clamp(2.8rem,8cqi,6rem)] font-bold leading-[0.95] tracking-[-0.05em]"
        >
          Ready to get funded?
        </h2>
        <p className="mx-auto mt-6 max-w-[30rem] text-[19px] font-medium">
          Pick an account, pass the evaluation, trade with {view.firm.name}.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => scrollTo("challenges")} className={BTN_INK}>
            {view.content.hero.primaryCta} →
          </button>
          <SfLink href={host.loginHref()} className={BTN_WHITE}>
            Sign in
          </SfLink>
        </div>
      </div>
    </section>
  );
}
