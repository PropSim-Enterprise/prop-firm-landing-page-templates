import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Aurum's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 @md:px-10";
export const MUTED = "text-[#b4ab9b]";
export const FAINT = "text-[#7d7568]";
export const GOLD = "text-[#c8a96a]";
export const HAIR = "border-[#c8a96a]/25";

export const BTN_GOLD =
  "inline-flex h-12 items-center justify-center gap-3 bg-[#c8a96a] px-8 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#0a0908] transition-colors duration-300 hover:bg-[#dcc08a]";
export const BTN_LINE =
  "inline-flex h-12 items-center justify-center gap-3 border border-[#c8a96a]/50 px-8 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#e9d3a1] transition-colors duration-300 hover:border-[#c8a96a] hover:bg-[#c8a96a]/10";

/** ✦ between two hairlines. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 ${GOLD} ${className}`}
    >
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c8a96a]/60" />
      <span className="text-[12px]">✦</span>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c8a96a]/60" />
    </div>
  );
}

export function Heading({
  kicker,
  title,
  sub,
  id,
}: {
  kicker: string;
  title: string;
  sub?: string;
  id: string;
}) {
  return (
    <div className="mx-auto max-w-[44rem] text-center">
      <p className={`aurum-caps ${GOLD}`}>{kicker}</p>
      <h2
        id={id}
        className="aurum-serif mt-5 text-balance text-[clamp(2.4rem,5.6cqi,4rem)] leading-[1.04]"
      >
        {title}
      </h2>
      <Ornament className="mt-6" />
      {sub && <p className={`mt-6 text-pretty text-[16px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

/** The firm's initial in a gold ring. */
export function Monogram({ name, size = 64 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.48 }}
      className="aurum-serif inline-flex items-center justify-center rounded-full border border-[#c8a96a]/60 text-[#e9d3a1] shadow-[inset_0_0_0_4px_#0a0908,inset_0_0_0_5px_rgba(200,169,106,0.35)]"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  if (!brand.logoUrl)
    return (
      <span className="block min-w-0 truncate aurum-serif text-[20px] tracking-[0.02em] @sm:text-[24px]">
        {brand.name}
      </span>
    );
  return (
    <span className="flex items-center gap-3">
      <img
        src={brand.logoUrl}
        alt={showName ? "" : brand.name}
        style={{ height: brand.logoHeight }}
        className="w-auto max-w-[180px] object-contain"
      />
      {showName && (
        <span className="block min-w-0 truncate aurum-serif text-[22px]">{brand.name}</span>
      )}
    </span>
  );
}

export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative border ${HAIR} p-2 ${className}`}>
      <div className="h-full border border-[#c8a96a]/15">{children}</div>
    </div>
  );
}
