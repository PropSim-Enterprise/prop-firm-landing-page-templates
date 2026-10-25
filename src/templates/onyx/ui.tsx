import type { ReactNode } from "react";
import type { BrandView } from "../../core/types";

/* Onyx's shared pieces. Colours are literal: a template owns its palette. */

export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5 @md:px-8";
export const MUTED = "text-onyx-muted";
export const FAINT = "text-onyx-faint";
export const ACCENT = "text-onyx-accent";

export const BTN_PRIMARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-onyx-primary px-5 text-[15px] font-medium text-onyx-onprimary transition-[background-color,transform] duration-200 hover:bg-onyx-primaryhover active:scale-[0.98]";
export const BTN_SECONDARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-onyx-ink/10 bg-onyx-ink/[0.03] px-5 text-[15px] font-medium text-onyx-fg transition-colors duration-200 hover:border-onyx-ink/20 hover:bg-onyx-ink/[0.07]";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={`onyx-mono text-[12px] uppercase tracking-[0.14em] ${MUTED}`}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  id,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  id: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-[40rem] text-center" : "max-w-[40rem]"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-4 text-balance text-[clamp(2rem,4.6cqi,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
      >
        {title}
      </h2>
      {sub && <p className={`mt-4 text-pretty text-[17px] leading-relaxed ${MUTED}`}>{sub}</p>}
    </div>
  );
}

/** Logo when the firm has one, otherwise its name as a wordmark. */
/**
 * The firm's logo. Onyx and Onyx Light share this component, so when the firm
 * has separate logos for dark and light backgrounds both are rendered and the
 * palette's CSS shows the right one.
 */
export function Brand({ brand, showName = false }: { brand: BrandView; showName?: boolean }) {
  const onDark = brand.logoUrl;
  const onLight = brand.logoUrlLight ?? brand.logoUrl;
  if (!onDark || !onLight) {
    return (
      <span className="block min-w-0 truncate text-[17px] font-semibold tracking-[-0.02em]">
        {brand.name}
      </span>
    );
  }
  const img = (src: string, cls: string) => (
    <img
      src={src}
      alt={showName ? "" : brand.name}
      style={{ height: brand.logoHeight }}
      className={`w-auto max-w-[180px] object-contain ${cls}`}
    />
  );
  return (
    <span className="flex items-center gap-2.5">
      {onDark === onLight ? (
        img(onDark, "")
      ) : (
        <>
          {img(onDark, "onyx-logo-dark")}
          {img(onLight, "onyx-logo-light")}
        </>
      )}
      {showName && (
        <span className="block min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em]">
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
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
