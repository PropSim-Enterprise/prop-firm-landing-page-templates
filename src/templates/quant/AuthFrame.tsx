import type { AuthFrameProps } from "../../core/types";
import { Brand, DIM, FAINT } from "./ui";

/** Sign-up and sign-in: the form in a terminal window. */
export function QuantAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="quant-scanlines flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[460px]">
        <div className="flex justify-center">
          <Brand brand={brand} />
        </div>
        <div className="mt-7 border border-[#1e2630] bg-[#10141b] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 border-b border-[#1e2630] px-4 py-2.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className={`ml-2 truncate text-[12px] ${FAINT}`}>
              {brand.name.toLowerCase().replace(/\s+/g, "-")} — account
            </span>
          </div>
          <div className="p-6 @sm:p-7">
            <h1 className="text-[22px] font-bold tracking-[-0.03em]">{title}</h1>
            {subtitle && <p className={`mt-1.5 text-[13px] ${DIM}`}>{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
        {footer && <div className={`mt-6 text-center text-[13px] ${DIM}`}>{footer}</div>}
      </div>
    </div>
  );
}
