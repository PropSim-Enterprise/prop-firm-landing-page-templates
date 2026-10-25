import { useId, useRef } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { evaluationPhases, metricsFor, useChallengePicker } from "../../core/picker";
import { SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { CONTAINER, FAINT, GOLD, Heading, MUTED } from "./ui";

/*
 * The collection: a programme's accounts as tall cards in a row that scrolls
 * sideways and snaps, with previous / next arrows. Each card carries every rule.
 */

function GroupLinks({
  groups,
  active,
  onPick,
}: {
  groups: string[];
  active: string;
  onPick: (g: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
      <legend className="sr-only">Account type</legend>
      {groups.map((g, i) => (
        <span key={g} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className={`text-[12px] ${GOLD}`}>
              ✦
            </span>
          )}
          <button
            type="button"
            aria-pressed={g === active}
            onClick={() => onPick(g)}
            className={`aurum-caps inline-flex min-h-11 items-end border-b px-1 pb-1 transition-colors ${g === active ? "border-[#c8a96a] text-[#e9d3a1]" : `border-transparent ${MUTED} hover:text-[#e9d3a1]`}`}
          >
            {g}
          </button>
        </span>
      ))}
    </fieldset>
  );
}

const ROMAN = ["I", "II", "III", "IV"];

function Card({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  const evals = evaluationPhases(challenge).length;
  const rows = metricsFor(challenge.phases);
  return (
    <article className="flex w-[300px] shrink-0 flex-col border border-[#c8a96a]/25 bg-[#0e0d0b] p-7 transition-colors duration-500 hover:border-[#c8a96a]/70 @md:w-[340px]">
      <p className={`aurum-caps ${FAINT}`}>{challenge.name}</p>
      <h3 className="aurum-serif aurum-num aurum-gold mt-6 text-[64px] leading-none">
        {compactMoney(challenge.size, challenge.currency)}
      </h3>
      <p className={`mt-3 text-[14px] ${MUTED}`}>
        {evals === 1 ? "One evaluation phase" : `${evals} evaluation phases`}
        {challenge.profitSplit !== undefined && ` · ${percent(challenge.profitSplit)} split`}
      </p>
      <div className="my-6 h-px bg-gradient-to-r from-[#c8a96a]/40 via-[#c8a96a]/15 to-transparent" />
      <table className="w-full border-collapse text-[13px]">
        <caption className="sr-only">
          Rules of the {money(challenge.size, challenge.currency)} account by phase
        </caption>
        <thead>
          <tr>
            <th scope="col" className="sr-only">
              Rule
            </th>
            {challenge.phases.map((p, i) => (
              <th
                key={p.label}
                scope="col"
                className={`aurum-serif pb-3 text-right text-[16px] font-medium ${p.funded ? GOLD : FAINT}`}
              >
                <span aria-hidden="true">{p.funded ? "F" : (ROMAN[i] ?? i + 1)}</span>
                <span className="sr-only">{p.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.key}>
              <th scope="row" className={`py-1.5 pr-3 text-left font-normal ${FAINT}`}>
                {m.label}
              </th>
              {challenge.phases.map((p) => (
                <td
                  key={p.label}
                  className="aurum-num whitespace-nowrap py-1.5 pl-2 text-right text-[#f2ece0]"
                >
                  {m.cell(p) ?? <span className={FAINT}>{m.empty ?? "—"}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-auto pt-8">
        <p className="aurum-serif aurum-num text-[30px] leading-none">
          {money(challenge.price, challenge.currency)}
        </p>
        <p className={`aurum-caps mt-2 ${FAINT}`}>Evaluation fee</p>
        <SfLink
          href={host.registerHref(challenge.id)}
          className="aurum-caps mt-6 inline-flex h-11 w-full items-center justify-center border border-[#c8a96a]/60 text-[#e9d3a1] transition-colors duration-300 hover:bg-[#c8a96a] hover:text-[#0a0908]"
        >
          Begin
        </SfLink>
      </div>
    </article>
  );
}

function Arrows({ onMove }: { onMove: (dir: 1 | -1) => void }) {
  const cls =
    "flex h-11 w-11 items-center justify-center border border-[#c8a96a]/40 text-[#e9d3a1] transition-colors hover:bg-[#c8a96a]/10";
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onMove(-1)}
        className={cls}
        aria-label="Previous accounts"
      >
        ←
      </button>
      <button type="button" onClick={() => onMove(1)} className={cls} aria-label="Next accounts">
        →
      </button>
    </div>
  );
}

export function Collection({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const rail = useRef<HTMLDivElement>(null);
  const { group, inGroup, pickGroup } = useChallengePicker(view);
  const move = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  return (
    <section data-sf-section="challenges" aria-labelledby={headingId} className="py-24 @md:py-32">
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          kicker="The collection"
          title="Accounts, by size"
          sub="Every account shows its rules in full, phase by phase. Choose the one that suits you."
        />
        {view.groups.length > 1 && (
          <div className="mt-10">
            <GroupLinks groups={view.groups} active={group} onPick={pickGroup} />
          </div>
        )}
        {inGroup.length > 0 ? (
          <>
            <div className="mt-12 flex items-center justify-between gap-4">
              <p className={`aurum-caps ${MUTED}`}>
                {inGroup.length} {inGroup.length === 1 ? "account" : "accounts"} · {group}
              </p>
              {inGroup.length > 1 && <Arrows onMove={move} />}
            </div>
            <div
              ref={rail}
              className="aurum-snap -mx-5 mt-6 flex gap-4 overflow-x-auto px-5 pb-2 @md:-mx-10 @md:px-10"
            >
              {inGroup.map((c) => (
                <Card key={c.id} challenge={c} />
              ))}
            </div>
          </>
        ) : (
          <p className={`mt-12 border border-[#c8a96a]/25 p-8 text-center text-[16px] ${MUTED}`}>
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
