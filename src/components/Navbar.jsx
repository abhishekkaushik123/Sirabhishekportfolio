import { useEffect, useState } from "react";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#originals", label: "Originals" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#awards", label: "Awards" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ viewer, onSwitchProfile }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-night/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-night to-transparent"
      />

      <nav className="flex items-center justify-between px-6 py-4 md:px-16">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-4xl text-accent">A</span>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Series
          </span>
        </a>

        <div className="flex items-center gap-4 lg:gap-8">
          <ul className="hidden gap-4 text-sm md:flex lg:gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onSwitchProfile}
            aria-label={`Watching as ${viewer.name}. Switch profile`}
            title="Switch profile"
            className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-linear-to-br ${viewer.gradient} text-xs font-bold ring-white transition-shadow hover:ring-2`}
          >
            {viewer.image ? (
              <img
                src={viewer.image}
                alt=""
                className="h-full w-full object-cover object-top"
              />
            ) : (
              viewer.badge
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
