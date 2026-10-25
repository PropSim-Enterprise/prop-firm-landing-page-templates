import { type RefObject, useCallback, useEffect, useId, useRef, useState } from "react";
import { SfLink, useHost, useScrollToSection } from "./runtime";

/**
 * The phone menu every template's nav carries below its wide breakpoint: the
 * page's sections plus Sign in, in a panel that drops under the header. The
 * behaviour is shared; each template passes its own classes.
 *
 * The header must be positioned (the templates' sticky headers are), because
 * the panel is placed at `top-full` of it.
 */
export interface MobileMenuStyle {
  /** The round toggle button. */
  button: string;
  /** The dropped panel (background, border, padding). */
  panel: string;
  /** One section link row. */
  link: string;
  /** The Sign in button at the bottom of the panel. */
  signIn: string;
}

function Icon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
      {open ? (
        <path
          d="M5 5l10 10M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 6h14M3 10h14M3 14h14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function useEscapeToClose(
  open: boolean,
  close: () => void,
  toggle: RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, toggle]);
}

export function MobileMenu({
  links,
  style,
}: {
  links: [string, string][];
  style: MobileMenuStyle;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const host = useHost();
  const scrollTo = useScrollToSection();
  const close = useCallback(() => setOpen(false), []);
  useEscapeToClose(open, close, toggle);
  const go = (section: string) => {
    close();
    scrollTo(section);
  };
  return (
    <div className="@lg:hidden">
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className={style.button}
      >
        <Icon open={open} />
      </button>
      {open && (
        <div id={panelId} className={`absolute inset-x-0 top-full ${style.panel}`}>
          <ul>
            {links.map(([section, label]) => (
              <li key={section}>
                <button type="button" onClick={() => go(section)} className={style.link}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <SfLink href={host.loginHref()} onClick={close} className={style.signIn}>
            Sign in
          </SfLink>
        </div>
      )}
    </div>
  );
}
