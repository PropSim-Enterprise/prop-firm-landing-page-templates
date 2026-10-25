import type { AuthFrameProps } from "../../core/types";
import { Brand, MUTED } from "./ui";

/**
 * Sign-up and sign-in: on wide screens an ink panel carries the firm's mark
 * and one line; the host's form sits on paper beside it.
 */
export function IvoryAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="grid min-h-full @lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#161512] p-12 text-[#f6f3ec] @lg:flex">
        <Brand brand={brand} onDark />
        <p className="ivory-serif max-w-[12ch] text-[clamp(3rem,5cqi,4.4rem)] leading-[0.98] tracking-[-0.02em]">
          Trade with <em className="italic text-[#9cc9b4]">{brand.name}.</em>
        </p>
        <p className="text-[13px] text-[#f6f3ec]/55">Simulated trading environment.</p>
      </aside>
      <div className="ivory-wash flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 flex justify-center @lg:hidden">
            <Brand brand={brand} />
          </div>
          <h1 className="ivory-serif text-[40px] leading-[1.05] tracking-[-0.015em]">{title}</h1>
          {subtitle && <p className={`mt-2 text-[16px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-8 rounded-[24px] border border-[#161512]/[0.12] bg-[#fffdf8] p-6 shadow-[0_20px_50px_-30px_rgba(22,21,18,0.35)] @sm:p-8">
            {children}
          </div>
          {footer && <div className={`mt-6 text-center text-[14px] ${MUTED}`}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
