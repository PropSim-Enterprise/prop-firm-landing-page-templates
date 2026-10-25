import { useId } from "react";
import { money, percent } from "../../core/format";
import { evaluationPhases, useChallengePicker } from "../../core/picker";
import { SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { BOX, CONTAINER, Heading, MUTED } from "./ui";

/*
 * Accounts as a checkout: pick a program, pick a size from a list of radio
 * rows, and read the receipt, which lists every rule as a line item.
 */

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
    <fieldset className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 pop-scrollbar-none @md:mx-0 @md:flex-wrap @md:px-0">
      <legend className="sr-only">Program</legend>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          aria-pressed={g === active}
          onClick={() => onPick(g)}
          className={`shrink-0 rounded-full border-[2.5px] border-[#111] px-4 py-2.5 text-[15px] font-bold transition-colors ${g === active ? "bg-[#111] text-[#fff6e5]" : "bg-white hover:bg-[#ffd23f]"}`}
        >
          {g}
        </button>
      ))}
    </fieldset>
  );
}

function SizeList({
  rows,
  current,
  onPick,
  name,
}: {
  rows: ChallengeView[];
  current: ChallengeView;
  onPick: (id: string) => void;
  name: string;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Account size</legend>
      {rows.map((c) => {
        const on = c.id === current.id;
        const evals = evaluationPhases(c).length;
        return (
          <label
            key={c.id}
            className={`flex cursor-pointer items-center gap-4 rounded-[16px] border-[2.5px] border-[#111] px-5 py-4 transition-[background-color,box-shadow,transform] duration-150 ${on ? "bg-[#ffd23f] shadow-[5px_5px_0_#111]" : "bg-white hover:-translate-y-0.5"}`}
          >
            <input
              type="radio"
              name={name}
              checked={on}
              onChange={() => onPick(c.id)}
              className="h-5 w-5 shrink-0 accent-[#111]"
            />
            <span className="flex-1">
              <span className="block text-[22px] font-bold leading-tight tracking-[-0.03em]">
                {money(c.size, c.currency)}
              </span>
              <span className={`text-[14px] ${MUTED}`}>
                {evals === 1 ? "1-step" : `${evals}-step`} · {c.name}
              </span>
            </span>
            <span className="text-[18px] font-bold">{money(c.price, c.currency)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function receiptLines(c: ChallengeView): [string, string][] {
  const out: [string, string][] = [["Account size", money(c.size, c.currency)]];
  evaluationPhases(c).forEach((p, i) => {
    if (p.target !== undefined) out.push([`Phase ${i + 1} target`, percent(p.target)]);
  });
  const first = c.phases[0];
  if (first?.dailyLoss !== undefined) out.push(["Daily loss limit", percent(first.dailyLoss)]);
  if (first?.maxLoss !== undefined) out.push(["Max loss", percent(first.maxLoss)]);
  if (first?.minDays) out.push(["Min trading days", String(first.minDays)]);
  if (first?.leverage) out.push(["Leverage", `1:${first.leverage}`]);
  if (c.profitSplit !== undefined) out.push(["Profit split", percent(c.profitSplit)]);
  return out;
}

function Receipt({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  return (
    <div className={`${BOX} p-6 @md:p-7`}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em]">Your receipt</p>
        <span className="rounded-full border-[2px] border-[#111] bg-[#7ee081] px-2.5 py-0.5 text-[12px] font-bold">
          {challenge.group}
        </span>
      </div>
      <dl className="mt-5 border-y-[2.5px] border-dashed border-[#111] py-4">
        {receiptLines(challenge).map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-1.5 text-[15px]">
            <dt className={MUTED}>{label}</dt>
            <dd className="font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-[16px] font-bold">Evaluation fee</span>
        <span className="text-[36px] font-bold leading-none tracking-[-0.04em]">
          {money(challenge.price, challenge.currency)}
        </span>
      </div>
      <SfLink
        href={host.registerHref(challenge.id)}
        className="pop-press mt-6 flex w-full items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#111] bg-[#ff5c8a] py-3.5 text-[17px] font-bold shadow-[5px_5px_0_#111]"
      >
        Start this challenge →
      </SfLink>
    </div>
  );
}

export function Checkout({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const radioName = useId();
  const { group, inGroup, current, pickGroup, pick } = useChallengePicker(view);
  return (
    <section
      data-sf-section="challenges"
      aria-labelledby={headingId}
      className="border-b-[2.5px] border-[#111] py-20 @md:py-28"
    >
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          sticker="Accounts"
          color="bg-[#4d96ff]"
          title="Pick your account. Check out."
          sub="Every rule is on the receipt before you pay. No surprises."
        />
        {current ? (
          <>
            {view.groups.length > 1 && (
              <div className="mt-10">
                <GroupTabs groups={view.groups} active={group} onPick={pickGroup} />
              </div>
            )}
            <div className="mt-8 grid items-start gap-8 @lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <SizeList rows={inGroup} current={current} onPick={pick} name={radioName} />
              <div className="@lg:sticky @lg:top-24">
                <Receipt challenge={current} />
              </div>
            </div>
          </>
        ) : (
          <p className={`mt-10 p-7 text-[17px] ${BOX}`}>
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
