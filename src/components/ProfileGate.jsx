import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ProfileGate({ profiles, onSelect }) {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".gate-title", { y: 30, opacity: 0, duration: 0.8 })
          .from(".gate-profile", { y: 40, scale: 0.9, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.4")
          .from(".gate-note", { opacity: 0, duration: 0.6 }, "-=0.2");
      });
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 className="gate-title font-display text-6xl md:text-7xl">Who’s watching?</h1>

      <ul className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {profiles.map((profile) => (
          <li key={profile.id} className="gate-profile">
            <button
              type="button"
              onClick={() => onSelect(profile.id)}
              className="group flex w-32 flex-col items-center md:w-40"
            >
              <span
                className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-br ${profile.gradient} ring-white transition-[scale,box-shadow] duration-300 group-hover:scale-105 group-hover:ring-4 group-focus-visible:ring-4`}
              >
                {profile.image ? (
                  <img src={profile.image} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="font-display text-6xl">{profile.badge}</span>
                )}
              </span>
              <span className="mt-3 text-lg text-muted transition-colors group-hover:text-white">
                {profile.name}
              </span>
              <span className="mt-1 text-xs text-muted">{profile.description}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="gate-note mt-12 max-w-md text-sm text-muted">
        Every profile watches the same true story. It only changes what plays first.
      </p>
    </main>
  );
}