/**
 * Number formatting for templates. Intl formatters are built once per
 * currency/style and reused: constructing them per call was a measured INP
 * cost in the trader terminal.
 */

const cache = new Map<string, Intl.NumberFormat>();

function formatter(key: string, make: () => Intl.NumberFormat): Intl.NumberFormat {
  let f = cache.get(key);
  if (!f) {
    f = make();
    cache.set(key, f);
  }
  return f;
}

function safeCurrency(currency: string): string {
  return /^[A-Z]{3}$/.test(currency) ? currency : "USD";
}

/** "$100,000" */
export function money(n: number, currency = "USD"): string {
  const c = safeCurrency(currency);
  return formatter(
    `m:${c}`,
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: c,
        maximumFractionDigits: 0,
      }),
  ).format(n);
}

/** "$100K", "$1.5M" */
export function compactMoney(n: number, currency = "USD"): string {
  const c = safeCurrency(currency);
  return formatter(
    `cm:${c}`,
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: c,
        notation: "compact",
        maximumFractionDigits: 1,
      }),
  ).format(n);
}

/** "12,480" */
export function count(n: number): string {
  return formatter("c", () => new Intl.NumberFormat("en-US")).format(n);
}

/** "12.5K" */
export function compactCount(n: number): string {
  return formatter(
    "cc",
    () => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }),
  ).format(n);
}

/** "10%", "4.5%" */
export function percent(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))}%`;
}
