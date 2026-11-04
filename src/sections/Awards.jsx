import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Laurel from "../components/Laurel";
import SectionTitle from "../components/SectionTitle";
import TiltCard from "../components/TiltCard";
import { awards, education } from "../data/credentials";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Awards() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".award-reveal", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".award-grid", start: "top 80%" },
        });

        gsap.from(".education-row", {
          x: -30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".education-list", start: "top 85%" },
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} id="awards" className="scroll-mt-20 px-6 py-24 md:px-16">
      <SectionTitle eyebrow="Awards & Credentials" title="Achievements" />

      <div className="award-grid grid gap-6 md:grid-cols-3">
        {awards.map((award) => (
          <div key={award.id} className="award-reveal">
            <TiltCard className="h-full rounded-xl border border-gold/40 bg-surface p-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Laurel />
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{award.type}</p>
                <Laurel flip />
              </div>
              <h3 className="mt-3 font-display text-4xl text-gold">{award.title}</h3>
              <p className="mt-2 text-sm text-muted">{award.detail}</p>
            </TiltCard>
          </div>
        ))}
      </div>

      <h3 className="mt-16 font-display text-3xl">Education</h3>
      <ul className="education-list mt-4 space-y-4">
        {education.map((item) => (
          <li
            key={item.id}
            className="education-row flex flex-col justify-between gap-1 border-b border-white/10 pb-4 md:flex-row"
          >
            <div>
              <p className="font-semibold">{item.degree}</p>
              <p className="text-sm text-muted">{item.school}</p>
            </div>
            <p className="text-sm text-accent">{item.period}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}