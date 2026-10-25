import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Quant's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1280px] px-4 @md:px-6";
export const DIM = "text-[#7d8896]";
export const FAINT = "text-[#4d5764]";
export const AMBER = "text-[#ffb000]";
export const GREEN = "text-[#3ddc84]";
export const PANEL = "border border-[#1e2630] bg-[#10141b]";

export const BTN_AMBER =
  "inline-flex h-11 items-center justify-center gap-2 bg-[#ffb000] px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#0c0f14] transition-colors duration-150 hover:bg-[#ffc23d]";
export const BTN_LINE =
  "inline-flex h-11 items-center justify-center gap-2 border border-[#2c3744] px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#d6dde6] transition-colors duration-150 hover:border-[#ffb000] hover:text-[#ffb000]";

/** A boxed panel with a title bar, like a terminal pane. */
export function Pane({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${PANEL} ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-[#1e2630] px-4 py-2">
        <p className={`text-[12px] font-bold uppercase tracking-[0.14em] ${DIM}`}>{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function Heading({
  path,
  title,
  sub,
  id,
}: {
  path: string;
  title: string;
  sub?: string;
  id: string;
}) {
  return (
    <div className="max-w-[52rem]">
      <p className={`text-[12px] ${AMBER}`}>
        <span className={FAINT}>~/</span>
        {path}
      </p>
      <h2
        id={id}
        className="mt-3 text-balance text-[clamp(1.9rem,4.2cqi,3rem)] font-bold leading-[1.1] tracking-[-0.03em]"
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 max-w-[44rem] text-pretty text-[14px] leading-[1.8] ${DIM}`}>{sub}</p>
      )}
    </div>
  );
}

export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  if (!brand.logoUrl) {
    return (
      <span className="block min-w-0 truncate text-[15px] font-bold">
        <span className={AMBER}>▍</span>
        {brand.name}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={brand.logoUrl}
        alt={showName ? "" : brand.name}
        style={{ height: brand.logoHeight }}
        className="w-auto max-w-[170px] object-contain"
      />
      {showName && (
        <span className="block min-w-0 truncate text-[14px] font-bold">{brand.name}</span>
      )}
    </span>
  );
}
