/**
 * Sign-up and sign-in pages: each template's own frame around a simple form.
 * The page is <html data-template="…" data-page="signup|signin">.
 */
import { type CSSProperties, type FormEvent, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  buildStorefrontView,
  money,
  StorefrontAuthFrame,
  type StorefrontView,
  templateManifest,
} from "../src";
import "../src/styles.css";
import "./auth.css";
import { AUTH, DEMO_MODE, FIRM, LINKS, PRODUCTS, STOREFRONT } from "./config";
import { DemoShell } from "./demo";

type AuthPage = "signup" | "signin";

const root = document.documentElement;
const templateId = root.dataset.template ?? "onyx";
const page: AuthPage = root.dataset.page === "signin" ? "signin" : "signup";
const view: StorefrontView = buildStorefrontView({
  firm: FIRM,
  products: PRODUCTS,
  config: STOREFRONT,
});
const productId = new URLSearchParams(window.location.search).get("product") ?? undefined;
const product = PRODUCTS.find((p) => p.id === productId);

/** Light accents (gold, lime, amber, near-white) need dark text on the button. */
function inkFor(hex: string): string {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150 ? "#111111" : "#ffffff";
}

const accent = templateManifest(templateId)?.formAccent ?? "#3b6cff";
const accentStyle = {
  "--af-accent": accent,
  "--af-accent-ink": inkFor(accent),
} as CSSProperties;

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
}) {
  return (
    <label className="af-field">
      <span>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required />
    </label>
  );
}

function ChosenChallenge() {
  if (!product) return null;
  return (
    <p className="af-chosen">
      <span>{product.name}</span>
      <strong>{money(product.price, product.currency)}</strong>
    </p>
  );
}

function SignUpFields() {
  return (
    <>
      <ChosenChallenge />
      <div className="af-row">
        <Field label="First name" name="firstName" autoComplete="given-name" />
        <Field label="Last name" name="lastName" autoComplete="family-name" />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" />
      <Field label="Country" name="country" autoComplete="country-name" />
      <label className="af-check">
        <input type="checkbox" name="terms" required />
        <span>
          I agree to the <a href={LINKS.legal["terms-of-service"] ?? "#"}>Terms of Service</a> and{" "}
          <a href={LINKS.legal["privacy-policy"] ?? "#"}>Privacy Policy</a>.
        </span>
      </label>
    </>
  );
}

function SignInFields() {
  return (
    <>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="current-password" />
      <a className="af-forgot" href={AUTH.forgotPasswordUrl}>
        Forgot your password?
      </a>
    </>
  );
}

function AuthForm({ onDemoSubmit }: { onDemoSubmit?: () => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    if (!onDemoSubmit) return;
    e.preventDefault();
    onDemoSubmit();
  };
  const action = page === "signup" ? AUTH.signupAction : AUTH.signinAction;
  return (
    <form className="af-form" style={accentStyle} action={action} method="post" onSubmit={submit}>
      {product && <input type="hidden" name="product" value={product.id} />}
      {page === "signup" ? <SignUpFields /> : <SignInFields />}
      <button type="submit" className="af-submit">
        {page === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}

const COPY: Record<AuthPage, { title: string; subtitle: string }> = {
  signup: {
    title: "Create your account",
    subtitle: "Start your challenge in a couple of minutes.",
  },
  signin: { title: "Welcome back", subtitle: "Sign in to your trader dashboard." },
};

/** A link to the sibling page (sign-in ↔ sign-up), built with the same template. */
function Switch() {
  return page === "signup" ? (
    <>
      Already have an account? <a href="../signin/">Sign in</a>
    </>
  ) : (
    <>
      New here? <a href="../signup/">Create an account</a>
    </>
  );
}

function Page({ onDemoSubmit }: { onDemoSubmit?: () => void }) {
  return (
    <StorefrontAuthFrame
      templateId={templateId}
      brand={view.firm}
      title={COPY[page].title}
      subtitle={COPY[page].subtitle}
      footer={<Switch />}
    >
      <AuthForm onDemoSubmit={onDemoSubmit} />
    </StorefrontAuthFrame>
  );
}

function Demo() {
  return (
    <DemoShell templateId={templateId} page={page}>
      {(open) => (
        <div className="af-scroll">
          <Page onDemoSubmit={() => open(`/demo/${page}-submit`)} />
        </div>
      )}
    </DemoShell>
  );
}

function Live() {
  return (
    <div className="af-scroll" style={{ height: "100dvh" }}>
      <Page />
    </div>
  );
}

const app = document.getElementById("app");
if (app) {
  createRoot(app).render(<StrictMode>{DEMO_MODE ? <Demo /> : <Live />}</StrictMode>);
}
