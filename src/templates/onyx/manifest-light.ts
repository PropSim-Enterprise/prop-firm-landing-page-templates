import type { TemplateManifest } from "../../core/types";

/** Onyx's structure in a light palette: same components, `.sf-onyx-light` tokens. */
export const onyxLightManifest: TemplateManifest = {
  id: "onyx-light",
  name: "Onyx Light",
  description:
    "Onyx on white. The same precise layout, tight headlines and phase-by-phase rules table, in near-black ink on bright paper with a deep emerald accent.",
  tags: ["light", "minimal", "data-led"],
  tone: "light",
  swatch: ["#fcfcfd", "#0b0c0e", "#047857"],
  formAccent: "#0b0c0e",
  sections: ["stats", "howItWorks", "rules", "faq", "testimonials"],
};
