import { flagshipOf } from "../../core/catalog";
import { money } from "../../core/format";
import { useChallengePicker } from "../../core/picker";
import type { LandingProps } from "../../core/types";
import { Footer } from "./Footer";
import { About, Faq, FinalCta, HowItWorks, Pricing, Rules, Stats, Testimonials } from "./Sections";
import { Announcement, Hero, Nav } from "./Top";

function pageFacts(view: LandingProps["view"]) {
  const flagship = flagshipOf(view.challenges);
  const { heading, body } = view.content.about;
  return {
    example: flagship ? money(flagship.size, flagship.currency) : undefined,
    currency: flagship?.currency ?? "USD",
    hasAbout: Boolean(heading.trim() || body.trim()),
  };
}

export function AzureLanding({ view }: LandingProps) {
  const { content, sections } = view;
  // One picker shared by the hero configurator and the pricing cards.
  const picker = useChallengePicker(view);
  const { example, currency, hasAbout } = pageFacts(view);
  return (
    <div className="relative min-h-full overflow-x-clip">
      {content.announcement.trim() && <Announcement text={content.announcement} />}
      <Nav view={view} />
      <main>
        <Hero view={view} picker={picker} />
        {sections.stats && <Stats stats={view.stats} currency={currency} />}
        <Pricing view={view} picker={picker} />
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
