import { useMemo, useState } from "react";
import { compactMoney, percent } from "./format";
import type { ChallengeView, PhaseView, StorefrontView } from "./types";

/*
 * Behaviour every account picker shares, whatever it looks like: which group
 * and which account are chosen, how sizes are labelled, and how each rule of a
 * phase is written.
 */

/** Group → account. Defaults to the middle size of the first group. */
export function useChallengePicker(view: StorefrontView) {
  const [chosenGroup, setGroup] = useState(view.groups[0] ?? "");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const group = view.groups.includes(chosenGroup) ? chosenGroup : (view.groups[0] ?? "");
  const inGroup = useMemo(
    () => view.challenges.filter((c) => c.group === group),
    [view.challenges, group],
  );
  const current = inGroup.find((c) => c.id === chosenId) ?? inGroup[Math.floor(inGroup.length / 2)];
  const pickGroup = (g: string) => {
    setGroup(g);
    setChosenId(null);
  };
  return { group, inGroup, current, pickGroup, pick: setChosenId };
}

/** "$100K", or "$100K · Swing 100K" when two accounts in a group share a size. */
export function sizeLabels(challenges: ChallengeView[]): Map<string, string> {
  const seen = new Map<number, number>();
  for (const c of challenges) seen.set(c.size, (seen.get(c.size) ?? 0) + 1);
  return new Map(
    challenges.map((c) => {
      const base = compactMoney(c.size, c.currency);
      return [c.id, (seen.get(c.size) ?? 0) > 1 ? `${base} · ${c.name}` : base];
    }),
  );
}

export type PhaseMetric = {
  key: string;
  label: string;
  cell: (p: PhaseView) => string | undefined;
  /** Shown when the phase has no value (default "—"). */
  empty?: string;
  /** Shown even when no phase sets it ("Time limit: None" is information). */
  always?: boolean;
};

const pct = (v: number | undefined) => (v === undefined ? undefined : percent(v));

export const PHASE_METRICS: PhaseMetric[] = [
  { key: "target", label: "Profit target", cell: (p) => pct(p.target) },
  { key: "daily", label: "Daily loss limit", cell: (p) => pct(p.dailyLoss) },
  {
    key: "max",
    label: "Maximum loss",
    cell: (p) =>
      p.maxLoss === undefined ? undefined : `${percent(p.maxLoss)}${p.trailing ? " trailing" : ""}`,
  },
  {
    key: "minDays",
    label: "Minimum trading days",
    cell: (p) => (p.minDays ? String(p.minDays) : undefined),
  },
  {
    key: "maxDays",
    label: "Time limit",
    cell: (p) => (p.maxDays ? `${p.maxDays} days` : undefined),
    empty: "None",
    always: true,
  },
  { key: "leverage", label: "Leverage", cell: (p) => (p.leverage ? `1:${p.leverage}` : undefined) },
  { key: "split", label: "Profit split", cell: (p) => (p.funded ? pct(p.profitSplit) : undefined) },
];

/** The metrics worth a row for these phases. */
export const metricsFor = (phases: PhaseView[]) =>
  PHASE_METRICS.filter((m) => m.always || phases.some((p) => m.cell(p) !== undefined));

/** Evaluation phases only (Phase 1, Phase 2 …). */
export const evaluationPhases = (c: ChallengeView) => c.phases.filter((p) => !p.funded);
