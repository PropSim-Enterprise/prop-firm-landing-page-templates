import plugin from "tailwindcss/plugin";

/**
 * Templates are compiled with THIS config, never an app's (styles.css points
 * here with @config), so neither app's theme can change how a template looks.
 *
 * - Every utility is scoped under `.sf-root`, which also lifts it above the
 *   apps' own unscoped utilities and element rules.
 * - There are no viewport breakpoints. Templates respond to the width of the
 *   storefront itself through `@sm: @md: @lg: @xl:` container variants, so the
 *   back office's phone-width preview really shows the phone layout. Never use
 *   `sm:`/`md:`/`lg:` in a template: an app's media-query rule of the same name
 *   would leak in (a test enforces this).
 */
const CONTAINER_WIDTHS = { sm: "40rem", md: "48rem", lg: "64rem", xl: "80rem" };

/**
 * Palette tokens for templates that ship in more than one colour scheme (Onyx
 * and Onyx Light share every component). Each is an "r g b" CSS variable set by
 * the template's root class, so opacity modifiers like `bg-onyx-accent/10` work.
 */
const tokens = (prefix, names) =>
  Object.fromEntries(names.map((n) => [n, `rgb(var(--${prefix}-${n}) / <alpha-value>)`]));

export default {
  // Touch screens must not keep a tapped element in its hover state.
  future: { hoverOnlyWhenSupported: true },
  content: { relative: true, files: ["./src/**/*.{ts,tsx}"] },
  important: ".sf-root",
  corePlugins: { preflight: false, container: false },
  theme: {
    screens: {},
    extend: {
      colors: {
        onyx: tokens("o", [
          "bg",
          "fg",
          "ink",
          "muted",
          "faint",
          "soft",
          "strong",
          "surface",
          "primary",
          "onprimary",
          "primaryhover",
          "accent",
        ]),
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      for (const [name, width] of Object.entries(CONTAINER_WIDTHS)) {
        addVariant(`@${name}`, `@container sf (min-width: ${width})`);
      }
    }),
  ],
};
