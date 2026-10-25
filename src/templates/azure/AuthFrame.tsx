import type { AuthFrameProps } from "../../core/types";
import { Brand, CARD, MUTED } from "./ui";

/** Sign-up and sign-in: a white card under the sky gradient. */
export function AzureAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="azure-sky flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center">
          <Brand brand={brand} />
        </div>
        <div className={`mt-8 p-6 @sm:p-8 ${CARD}`}>
          <div
            aria-hidden="true"
            className="azure-gradient -mx-6 -mt-6 mb-6 h-1.5 rounded-t-[22px] @sm:-mx-8 @sm:-mt-8"
          />
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em]">{title}</h1>
          {subtitle && <p className={`mt-1.5 text-[15px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className={`mt-6 text-center text-[15px] ${MUTED}`}>{footer}</div>}
      </div>
    </div>
  );
}
