import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionTitle from "../components/SectionTitle";
import { scenes, stats } from "../data/story";
import { profile } from "../data/profile";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Story() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".story-line", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: ".story-script", start: "top 75%" },
        });

        gsap.from(".story-stat", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".story-stats", start: "top 80%" },
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} id="story" className="scroll-mt-20 px-6 py-24 md:px-16">
      <SectionTitle eyebrow="The Screenplay" title="The Full Story" />

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="story-script rounded-xl border border-white/10 bg-surface p-6 font-mono text-sm leading-relaxed md:p-10 lg:col-span-2">
          <p className="story-line text-muted">FADE IN:</p>

          {scenes.map((scene) => (
            <div key={scene.id} className="story-line mt-8">
              <p className="font-bold uppercase text-accent">{scene.heading}</p>
              <p className="mt-2 text-white/85">{scene.action}</p>
            </div>
          ))}

          <div className="story-line mt-10 text-center">
            <p className="font-bold uppercase">{profile.firstName} (V.O.)</p>
            <p className="mt-1 italic text-white/85">{profile.tagline}</p>
          </div>

          <p className="story-line mt-10 text-right text-muted">TO BE CONTINUED…</p>
        </article>

        <aside className="story-stats grid grid-cols-2 gap-4 self-start">
          {stats.map((stat) => (
            <div key={stat.id} className="story-stat rounded-xl bg-surface p-5">
              <p className="font-display text-5xl leading-none text-accent">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            </div>
          ))}

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="story-stat col-span-2 rounded-md bg-white px-6 py-3 text-center text-sm font-semibold text-night transition-colors hover:bg-white/80"
          >
            Connect on LinkedIn ↗
          </a>
        </aside>
      </div>
    </section>
  );
}