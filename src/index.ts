export { buildCatalog, flagshipOf, phaseViews } from "./core/catalog";
export { compactMoney, money, percent } from "./core/format";
export {
  DEFAULT_TEMPLATE_ID,
  legacyTemplateId,
  readTemplateId,
  resolveStorefront,
  resolveTemplateId,
} from "./core/resolve";
export * from "./core/types";
export { type BuildViewInput, buildStorefrontView } from "./core/view";
export { isTemplateId, loadTemplate, TEMPLATE_MANIFESTS, templateManifest } from "./registry";
export { StorefrontAuthFrame, StorefrontLanding, type StorefrontLandingProps } from "./render";
