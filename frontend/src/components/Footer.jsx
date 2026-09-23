import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import Logo from "../components/Logo";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { label: "Home", to: "/home" },
    { label: "About", to: "/about" },
    { label: "Create Post", to: "/create-post" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      {/* Premium ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/[0.035] blur-[100px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* ───────────── Main Footer ───────────── */}
        <div className="grid gap-12 py-16 md:grid-cols-[1fr_auto] md:items-start">
          {/* Brand */}
          <div className="max-w-[520px]">
            <Logo size={40} />

            <p className="mt-6 max-w-[430px] text-sm leading-7 text-[var(--color-text-secondary)]">
              A quiet place for ideas, stories, and things worth remembering.
              Write freely. Share thoughtfully.
            </p>

            {/* Personal signature */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-[var(--color-border)]" />

              <span className="text-xs text-[var(--color-text-muted)]">
                Built with
              </span>

              <span className="text-sm">❤️</span>

              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Gobinda Gagan Dey
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:min-w-[170px]">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={13} className="text-[var(--color-accent)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Explore
              </span>
            </div>

            <nav className="flex flex-col gap-3.5">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group flex w-fit items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
                >
                  {link.label}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ───────────── Signature Section ───────────── */}
        <div className="relative border-t border-[var(--color-border)] py-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              A personal project by
            </p>

            <a
              href="https://gobinda-gagan-dey.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <h3 className="mt-3 underline text-xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-2xl hover:underline cursor-pointer">
                Gobinda Gagan Dey
                <span className="ml-2">❤️</span>
              </h3>
            </a>

            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Software Developer · India
            </p>
          </div>
        </div>

        {/* ───────────── Bottom Bar ───────────── */}
        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            © {year} TechFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              aria-label="Back to top"
              className="group flex items-center gap-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Back to top
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--color-text-muted)] group-hover:bg-[var(--color-bg-hover)]">
                <ArrowUp
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
