import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import { seasons } from "../data/journey";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Journey() {
  const [activeId, setActiveId] = useState(seasons[0].id);
  const container = useRef(null);
  const previousIndex = useRef(0);

  const activeIndex = seasons.findIndex((season) => season.id === activeId);
  const activeSeason = seasons[activeIndex];

  // The season tabs rise in once, when the section scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".season-tab", {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".season-tabs", start: "top 85%" },
        });
      });
    },
    { scope: container },
  );

  // A later season slides in from the right, an earlier one from the left.
  useGSAP(
    () => {
      const direction = activeIndex >= previousIndex.current ? 1 : -1;
      previousIndex.current = activeIndex;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".season-reveal", {
          x: 50 * direction,
          opacity: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
        });
      });
    },
    { scope: container, dependencies: [activeId], revertOnUpdate: true },
  );

  // Arrow keys, Home and End move between tabs, as screen reader users expect.
  const handleKeyDown = (event) => {
    const last = seasons.length - 1;
    const targets = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];

    if (next === undefined) return;

    event.preventDefault();
    setActiveId(seasons[next].id);
    event.currentTarget.children[next].focus();
  };

  return (
    <section ref={container} id="journey" className="scroll-mt-20 overflow-hidden px-6 py-24 md:px-16">
      <SectionTitle eyebrow={`${seasons.length} Seasons`} title="My Journey" />

      <div
        role="tablist"
        aria-label="Seasons"
        onKeyDown={handleKeyDown}
        className="season-tabs -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"
      >
        {seasons.map((season) => {
          const selected = season.id === activeId;

          return (
            <button
              key={season.id}
              id={`season-tab-${season.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="season-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(season.id)}
              className={`season-tab shrink-0 cursor-pointer border-b-2 px-3 py-2 text-left transition-colors ${
                selected ? "border-accent text-white" : "border-white/10 text-muted hover:text-white"
              }`}
            >
              <span className="block font-display text-3xl leading-none">{season.number}</span>
              <span className="mt-1 block whitespace-nowrap text-xs md:whitespace-normal">
                {season.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="season-panel"
        role="tabpanel"
        aria-labelledby={`season-tab-${activeSeason.id}`}
        className={`mt-8 rounded-xl border-l-4 bg-surface p-6 md:min-h-80 md:p-10 ${
          activeSeason.upcoming ? "border-dashed border-muted" : "border-accent"
        }`}
      >
        <p className="season-reveal text-xs uppercase tracking-[0.3em] text-accent">
          {activeSeason.period}
        </p>
        <h3 className="season-reveal mt-2 font-display text-5xl">{activeSeason.title}</h3>

        <ol className="mt-6 space-y-4">
          {activeSeason.episodes.map((episode, index) => (
            <li key={episode} className="season-reveal flex gap-4">
              <span className="font-display text-2xl leading-6 text-muted">E{index + 1}</span>
              <span>{episode}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}