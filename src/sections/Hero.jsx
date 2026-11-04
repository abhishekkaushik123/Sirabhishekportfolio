import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../data/profile";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-photo", { x: 60, scale: 1.08, opacity: 0, filter: "blur(12px)", duration: 1.6 }, 0)
          .from(".hero-origin", { y: 20, opacity: 0, duration: 0.6 }, 0.3)
          .from(".hero-name", { y: 80, scale: 0.9, opacity: 0, duration: 1.2 }, 0.5)
          .from(".hero-series", { letterSpacing: "1.5em", opacity: 0, duration: 1 }, 1)
          .from(".hero-role", { y: 20, opacity: 0, duration: 0.6 }, 1.4)
          .from(".hero-pill", { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, 1.6)
          .from(".hero-tagline", { opacity: 0, duration: 0.8 }, 2)
          .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, 2.2);

        gsap.to(".hero-photo", {
          scale: 1.04,
          duration: 8,
          delay: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".hero-glow", {
          opacity: 0.45,
          scale: 1.15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden px-6 pb-12 pt-24 md:px-16 md:py-0"
    >
      <div className="grid w-full items-center gap-8 md:grid-cols-2">
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="hero-origin text-xs uppercase tracking-[0.4em] text-accent">
            {profile.originLabel}
          </p>

          <h1 className="hero-name font-display text-8xl uppercase leading-none md:text-[9rem]">
            {profile.firstName}
          </h1>

          <p className="hero-series text-sm uppercase tracking-[0.5em] text-accent">
            {profile.seriesLabel}
          </p>

          <p className="hero-role mt-6 text-xs uppercase tracking-[0.3em] text-muted">
            {profile.role}
          </p>

          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {profile.pills.map((pill) => (
              <li
                key={pill}
                className="hero-pill rounded-full border border-white/10 px-3 py-1 text-xs"
              >
                {pill}
              </li>
            ))}
          </ul>

          <p className="hero-tagline mt-6 font-serif text-xl italic text-muted">
            “{profile.tagline}”
          </p>

          <div className="hero-cta mt-8 flex justify-center gap-3 md:justify-start">
            <a
              href="#originals"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-night transition-colors hover:bg-white/80"
            >
              ▶ Watch Originals
            </a>
            <a
              href="#story"
              className="rounded-md bg-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/25"
            >
              ⓘ More Info
            </a>
          </div>
        </div>

        <div className="relative order-1 flex justify-center md:order-2 md:justify-end">
          <div
            className="hero-glow absolute inset-0 -z-10 m-auto h-4/5 w-4/5 rounded-full bg-accent/30 blur-3xl"
            aria-hidden="true"
          />
          <img
            src="/images/abhishek.webp"
            alt="Portrait of Abhishek Kaushik"
            width="847"
            height="757"
            className="hero-photo w-64 md:w-full md:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
}