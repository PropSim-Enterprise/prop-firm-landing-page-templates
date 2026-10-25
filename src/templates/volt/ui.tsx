import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Volt's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1240px] px-5 @md:px-8";
export const MUTED = "text-[#a3a39c]";
export const FAINT = "text-[#6f6f69]";
export const LIME = "text-[#d7ff3d]";

export const BTN_LIME =
  "inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#d7ff3d] px-7 text-[15px] font-bold uppercase tracking-[0.04em] text-[#0b0b0c] transition-[background-color,transform] duration-200 hover:bg-[#e4ff73] active:scale-[0.98]";
export const BTN_OUTLINE =
  "inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-2 border-[#f4f4f0]/25 px-7 text-[15px] font-bold uppercase tracking-[0.04em] text-[#f4f4f0] transition-colors duration-200 hover:border-[#f4f4f0]";

export function Tag({ children, lime = false }: { children: ReactNode; lime?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border-2 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] ${
        lime ? "border-[#d7ff3d] bg-[#d7ff3d] text-[#0b0b0c]" : "border-[#f4f4f0]/20 text-[#f4f4f0]"
      }`}
    >
      {children}
    </span>
  );
}

const HEADING_SIZE = {
  full: "text-[clamp(3rem,8.4cqi,6.4rem)]",
  /** For a heading that shares its row with another column. */
  column: "text-[clamp(2.6rem,5.2cqi,4.2rem)]",
};

export function Heading({
  tag,
  title,
  sub,
  id,
  size = "full",
}: {
  tag: string;
  title: string;
  sub?: string;
  id: string;
  size?: keyof typeof HEADING_SIZE;
}) {
  return (
    <div className="max-w-[52rem]">
      <Tag>{tag}</Tag>
      <h2 id={id} className={`volt-display mt-6 text-balance ${HEADING_SIZE[size]}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-6 max-w-[38rem] text-pretty text-[18px] leading-relaxed ${MUTED}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  if (!brand.logoUrl) {
    return (
      <span className="block min-w-0 truncate volt-display text-[19px] leading-none @sm:text-[22px] @md:text-[26px]">
        {brand.name}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-3">
      <img
        src={brand.logoUrl}
        alt={showName ? "" : brand.name}
        style={{ height: brand.logoHeight }}
        className="w-auto max-w-[180px] object-contain"
      />
      {showName && (
        <span className="block min-w-0 truncate volt-display text-[22px] leading-none">
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
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
