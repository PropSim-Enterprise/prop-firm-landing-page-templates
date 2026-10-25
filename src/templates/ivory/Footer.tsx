import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, FAINT, MUTED } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="bg-[#efebe2] pb-12 pt-16">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-10 @md:flex-row @md:items-start @md:justify-between">
          <div className="max-w-[24rem]">
            <Brand brand={firm} showName={firm.showName} />
            <p className={`mt-4 text-[15px] leading-relaxed ${MUTED}`}>
              {view.content.hero.eyebrow}
            </p>
          </div>
          <div className="flex flex-col gap-8 @sm:flex-row @sm:gap-16">
            {firm.social.length > 0 && (
              <nav aria-label="Social">
                <p className={`text-[12px] uppercase tracking-[0.16em] ${FAINT}`}>Follow</p>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {firm.social.map((s) => (
                    <li key={s.key}>
                      <SfLink href={s.href} className="transition-colors hover:text-[#1d5c46]">
                        {s.label}
                      </SfLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {firm.legal.length > 0 && (
              <nav aria-label="Legal">
                <p className={`text-[12px] uppercase tracking-[0.16em] ${FAINT}`}>Legal</p>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {firm.legal.map((l) => (
                    <li key={l.slug}>
                      <SfLink href={l.href} className="transition-colors hover:text-[#1d5c46]">
                        {l.title}
                      </SfLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
        <Disclaimer
          className={`mt-14 grid gap-x-12 gap-y-6 border-t border-[#161512]/[0.12] pt-10 @lg:grid-cols-2 ${MUTED}`}
          titleClassName="text-[13px] font-medium text-[#161512]"
          bodyClassName="mt-1.5 text-[12.5px] leading-relaxed"
        />
        <p className={`mt-12 text-[13px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
