import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Cobalt's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5 @md:px-8";
export const MUTED = "text-[#4a5675]";
export const FAINT = "text-[#8590ab]";
export const BLUE = "text-[#2547f4]";
export const CARD =
  "rounded-[24px] border border-[#0b1533]/[0.08] bg-white shadow-[0_1px_2px_rgba(11,21,51,0.04),0_12px_32px_-16px_rgba(11,21,51,0.12)]";

export const BTN_BLUE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#2547f4] px-6 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,71,244,0.6)] transition-[background-color,transform] duration-200 hover:bg-[#1d3be0] active:scale-[0.98]";
export const BTN_GHOST =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-white px-6 text-[15px] font-semibold text-[#0b1533] shadow-[inset_0_0_0_1px_rgba(11,21,51,0.12)] transition-colors duration-200 hover:bg-[#eef1f8]";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#2547f4]/10 px-3 py-1 text-[13px] font-semibold text-[#2547f4]">
      {children}
    </span>
  );
}

export function Heading({
  pill,
  title,
  sub,
  id,
  center = false,
}: {
  pill: string;
  title: string;
  sub?: string;
  id: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[42rem] text-center" : "max-w-[42rem]"}>
      <Pill>{pill}</Pill>
      <h2
        id={id}
        className="mt-5 text-balance text-[clamp(2.1rem,4.8cqi,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.03em]"
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
      <span className="block min-w-0 truncate text-[19px] font-extrabold tracking-[-0.02em]">
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
        <span className="block min-w-0 truncate text-[16px] font-bold tracking-[-0.01em]">
          {brand.name}
        </span>
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
      <circle cx="9" cy="9" r="9" fill="#2547f4" fillOpacity="0.12" />
      <path
        d="M5.5 9.2l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="#2547f4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
