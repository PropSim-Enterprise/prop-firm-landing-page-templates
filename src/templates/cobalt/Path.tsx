import { useId } from "react";
import { money } from "../../core/format";
import { PHASE_METRICS, sizeLabels, useChallengePicker } from "../../core/picker";
import { Reveal, SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, PhaseView, StorefrontView } from "../../core/types";
import { Arrow, BTN_BLUE, CARD, CONTAINER, FAINT, Heading, MUTED } from "./ui";

/*
 * Accounts as a path: choose a programme and a size, then read the account
 * phase by phase (Phase 1 → Phase 2 → Funded), with the fee and the buy
 * button on a bar that stays in view.
 */

function Choices({
  items,
  active,
  onPick,
  label,
}: {
  items: [string, string][];
  active: string;
  onPick: (v: string) => void;
  label: string;
}) {
  return (
    <fieldset className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 cobalt-scrollbar-none @md:mx-0 @md:flex-wrap @md:justify-center @md:px-0">
      <legend className="sr-only">{label}</legend>
      {items.map(([value, text]) => (
        <button
          key={value}
          type="button"
          aria-pressed={value === active}
          onClick={() => onPick(value)}
          className={`cobalt-num h-11 shrink-0 rounded-[12px] px-4 text-[14px] font-semibold transition-colors duration-200 ${
            value === active
              ? "bg-[#0b1533] text-white"
              : "bg-white text-[#0b1533] shadow-[inset_0_0_0_1px_rgba(11,21,51,0.1)] hover:bg-[#eef1f8]"
          }`}
        >
          {text}
        </button>
      ))}
    </fieldset>
  );
}

function PhaseCard({ phase, step, last }: { phase: PhaseView; step: number; last: boolean }) {
  const rows = PHASE_METRICS.filter((m) => m.cell(phase) !== undefined);
  return (
    <li className="relative">
      <div
        className={`h-full p-6 ${phase.funded ? "rounded-[24px] bg-[#0b1533] text-white" : CARD}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold ${phase.funded ? "bg-[#2547f4] text-white" : "bg-[#2547f4]/10 text-[#2547f4]"}`}
          >
            {step}
          </span>
          <h3 className="text-[18px] font-bold tracking-[-0.01em]">{phase.label}</h3>
        </div>
        <dl className="mt-5 space-y-3">
          {rows.map((m) => (
            <div key={m.key} className="flex items-baseline justify-between gap-4 text-[14px]">
              <dt className={phase.funded ? "text-white/65" : MUTED}>{m.label}</dt>
              <dd className="cobalt-num font-bold">{m.cell(phase)}</dd>
            </div>
          ))}
          {rows.length === 0 && (
            <p className={`text-[14px] ${phase.funded ? "text-white/65" : MUTED}`}>
              No limits set for this phase.
            </p>
          )}
        </dl>
      </div>
      {!last && (
        <span
          aria-hidden="true"
          className="absolute -right-[18px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2547f4] shadow-[0_4px_12px_rgba(11,21,51,0.12)] @lg:flex"
        >
          <Arrow />
        </span>
      )}
    </li>
  );
}

const PHASE_COLS: Record<number, string> = {
  1: "",
  2: "@lg:grid-cols-2",
  3: "@lg:grid-cols-3",
  4: "@lg:grid-cols-4",
};

function BuyBar({ challenge }: { challenge: ChallengeView }) {
  const host = useHost();
  return (
    <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-white/90 p-3 pl-6 shadow-[0_0_0_1px_rgba(11,21,51,0.08),0_20px_40px_-20px_rgba(11,21,51,0.35)] backdrop-blur-xl">
      <p className="text-[15px]">
        <span className="font-bold">{money(challenge.size, challenge.currency)}</span>
        <span className={`mx-2 ${FAINT}`}>·</span>
        <span className={MUTED}>{challenge.name}</span>
      </p>
      <div className="flex items-center gap-4">
        <p className="cobalt-num text-[22px] font-extrabold tracking-[-0.02em]">
          {money(challenge.price, challenge.currency)}
          <span className={`ml-1.5 text-[13px] font-medium tracking-normal ${FAINT}`}>fee</span>
        </p>
        <SfLink href={host.registerHref(challenge.id)} className={BTN_BLUE}>
          Start challenge
          <Arrow />
        </SfLink>
      </div>
    </div>
  );
}

export function Path({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const { group, inGroup, current, pickGroup, pick } = useChallengePicker(view);
  const labels = sizeLabels(inGroup);
  return (
    <section data-sf-section="challenges" aria-labelledby={headingId} className="py-24 @md:py-32">
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          pill="Accounts"
          title="Choose a size. See the whole path."
          sub="Every phase of every account, with its rules, before you pay a thing."
          center
        />
        {current ? (
          <Reveal className="mt-12">
            <div className="flex flex-col gap-3 @md:items-center">
              {view.groups.length > 1 && (
                <Choices
                  label="Account type"
                  items={view.groups.map((g) => [g, g])}
                  active={group}
                  onPick={pickGroup}
                />
              )}
              <Choices
                label="Account size"
                items={inGroup.map((c) => [c.id, labels.get(c.id) ?? ""])}
                active={current.id}
                onPick={pick}
              />
            </div>
            <ol
              className={`mt-10 grid gap-5 ${PHASE_COLS[current.phases.length] ?? "@lg:grid-cols-3"}`}
            >
              {current.phases.map((p, i) => (
                <PhaseCard
                  key={p.label}
                  phase={p}
                  step={i + 1}
                  last={i === current.phases.length - 1}
                />
              ))}
            </ol>
            {current.description && (
              <p className={`mt-6 text-center text-[14px] ${MUTED}`}>{current.description}</p>
            )}
            <BuyBar challenge={current} />
          </Reveal>
        ) : (
          <p className={`mt-12 p-7 text-center text-[16px] ${CARD} ${MUTED}`}>
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
