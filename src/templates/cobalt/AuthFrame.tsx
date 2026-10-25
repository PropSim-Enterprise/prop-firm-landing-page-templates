import type { AuthFrameProps } from "../../core/types";
import { Brand, CARD, MUTED } from "./ui";

/** Sign-up and sign-in: one white card on the brand sky, firm mark above. */
export function CobaltAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="cobalt-sky flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center">
          <Brand brand={brand} />
        </div>
        <div className={`mt-8 p-6 @sm:p-8 ${CARD}`}>
          <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em]">{title}</h1>
          {subtitle && <p className={`mt-1.5 text-[15px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className={`mt-6 text-center text-[14px] ${MUTED}`}>{footer}</div>}
      </div>
    </div>
  );
}
