import type { TemplateManifest, TemplateModule } from "./core/types";
import { aurumManifest } from "./templates/aurum/manifest";
import { azureManifest } from "./templates/azure/manifest";
import { cobaltManifest } from "./templates/cobalt/manifest";
import { harborManifest } from "./templates/harbor/manifest";
import { ivoryManifest } from "./templates/ivory/manifest";
import { onyxManifest } from "./templates/onyx/manifest";
import { onyxLightManifest } from "./templates/onyx/manifest-light";
import { popManifest } from "./templates/pop/manifest";
import { quantManifest } from "./templates/quant/manifest";
import { voltManifest } from "./templates/volt/manifest";

/**
 * Every template the platform offers. Manifests are tiny and load up front (the
 * picker lists them); a template's pages load only when something renders it.
 * To add a template: a folder under templates/, its manifest here, its loader below.
 */
export const TEMPLATE_MANIFESTS: readonly TemplateManifest[] = [
  onyxManifest,
  onyxLightManifest,
  ivoryManifest,
  voltManifest,
  cobaltManifest,
  azureManifest,
  aurumManifest,
  quantManifest,
  harborManifest,
  popManifest,
];

const LOADERS: Record<string, () => Promise<TemplateModule>> = {
  onyx: () => import("./templates/onyx").then((m) => m.default),
  // Same components; the root class sf-onyx-light swaps the palette.
  "onyx-light": () => import("./templates/onyx").then((m) => m.default),
  ivory: () => import("./templates/ivory").then((m) => m.default),
  volt: () => import("./templates/volt").then((m) => m.default),
  cobalt: () => import("./templates/cobalt").then((m) => m.default),
  azure: () => import("./templates/azure").then((m) => m.default),
  aurum: () => import("./templates/aurum").then((m) => m.default),
  quant: () => import("./templates/quant").then((m) => m.default),
  harbor: () => import("./templates/harbor").then((m) => m.default),
  pop: () => import("./templates/pop").then((m) => m.default),
};

export function isTemplateId(id: string | null | undefined): id is string {
  return typeof id === "string" && id in LOADERS;
}

export function templateManifest(id: string): TemplateManifest | undefined {
  return TEMPLATE_MANIFESTS.find((m) => m.id === id);
}

export function loadTemplate(id: string): Promise<TemplateModule> {
  const load = LOADERS[id];
  if (!load) return Promise.reject(new Error(`Unknown storefront template "${id}"`));
  return load();
}
