import type { BrandView } from "../../core/types";

/* Azure's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5 @md:px-8";
export const MUTED = "text-[#4b5b75]";
export const FAINT = "text-[#8796ad]";
export const SKY = "text-[#0284c7]";
export const CARD =
  "rounded-[22px] border border-[#0b1a33]/[0.07] bg-white shadow-[0_1px_2px_rgba(11,26,51,0.04),0_16px_40px_-20px_rgba(11,26,51,0.18)]";

export const BTN_GRADIENT =
  "azure-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.7)] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]";
export const BTN_SOFT =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0b1a33] shadow-[inset_0_0_0_1px_rgba(11,26,51,0.12)] transition-colors duration-200 hover:bg-[#eaf2ff]";

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
    <div className={center ? "mx-auto max-w-[42rem] text-center" : "max-w-[42rem]"}>
      <p className="azure-text-gradient text-[15px] font-semibold">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 text-balance text-[clamp(2.1rem,4.8cqi,3.3rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
      >
        {title}
      </h2>
      {sub && <p className={`mt-4 text-pretty text-[17px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  const src = brand.logoUrlLight ?? brand.logoUrl;
  if (!src)
    return (
      <span className="block min-w-0 truncate text-[20px] font-bold tracking-[-0.02em]">
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
        <span className="block min-w-0 truncate text-[17px] font-semibold">{brand.name}</span>
      )}
    </span>
  );
}

export function Check() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
      <circle cx="9" cy="9" r="9" fill="#0284c7" fillOpacity="0.12" />
      <path
        d="M5.5 9.2l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="#0284c7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
