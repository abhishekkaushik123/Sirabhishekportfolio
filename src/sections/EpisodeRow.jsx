import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { episodes } from "../data/episodes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function EpisodeRow() {
  const container = useRef(null);
  const row = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".episode-card", {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 85%" },
        });
      });
    },
    { scope: container },
  );

  const scrollRow = (direction) => {
    row.current.scrollBy({
      left: direction * row.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section ref={container} aria-label="Continue exploring" className="px-6 pb-8 md:px-16">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold">Continue Exploring</h2>

        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollRow(-1)}
            aria-label="Scroll episodes left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-lg transition-colors hover:bg-white/10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollRow(1)}
            aria-label="Scroll episodes right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-lg transition-colors hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={row}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-4 [scrollbar-width:none] md:-mx-16 md:scroll-px-16 md:px-16"
      >
        {episodes.map((episode) => (
          <a
            key={episode.id}
            href={episode.href}
            className={`episode-card group relative aspect-video w-72 shrink-0 snap-start overflow-hidden rounded-lg bg-linear-to-br ${episode.gradient} transition-[scale] duration-300 hover:z-10 hover:scale-105 md:w-80`}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-[10px] transition-colors group-hover:bg-white group-hover:text-night">
              ▶
            </span>

            <div className="absolute inset-x-0 bottom-3 px-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Episode {episode.number}
              </p>
              <h3 className="font-display text-3xl leading-none">{episode.title}</h3>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <div className="h-full bg-accent" style={{ width: `${episode.progress}%` }} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}