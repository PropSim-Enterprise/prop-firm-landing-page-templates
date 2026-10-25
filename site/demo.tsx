/**
 * Demo mode (DEMO_MODE in config.ts): a bar to switch templates, and a panel
 * that explains each button instead of following it. Not used on a live site.
 */
import { type ReactNode, useState } from "react";
import { money, type StorefrontHost, TEMPLATE_MANIFESTS } from "../src";
import { PRODUCTS } from "./config";
import "./demo.css";

const REPO_URL = "https://github.com/PropSim-Enterprise/prop-firm-landing-page-templates";
const PROPSIM_URL =
  "https://propsim.markets/?utm_source=github&utm_medium=template_demo&utm_campaign=prop-firm-landing-page-templates";

/** Buttons become internal links, which the runtime hands to `open`. */
export function demoHost(open: (href: string) => void): StorefrontHost {
  return {
    registerHref: (productId) => `/demo/register${productId ? `/${productId}` : ""}`,
    loginHref: () => "/demo/login",
    navigate: open,
  };
}

interface Explanation {
  title: string;
  body: string;
}

function explainCheckout(productId: string | undefined): Explanation {
  const product = PRODUCTS.find((p) => p.id === productId);
  const what = product ? ` for the ${product.name} (${money(product.price, product.currency)})` : "";
  return {
    title: "This button opens your checkout",
    body: `On your live site, this takes the trader to your checkout${what}. Set the address in site/config.ts under LINKS.register.`,
  };
}

function explain(href: string): Explanation {
  if (href.startsWith("/demo/register")) return explainCheckout(href.split("/")[3]);
  if (href === "/demo/login") {
    return {
      title: "This button opens your trader dashboard",
      body: "On your live site, Sign in goes to your traders' dashboard. Set the address in site/config.ts under LINKS.login.",
    };
  }
  return {
    title: "This link opens one of your legal pages",
    body: "On your live site, footer links go to your terms, privacy policy and risk disclosure. Set them in site/config.ts under LINKS.legal.",
  };
}

function DemoBar({ templateId }: { templateId: string }) {
  return (
    <header className="demo-bar">
      <a className="demo-back" href="../../">
        <span aria-hidden="true">←</span> All templates
      </a>
      <label className="demo-switch">
        <span className="demo-wide">Template</span>
        <select
          value={templateId}
          onChange={(e) => window.location.assign(`../${e.target.value}/`)}
        >
          {TEMPLATE_MANIFESTS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <nav className="demo-actions">
        <a className="demo-btn demo-wide" href={REPO_URL}>
          Get the code
        </a>
        <a className="demo-btn demo-btn-primary" href={PROPSIM_URL}>
          Launch your prop firm
        </a>
      </nav>
    </header>
  );
}

function DemoPanel({ href, onClose }: { href: string; onClose: () => void }) {
  const { title, body } = explain(href);
  return (
    <div className="demo-overlay" role="presentation" onClick={onClose}>
      <div
        className="demo-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-panel-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="demo-eyebrow">Template demo</p>
        <h2 id="demo-panel-title">{title}</h2>
        <p>{body}</p>
        <p>
          Need the checkout, challenge engine, trader dashboard and payouts behind these buttons?
          PropSim runs the whole prop firm for you, on your own brand.
        </p>
        <div className="demo-panel-actions">
          <a className="demo-btn demo-btn-primary" href={PROPSIM_URL}>
            Launch your prop firm on PropSim
          </a>
          <button type="button" className="demo-btn" onClick={onClose}>
            Keep exploring
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoShell({
  templateId,
  children,
}: {
  templateId: string;
  children: (open: (href: string) => void) => ReactNode;
}) {
  const [href, setHref] = useState<string | null>(null);
  return (
    <div className="demo-shell">
      <DemoBar templateId={templateId} />
      <main className="demo-main">{children(setHref)}</main>
      {href && <DemoPanel href={href} onClose={() => setHref(null)} />}
    </div>
  );
}
