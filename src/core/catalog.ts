import { rec } from "./resolve";
import type {
  ChallengeView,
  PhaseView,
  PublicChallengeTemplate,
  PublicPhase,
  PublicProduct,
  PublicRule,
} from "./types";

/**
 * Turns the public products payload into the challenge catalog templates show:
 * evaluation products only, each with its full phase chain and the real rule
 * values. Nothing is invented: a value the firm has not configured is left out.
 */

type RuleSpecs = Pick<
  PhaseView,
  "target" | "dailyLoss" | "maxLoss" | "trailing" | "minDays" | "maxDays"
>;

const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

/** Legacy rule values store percents either as 10 or as 0.1. */
const pct = (v: unknown): number | undefined => {
  const n = num(v);
  if (n === undefined) return undefined;
  return Number((n <= 1 ? n * 100 : n).toFixed(2));
};

/** Profit splits are stored as 80 or 0.8. */
export const splitPercent = (v: unknown): number | undefined => {
  const n = num(v);
  if (n === undefined || n <= 0) return undefined;
  return n > 1 ? n : Math.round(n * 100);
};

/** Params already hold percents; only the legacy flat `value` may be a fraction. */
const percentOf = (param: unknown, value: unknown) => num(param) ?? pct(value);

const lossLimit = (r: PublicRule, p: Record<string, unknown>) => percentOf(p.maxPercent, r.value);

const RULE_READERS: Record<string, (r: PublicRule, p: Record<string, unknown>) => RuleSpecs> = {
  PROFIT_TARGET: (r, p) => ({ target: percentOf(p.targetPercent, r.value) }),
  MAX_DAILY_LOSS: (r, p) => ({ dailyLoss: lossLimit(r, p) }),
  MAX_OVERALL_LOSS: (r, p) => ({ maxLoss: lossLimit(r, p) }),
  MAX_DRAWDOWN: (r, p) => ({ maxLoss: lossLimit(r, p) }),
  MAX_TOTAL_DRAWDOWN: (r, p) => ({ maxLoss: lossLimit(r, p) }),
  TRAILING_DRAWDOWN: (r, p) => ({ maxLoss: lossLimit(r, p), trailing: true }),
  MIN_TRADING_DAYS: (r, p) => ({ minDays: num(p.minDays ?? r.value) }),
  MAX_TRADING_DAYS: (r, p) => ({ maxDays: num(p.maxDays ?? r.value) }),
};

function defined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export function readRuleSpecs(rules: PublicRule[] | undefined): RuleSpecs {
  let specs: RuleSpecs = {};
  for (const rule of rules ?? []) {
    const read = rule.enabled === false ? undefined : RULE_READERS[rule.code || rule.type || ""];
    if (read) specs = { ...specs, ...defined(read(rule, rec(rule.params))) };
  }
  return specs;
}

/** A split configured on the profit-target rule ("Profit Split (Funded)"). */
function ruleSplit(rules: PublicRule[] | undefined): number | undefined {
  const target = (rules ?? []).find((r) => (r.code || r.type) === "PROFIT_TARGET");
  return splitPercent(rec(target?.params).profitSplit);
}

const isFunded = (phase: string | undefined) => (phase ?? "").toUpperCase().includes("FUND");

function chainOf(t: PublicChallengeTemplate): PublicPhase[] {
  if (Array.isArray(t.phases) && t.phases.length > 0) return t.phases;
  return [
    {
      phase: t.phase,
      startingBalance: t.startingBalance,
      currency: t.currency,
      leverage: t.leverage,
      profitSplit: t.profitSplit ?? null,
      maxDurationDays: t.maxDurationDays ?? null,
      rules: Array.isArray(t.rules) ? t.rules : [],
    },
  ];
}

function toPhaseView(p: PublicPhase, label: string): PhaseView {
  const funded = isFunded(p.phase);
  const specs = readRuleSpecs(p.rules);
  return {
    label,
    funded,
    ...defined({
      ...specs,
      maxDays: specs.maxDays ?? num(p.maxDurationDays ?? undefined),
      leverage: num(p.leverage),
      profitSplit: funded ? (splitPercent(p.profitSplit) ?? ruleSplit(p.rules)) : undefined,
    }),
  };
}

/** Phase 1, Phase 2, …, Funded. */
export function phaseViews(t: PublicChallengeTemplate): PhaseView[] {
  let evaluation = 0;
  return chainOf(t).map((p) => {
    if (isFunded(p.phase)) return toPhaseView(p, "Funded");
    evaluation += 1;
    return toPhaseView(p, `Phase ${evaluation}`);
  });
}

function challengeSplit(t: PublicChallengeTemplate, phases: PhaseView[]): number | undefined {
  const funded = phases.find((p) => p.funded)?.profitSplit;
  return funded ?? splitPercent(t.profitSplit) ?? ruleSplit(t.rules);
}

/**
 * A product's group: the one the firm set, else the words before the size in
 * its name ("Swing 50K Challenge" → "Swing"), the same idea the server uses
 * to group checkout templates.
 */
function groupOf(p: PublicProduct, t: PublicChallengeTemplate): string {
  const own = p.group?.trim();
  if (own) return own;
  const name = t.name || p.name;
  const prefix = name.split(/\s\$?\d/)[0]?.trim();
  return prefix && prefix !== name.trim() ? prefix : "Standard";
}

function toChallenge(p: PublicProduct): ChallengeView | null {
  const t = p.template;
  if (!t || isFunded(t.phase)) return null;
  const phases = phaseViews(t);
  const split = challengeSplit(t, phases);
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    currency: p.currency || t.currency || "USD",
    group: groupOf(p, t),
    size: t.startingBalance,
    phases,
    ...(split === undefined ? {} : { profitSplit: split }),
  };
}

const bySizePrice = (a: ChallengeView, b: ChallengeView) => a.size - b.size || a.price - b.price;

/** Groups in display order: the largest range first (usually the main program). */
function orderGroups(challenges: ChallengeView[]): string[] {
  const counts = new Map<string, number>();
  for (const c of challenges) counts.set(c.group, (counts.get(c.group) ?? 0) + 1);
  return [...counts.keys()].sort(
    (a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || a.localeCompare(b),
  );
}

export function buildCatalog(products: PublicProduct[]): {
  challenges: ChallengeView[];
  groups: string[];
} {
  const unordered = products
    .map(toChallenge)
    .filter((c): c is ChallengeView => c !== null)
    .sort(bySizePrice);
  const groups = orderGroups(unordered);
  const rank = new Map(groups.map((g, i) => [g, i]));
  const challenges = unordered.sort(
    (a, b) => (rank.get(a.group) ?? 0) - (rank.get(b.group) ?? 0) || bySizePrice(a, b),
  );
  return { challenges, groups };
}

/** The challenge the page uses for its examples: the middle size of the first group. */
export function flagshipOf(challenges: ChallengeView[]): ChallengeView | undefined {
  const first = challenges[0];
  if (!first) return undefined;
  const group = challenges.filter((c) => c.group === first.group);
  return group[Math.floor(group.length / 2)];
}
