import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import { experience } from "../data/experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Experience() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".experience-card", start: "top 80%" },
          })
          .from(".experience-card", { y: 50, opacity: 0, duration: 0.8 })
          .from(".experience-point", { x: -30, opacity: 0, stagger: 0.15, duration: 0.6 }, "-=0.4")
          .from(".experience-tech", { y: 12, opacity: 0, stagger: 0.06, duration: 0.4 }, "-=0.2");
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} id="experience" className="scroll-mt-20 px-6 py-24 md:px-16">
      <SectionTitle eyebrow="Previously On" title="Experience" />

      {experience.map((job) => (
        <article
          key={job.id}
          className="experience-card rounded-xl border-l-4 border-accent bg-surface p-6 md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{job.period}</p>
          <h3 className="mt-2 font-display text-4xl md:text-5xl">{job.role}</h3>
          <p className="text-lg text-muted">{job.company}</p>
          <p className="mt-2 text-sm text-muted">{job.summary}</p>

          <ul className="mt-6 space-y-3">
            {job.points.map((point) => (
              <li key={point} className="experience-point flex gap-3 text-sm md:text-base">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {job.tech.map((item) => (
              <li
                key={item}
                className="experience-tech rounded-full border border-white/10 px-3 py-1 text-xs text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}