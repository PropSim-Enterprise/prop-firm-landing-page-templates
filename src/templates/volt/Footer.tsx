import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, FAINT, MUTED } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="pb-12 pt-16">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 @md:flex-row @md:items-center @md:justify-between">
          <Brand brand={firm} showName={firm.showName} />
          {firm.social.length > 0 && (
            <ul aria-label="Social" className="flex flex-wrap gap-2">
              {firm.social.map((s) => (
                <li key={s.key}>
                  <SfLink
                    href={s.href}
                    className="inline-flex h-10 items-center rounded-full border-2 border-[#f4f4f0]/15 px-4 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-[#d7ff3d] hover:text-[#d7ff3d]"
                  >
                    {s.label}
                  </SfLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        {firm.legal.length > 0 && (
          <nav aria-label="Legal" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              {firm.legal.map((l) => (
                <li key={l.slug}>
                  <SfLink
                    href={l.href}
                    className={`transition-colors hover:text-[#d7ff3d] ${MUTED}`}
                  >
                    {l.title}
                  </SfLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Disclaimer
          className={`mt-12 grid gap-x-10 gap-y-5 border-t-2 border-[#f4f4f0]/[0.08] pt-10 @lg:grid-cols-2 ${FAINT}`}
          titleClassName="text-[12px] font-bold uppercase tracking-[0.1em] text-[#a3a39c]"
          bodyClassName="mt-1.5 text-[12px] leading-relaxed"
        />
        <p className={`mt-10 text-[12px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
