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
  AMBER,
  BTN_AMBER,
  BTN_LINE,
  CONTAINER,
  DIM,
  FAINT,
  GREEN,
  Heading,
  PANEL,
  Pane,
} from "./ui";

const SECTION = "border-b border-[#1e2630] py-20 @md:py-24";

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="Firm figures" className="border-b border-[#1e2630]">
      <dl className={`${CONTAINER} grid grid-cols-2 @lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`flex flex-col-reverse justify-end px-4 py-6 ${i % 2 === 1 ? "border-l border-[#1e2630]" : ""} ${i >= 2 ? "border-t border-[#1e2630] @lg:border-t-0" : ""} ${i === 2 ? "@lg:border-l" : ""}`}
          >
            <dt className={`mt-1 text-[12px] uppercase tracking-[0.12em] ${DIM}`}>{s.label}</dt>
            <dd
              className={`text-[clamp(1.6rem,3.2cqi,2.2rem)] font-bold tracking-[-0.03em] ${s.format === "money" ? GREEN : ""}`}
            >
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
        <Heading id={id} path="process" title="The pipeline" />
        <ol className="mt-10 grid gap-3 @md:grid-cols-2 @xl:grid-flow-col @xl:auto-cols-fr @xl:grid-cols-none">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal
                delay={i * 60}
                className={`h-full p-5 ${PANEL} ${i === steps.length - 1 ? "border-[#ffb000]/60" : ""}`}
              >
                <p className={`text-[12px] ${i === steps.length - 1 ? AMBER : FAINT}`}>
                  [{String(i + 1).padStart(2, "0")}] {i === steps.length - 1 ? "done" : "step"}
                </p>
                <h3 className="mt-3 text-[16px] font-bold uppercase tracking-[0.02em]">
                  {s.title}
                </h3>
                <p className={`mt-2 text-[13px] leading-[1.75] ${DIM}`}>{s.body}</p>
              </Reveal>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#ffb000] @xl:block"
                >
                  →
                </span>
              )}
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
      <div className={`${CONTAINER} grid gap-10 @lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
        <Heading
          id={id}
          path="rules"
          title="Rules, as configured"
          sub={
            example
              ? `Phase 1 of the ${example} account. The table above has every account.`
              : undefined
          }
        />
        <Pane title="rules.conf">
          <dl className="px-4 py-3 text-[13px] leading-[1.7]">
            {rules.map((r) => (
              <div key={r.key} className="flex flex-col-reverse py-2">
                <dt className="flex justify-between gap-6">
                  <span className="text-[#8fb3ff]">
                    {r.label.toLowerCase().replace(/\s+/g, "_")}
                  </span>
                  <span className={r.key === "split" ? GREEN : AMBER}>{r.value}</span>
                </dt>
                <dd className={FAINT}># {r.body}</dd>
              </div>
            ))}
          </dl>
        </Pane>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading id={id} path="traders" title="From the traders" />
        <div className="mt-10 grid gap-3 @md:grid-cols-2 @lg:grid-cols-3">
          {items.map((t) => (
            <figure key={`${t.name}-${t.quote.slice(0, 16)}`} className={`p-5 ${PANEL}`}>
              <blockquote className="text-pretty text-[14px] leading-[1.8]">
                <span className={AMBER}>&gt; </span>
                {t.quote}
              </blockquote>
              <figcaption className={`mt-4 text-[12px] ${DIM}`}>
                — {t.name}
                {t.detail && <span className={FAINT}> · {t.detail}</span>}
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
        <h2 className="text-balance text-[clamp(1.8rem,3.8cqi,2.6rem)] font-bold leading-[1.15] tracking-[-0.03em]">
          {heading || "About us"}
        </h2>
        {body && <p className={`whitespace-pre-line text-[14px] leading-[1.9] ${DIM}`}>{body}</p>}
      </div>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="quant-faq border-b border-[#1e2630] last:border-0">
      <summary className="flex cursor-pointer items-start gap-3 px-4 py-4 text-[14px] font-bold transition-colors hover:bg-[#151b24]">
        <span
          aria-hidden="true"
          className={`quant-faq-icon mt-0.5 transition-transform duration-200 ${AMBER}`}
        >
          ▸
        </span>
        {item.question}
      </summary>
      <p className={`px-4 pb-5 pl-10 text-[13px] leading-[1.85] ${DIM}`}>{item.answer}</p>
    </details>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={SECTION}>
      <div className={`${CONTAINER} grid gap-10 @lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
        <div>
          <Heading id={id} path="faq" title="Questions" />
          <p className={`mt-5 text-[13px] leading-[1.8] ${DIM}`}>
            Something else?{" "}
            <SfLink href={host.loginHref()} className="text-[#ffb000] underline underline-offset-4">
              Sign in and open a support ticket
            </SfLink>
            .
          </p>
        </div>
        <Pane title={`faq · ${items.length} entries`}>
          {items.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </Pane>
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
      className="quant-scanlines border-b border-[#1e2630] py-20 @md:py-24"
    >
      <div className={`${CONTAINER} text-center`}>
        <p className={`text-[13px] ${DIM}`}>
          <span className={GREEN}>{view.firm.slug}@funded</span>
          <span className={FAINT}>:~$ </span>start --evaluation
          <span aria-hidden="true" className="quant-cursor" />
        </p>
        <h2
          id={id}
          className="mx-auto mt-6 max-w-[30ch] text-balance text-[clamp(2rem,5cqi,3.4rem)] font-bold leading-[1.08] tracking-[-0.04em]"
        >
          Ready when you are.
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => scrollTo("challenges")} className={BTN_AMBER}>
            [ {view.content.hero.primaryCta} ]
          </button>
          <SfLink href={host.loginHref()} className={BTN_LINE}>
            [ Sign in ]
          </SfLink>
        </div>
      </div>
    </section>
  );
}
