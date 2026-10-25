import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  buildStorefrontView,
  StorefrontLanding,
  type StorefrontHost,
  type StorefrontView,
} from "../src";
import "../src/styles.css";
import { DEMO_MODE, FIRM, LINKS, PRODUCTS, STOREFRONT } from "./config";
import { DemoShell, demoHost } from "./demo";

/** Each page names its template on <html data-template="…">. */
const templateId = document.documentElement.dataset.template ?? "onyx";

/** The legal links point at your own pages (LINKS.legal). */
function withLegalLinks(view: StorefrontView): StorefrontView {
  const legal = view.firm.legal.map((l) => ({ ...l, href: LINKS.legal[l.slug] ?? l.href }));
  return { ...view, firm: { ...view.firm, legal } };
}

const liveHost: StorefrontHost = {
  registerHref: LINKS.register,
  loginHref: () => LINKS.login,
  sameTab: true,
};

const view = buildStorefrontView({ firm: FIRM, products: PRODUCTS, config: STOREFRONT });

function Live() {
  return (
    <StorefrontLanding
      templateId={templateId}
      view={withLegalLinks(view)}
      host={liveHost}
      style={{ height: "100dvh" }}
    />
  );
}

function Demo() {
  return (
    <DemoShell templateId={templateId}>
      {(open) => (
        <StorefrontLanding
          templateId={templateId}
          view={view}
          host={demoHost(open)}
          style={{ height: "100%", ["--sf-vh" as string]: "calc(100dvh - 52px)" }}
        />
      )}
    </DemoShell>
  );
}

/** On a live site the page is the firm's, not the template's: name it after the firm. */
function titlePageAfterFirm() {
  document.title = `${FIRM.name}: ${view.content.hero.eyebrow}`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", view.content.hero.description);
}

const app = document.getElementById("app");
if (!DEMO_MODE) titlePageAfterFirm();
if (app) {
  createRoot(app).render(<StrictMode>{DEMO_MODE ? <Demo /> : <Live />}</StrictMode>);
}
