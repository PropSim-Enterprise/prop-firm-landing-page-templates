import type { AuthFrameProps } from "../../core/types";
import { BOX, Brand, MUTED, Sticker } from "./ui";

/** Sign-up and sign-in: one chunky card on the dotted cream page. */
export function PopAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="pop-dots flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center justify-center gap-3">
          <Brand brand={brand} />
        </div>
        <div className={`relative mt-9 p-6 @sm:p-8 ${BOX}`}>
          <Sticker color="bg-[#ff5c8a]" tilt="rotate-3" className="absolute -right-3 -top-5">
            Welcome
          </Sticker>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.04em]">{title}</h1>
          {subtitle && <p className={`mt-1.5 text-[16px] ${MUTED}`}>{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className="mt-7 text-center text-[15px] font-medium">{footer}</div>}
      </div>
    </div>
  );
}
