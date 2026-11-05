import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import { skillGenres } from "../data/skills";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Skills() {
  const [activeId, setActiveId] = useState(skillGenres[0].id);
  const container = useRef(null);

  const activeIndex = skillGenres.findIndex((genre) => genre.id === activeId);
  const activeGenre = skillGenres[activeIndex];

  // The genre list slides in once, when the section scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".skill-tab", {
          x: -30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".skill-tabs", start: "top 85%" },
        });
      });
    },
    { scope: container },
  );

  // The tiles pop in again every time activeId changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".skill-tile", {
          y: 24,
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        });
      });
    },
    { scope: container, dependencies: [activeId], revertOnUpdate: true },
  );

  // Arrow keys, Home and End move between tabs, as screen reader users expect.
  const handleKeyDown = (event) => {
    const last = skillGenres.length - 1;
    const targets = {
      ArrowDown: activeIndex === last ? 0 : activeIndex + 1,
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowUp: activeIndex === 0 ? last : activeIndex - 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];

    if (next === undefined) return;

    event.preventDefault();
    setActiveId(skillGenres[next].id);
    event.currentTarget.children[next].focus();
  };

  return (
    <section ref={container} id="skills" className="scroll-mt-20 px-6 py-24 md:px-16">
      <SectionTitle eyebrow="Genres" title="My Skill Universe" />

      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
        <div
          role="tablist"
          aria-label="Skill genres"
          onKeyDown={handleKeyDown}
          className="skill-tabs -mx-6 flex shrink-0 gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:w-60 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0"
        >
          {skillGenres.map((genre) => {
            const selected = genre.id === activeId;

            return (
              <button
                key={genre.id}
                id={`skill-tab-${genre.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="skill-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(genre.id)}
                className={`skill-tab shrink-0 cursor-pointer whitespace-nowrap rounded-md border-l-4 px-4 py-2 text-left font-display text-2xl transition-colors ${
                  selected
                    ? "border-accent bg-surface text-white"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>

        <div
          id="skill-panel"
          role="tabpanel"
          aria-labelledby={`skill-tab-${activeGenre.id}`}
          className="min-h-80 flex-1 md:min-h-0"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            {activeGenre.skills.length} skills
          </p>

          <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {activeGenre.skills.map((skill) => (
              <li
                key={skill}
                className="skill-tile rounded-xl border border-white/10 bg-surface p-5 text-center font-semibold"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}