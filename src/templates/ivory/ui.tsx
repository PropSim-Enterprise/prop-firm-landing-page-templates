import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Ivory's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 @md:px-10";
export const INK = "text-[#161512]";
export const MUTED = "text-[#5c5a53]";
export const FAINT = "text-[#8f8c83]";
export const GREEN = "text-[#1d5c46]";

export const BTN_INK =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#161512] px-6 text-[15px] font-medium text-[#f6f3ec] transition-[background-color,transform] duration-200 hover:bg-[#2a2823] active:scale-[0.98]";
export const BTN_LINE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#161512]/20 px-6 text-[15px] font-medium text-[#161512] transition-colors duration-200 hover:border-[#161512]/50 hover:bg-white/60";

/** Small caps with a hairline either side. */
export function Kicker({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.18em] ${GREEN} ${center ? "justify-center" : ""}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-[#1d5c46]/40" />
      {children}
      {center && <span aria-hidden="true" className="h-px w-6 bg-[#1d5c46]/40" />}
    </p>
  );
}

export function Heading({
  kicker,
  title,
  sub,
  id,
  center = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  id: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[44rem] text-center" : "max-w-[44rem]"}>
      <Kicker center={center}>{kicker}</Kicker>
      <h2
        id={id}
        className="ivory-serif mt-5 text-balance text-[clamp(2.4rem,5.6cqi,4rem)] leading-[1.02] tracking-[-0.015em]"
      >
        {title}
      </h2>
      {sub && <p className={`mt-5 text-pretty text-[17px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

/** The firm's logo for light backgrounds, else its name set in the serif. */
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
  if (!src) {
    return (
      <span className="block min-w-0 truncate ivory-serif text-[24px] leading-none tracking-[-0.01em]">
        {brand.name}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-3">
      <img
        src={src}
        alt={showName ? "" : brand.name}
        style={{ height: brand.logoHeight }}
        className="w-auto max-w-[180px] object-contain"
      />
      {showName && (
        <span className="block min-w-0 truncate ivory-serif text-[22px] leading-none">
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
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
