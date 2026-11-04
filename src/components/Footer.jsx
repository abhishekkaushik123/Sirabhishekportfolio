import { profile } from "../data/profile";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 md:px-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          © {year} {profile.firstName} {profile.lastName} · Built with React & Tailwind
        </p>

        <ul className="flex gap-6 text-sm">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="text-muted transition-colors hover:text-white"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </li>
          {profile.github && (
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition-colors hover:text-white"
              >
                GitHub
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}