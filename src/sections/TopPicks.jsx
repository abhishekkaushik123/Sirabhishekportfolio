import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import { topPicks } from "../data/topPicks";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function TopPicks() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pick-reveal", {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pick-row", start: "top 80%" },
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} id="picks" className="scroll-mt-20 py-24">
      <div className="px-6 md:px-16">
        <SectionTitle eyebrow="Top Picks" title="Top 5 For You" />
      </div>

      <ol className="pick-row flex gap-4 overflow-x-auto px-6 py-6 [scrollbar-width:none] md:px-16">
        {topPicks.map((pick, index) => (
          <li key={pick.id} className="pick-reveal shrink-0">
            <a href={pick.href} className="group flex items-end">
              <span
                aria-hidden="true"
                className="font-display text-[11rem] leading-[0.8] text-transparent transition-colors [-webkit-text-stroke:2px_var(--color-muted)] group-hover:text-accent"
              >
                {index + 1}
              </span>

              <div
                className={`relative -ml-3 flex h-64 w-44 flex-col rounded-lg bg-surface bg-linear-to-b ${pick.color} to-70% p-4 transition-transform duration-300 group-hover:scale-105`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">{pick.label}</p>
                <h3 className="mt-auto font-display text-3xl leading-none">{pick.title}</h3>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}