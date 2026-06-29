import { useEffect } from "react";
import BackgroundEffects from "./components/BackgroundEffects";
import MusicPlayer from "./components/MusicPlayer";
import ProfileCard from "./components/ProfileCard";
import Section from "./components/Section";

const PAGE_TITLE = "vibeslayer";

function useTypingPageTitle() {
  useEffect(() => {
    let letters = 0;
    let direction: 1 | -1 = 1;
    let timeoutId = 0;

    const tick = () => {
      const typed = PAGE_TITLE.slice(0, letters);
      document.title = `${typed}${direction === 1 || letters < PAGE_TITLE.length ? "|" : ""}`;

      let delay = direction === 1 ? 135 : 65;
      if (direction === 1 && letters < PAGE_TITLE.length) {
        letters += 1;
      } else if (direction === 1) {
        direction = -1;
        delay = 950;
      } else if (letters > 0) {
        letters -= 1;
      } else {
        direction = 1;
        delay = 360;
      }

      timeoutId = window.setTimeout(tick, delay);
    };

    tick();

    return () => {
      window.clearTimeout(timeoutId);
      document.title = PAGE_TITLE;
    };
  }, []);
}

export default function App() {
  useTypingPageTitle();

  return (
    <main className="relative min-h-dvh text-zinc-100 antialiased">
      <BackgroundEffects />

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-24 sm:px-6">
        <ProfileCard />
      </div>

      <Section title="Projects" />
      <Section title="About" />

      <MusicPlayer />
    </main>
  );
}
