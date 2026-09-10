import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-forest border-border border-t px-6 py-10">
      <div className="text-cream mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-cream mb-1 text-base">{APP_NAME}</p>
          <p className="text-cream/75 text-sm">{APP_TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-5">
          {FOOTER_LINKS.map(({ label, to }) =>
            to ? (
              <Link
                key={label}
                to={to}
                className="focus-visible:outline-primary-accent rounded-sm text-sm no-underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {label}
              </Link>
            ) : (
              <span key={label} className="text-cream/75 text-sm" title="Coming soon">
                {label}
              </span>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
