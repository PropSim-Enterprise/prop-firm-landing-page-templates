import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { Brand, CONTAINER, FAINT, MUTED } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  return (
    <footer className="border-t border-onyx-ink/[0.06] pb-12 pt-16">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 @md:flex-row @md:items-start @md:justify-between">
          <div className="max-w-[22rem]">
            <Brand brand={firm} showName={firm.showName} />
            {view.content.hero.eyebrow && (
              <p className={`mt-3 text-[14px] ${FAINT}`}>{view.content.hero.eyebrow}</p>
            )}
          </div>
          {firm.social.length > 0 && (
            <ul aria-label="Social" className="flex flex-wrap gap-2">
              {firm.social.map((s) => (
                <li key={s.key}>
                  <SfLink
                    href={s.href}
                    className="inline-flex h-9 items-center rounded-full border border-onyx-ink/10 px-3.5 text-[13px] text-onyx-soft transition-colors hover:border-onyx-ink/25 hover:text-onyx-fg"
                  >
                    {s.label}
                  </SfLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        {firm.legal.length > 0 && (
          <nav aria-label="Legal" className="mt-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              {firm.legal.map((l) => (
                <li key={l.slug}>
                  <SfLink href={l.href} className={`transition-colors hover:text-onyx-fg ${MUTED}`}>
                    {l.title}
                  </SfLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Disclaimer
          className={`mt-12 grid gap-x-10 gap-y-5 border-t border-onyx-ink/[0.06] pt-10 @lg:grid-cols-2 ${FAINT}`}
          titleClassName="text-[12px] font-medium text-onyx-muted"
          bodyClassName="mt-1.5 text-[12px] leading-relaxed"
        />
        <p className={`mt-10 text-[12px] ${FAINT}`}>
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
