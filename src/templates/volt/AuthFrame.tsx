import type { AuthFrameProps } from "../../core/types";
import { Brand, MUTED } from "./ui";

/** Sign-up and sign-in: the firm's name huge and hollow behind one bordered panel. */
export function VoltAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="relative isolate flex min-h-full items-center justify-center overflow-hidden px-4 py-14">
      <div aria-hidden="true" className="volt-grain pointer-events-none absolute inset-0 -z-10" />
      <p
        aria-hidden="true"
        className="volt-display volt-outline pointer-events-none absolute inset-x-0 bottom-[-0.08em] -z-10 select-none whitespace-nowrap text-center text-[clamp(6rem,24cqi,22rem)]"
      >
        {brand.name}
      </p>
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center">
          <Brand brand={brand} />
        </div>
        <div className="mt-8 overflow-hidden rounded-[26px] border-2 border-[#f4f4f0]/[0.12] bg-[#121213]">
          <div aria-hidden="true" className="h-1.5 bg-[#d7ff3d]" />
          <div className="p-6 @sm:p-8">
            <h1 className="volt-display text-[46px]">{title}</h1>
            {subtitle && <p className={`mt-3 text-[15px] ${MUTED}`}>{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
        </div>
        {footer && <div className={`mt-6 text-center text-[14px] ${MUTED}`}>{footer}</div>}
      </div>
    </div>
  );
}
