import { Disclaimer } from "../../core/disclaimer";
import { SfLink } from "../../core/runtime";
import type { StorefrontView } from "../../core/types";
import { CONTAINER } from "./ui";

export function Footer({ view }: { view: StorefrontView }) {
  const { firm } = view;
  const logo = firm.logoUrl;
  return (
    <footer className="bg-[#111] pb-12 pt-16 text-[#fff6e5]">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 @md:flex-row @md:items-start @md:justify-between">
          <div>
            {logo ? (
              <img
                src={logo}
                alt={firm.name}
                style={{ height: firm.logoHeight }}
                className="w-auto max-w-[180px] object-contain"
              />
            ) : (
              <p className="text-[24px] font-bold tracking-[-0.04em]">{firm.name}</p>
            )}
            <p className="mt-2 text-[15px] text-[#fff6e5]/60">{view.content.hero.eyebrow}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {firm.social.map((s) => (
              <SfLink
                key={s.key}
                href={s.href}
                className="rounded-full border-[2px] border-[#fff6e5]/40 px-4 py-1.5 text-[14px] font-bold transition-colors hover:border-[#ffd23f] hover:text-[#ffd23f]"
              >
                {s.label}
              </SfLink>
            ))}
          </div>
        </div>
        {firm.legal.length > 0 && (
          <nav aria-label="Legal" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#fff6e5]/70">
              {firm.legal.map((l) => (
                <li key={l.slug}>
                  <SfLink href={l.href} className="underline-offset-4 hover:underline">
                    {l.title}
                  </SfLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Disclaimer
          className="mt-10 grid gap-x-10 gap-y-5 border-t-[2px] border-[#fff6e5]/15 pt-10 text-[#fff6e5]/55 @lg:grid-cols-2"
          titleClassName="text-[13px] font-bold text-[#fff6e5]/85"
          bodyClassName="mt-1.5 text-[12px] leading-relaxed"
        />
        <p className="mt-10 text-[12px] text-[#fff6e5]/45">
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
