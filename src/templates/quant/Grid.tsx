import { useId, useMemo, useState } from "react";
import { compactMoney, money, percent } from "../../core/format";
import { evaluationPhases } from "../../core/picker";
import { SfLink, useHost } from "../../core/runtime";
import type { ChallengeView, StorefrontView } from "../../core/types";
import { CONTAINER, DIM, FAINT, GREEN, Heading, Pane } from "./ui";

/*
 * Every account of every program in one table: filter by program, sort by
 * size or fee, buy from the row. Below table width each row becomes a block.
 */

type SortKey = "size" | "price";
type Column = {
  key: string;
  label: string;
  value: (c: ChallengeView) => string | undefined;
  good?: boolean;
};

const pct = (v: number | undefined) => (v === undefined ? undefined : percent(v));
const days = (v: number | undefined) => (v ? `${v}d` : undefined);

function columns(rows: ChallengeView[]): Column[] {
  const phaseCount = Math.max(0, ...rows.map((c) => evaluationPhases(c).length));
  const targets: Column[] = Array.from({ length: phaseCount }, (_, i) => ({
    key: `t${i}`,
    label: `P${i + 1} target`,
    value: (c) => pct(evaluationPhases(c)[i]?.target),
  }));
  const all: Column[] = [
    ...targets,
    { key: "daily", label: "Daily", value: (c) => pct(c.phases[0]?.dailyLoss) },
    { key: "max", label: "Max loss", value: (c) => pct(c.phases[0]?.maxLoss) },
    { key: "min", label: "Min days", value: (c) => days(c.phases[0]?.minDays) },
    {
      key: "lev",
      label: "Leverage",
      value: (c) => (c.phases[0]?.leverage ? `1:${c.phases[0].leverage}` : undefined),
    },
    { key: "split", label: "Split", value: (c) => pct(c.profitSplit), good: true },
  ];
  return all.filter((col) => rows.some((c) => col.value(c) !== undefined));
}

function useGrid(view: StorefrontView) {
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "size", dir: 1 });
  const rows = useMemo(() => {
    const filtered =
      group === "all" ? view.challenges : view.challenges.filter((c) => c.group === group);
    return [...filtered].sort(
      (a, b) => (a[sort.key] - b[sort.key]) * sort.dir || a.group.localeCompare(b.group),
    );
  }, [view.challenges, group, sort]);
  const toggle = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key ? (-s.dir as 1 | -1) : 1 }));
  return { group, setGroup, rows, sort, toggle };
}

function Filters({
  groups,
  active,
  onPick,
  count,
}: {
  groups: string[];
  active: string;
  onPick: (g: string) => void;
  count: number;
}) {
  return (
    <fieldset className="flex items-center gap-1 overflow-x-auto px-3 py-2 quant-scrollbar-none">
      <legend className="sr-only">Program</legend>
      {["all", ...groups].map((g) => (
        <button
          key={g}
          type="button"
          aria-pressed={g === active}
          onClick={() => onPick(g)}
          className={`min-h-11 shrink-0 px-3 py-2.5 text-[12px] uppercase @md:min-h-0 @md:px-2.5 @md:py-1 tracking-[0.06em] transition-colors ${g === active ? "bg-[#ffb000] font-bold text-[#0c0f14]" : "text-[#9aa6b4] hover:bg-[#151b24] hover:text-[#d6dde6]"}`}
        >
          {g === "all" ? `All (${count})` : g}
        </button>
      ))}
    </fieldset>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
      className="px-3 py-2.5 text-left"
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`uppercase tracking-[0.08em] transition-colors hover:text-[#ffb000] ${active ? "text-[#ffb000]" : ""}`}
      >
        {label} {active ? (sort.dir === 1 ? "▲" : "▼") : "△"}
      </button>
    </th>
  );
}

function BuyLink({ c }: { c: ChallengeView }) {
  const host = useHost();
  return (
    <SfLink
      href={host.registerHref(c.id)}
      aria-label={`Buy the ${money(c.size, c.currency)} ${c.group} account`}
      className="inline-flex h-11 items-center border border-[#ffb000]/50 px-3 @md:h-8 text-[12px] font-bold uppercase tracking-[0.08em] text-[#ffb000] transition-colors hover:bg-[#ffb000] hover:text-[#0c0f14]"
    >
      Buy →
    </SfLink>
  );
}

function Table({
  rows,
  cols,
  sort,
  onSort,
}: {
  rows: ChallengeView[];
  cols: Column[];
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
}) {
  return (
    <div className="hidden overflow-x-auto @lg:block">
      <table className="w-full border-collapse text-[13px]">
        <caption className="sr-only">Every account, its fee and its rules</caption>
        <thead>
          <tr className={`border-b border-[#1e2630] text-[12px] ${DIM}`}>
            <th scope="col" className="px-3 py-2.5 text-left uppercase tracking-[0.08em]">
              Program
            </th>
            <SortHeader label="Size" k="size" sort={sort} onSort={onSort} />
            <SortHeader label="Fee" k="price" sort={sort} onSort={onSort} />
            {cols.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="whitespace-nowrap px-3 py-2.5 text-left uppercase tracking-[0.08em]"
              >
                {col.label}
              </th>
            ))}
            <th scope="col" className="px-3 py-2.5">
              <span className="sr-only">Buy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr
              key={c.id}
              className="border-b border-[#1e2630]/70 transition-colors last:border-0 hover:bg-[#151b24]"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-3 py-2.5 text-left font-normal text-[#9aa6b4]"
              >
                {c.group}
              </th>
              <td className="whitespace-nowrap px-3 py-2.5 font-bold">
                {money(c.size, c.currency)}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[#ffcf66]">
                {money(c.price, c.currency)}
              </td>
              {cols.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-3 py-2.5 ${col.good ? GREEN : ""}`}
                >
                  {col.value(c) ?? <span className={FAINT}>—</span>}
                </td>
              ))}
              <td className="px-3 py-2 text-right">
                <BuyLink c={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Blocks({ rows, cols }: { rows: ChallengeView[]; cols: Column[] }) {
  return (
    <ul className="divide-y divide-[#1e2630] @lg:hidden">
      {rows.map((c) => (
        <li key={c.id} className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[18px] font-bold">
              {compactMoney(c.size, c.currency)}{" "}
              <span className={`text-[12px] font-normal ${DIM}`}>{c.group}</span>
            </p>
            <p className="text-[14px] text-[#ffcf66]">{money(c.price, c.currency)}</p>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2 text-[12px]">
            {cols.map((col) => (
              <div key={col.key}>
                <dt className={`uppercase ${FAINT}`}>{col.label}</dt>
                <dd className={col.good ? GREEN : ""}>{col.value(c) ?? "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3">
            <BuyLink c={c} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Grid({ view }: { view: StorefrontView }) {
  const headingId = useId();
  const { group, setGroup, rows, sort, toggle } = useGrid(view);
  const cols = columns(rows);
  return (
    <section
      data-sf-section="challenges"
      aria-labelledby={headingId}
      className="border-b border-[#1e2630] py-20 @md:py-24"
    >
      <div className={CONTAINER}>
        <Heading
          id={headingId}
          path="accounts"
          title="Every account. One table."
          sub="Filter by program, sort by size or fee, and compare every rule side by side. P1 and P2 are the evaluation phases."
        />
        {view.challenges.length > 0 ? (
          <Pane
            title={`accounts · ${rows.length} rows`}
            aside={
              <span className={`text-[12px] ${DIM}`}>
                sorted by {sort.key === "size" ? "size" : "fee"} {sort.dir === 1 ? "▲" : "▼"}
              </span>
            }
            className="mt-10"
          >
            {view.groups.length > 1 && (
              <div className="border-b border-[#1e2630]">
                <Filters
                  groups={view.groups}
                  active={group}
                  onPick={setGroup}
                  count={view.challenges.length}
                />
              </div>
            )}
            <Table rows={rows} cols={cols} sort={sort} onSort={toggle} />
            <Blocks rows={rows} cols={cols} />
          </Pane>
        ) : (
          <p className={`mt-10 border border-[#1e2630] p-6 text-[14px] ${DIM}`}>
            Accounts are being set up. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
