import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import TiltCard from "../components/TiltCard";
import { useProjects } from "../hooks/useProjects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const posterColors = {
  eventora: "from-purple-700",
  "cold-email": "from-rose-700",
  irrigation: "from-emerald-700",
  "student-tracker": "from-amber-600",
};

export default function Originals() {
  const projects = useProjects();
  const container = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Computers: pin the section and let scrolling down move the posters sideways.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () =>
          Math.max(0, track.current.offsetWidth - viewport.current.clientWidth);

        gsap.set(viewport.current, { overflow: "hidden" });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ".originals-pin",
              start: "top top",
              end: () => `+=${distance() * 2}`,
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(track.current, { x: () => -distance() }, 0)
          .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1 }, 0);
      });

      // Phones and reduced motion: a normal swipeable row that still fills the bar.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        const row = viewport.current;

        const updateBar = () => {
          const scrollable = row.scrollWidth - row.clientWidth;
          gsap.set(bar.current, { scaleX: scrollable > 0 ? row.scrollLeft / scrollable : 1 });
        };

        updateBar();
        row.addEventListener("scroll", updateBar, { passive: true });

        return () => row.removeEventListener("scroll", updateBar);
      });

      // The number of posters changes the page height, so re-measure everything below.
      ScrollTrigger.refresh();
    },
    { scope: container, dependencies: [projects], revertOnUpdate: true },
  );

  return (
    <section ref={container} id="originals" className="scroll-mt-20 md:scroll-mt-0">
      <div className="originals-pin flex flex-col py-24 md:h-screen md:justify-center md:py-0 md:pt-16">
        <div className="px-6 md:px-16">
          <SectionTitle eyebrow="Originals" title="My Projects" />
        </div>

        <div
          ref={viewport}
          className="snap-x snap-mandatory scroll-px-6 overflow-x-auto [scrollbar-width:none]"
        >
          <div ref={track} className="flex w-max gap-6 px-6 py-4 md:px-16">
            {projects.map((project) => (
              <div
                key={project.id}
                className="h-[26rem] w-[78vw] shrink-0 snap-start md:h-[55vh] md:w-[max(30vw,22rem)]"
              >
                <TiltCard
                  className={`flex h-full flex-col rounded-xl bg-surface bg-linear-to-b ${posterColors[project.id] ?? "from-sky-700"} to-60% p-6`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                    A Original
                  </p>

                  <div className="mt-auto">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                      {project.tagline}
                    </p>
                    <h3 className="mt-2 font-display text-4xl md:text-5xl">{project.title}</h3>
                    <p className="mt-3 text-sm text-muted">{project.description}</p>
                    <p className="mt-4 text-xs text-muted">{project.tech.join(" · ")}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="mx-6 mt-4 h-1 rounded-full bg-white/10 md:mx-16">
          <div ref={bar} className="h-full origin-left rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}