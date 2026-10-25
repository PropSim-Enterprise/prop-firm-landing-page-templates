import { useId } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { evaluationPhases, metricsFor, useChallengePicker } from "../../core/picker";
import { Reveal, SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { Arrow, CONTAINER, FAINT, Heading, MUTED, Tag } from "./ui";

/*
 * Every size of the chosen programme on show at once, as big tiles: the size,
 * the fee, the headline rules, and the full rule sheet one tap away.
 */

function GroupPills({
  groups,
  active,
  onPick,
}: {
  groups: string[];
  active: string;
  onPick: (g: string) => void;
}) {
  return (
    <fieldset className="-mx-5 flex gap-2 overflow-x-auto px-5 volt-scrollbar-none @md:mx-0 @md:flex-wrap @md:px-0">
      <legend className="sr-only">Account type</legend>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          aria-pressed={g === active}
          onClick={() => onPick(g)}
          className={`h-11 shrink-0 rounded-full border-2 px-5 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${
            g === active
              ? "border-[#d7ff3d] bg-[#d7ff3d] text-[#0b0b0c]"
              : "border-[#f4f4f0]/15 text-[#f4f4f0] hover:border-[#f4f4f0]/50"
          }`}
        >
          {g}
        </button>
      ))}
    </fieldset>
  );
}

function headline(c: ChallengeView): [string, string][] {
  const evals = evaluationPhases(c);
  const targets = evals.map((p) => p.target).filter((t): t is number => t !== undefined);
  const first = c.phases[0];
  const rows: [string, string | undefined][] = [
    ["Target", targets.length ? targets.map(percent).join(" → ") : undefined],
    ["Daily loss", first?.dailyLoss === undefined ? undefined : percent(first.dailyLoss)],
    ["Max loss", first?.maxLoss === undefined ? undefined : percent(first.maxLoss)],
    ["Split", c.profitSplit === undefined ? undefined : percent(c.profitSplit)],
  ];
  return rows.filter((r): r is [string, string] => r[1] !== undefined);
}

function RuleSheet({ challenge }: { challenge: ChallengeView }) {
  const metrics = metricsFor(challenge.phases);
  return (
    <details className="group/sheet mt-5 border-t-2 border-[#f4f4f0]/10 pt-4">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between text-[12px] font-bold uppercase tracking-[0.12em] text-[#f4f4f0]/70 transition-colors hover:text-[#d7ff3d]">
        Every rule
        <span
          aria-hidden="true"
          className="text-[18px] leading-none transition-transform duration-300 group-open/sheet:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 overflow-x-auto volt-scrollbar-none">
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="sr-only">
            Every rule of the {money(challenge.size, challenge.currency)} account
          </caption>
          <thead>
            <tr>
              <th scope="col" className="pb-2 pr-3 font-normal" />
              {challenge.phases.map((p) => (
                <th
                  key={p.label}
                  scope="col"
                  className={`whitespace-nowrap pb-2 pr-3 text-[12px] font-bold uppercase tracking-[0.1em] ${p.funded ? "text-[#d7ff3d]" : FAINT}`}
                >
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.key} className="border-t border-[#f4f4f0]/[0.08]">
                <th scope="row" className={`whitespace-nowrap py-2 pr-3 font-normal ${MUTED}`}>
                  {m.label}
                </th>
                {challenge.phases.map((p) => (
                  <td key={p.label} className="volt-num whitespace-nowrap py-2 pr-3 font-semibold">
                    {m.cell(p) ?? <span className={FAINT}>{m.empty ?? "—"}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Tile({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  const evals = evaluationPhases(challenge).length;
  return (
    <article className="group flex flex-col rounded-[26px] border-2 border-[#f4f4f0]/[0.12] bg-[#121213] p-6 transition-colors duration-300 hover:border-[#d7ff3d] @md:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className={`truncate text-[12px] font-bold uppercase tracking-[0.12em] ${FAINT}`}>
          {challenge.name}
        </span>
        <Tag>{evals === 1 ? "1-step" : `${evals}-step`}</Tag>
      </div>
      <h3 className="volt-display volt-num mt-5 text-[clamp(3.6rem,6cqi,4.6rem)] transition-colors duration-300 group-hover:text-[#d7ff3d]">
        {compactMoney(challenge.size, challenge.currency)}
      </h3>
      <p className="mt-2 text-[15px]">
        <span className="volt-num font-bold">{money(challenge.price, challenge.currency)}</span>
        <span className={`ml-2 ${MUTED}`}>evaluation fee</span>
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
        {headline(challenge).map(([label, value]) => (
          <div key={label}>
            <dt className={`text-[12px] font-bold uppercase tracking-[0.12em] ${FAINT}`}>
              {label}
            </dt>
            <dd className="volt-num mt-1 text-[18px] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <RuleSheet challenge={challenge} />
      <SfLink
        href={host.registerHref(challenge.id)}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#d7ff3d] text-[13px] font-bold uppercase tracking-[0.08em] text-[#d7ff3d] transition-colors duration-200 hover:bg-[#d7ff3d] hover:text-[#0b0b0c]"
      >
        Start {compactMoney(challenge.size, challenge.currency)}
        <Arrow />
      </SfLink>
    </article>
  );
}

export function Accounts({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const { group, inGroup, pickGroup } = useChallengePicker(view);
  return (
    <section data-sf-section="challenges" aria-labelledby={headingId} className="py-24 @md:py-32">
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          tag="Accounts"
          title="Pick your size."
          sub="Every account, every fee, every rule. Choose a program, then the size that fits how you trade."
        />
        {view.groups.length > 1 && (
          <div className="mt-10">
            <GroupPills groups={view.groups} active={group} onPick={pickGroup} />
          </div>
        )}
        {inGroup.length > 0 ? (
          <Reveal className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 @md:grid-cols-2 @xl:grid-cols-3">
            {inGroup.map((c) => (
              <Tile key={c.id} challenge={c} />
            ))}
          </Reveal>
        ) : (
          <p
            className={`mt-10 rounded-[26px] border-2 border-[#f4f4f0]/[0.12] p-7 text-[17px] ${MUTED}`}
          >
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
