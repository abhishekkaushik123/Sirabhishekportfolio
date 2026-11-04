import { lazy, Suspense, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfileGate from "./components/ProfileGate";
import Hero from "./sections/Hero";
import EpisodeRow from "./sections/EpisodeRow";
import Story from "./sections/Story";
import Experience from "./sections/Experience";
import Originals from "./sections/Originals";
import Skills from "./sections/Skills";
import Journey from "./sections/Journey";
import About from "./sections/About";
import TopPicks from "./sections/TopPicks";
import Finale from "./sections/Finale";
import Awards from "./sections/Awards";
import { profiles } from "./data/profiles";
import { playTaDum } from "./lib/sound";

// The 3D intro (and Three.js with it) is only downloaded when it actually plays.
const Intro = lazy(() => import("./intro/Intro"));

// Each profile lists these keys in the order its sections should play.
const sections = {
  story: Story,
  experience: Experience,
  originals: Originals,
  skills: Skills,
  journey: Journey,
  about: About,
  picks: TopPicks,
  awards: Awards,
};

function readStorage(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Private mode can block storage; choices then last only until the page reloads.
  }
}

function shouldPlayIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  // The 3D intro is the biggest download, so skip it for visitors saving data.
  if (navigator.connection?.saveData) return false;
  return !readStorage("intro-seen");
}

export default function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [profileId, setProfileId] = useState(() => readStorage("profile"));

  const finishIntro = () => {
    writeStorage("intro-seen", "yes");
    setShowIntro(false);
  };

  const chooseProfile = (id) => {
    playTaDum();
    writeStorage("profile", id);
    setProfileId(id);
    window.scrollTo(0, 0);
  };

  const switchProfile = () => {
    writeStorage("profile", null);
    setProfileId(null);
  };

  if (showIntro) {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-night" />}>
        <Intro onDone={finishIntro} />
      </Suspense>
    );
  }

  const viewer = profiles.find((profile) => profile.id === profileId);

  if (!viewer) {
    return <ProfileGate profiles={profiles} onSelect={chooseProfile} />;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-night"
      >
        Skip to content
      </a>

      <Navbar viewer={viewer} onSwitchProfile={switchProfile} />

      <main id="main">
        <Hero />
        <EpisodeRow />
        {viewer.order.map((key) => {
          const Section = sections[key];
          return <Section key={key} />;
        })}
        <Finale />
      </main>

      <Footer />
    </>
  );
}
