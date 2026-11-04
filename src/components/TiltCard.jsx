import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function TiltCard({ children, className = "" }) {
  const card = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = card.current;
      gsap.set(el, { transformPerspective: 800 });

      const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
      const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

      const onEnter = () => gsap.to(el, { scale: 1.03, duration: 0.4, ease: "power3.out" });

      const onMove = (event) => {
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;

        rotateY(x * 20);
        rotateX(-y * 20);
        el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
      };

      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        gsap.to(el, { scale: 1, duration: 0.4, ease: "power3.out" });
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  return (
    <article ref={card} className={`group relative ${className}`}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgba(255,255,255,0.2),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </article>
  );
}