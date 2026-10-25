/**
 * The disclaimer every template's footer carries. Templates choose the colours
 * and type through the class names, never the words.
 *
 * REPLACE THIS TEXT WITH YOUR OWN. It is a neutral starting point for a firm
 * that sells simulated trading evaluations, not legal advice. Have a lawyer
 * review the wording for the countries you sell into.
 */

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Simulated Trading",
    body: [
      "All trading accounts offered on this website are simulated accounts used for evaluation and educational purposes. They do not involve real capital, and trades are not placed on a live market.",
      "Simulated trading results have inherent limitations and do not represent actual trading performance. No representation is made that any account will achieve profits or losses similar to those shown.",
    ],
  },
  {
    title: "No Financial Advice",
    body: [
      "Nothing on this website is financial, investment, legal or tax advice, or a recommendation to engage in any trading activity. Trading leveraged products carries a high level of risk.",
    ],
  },
  {
    title: "Jurisdiction Restrictions",
    body: [
      "Our services may not be available in jurisdictions where proprietary trading programs are restricted or prohibited by law. You are responsible for complying with your local regulations.",
    ],
  },
  {
    title: "Legal Documents",
    body: [
      "Please read our Terms of Service, Privacy Policy and Risk Disclosure before purchasing an evaluation. By using this website you accept these documents.",
    ],
  },
];

/**
 * A one-line credit under the disclaimer. It is optional: set this to false to
 * remove it. Keeping it is a free way to say thanks.
 */
const SHOW_TEMPLATE_CREDIT = true;
const CREDIT_URL =
  "https://propsim.markets/?utm_source=github&utm_medium=template_footer&utm_campaign=prop-firm-landing-page-templates";

export function Disclaimer({
  className = "",
  titleClassName = "",
  bodyClassName = "",
}: {
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={className}>
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <p className={titleClassName}>{s.title}</p>
          {s.body.map((p) => (
            <p key={p.slice(0, 24)} className={bodyClassName}>
              {p}
            </p>
          ))}
        </div>
      ))}
      {SHOW_TEMPLATE_CREDIT && (
        <p className={bodyClassName}>
          Landing page template by{" "}
          <a href={CREDIT_URL} style={{ textDecoration: "underline" }}>
            PropSim prop firm software
          </a>
          .
        </p>
      )}
    </div>
  );
}
