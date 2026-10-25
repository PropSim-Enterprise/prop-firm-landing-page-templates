/**
 * Demo mode (DEMO_MODE in config.ts): a bar to switch templates and pages, and
 * a panel that explains what a form or legal link does on a live site.
 * Not used on a live site.
 */
import { type ReactNode, useState } from "react";
import { type StorefrontHost, TEMPLATE_MANIFESTS } from "../src";
import { LINKS } from "./config";
import "./demo.css";

const REPO_URL = "https://github.com/PropSim-Enterprise/prop-firm-landing-page-templates";
const PROPSIM_URL =
  "https://propsim.markets/?utm_source=github&utm_medium=template_demo&utm_campaign=prop-firm-landing-page-templates";

export type DemoPage = "landing" | "signup" | "signin";

/** The same links as a live site; internal links (legal pages) open the panel. */
export function demoHost(open: (href: string) => void): StorefrontHost {
  return {
    registerHref: LINKS.register,
    loginHref: () => LINKS.login,
    navigate: open,
    sameTab: true,
  };
}

interface Explanation {
  title: string;
  body: string;
}

const EXPLANATIONS: Record<string, Explanation> = {
  "/demo/signup-submit": {
    title: "This form creates the trader's account",
    body: "On your live site, the sign-up form posts to your backend (AUTH.signupAction in site/config.ts), which creates the account and takes the trader to checkout for the challenge they picked.",
  },
  "/demo/signin-submit": {
    title: "This form signs the trader in",
    body: "On your live site, the sign-in form posts to your backend (AUTH.signinAction in site/config.ts) and opens the trader's dashboard.",
  },
};

const LEGAL: Explanation = {
  title: "This link opens one of your legal pages",
  body: "On your live site, footer links go to your terms, privacy policy and risk disclosure. Set them in site/config.ts under LINKS.legal.",
};

/** Relative paths from the current page to the gallery and to each page of a template. */
function paths(page: DemoPage) {
  const toTemplates = page === "landing" ? "../" : "../../";
  const toTemplate = page === "landing" ? "./" : "../";
  return {
    gallery: `${toTemplates}../`,
    template: (id: string) => `${toTemplates}${id}/${page === "landing" ? "" : `${page}/`}`,
    page: (p: DemoPage) => `${toTemplate}${p === "landing" ? "" : `${p}/`}`,
  };
}

const PAGES: { id: DemoPage; label: string }[] = [
  { id: "landing", label: "Landing" },
  { id: "signup", label: "Sign up" },
  { id: "signin", label: "Sign in" },
];

function DemoBar({ templateId, page }: { templateId: string; page: DemoPage }) {
  const to = paths(page);
  return (
    <header className="demo-bar">
      <a className="demo-back" href={to.gallery}>
        <span aria-hidden="true">←</span> <span className="demo-wide">All templates</span>
      </a>
      <select
        aria-label="Template"
        className="demo-select"
        value={templateId}
        onChange={(e) => window.location.assign(to.template(e.target.value))}
      >
        {TEMPLATE_MANIFESTS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <nav className="demo-pages" aria-label="Pages">
        {PAGES.map((p) => (
          <a key={p.id} href={to.page(p.id)} aria-current={p.id === page ? "page" : undefined}>
            {p.label}
          </a>
        ))}
      </nav>
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
  const { title, body } = EXPLANATIONS[href] ?? LEGAL;
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
          Need the accounts, checkout, challenge engine, trader dashboard and payouts behind these
          pages? PropSim runs the whole prop firm for you, on your own brand.
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
  page = "landing",
  children,
}: {
  templateId: string;
  page?: DemoPage;
  children: (open: (href: string) => void) => ReactNode;
}) {
  const [href, setHref] = useState<string | null>(null);
  return (
    <div className="demo-shell">
      <DemoBar templateId={templateId} page={page} />
      <main className="demo-main">{children(setHref)}</main>
      {href && <DemoPanel href={href} onClose={() => setHref(null)} />}
    </div>
  );
}
