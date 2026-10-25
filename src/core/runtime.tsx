import {
  type AnchorHTMLAttributes,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { StorefrontHost } from "./types";

/**
 * The runtime every template renders inside: the host's links, the scroll
 * container, and reveal-on-scroll. Templates never touch `window` scrolling,
 * global ids or the URL hash, so several can render on one back-office page.
 */

const INERT_HOST: StorefrontHost = { registerHref: () => "#", loginHref: () => "#", inert: true };

const HostContext = createContext<StorefrontHost>(INERT_HOST);
const RootContext = createContext<RefObject<HTMLDivElement | null>>({ current: null });

export const useHost = () => useContext(HostContext);

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

/** An anchor that follows the host's rules: client navigation live, inert in previews. */
export function SfLink({
  href,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const host = useHost();
  const external = !isInternal(href);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (host.inert) return e.preventDefault();
    if (!external && host.navigate) {
      e.preventDefault();
      host.navigate(href);
    }
  };
  return (
    <a
      href={href}
      onClick={handle}
      {...(external && !host.sameTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    />
  );
}

/** Offset of `el` from the top of the storefront's own scroller, in layout pixels. */
function offsetWithin(root: HTMLElement, el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/** Scrolls the storefront (not the page around it) to a `data-sf-section`. */
export function useScrollToSection() {
  const rootRef = useContext(RootContext);
  return useCallback(
    (name: string) => {
      const root = rootRef.current;
      const el = root?.querySelector<HTMLElement>(`[data-sf-section="${name}"]`);
      if (!root || !el) return;
      root.scrollTo({ top: Math.max(offsetWithin(root, el) - 72, 0), behavior: "smooth" });
    },
    [rootRef],
  );
}

/** Fades an element in the first time it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const rootRef = useContext(RootContext);
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.setAttribute("data-sf-shown", "");
        io.disconnect();
      },
      { root: rootRef.current, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef]);
  return ref;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`sf-reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** True once the storefront has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 8) {
  const rootRef = useContext(RootContext);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onScroll = () => setScrolled(root.scrollTop > threshold);
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [rootRef, threshold]);
  return scrolled;
}

export interface StorefrontRootProps {
  host: StorefrontHost;
  templateId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * The scroll container and style scope. `--sf-vh` is the height a "full
 * screen" section should use: the viewport on the live site, the frame height
 * in a preview (set it through `style`).
 */
export function StorefrontRoot({
  host,
  templateId,
  children,
  className = "",
  style,
}: StorefrontRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);
  useEffect(() => setMotion(typeof IntersectionObserver !== "undefined"), []);
  return (
    <HostContext.Provider value={host}>
      <RootContext.Provider value={ref}>
        <div
          ref={ref}
          className={`sf-root sf-${templateId} ${className}`}
          data-sf-motion={motion ? "" : undefined}
          style={style}
        >
          {children}
        </div>
      </RootContext.Provider>
    </HostContext.Provider>
  );
}

/** A frame for the sign-up and sign-in pages: same scope, no scrolling rules. */
export function StorefrontScope({
  templateId,
  children,
}: {
  templateId: string;
  children: ReactNode;
}) {
  return <div className={`sf-root sf-${templateId}`}>{children}</div>;
}
