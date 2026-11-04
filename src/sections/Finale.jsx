import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { profile } from "../data/profile";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Finale() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = SplitText.create(".finale-title", { type: "chars" });

        // scrub ties the letters to the scrollbar, so scrolling back un-builds them.
        gsap.from(title.chars, {
          yPercent: 60,
          scale: 0.5,
          opacity: 0,
          stagger: 0.06,
          ease: "power2.out",
          transformOrigin: "50% 100%",
          scrollTrigger: {
            trigger: ".finale-title",
            start: "top 90%",
            end: "top 30%",
            scrub: 0.5,
          },
        });

        // The contact buttons play once, so they can never stay half hidden.
        gsap.from(".finale-cta", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".finale-actions", start: "top 95%" },
        });
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      id="contact"
      className="flex min-h-svh scroll-mt-20 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <h2 className="finale-title font-display text-[20vw] uppercase leading-[0.9] text-accent md:text-[16vw]">
        <span className="block">To Be</span>{" "}
        <span className="block">Continued…</span>
      </h2>

      <div className="finale-actions mt-8">
        <p className="finale-cta font-serif text-3xl italic md:text-4xl">Let's build something.</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="finale-cta rounded-md bg-white px-6 py-3 text-sm font-semibold text-night transition-colors hover:bg-white/80"
          >
            Email Me
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="finale-cta rounded-md bg-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/25"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="finale-cta rounded-md bg-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/25"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}