import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, DIM, FAINT } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="pb-10 pt-12">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-6 @md:flex-row @md:items-center @md:justify-between">
          <Brand brand={firm} showName={firm.showName} />
          {firm.social.length > 0 && (
            <ul
              aria-label="Social"
              className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.08em]"
            >
              {firm.social.map((s) => (
                <li key={s.key}>
                  <SfLink href={s.href} className={`transition-colors hover:text-[#ffb000] ${DIM}`}>
                    {s.label}
                  </SfLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        {firm.legal.length > 0 && (
          <nav aria-label="Legal" className="mt-8">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
              {firm.legal.map((l) => (
                <li key={l.slug}>
                  <SfLink href={l.href} className={`transition-colors hover:text-[#ffb000] ${DIM}`}>
                    {l.title}
                  </SfLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Disclaimer
          className={`mt-10 grid gap-x-10 gap-y-5 border-t border-[#1e2630] pt-8 @lg:grid-cols-2 ${FAINT}`}
          titleClassName="text-[12px] font-bold uppercase tracking-[0.1em] text-[#7d8896]"
          bodyClassName="mt-1.5 text-[12px] leading-relaxed"
        />
        <p className={`mt-8 text-[12px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
