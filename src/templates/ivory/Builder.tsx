import { type CSSProperties, useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { evaluationPhases, sizeLabels, useChallengePicker } from "../../core/picker";
import { Reveal, SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, CONTAINER, FAINT, Heading, MUTED } from "./ui";

/*
 * Account builder: group tabs, a size slider (adapted from 21st.dev's
 * "PricingSlider Loops" by radu: a range snapped to breakpoints, filled with a
 * gradient), a dark summary card, then every size of the group side by side.
 */

const THUMB = 26;

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
    <fieldset className="-mx-5 flex gap-7 overflow-x-auto border-b border-[#161512]/[0.12] px-5 ivory-scrollbar-none @md:mx-0 @md:px-0">
      <legend className="sr-only">Account type</legend>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          aria-pressed={g === active}
          onClick={() => onPick(g)}
          className={`-mb-px shrink-0 border-b-2 pb-3 pt-3 text-[15px] transition-colors duration-200 ${
            g === active
              ? "border-[#161512] font-medium text-[#161512]"
              : "border-transparent text-[#5c5a53] hover:text-[#161512]"
          }`}
        >
          {g}
        </button>
      ))}
    </fieldset>
  );
}

/** Where tick `i` of `n` sits under the slider thumb's centre. */
const tickLeft = (i: number, last: number) => {
  const f = last ? i / last : 0;
  return `calc(${f * 100}% + ${(0.5 - f) * THUMB}px)`;
};

function SizeSlider({
  challenges,
  current,
  onPick,
}: {
  challenges: ChallengeView[];
  current: ChallengeView;
  onPick: (id: string) => void;
}) {
  const labels = sizeLabels(challenges);
  const index = Math.max(
    0,
    challenges.findIndex((c) => c.id === current.id),
  );
  const last = challenges.length - 1;
  if (last < 1) return null;
  const fill = { "--ivory-fill": `${(index / last) * 100}%` } as CSSProperties;
  return (
    <div className="mt-7">
      <input
        type="range"
        min={0}
        max={last}
        step={1}
        value={index}
        aria-label="Account size"
        aria-valuetext={labels.get(current.id)}
        onChange={(e) => {
          const next = challenges[Number(e.target.value)];
          if (next) onPick(next.id);
        }}
        className="ivory-range"
        style={fill}
      />
      <div className="relative mt-1 h-5">
        {challenges.map((c, i) => (
          <button
            key={c.id}
            type="button"
            tabIndex={-1}
            onClick={() => onPick(c.id)}
            style={{ left: tickLeft(i, last) }}
            className={`ivory-num absolute -top-2.5 flex h-10 -translate-x-1/2 items-center whitespace-nowrap px-1 text-[12px] transition-colors ${
              i === index ? "font-medium text-[#161512]" : `${FAINT} hover:text-[#161512]`
            } ${i === 0 || i === last ? "" : "hidden @md:block"}`}
          >
            {compactMoney(c.size, c.currency)}
          </button>
        ))}
      </div>
    </div>
  );
}

function summaryRows(c: ChallengeView): [string, string][] {
  const first = c.phases[0];
  const rows: [string, string | undefined][] = [
    ["Profit target", first?.target === undefined ? undefined : percent(first.target)],
    ["Daily loss limit", first?.dailyLoss === undefined ? undefined : percent(first.dailyLoss)],
    ["Maximum loss", first?.maxLoss === undefined ? undefined : percent(first.maxLoss)],
    ["Profit split", c.profitSplit === undefined ? undefined : percent(c.profitSplit)],
  ];
  return rows.filter((r): r is [string, string] => r[1] !== undefined);
}

function SummaryCard({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  const evals = evaluationPhases(challenge).length;
  return (
    <div className="flex flex-col rounded-[28px] bg-[#161512] p-7 text-[#f6f3ec] shadow-[0_30px_60px_-30px_rgba(22,21,18,0.55)] @md:p-9">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#f6f3ec]/55">Your evaluation</p>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="ivory-serif ivory-num text-[52px] leading-none">
          {money(challenge.price, challenge.currency)}
        </p>
        <p className="text-right text-[13px] text-[#f6f3ec]/55">
          {evals === 1 ? "One phase" : `${evals} phases`}
        </p>
      </div>
      <p className="mt-2 text-[14px] text-[#f6f3ec]/55">Evaluation fee · {challenge.name}</p>
      <dl className="mt-7 space-y-3 border-t border-[#f6f3ec]/[0.12] pt-6">
        {summaryRows(challenge).map(([label, value]) => (
          <div key={label} className="flex items-baseline text-[15px]">
            <dt className="text-[#f6f3ec]/70">{label}</dt>
            <span
              aria-hidden="true"
              className="mx-3 flex-1 translate-y-[-0.3em] border-b border-dotted border-[#f6f3ec]/25"
            />
            <dd className="ivory-num font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <SfLink
        href={host.registerHref(challenge.id)}
        className="mt-9 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f6f3ec] px-6 text-[15px] font-medium text-[#161512] transition-colors hover:bg-white @lg:mt-auto"
      >
        Start the {compactMoney(challenge.size, challenge.currency)} evaluation
        <Arrow />
      </SfLink>
    </div>
  );
}

/* ── Every size of the group, side by side ───────────────────────────── */

type CompareRow = { key: string; label: string; cell: (c: ChallengeView) => string | undefined };

const pct = (v: number | undefined) => (v === undefined ? undefined : percent(v));

function compareRows(challenges: ChallengeView[]): CompareRow[] {
  const phaseCount = Math.max(0, ...challenges.map((c) => evaluationPhases(c).length));
  const targets: CompareRow[] = Array.from({ length: phaseCount }, (_, i) => ({
    key: `target-${i}`,
    label: phaseCount === 1 ? "Profit target" : `Phase ${i + 1} target`,
    cell: (c) => pct(evaluationPhases(c)[i]?.target),
  }));
  const days = (c: ChallengeView) => {
    const limits = evaluationPhases(c).map((p) => p.maxDays);
    return limits.every((d) => d === undefined)
      ? "None"
      : limits.map((d) => d ?? "—").join(" / ") + " days";
  };
  const rows: CompareRow[] = [
    { key: "fee", label: "Evaluation fee", cell: (c) => money(c.price, c.currency) },
    ...targets,
    { key: "daily", label: "Daily loss limit", cell: (c) => pct(c.phases[0]?.dailyLoss) },
    { key: "max", label: "Maximum loss", cell: (c) => pct(c.phases[0]?.maxLoss) },
    {
      key: "min",
      label: "Minimum trading days",
      cell: (c) => (c.phases[0]?.minDays ? String(c.phases[0].minDays) : undefined),
    },
    { key: "time", label: "Time limit", cell: days },
    { key: "split", label: "Profit split", cell: (c) => pct(c.profitSplit) },
  ];
  return rows.filter((r) => challenges.some((c) => r.cell(c) !== undefined));
}

function CompareTable({
  challenges,
  current,
  onPick,
  group,
}: {
  challenges: ChallengeView[];
  current: ChallengeView;
  onPick: (id: string) => void;
  group: string;
}) {
  const rows = compareRows(challenges);
  const col = (c: ChallengeView) => (c.id === current.id ? "bg-[#1d5c46]/[0.07]" : "");
  return (
    <div className="mt-16">
      <h3 className="ivory-serif text-[30px] leading-tight">Compare every {group} account</h3>
      <div className="mt-6 overflow-x-auto rounded-[22px] border border-[#161512]/[0.12] bg-[#fffdf8] ivory-scrollbar-none">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
          <caption className="sr-only">Every {group} account and its rules</caption>
          <thead>
            <tr className="border-b border-[#161512]/[0.12]">
              <th
                scope="col"
                className={`sticky left-0 z-10 bg-[#fffdf8] px-5 py-4 text-[12px] font-normal uppercase tracking-[0.14em] ${FAINT}`}
              >
                Account
              </th>
              {challenges.map((c) => (
                <th key={c.id} scope="col" className={`px-4 py-3 ${col(c)}`}>
                  <button
                    type="button"
                    aria-pressed={c.id === current.id}
                    onClick={() => onPick(c.id)}
                    className="ivory-serif ivory-num py-2 text-[24px] leading-none transition-colors hover:text-[#1d5c46]"
                  >
                    {compactMoney(c.size, c.currency)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-[#161512]/[0.08] last:border-0">
                <th
                  scope="row"
                  className={`sticky left-0 z-10 whitespace-nowrap bg-[#fffdf8] px-5 py-3.5 font-normal ${MUTED}`}
                >
                  {r.label}
                </th>
                {challenges.map((c) => (
                  <td
                    key={c.id}
                    className={`ivory-num whitespace-nowrap px-4 py-3.5 font-medium ${col(c)}`}
                  >
                    {r.cell(c) ?? <span className={FAINT}>—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Builder({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const { group, inGroup, current, pickGroup, pick } = useChallengePicker(view);
  return (
    <section data-sf-section="challenges" aria-labelledby={headingId} className="py-24 @md:py-32">
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          kicker="Accounts"
          title="Build your account"
          sub="Choose a program and slide to the size you want. Every rule is listed, nothing is hidden in the small print."
        />
        {view.groups.length > 1 && (
          <div className="mt-12">
            <GroupTabs groups={view.groups} active={group} onPick={pickGroup} />
          </div>
        )}
        {current ? (
          <Reveal>
            <div className="mt-10 grid gap-5 @lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-[#161512]/[0.12] bg-[#fffdf8] p-7 @md:p-9">
                <p className={`text-[12px] uppercase tracking-[0.16em] ${MUTED}`}>Account size</p>
                <p className="ivory-serif ivory-num mt-4 text-[clamp(3.4rem,8cqi,5.6rem)] leading-[0.9] tracking-[-0.02em]">
                  {money(current.size, current.currency)}
                </p>
                <p className={`mt-3 text-[15px] ${MUTED}`}>{current.name}</p>
                <SizeSlider challenges={inGroup} current={current} onPick={pick} />
                {current.description && (
                  <p
                    className={`mt-8 border-t border-[#161512]/10 pt-6 text-[14px] leading-relaxed ${MUTED}`}
                  >
                    {current.description}
                  </p>
                )}
              </div>
              <SummaryCard challenge={current} />
            </div>
            {inGroup.length > 1 && (
              <CompareTable challenges={inGroup} current={current} onPick={pick} group={group} />
            )}
          </Reveal>
        ) : (
          <p
            className={`mt-12 rounded-[22px] border border-[#161512]/[0.12] bg-[#fffdf8] p-7 text-[16px] ${MUTED}`}
          >
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
