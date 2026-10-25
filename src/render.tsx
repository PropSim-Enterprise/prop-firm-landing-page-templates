import { type ComponentType, type CSSProperties, lazy, type ReactNode, Suspense } from "react";
import { StorefrontRoot, StorefrontScope } from "./core/runtime";
import type {
  AuthFrameProps,
  LandingProps,
  StorefrontHost,
  StorefrontView,
  TemplateModule,
} from "./core/types";
import { loadTemplate } from "./registry";

const parts = new Map<string, unknown>();

/** One lazy component per template part, created once and reused. */
function lazyPart<P extends object>(id: string, part: keyof TemplateModule): ComponentType<P> {
  const key = `${id}:${part}`;
  const existing = parts.get(key) as ComponentType<P> | undefined;
  if (existing) return existing;
  const component = lazy(() =>
    loadTemplate(id).then((m) => ({ default: m[part] as unknown as ComponentType<P> })),
  );
  parts.set(key, component);
  return component;
}

export interface StorefrontLandingProps {
  templateId: string;
  view: StorefrontView;
  host: StorefrontHost;
  fallback?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** A firm's landing page in the chosen template. Fills its parent; scrolls itself. */
export function StorefrontLanding({
  templateId,
  view,
  host,
  fallback = null,
  className,
  style,
}: StorefrontLandingProps) {
  const Landing = lazyPart<LandingProps>(templateId, "Landing");
  return (
    <StorefrontRoot host={host} templateId={templateId} className={className} style={style}>
      <Suspense fallback={fallback}>
        <Landing view={view} />
      </Suspense>
    </StorefrontRoot>
  );
}

/** The sign-up / sign-in frame of the chosen template, around the host's own form. */
export function StorefrontAuthFrame({
  templateId,
  ...props
}: AuthFrameProps & { templateId: string }) {
  const Frame = lazyPart<AuthFrameProps>(templateId, "AuthFrame");
  return (
    <StorefrontScope templateId={templateId}>
      <Suspense fallback={null}>
        <Frame {...props} />
      </Suspense>
    </StorefrontScope>
  );
}
