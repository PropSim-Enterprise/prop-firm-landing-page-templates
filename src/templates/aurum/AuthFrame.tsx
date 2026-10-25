import type { AuthFrameProps } from "../../core/types";
import { Frame, Monogram, MUTED, Ornament } from "./ui";

/** Sign-up and sign-in: the form inside a double gold frame, the firm's monogram above. */
export function AurumAuthFrame({ brand, title, subtitle, footer, children }: AuthFrameProps) {
  return (
    <div className="aurum-glow flex min-h-full items-center justify-center px-4 py-14">
      <div className="w-full max-w-[460px] text-center">
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            style={{ height: brand.logoHeight }}
            className="mx-auto w-auto max-w-[180px] object-contain"
          />
        ) : (
          <Monogram name={brand.name} />
        )}
        <Frame className="mt-8 bg-[#0e0d0b] text-left">
          <div className="p-6 @sm:p-8">
            <h1 className="aurum-serif text-center text-[34px] leading-tight">{title}</h1>
            <Ornament className="mt-4" />
            {subtitle && <p className={`mt-4 text-center text-[15px] ${MUTED}`}>{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
        </Frame>
        {footer && <div className={`mt-6 text-[14px] ${MUTED}`}>{footer}</div>}
      </div>
    </div>
  );
}
