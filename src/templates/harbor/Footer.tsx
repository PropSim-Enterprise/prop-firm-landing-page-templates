import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, FAINT, MUTED } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="bg-[#f7f9fc] pb-12 pt-16">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 @md:flex-row @md:items-start @md:justify-between">
          <div className="max-w-[22rem]">
            <Brand brand={firm} showName={firm.showName} />
            <p className={`mt-3 text-[14px] ${MUTED}`}>{view.content.hero.eyebrow}</p>
          </div>
          <div className="flex flex-col gap-6 @sm:flex-row @sm:gap-14">
            {firm.social.length > 0 && (
              <nav aria-label="Social">
                <p className="text-[13px] font-semibold">Follow</p>
                <ul className={`mt-3 space-y-2 text-[14px] ${MUTED}`}>
                  {firm.social.map((s) => (
                    <li key={s.key}>
                      <SfLink href={s.href} className="hover:text-[#0f1d33]">
                        {s.label}
                      </SfLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {firm.legal.length > 0 && (
              <nav aria-label="Legal">
                <p className="text-[13px] font-semibold">Legal</p>
                <ul className={`mt-3 space-y-2 text-[14px] ${MUTED}`}>
                  {firm.legal.map((l) => (
                    <li key={l.slug}>
                      <SfLink href={l.href} className="hover:text-[#0f1d33]">
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
          className={`mt-12 grid gap-x-10 gap-y-5 border-t border-[#0f1d33]/[0.08] pt-10 @lg:grid-cols-2 ${FAINT}`}
          titleClassName="text-[12px] font-semibold text-[#5a6b85]"
          bodyClassName="mt-1.5 text-[12px] leading-relaxed"
        />
        <p className={`mt-10 text-[12px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
