import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Pop's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 @md:px-8";
export const MUTED = "text-[#4a4a4a]";
export const BOX = "rounded-[18px] border-[2.5px] border-[#111] bg-white shadow-[6px_6px_0_#111]";

export const BTN_INK =
  "pop-press inline-flex items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#111] bg-[#111] px-6 py-3 text-[16px] font-bold text-[#fff6e5] shadow-[5px_5px_0_#ff5c8a]";
export const BTN_YELLOW =
  "pop-press inline-flex items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#111] bg-[#ffd23f] px-6 py-3 text-[16px] font-bold text-[#111] shadow-[5px_5px_0_#111]";
export const BTN_WHITE =
  "pop-press inline-flex items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#111] bg-white px-6 py-3 text-[16px] font-bold text-[#111] shadow-[5px_5px_0_#111]";

export const ACCENTS = ["bg-[#ffd23f]", "bg-[#ff5c8a]", "bg-[#4d96ff]", "bg-[#7ee081]"];

/** A tilted label, like a sticker slapped on the page. */
export function Sticker({
  children,
  color = "bg-[#ffd23f]",
  tilt = "-rotate-3",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  tilt?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-[2.5px] border-[#111] px-4 py-1.5 text-[14px] font-bold shadow-[3px_3px_0_#111] ${color} ${tilt} ${className}`}
    >
      {children}
    </span>
  );
}

export function Heading({
  sticker,
  title,
  sub,
  id,
  color,
}: {
  sticker: string;
  title: string;
  sub?: string;
  id: string;
  color?: string;
}) {
  return (
    <div className="max-w-[46rem]">
      <Sticker color={color}>{sticker}</Sticker>
      <h2
        id={id}
        className="mt-6 text-balance text-[clamp(2.4rem,5.6cqi,4rem)] font-bold leading-[1] tracking-[-0.04em]"
      >
        {title}
      </h2>
      {sub && <p className={`mt-5 text-pretty text-[18px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  const src = brand.logoUrlLight ?? brand.logoUrl;
  if (!src)
    return (
      <span className="block min-w-0 truncate text-[17px] font-bold tracking-[-0.03em] @sm:text-[20px]">
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
        <span className="block min-w-0 truncate text-[17px] font-bold">{brand.name}</span>
      )}
    </span>
  );
}
