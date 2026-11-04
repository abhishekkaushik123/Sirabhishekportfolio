import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import TiltCard from "../components/TiltCard";
import { characterFacts, pilotQuote } from "../data/about";
import { profile } from "../data/profile";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function About() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Split the quote into lines. autoSplit splits again if the width changes.
        SplitText.create(".pilot-quote", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.9,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: { trigger: ".pilot-quote", start: "top 80%" },
            }),
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".character-reveal", start: "top 80%" },
          })
          .from(".character-reveal", { y: 50, opacity: 0, duration: 0.8 })
          .from(".character-fact", { x: -30, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.4");
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} id="about" className="scroll-mt-20 px-6 py-24 md:px-16">
      <SectionTitle eyebrow="The Pilot" title="About Me" />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="pilot-quote font-serif text-2xl italic leading-snug md:text-3xl lg:text-4xl">
            “{pilotQuote}”
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-accent">
            {profile.firstName} {profile.lastName}
          </p>
        </div>

        <div className="character-reveal mx-auto w-full max-w-md">
          <TiltCard className="overflow-hidden rounded-xl border border-white/10 bg-surface">
            <div className="bg-linear-to-b from-accent/50 to-surface px-6 pt-6">
              <img
                src="/images/abhishek.webp"
                alt=""
                width="847"
                height="757"
                loading="lazy"
                className="mx-auto w-56"
              />
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Cast · Software Engineer</p>
              <h3 className="mt-2 font-display text-5xl leading-none">
                {profile.firstName} {profile.lastName}
              </h3>

              <dl className="mt-6 space-y-3">
                {characterFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="character-fact flex justify-between gap-4 border-b border-white/10 pb-3 text-sm"
                  >
                    <dt className="text-muted">{fact.label}</dt>
                    <dd className="text-right font-semibold">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}