import type { AuthFrameProps } from "../../core/types";
import { Brand, MUTED } from "./ui";

/** Sign-up and sign-in: the host's form in one quiet panel under the same light as the landing page. */
export function OnyxAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="relative isolate flex min-h-full items-center justify-center overflow-hidden px-4 py-14">
      <div aria-hidden="true" className="onyx-hero-bg pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="onyx-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
      />
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center">
          <Brand brand={brand} />
        </div>
        <div className="onyx-panel mt-8 rounded-[22px] border border-onyx-ink/10 bg-onyx-surface/90 p-6 shadow-[var(--o-shadow)] backdrop-blur-xl @sm:p-8">
          <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.03em]">{title}</h1>
          {subtitle && <p className={`mt-1.5 text-[15px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className={`mt-6 text-center text-[13px] ${MUTED}`}>{footer}</div>}
      </div>
    </div>
  );
}
