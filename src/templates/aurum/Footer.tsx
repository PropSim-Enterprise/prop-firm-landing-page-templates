import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, FAINT, MUTED, Ornament } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="border-t border-[#c8a96a]/15 pb-12 pt-16 text-center">
      <div className={CONTAINER}>
        <Brand brand={firm} showName={firm.showName} />
        <Ornament className="mt-6" />
        {firm.social.length > 0 && (
          <ul aria-label="Social" className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {firm.social.map((s) => (
              <li key={s.key}>
                <SfLink
                  href={s.href}
                  className={`aurum-caps transition-colors hover:text-[#e9d3a1] ${MUTED}`}
                >
                  {s.label}
                </SfLink>
              </li>
            ))}
          </ul>
        )}
        {firm.legal.length > 0 && (
          <nav aria-label="Legal" className="mt-6">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
              {firm.legal.map((l) => (
                <li key={l.slug}>
                  <SfLink
                    href={l.href}
                    className={`transition-colors hover:text-[#e9d3a1] ${FAINT}`}
                  >
                    {l.title}
                  </SfLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Disclaimer
          className={`mt-12 grid gap-x-10 gap-y-5 border-t border-[#c8a96a]/15 pt-10 text-left @lg:grid-cols-2 ${FAINT}`}
          titleClassName="aurum-caps text-[#b4ab9b]"
          bodyClassName="mt-2 text-[12px] leading-relaxed"
        />
        <p className={`mt-10 text-[12px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
