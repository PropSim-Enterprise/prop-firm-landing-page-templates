import { flagshipOf } from "../../core/catalog";
import { money } from "../../core/format";
import type { LandingProps } from "../../core/types";
import { Collection } from "./Collection";
import { Footer } from "./Footer";
import { About, Faq, FinalCta, HowItWorks, Rules, Stats, Testimonials } from "./Sections";
import { Announcement, Hero, Nav } from "./Top";

export function AurumLanding({ view }: LandingProps) {
  const { content, sections } = view;
  const flagship = flagshipOf(view.challenges);
  const example = flagship ? money(flagship.size, flagship.currency) : undefined;
  const hasAbout = Boolean(content.about.heading.trim() || content.about.body.trim());
  return (
    <div className="relative min-h-full overflow-x-clip">
      {content.announcement.trim() && <Announcement text={content.announcement} />}
      <Nav view={view} />
      <main>
        <Hero view={view} />
        {sections.stats && <Stats stats={view.stats} currency={flagship?.currency ?? "USD"} />}
        <Collection view={view} />
        {sections.howItWorks && <HowItWorks steps={view.steps} />}
        {sections.rules && <Rules rules={view.rules} example={example} />}
        {sections.testimonials && <Testimonials items={content.testimonials} />}
        {hasAbout && <About heading={content.about.heading} body={content.about.body} />}
        {sections.faq && <Faq items={view.faq} />}
        <FinalCta view={view} />
      </main>
      <Footer view={view} />
    </div>
  );
}
