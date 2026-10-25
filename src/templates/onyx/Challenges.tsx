import { useId } from "react";
import { money, percent } from "../../core/format";
import { metricsFor, type PhaseMetric, sizeLabels, useChallengePicker } from "../../core/picker";
import { Reveal, SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, PhaseView, StorefrontView } from "../../core/types";
import { Arrow, BTN_PRIMARY, CONTAINER, FAINT, MUTED, SectionHeading } from "./ui";

/*
 * The account picker: group → size → that account's summary and a
 * phase-by-phase rules table. The table follows the comparison-table pattern
 * from 21st.dev ("Feature Comparison Table" by olewandowski1): phases as
 * columns, a tinted highlighted column for the funded stage.
 */

type Metric = PhaseMetric;

function GroupTabs({
  groups,
  active,
  onPick,
}: {
  groups: string[];
  active: string;
  onPick: (g: string) => void;
}) {
  return (
    <fieldset className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-onyx-ink/10 bg-onyx-ink/[0.03] p-1 onyx-scrollbar-none">
      <legend className="sr-only">Account type</legend>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          aria-pressed={g === active}
          onClick={() => onPick(g)}
          className={`h-11 shrink-0 rounded-full px-4 text-[14px] font-medium @md:h-9 transition-colors duration-200 ${
            g === active
              ? "bg-onyx-primary text-onyx-onprimary"
              : "text-onyx-muted hover:text-onyx-fg"
          }`}
        >
          {g}
        </button>
      ))}
    </fieldset>
  );
}

function SizePicker({
  challenges,
  active,
  onPick,
}: {
  challenges: ChallengeView[];
  active?: string;
  onPick: (id: string) => void;
}) {
  const labels = sizeLabels(challenges);
  return (
    <fieldset className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 onyx-scrollbar-none @md:mx-0 @md:flex-wrap @md:px-0">
      <legend className="sr-only">Account size</legend>
      {challenges.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={c.id === active}
          onClick={() => onPick(c.id)}
          className={`onyx-num h-12 shrink-0 rounded-[14px] border px-5 text-[15px] font-medium transition-[border-color,background-color,color] duration-200 ${
            c.id === active
              ? "border-onyx-accent/60 bg-onyx-accent/[0.08] text-onyx-fg"
              : "border-onyx-ink/10 text-onyx-soft hover:border-onyx-ink/25 hover:text-onyx-fg"
          }`}
        >
          {labels.get(c.id)}
        </button>
      ))}
    </fieldset>
  );
}

function summaryPoints(c: ChallengeView): string[] {
  const evals = c.phases.filter((p) => !p.funded).length;
  const points = [evals === 1 ? "One evaluation phase" : `${evals} evaluation phases`];
  if (c.profitSplit !== undefined)
    points.push(`${percent(c.profitSplit)} profit split when funded`);
  const lev = c.phases[0]?.leverage;
  if (lev) points.push(`Leverage up to 1:${lev}`);
  return points;
}

function Summary({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  return (
    <div className="onyx-panel flex flex-col rounded-[22px] border border-onyx-ink/10 p-6 @md:p-7">
      <p className={`onyx-mono text-[12px] uppercase tracking-[0.14em] ${FAINT}`}>
        {challenge.name}
      </p>
      <p className="onyx-num mt-3 text-[44px] font-semibold leading-none tracking-[-0.045em]">
        {money(challenge.size, challenge.currency)}
      </p>
      <div className="mt-6 flex items-baseline justify-between border-y border-onyx-ink/[0.06] py-4">
        <span className={`text-[14px] ${MUTED}`}>Evaluation fee</span>
        <span className="onyx-num text-[22px] font-semibold tracking-[-0.02em]">
          {money(challenge.price, challenge.currency)}
        </span>
      </div>
      <ul className="mt-5 space-y-2.5 text-[14px] text-onyx-soft">
        {summaryPoints(challenge).map((p) => (
          <li key={p} className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-onyx-accent" />
            {p}
          </li>
        ))}
      </ul>
      {challenge.description && (
        <p className={`mt-5 text-[14px] leading-relaxed ${MUTED}`}>{challenge.description}</p>
      )}
      <SfLink
        href={host.registerHref(challenge.id)}
        className={`${BTN_PRIMARY} mt-7 w-full @lg:mt-auto`}
      >
        Start this challenge
        <Arrow />
      </SfLink>
    </div>
  );
}

function Cell({ metric, phase }: { metric: Metric; phase: PhaseView }) {
  const value = metric.cell(phase);
  if (value === undefined) return <span className={FAINT}>{metric.empty ?? "—"}</span>;
  return value;
}

function PhaseTable({ challenge }: { challenge: ChallengeView }) {
  const metrics = metricsFor(challenge.phases);
  return (
    <div className="hidden overflow-hidden rounded-[22px] border border-onyx-ink/10 bg-onyx-ink/[0.012] @md:block">
      <table className="w-full table-fixed border-collapse text-left text-[14px]">
        <caption className="sr-only">
          Rules for each phase of the {money(challenge.size, challenge.currency)} account
        </caption>
        <thead>
          <tr className="border-b border-onyx-ink/[0.08] bg-onyx-ink/[0.02]">
            <th
              scope="col"
              className={`onyx-mono w-[34%] px-5 py-4 text-[12px] font-normal uppercase tracking-[0.12em] ${FAINT}`}
            >
              Rule
            </th>
            {challenge.phases.map((p) => (
              <th
                key={p.label}
                scope="col"
                className={`px-5 py-4 text-[14px] font-semibold ${p.funded ? "bg-onyx-accent/[0.07] text-onyx-accent" : ""}`}
              >
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.key} className="border-b border-onyx-ink/[0.06] last:border-0">
              <th scope="row" className={`px-5 py-3.5 font-normal ${MUTED}`}>
                {m.label}
              </th>
              {challenge.phases.map((p) => (
                <td
                  key={p.label}
                  className={`onyx-num px-5 py-3.5 font-medium ${p.funded ? "bg-onyx-accent/[0.04]" : ""}`}
                >
                  <Cell metric={m} phase={p} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Below table width the same rules stack as one card per phase, showing what applies to it. */
function PhaseCards({ challenge }: { challenge: ChallengeView }) {
  const metrics = metricsFor(challenge.phases);
  const applies = (m: Metric, p: PhaseView) => m.always || m.cell(p) !== undefined;
  return (
    <div className="grid gap-3 @md:hidden">
      {challenge.phases.map((p) => (
        <div
          key={p.label}
          className={`rounded-[18px] border p-5 ${p.funded ? "border-onyx-accent/30 bg-onyx-accent/[0.04]" : "border-onyx-ink/10"}`}
        >
          <p className={`text-[15px] font-semibold ${p.funded ? "text-onyx-accent" : ""}`}>
            {p.label}
          </p>
          <dl className="mt-3 divide-y divide-onyx-ink/[0.06]">
            {metrics
              .filter((m) => applies(m, p))
              .map((m) => (
                <div key={m.key} className="flex items-center justify-between py-2.5 text-[14px]">
                  <dt className={MUTED}>{m.label}</dt>
                  <dd className="onyx-num font-medium">
                    <Cell metric={m} phase={p} />
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function Challenges({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const { group, inGroup, current, pickGroup, pick } = useChallengePicker(view);
  return (
    <section
      data-sf-section="challenges"
      aria-labelledby={headingId}
      className="border-t border-onyx-ink/[0.06] py-24 @md:py-32"
    >
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 @lg:flex-row @lg:items-end @lg:justify-between">
          <SectionHeading
            id={headingId}
            eyebrow="Accounts"
            title="Choose your account"
            sub="Pick a size, pass the evaluation, trade a funded account. Every rule is published below."
          />
          {view.groups.length > 1 && (
            <GroupTabs groups={view.groups} active={group} onPick={pickGroup} />
          )}
        </div>
        {current ? (
          <Reveal className="mt-10 space-y-5">
            <SizePicker challenges={inGroup} active={current.id} onPick={pick} />
            <div className="grid gap-5 @lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
              <Summary challenge={current} />
              <div>
                <PhaseTable challenge={current} />
                <PhaseCards challenge={current} />
              </div>
            </div>
          </Reveal>
        ) : (
          <p className={`mt-10 rounded-[18px] border border-onyx-ink/10 p-6 text-[15px] ${MUTED}`}>
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
