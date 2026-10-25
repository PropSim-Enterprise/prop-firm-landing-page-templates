import { useId } from "react";
import { compactCount, compactMoney, count, money, percent } from "../../core/format";
import { evaluationPhases } from "../../core/picker";
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
import { Arrow, BLUE, BTN_GLASS, BTN_WHITE, CARD, CONTAINER, FAINT, Heading, MUTED } from "./ui";

const SECTION = "py-24 @md:py-28";

function statValue(s: StatView, currency: string): string {
  if (s.format === "money") return compactMoney(s.value, currency);
  return s.value >= 100_000 ? compactCount(s.value) : count(s.value);
}

export function Stats({ stats, currency }: { stats: StatView[]; currency: string }) {
  return (
    <section aria-label="By the numbers" className="pt-20">
      <dl className={`${CONTAINER} grid grid-cols-2 gap-6 @lg:grid-cols-4`}>
        {stats.map((s) => (
          <div key={s.key} className="flex flex-col-reverse justify-end">
            <dt className={`mt-1.5 text-[14px] ${MUTED}`}>{s.label}</dt>
            <dd className="text-[clamp(2rem,4cqi,2.8rem)] font-semibold leading-none tracking-[-0.03em]">
              {statValue(s, currency)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Programs overview ───────────────────────────────────────────────── */

const range = (values: number[], fmt: (n: number) => string) => {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;
};

function programFacts(rows: ChallengeView[]): [string, string][] {
  const currency = rows[0]?.currency ?? "USD";
  const facts: [string, string][] = [
    [
      "Account sizes",
      range(
        rows.map((c) => c.size),
        (n) => compactMoney(n, currency),
      ),
    ],
    [
      "Evaluation fee",
      range(
        rows.map((c) => c.price),
        (n) => money(n, currency),
      ),
    ],
  ];
  const phases = [...new Set(rows.map((c) => evaluationPhases(c).length))].sort((a, b) => a - b);
  facts.push(["Evaluation", phases.map((n) => (n === 1 ? "1 phase" : `${n} phases`)).join(" or ")]);
  const splits = rows.map((c) => c.profitSplit).filter((s): s is number => s !== undefined);
  if (splits.length) facts.push(["Profit split", range(splits, percent)]);
  return facts;
}

export function Programs({ view, picker }: { view: StorefrontView; picker: Picker }) {
  const id = useId();
  const scrollTo = useScrollToSection();
  const open = (g: string) => {
    picker.pickGroup(g);
    scrollTo("challenges");
  };
  if (view.challenges.length === 0) return null;
  return (
    <section data-sf-section="programs" aria-labelledby={id} className={SECTION}>
      <div className={CONTAINER}>
        <Heading
          id={id}
          eyebrow="Programs"
          title="A program for every way of trading"
          sub="Each program shares the same clear rules format. Open one to see its accounts above."
        />
        <ul className="mt-12 grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
          {view.groups.map((g) => {
            const rows = view.challenges.filter((c) => c.group === g);
            return (
              <li key={g}>
                <Reveal className={`flex h-full flex-col p-7 ${CARD}`}>
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{g}</h3>
                  <p className={`mt-1 text-[14px] ${FAINT}`}>
                    {rows.length === 1 ? "1 account" : `${rows.length} accounts`}
                  </p>
                  <dl className="mt-6 space-y-3 text-[14px]">
                    {programFacts(rows).map(([label, value]) => (
                      <div key={label} className="flex items-baseline justify-between gap-4">
                        <dt className={MUTED}>{label}</dt>
                        <dd className="text-right font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => open(g)}
                    className={`mt-auto inline-flex items-center gap-2 pt-7 text-[14px] font-semibold ${BLUE} hover:underline`}
                  >
                    See {g} accounts
                    <Arrow />
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── How it works: a horizontal timeline ─────────────────────────────── */

export function HowItWorks({ steps }: { steps: StepView[] }) {
  const id = useId();
  return (
    <section data-sf-section="how" aria-labelledby={id} className={`${SECTION} bg-white`}>
      <div className={CONTAINER}>
        <Heading id={id} eyebrow="How it works" title="A clear path, start to funded" center />
        <ol className="relative mt-14 grid gap-10 @lg:grid-flow-col @lg:auto-cols-fr @lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[11px] hidden h-px bg-[#0f1d33]/10 @lg:block"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span
                aria-hidden="true"
                className={`relative z-10 block h-[22px] w-[22px] rounded-full border-[5px] ${i === steps.length - 1 ? "border-[#5b8def]/30 bg-[#5b8def]" : "border-[#e8eef7] bg-[#0f1d33]"}`}
              />
              <p className={`mt-5 text-[13px] font-semibold ${FAINT}`}>Step {i + 1}</p>
              <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.015em]">{s.title}</h3>
              <p className={`mt-2 max-w-[18rem] text-[15px] leading-relaxed ${MUTED}`}>{s.body}</p>
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
      <div
        className={`${CONTAINER} grid gap-12 @lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @lg:gap-16`}
      >
        <Heading
          id={id}
          eyebrow="Trading rules"
          title="Rules written for people, not lawyers"
          sub={
            example
              ? `Phase 1 of the ${example} account. Every account's rules are on the card above.`
              : undefined
          }
        />
        <dl className={`overflow-hidden ${CARD}`}>
          {rules.map((r, i) => (
            <div
              key={r.key}
              className={`grid grid-cols-[1fr_auto] gap-x-6 px-6 py-5 ${i % 2 ? "bg-[#f7f9fc]" : ""}`}
            >
              <dt className="text-[15px] font-semibold">{r.label}</dt>
              <dd className={`text-[18px] font-semibold ${r.key === "split" ? BLUE : ""}`}>
                {r.value}
              </dd>
              <dd className={`col-span-2 mt-1 text-[14px] leading-relaxed ${MUTED}`}>{r.body}</dd>
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
        <Heading id={id} eyebrow="Traders" title="What traders tell us" center />
        <div className="mt-12 grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
          {items.map((t) => (
            <figure key={`${t.name}-${t.quote.slice(0, 16)}`} className={`p-7 ${CARD}`}>
              <blockquote className="text-pretty text-[16px] leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[14px]">
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
      <div className={`${CONTAINER} grid gap-8 @lg:grid-cols-2 @lg:gap-16`}>
        <h2 className="text-balance text-[clamp(1.9rem,4cqi,2.7rem)] font-semibold leading-[1.12] tracking-[-0.025em]">
          {heading || "About us"}
        </h2>
        {body && (
          <p className={`whitespace-pre-line text-[17px] leading-[1.75] ${MUTED}`}>{body}</p>
        )}
      </div>
    </section>
  );
}

/* ── FAQ: always open, two columns ───────────────────────────────────── */

export function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  const host = useHost();
  return (
    <section data-sf-section="faq" aria-labelledby={id} className={`${SECTION} bg-white`}>
      <div className={CONTAINER}>
        <Heading id={id} eyebrow="FAQ" title="Questions, answered" />
        <dl className="mt-12 grid gap-x-14 gap-y-10 @md:grid-cols-2">
          {items.map((item) => (
            <div key={item.question}>
              <dt className="text-[17px] font-semibold tracking-[-0.01em]">{item.question}</dt>
              <dd className={`mt-2 text-[15px] leading-[1.7] ${MUTED}`}>{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className={`mt-12 text-[15px] ${MUTED}`}>
          Something else?{" "}
          <SfLink href={host.loginHref()} className={`font-semibold ${BLUE} hover:underline`}>
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
    <section aria-labelledby={id} className="harbor-night py-24 text-center text-white @md:py-28">
      <div className={CONTAINER}>
        <h2
          id={id}
          className="mx-auto max-w-[22ch] text-balance text-[clamp(2.2rem,5.2cqi,3.6rem)] font-semibold leading-[1.06] tracking-[-0.03em]"
        >
          Open your account with {view.firm.name}.
        </h2>
        <p className="mx-auto mt-5 max-w-[30rem] text-[17px] text-white/70">
          Choose an account, pass the evaluation, trade a funded account.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => scrollTo("challenges")} className={BTN_WHITE}>
            {view.content.hero.primaryCta}
            <Arrow />
          </button>
          <SfLink href={host.loginHref()} className={BTN_GLASS}>
            Sign in
          </SfLink>
        </div>
      </div>
    </section>
  );
}
