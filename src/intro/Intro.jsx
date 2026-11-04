import { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../data/profile";
import font from "./helvetiker_bold.typeface.json";

gsap.registerPlugin(useGSAP);

// The 3D part: the name as extruded letters, a camera that flies in, and a red light sweeping across.
function Scene({ onFinish }) {
  const group = useRef(null);
  const sweep = useRef(null);
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);

  // Size the word to about 65% of the visible width, so it fits on any screen.
  const visibleWidth = 2 * 7 * Math.tan((20 * Math.PI) / 180) * aspect;
  const scale = Math.min(1, (visibleWidth * 0.65) / 8.5);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onFinish });

    tl.fromTo(
      camera.position,
      { z: 18 },
      { z: 7, duration: 2.6, ease: "power3.out", onUpdate: () => camera.lookAt(0, 0, 0) },
    )
      .from(group.current.rotation, { x: 0.4, y: -0.8, duration: 2.6, ease: "power3.out" }, 0)
      .fromTo(sweep.current.position, { x: -9 }, { x: 9, duration: 2.2, ease: "power1.inOut" }, 0.6)
      .to(camera.position, { z: 1.5, duration: 0.8, ease: "power2.in" }, 3.2);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2} />
      <pointLight ref={sweep} position={[-9, 0.5, 3]} intensity={60} color="#ff4d4d" />

      <group ref={group} scale={scale}>
        <Center>
          <Text3D
            font={font}
            size={1}
            height={0.35}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.03}
            bevelSegments={4}
            letterSpacing={0.12}
          >
            {profile.firstName.toUpperCase()}
            <meshStandardMaterial color="#e50914" metalness={0.6} roughness={0.25} emissive="#4a0006" />
          </Text3D>
        </Center>
      </group>
    </>
  );
}

export default function Intro({ onDone }) {
  const overlay = useRef(null);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    gsap.to(overlay.current, { opacity: 0, duration: 0.6, onComplete: onDone });
  };

  useGSAP(
    () => {
      gsap.from(".intro-label", { opacity: 0, y: 10, duration: 0.8, delay: 0.4 });
      gsap.from(".intro-series", { opacity: 0, letterSpacing: "1.4em", duration: 1.2, delay: 1.6 });
    },
    { scope: overlay },
  );

  return (
    <div ref={overlay} className="fixed inset-0 z-200 bg-night">
      <Canvas camera={{ position: [0, 0, 18], fov: 40 }} dpr={[1, 2]}>
        <Scene onFinish={finish} />
      </Canvas>

      <p className="intro-label pointer-events-none absolute inset-x-0 top-[30%] text-center text-xs uppercase tracking-[0.5em] text-accent">
        {profile.originLabel}
      </p>
      <p className="intro-series pointer-events-none absolute inset-x-0 bottom-[30%] text-center text-sm uppercase tracking-[0.6em] text-white/80">
        {profile.seriesLabel}
      </p>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-6 rounded-md border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:bg-white/10 hover:text-white md:right-16"
      >
        Skip intro ›
      </button>
    </div>
  );
}
