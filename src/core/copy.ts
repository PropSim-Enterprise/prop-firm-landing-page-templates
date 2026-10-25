import { compactMoney, money, percent } from "./format";
import type {
  ChallengeView,
  FaqItem,
  HeroContent,
  PhaseView,
  PublicFirmStats,
  RuleView,
  StatView,
  StepView,
} from "./types";

/**
 * Copy derived from the firm's real configuration. Every number here comes
 * from its challenges or its stats; when a value is not configured the
 * sentence that would need it is left out, never filled with a guess.
 */

const evaluations = (c: ChallengeView) => c.phases.filter((p) => !p.funded);

function splits(challenges: ChallengeView[]): number[] {
  return challenges.map((c) => c.profitSplit).filter((s): s is number => s !== undefined);
}

const maxOf = (values: number[]) => (values.length ? Math.max(...values) : undefined);

/* ── Hero defaults ───────────────────────────────────────────────────── */

export function defaultHero(challenges: ChallengeView[]): HeroContent {
  const topSplit = maxOf(splits(challenges));
  const topSize = maxOf(challenges.map((c) => c.size));
  const currency = challenges[0]?.currency ?? "USD";
  return {
    eyebrow: "Funded trader program",
    title: topSplit
      ? `Trade our capital. Keep up to ${percent(topSplit)} of the profit.`
      : "Trade our capital. Prove your edge.",
    description: topSize
      ? `Pass the evaluation on an account of up to ${compactMoney(topSize, currency)}, then trade a funded account under clear, published rules.`
      : "Pass the evaluation, then trade a funded account under clear, published rules.",
    primaryCta: "Choose your account",
    secondaryCta: "Sign in",
  };
}

/* ── Stats ───────────────────────────────────────────────────────────── */

const STAT_DEFS: { key: keyof PublicFirmStats; label: string; format: StatView["format"] }[] = [
  { key: "totalTraders", label: "Registered traders", format: "count" },
  { key: "totalAccounts", label: "Accounts opened", format: "count" },
  { key: "tradersPassed", label: "Evaluations passed", format: "count" },
  { key: "totalPayouts", label: "Paid to traders", format: "money" },
];

export function buildStats(stats: PublicFirmStats | undefined): StatView[] {
  return STAT_DEFS.map((d) => ({ ...d, value: Number(stats?.[d.key] ?? 0) })).filter(
    (s) => Number.isFinite(s.value) && s.value > 0,
  );
}

/* ── How it works ────────────────────────────────────────────────────── */

function limitsClause(p: PhaseView): string {
  const parts: string[] = [];
  if (p.dailyLoss !== undefined) parts.push(`the ${percent(p.dailyLoss)} daily`);
  if (p.maxLoss !== undefined) parts.push(`the ${percent(p.maxLoss)} overall`);
  return parts.length ? ` without breaching ${parts.join(" or ")} loss limit` : "";
}

function phaseStep(p: PhaseView): StepView {
  const target =
    p.target === undefined
      ? "Hit the profit target"
      : `Reach the ${percent(p.target)} profit target`;
  const days = p.minDays ? ` Trade on at least ${p.minDays} days.` : "";
  return { title: `Pass ${p.label}`, body: `${target}${limitsClause(p)}.${days}` };
}

export function buildSteps(flagship: ChallengeView | undefined): StepView[] {
  if (!flagship) return [];
  const funded: StepView = {
    title: "Get funded",
    body:
      flagship.profitSplit === undefined
        ? "Trade a funded account under the same published rules."
        : `Trade a funded account and keep ${percent(flagship.profitSplit)} of the profit you make.`,
  };
  return [
    {
      title: "Choose your account",
      body: "Pick the account size and rules that suit how you trade.",
    },
    ...evaluations(flagship).map(phaseStep),
    funded,
  ];
}

/* ── Rules at a glance ───────────────────────────────────────────────── */

type RuleDef = {
  key: string;
  label: string;
  read: (p: PhaseView, c: ChallengeView) => string | undefined;
  body: (p: PhaseView) => string;
};

const fmtPct = (v: number | undefined) => (v === undefined ? undefined : percent(v));

const RULE_DEFS: RuleDef[] = [
  {
    key: "target",
    label: "Profit target",
    read: (p) => fmtPct(p.target),
    body: () => "The gain you need to pass the phase, measured from your starting balance.",
  },
  {
    key: "daily",
    label: "Daily loss limit",
    read: (p) => fmtPct(p.dailyLoss),
    body: () => "The most your account can lose in a single trading day.",
  },
  {
    key: "max",
    label: "Maximum loss",
    read: (p) => fmtPct(p.maxLoss),
    body: (p) =>
      p.trailing
        ? "The most your account can fall from its highest point."
        : "The most your account can fall below its starting balance.",
  },
  {
    key: "minDays",
    label: "Minimum trading days",
    read: (p) => (p.minDays ? `${p.minDays} days` : undefined),
    body: () => "Trade on at least this many days before the phase can pass.",
  },
  {
    key: "maxDays",
    label: "Time limit",
    read: (p) => (p.maxDays ? `${p.maxDays} days` : undefined),
    body: () => "The time you have to complete the phase.",
  },
  {
    key: "leverage",
    label: "Leverage",
    read: (p) => (p.leverage ? `1:${p.leverage}` : undefined),
    body: () => "The most leverage you can use on this account.",
  },
  {
    key: "split",
    label: "Profit split",
    read: (_p, c) => fmtPct(c.profitSplit),
    body: () => "Your share of the profit on a funded account.",
  },
];

export function buildRules(flagship: ChallengeView | undefined): RuleView[] {
  const first = flagship?.phases[0];
  if (!flagship || !first) return [];
  return RULE_DEFS.flatMap((d) => {
    const value = d.read(first, flagship);
    return value === undefined ? [] : [{ key: d.key, label: d.label, value, body: d.body(first) }];
  });
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function evaluationAnswer(c: ChallengeView): string | undefined {
  const phases = evaluations(c);
  const first = phases[0];
  if (!first) return undefined;
  const count =
    phases.length === 1
      ? "There is one evaluation phase."
      : `There are ${phases.length} evaluation phases.`;
  const values = [
    first.target !== undefined && `a ${percent(first.target)} profit target`,
    first.dailyLoss !== undefined && `a ${percent(first.dailyLoss)} daily loss limit`,
    first.maxLoss !== undefined && `a ${percent(first.maxLoss)} overall loss limit`,
  ].filter(Boolean);
  const example = values.length
    ? ` On the ${money(c.size, c.currency)} account, phase 1 has ${values.join(", ")}.`
    : "";
  return `${count} In each one, reach the profit target without breaching the loss limits.${example}`;
}

function splitAnswer(challenges: ChallengeView[]): string | undefined {
  const all = splits(challenges);
  if (!all.length) return undefined;
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  return lo === hi
    ? `You keep ${percent(hi)} of the profit you make on a funded account.`
    : `Between ${percent(lo)} and ${percent(hi)} of the profit on a funded account, depending on the account you choose.`;
}

function timeAnswer(challenges: ChallengeView[]): string {
  const limits = challenges
    .flatMap((c) => c.phases.map((p) => p.maxDays))
    .filter((d): d is number => d !== undefined);
  if (!limits.length)
    return "No. There is no time limit on the evaluation, so you can trade at your own pace.";
  const lo = Math.min(...limits);
  const hi = Math.max(...limits);
  return lo === hi
    ? `Yes. Each phase must be completed within ${hi} days.`
    : `Yes. Depending on the account, each phase must be completed within ${lo} to ${hi} days.`;
}

function leverageAnswer(challenges: ChallengeView[]): string | undefined {
  const top = maxOf(
    challenges.flatMap((c) => c.phases.map((p) => p.leverage ?? 0)).filter((l) => l > 0),
  );
  return top ? `Up to 1:${top}, depending on the account.` : undefined;
}

export function buildFaq(
  own: FaqItem[],
  challenges: ChallengeView[],
  flagship: ChallengeView | undefined,
): FaqItem[] {
  if (own.length) return own;
  if (!flagship) return [];
  const derived: [string, string | undefined][] = [
    ["How does the evaluation work?", evaluationAnswer(flagship)],
    ["How much of the profit do I keep?", splitAnswer(challenges)],
    ["Is there a time limit?", timeAnswer(challenges)],
    ["What leverage can I use?", leverageAnswer(challenges)],
    [
      "What happens if I break a rule?",
      "If a loss limit is breached, that evaluation ends. You can start a new one at any time.",
    ],
    [
      "Is this real money?",
      "Accounts run in a simulated trading environment. Simulated results have limitations and do not represent actual trading performance.",
    ],
  ];
  return derived.flatMap(([question, answer]) => (answer ? [{ question, answer }] : []));
}
