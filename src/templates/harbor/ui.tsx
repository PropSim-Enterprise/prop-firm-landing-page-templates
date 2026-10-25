import type { BrandView } from "../../core/types";

/* Harbor's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1160px] px-5 @md:px-8";
export const MUTED = "text-[#5a6b85]";
export const FAINT = "text-[#8a99b0]";
export const BLUE = "text-[#5b8def]";
export const CARD =
  "rounded-[20px] border border-[#0f1d33]/[0.08] bg-white shadow-[0_1px_2px_rgba(15,29,51,0.04)]";

export const BTN_NAVY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0f1d33] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1b2c48]";
export const BTN_WHITE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0f1d33] transition-colors duration-200 hover:bg-[#e8eef7]";
export const BTN_GLASS =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] transition-colors duration-200 hover:bg-white/15";

export function Heading({
  eyebrow,
  title,
  sub,
  id,
  center = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  id: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[40rem] text-center" : "max-w-[40rem]"}>
      <p className={`text-[14px] font-semibold ${BLUE}`}>{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 text-balance text-[clamp(2rem,4.4cqi,3rem)] font-semibold leading-[1.1] tracking-[-0.025em]"
      >
        {title}
      </h2>
      {sub && <p className={`mt-4 text-pretty text-[17px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

export function Brand({
  brand,
  showName = false,
  onDark = false,
}: {
  brand: BrandView;
  showName?: boolean;
  onDark?: boolean;
}) {
  const src = onDark ? brand.logoUrl : (brand.logoUrlLight ?? brand.logoUrl);
  if (!src)
    return (
      <span className="block min-w-0 truncate text-[18px] font-bold tracking-[-0.02em]">
        {brand.name}
      </span>
    );
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={src}
        alt={showName ? "" : brand.name}
        style={{ height: brand.logoHeight }}
        className="w-auto max-w-[180px] object-contain"
      />
      {showName && (
        <span className="block min-w-0 truncate text-[16px] font-semibold">{brand.name}</span>
      )}
    </span>
  );
}

export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
