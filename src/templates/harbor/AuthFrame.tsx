import type { AuthFrameProps } from "../../core/types";
import { Brand, CARD, MUTED } from "./ui";

/** Sign-up and sign-in: a white card on the navy night sky. */
export function HarborAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="harbor-night flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center text-white">
          <Brand brand={brand} onDark />
        </div>
        <div className={`mt-8 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] @sm:p-8 ${CARD}`}>
          <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.025em]">{title}</h1>
          {subtitle && <p className={`mt-1.5 text-[15px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && (
          <div className="mt-6 text-center text-[14px] text-white/70 [&_a]:text-white [&_a]:underline">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
