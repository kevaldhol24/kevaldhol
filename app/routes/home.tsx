import { About } from "~/components/about";
import { Contact } from "~/components/contact";
import { Cursor } from "~/components/cursor";
import { Experience } from "~/components/experience";
import { Hero } from "~/components/hero";
import { SceneCanvas } from "~/components/scene-canvas";
import { SiteNav } from "~/components/site-nav";
import { Work } from "~/components/work";
import { profile } from "~/content/portfolio";
import { useMagnetic, useReveals } from "~/motion/use-reveals";

export function meta() {
  const title = `${profile.name} — ${profile.role}`;
  return [
    { title },
    { name: "description", content: profile.intro },
    { property: "og:title", content: title },
    { property: "og:description", content: profile.intro },
    { property: "og:type", content: "website" },
    { name: "theme-color", content: "#07070a" },
  ];
}

export default function Home() {
  useReveals();
  useMagnetic();

  return (
    <>
      <a
        href="#about"
        className="bg-paper text-ink sr-only z-[60] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SceneCanvas />
      <div aria-hidden="true" className="grain" />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Cursor />
    </>
  );
}
