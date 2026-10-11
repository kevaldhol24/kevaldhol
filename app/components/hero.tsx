import { SplitText } from "~/components/split-text";
import { profile } from "~/content/portfolio";

export function Hero() {
  const [first, middle, last] = profile.headline;

  return (
    <section
      id="top"
      data-scene
      className="relative flex min-h-dvh flex-col justify-between px-5 pt-28 pb-8 md:px-10"
    >
      <div className="text-mute mx-auto flex w-full max-w-7xl items-start justify-between font-mono text-xs tracking-widest uppercase">
        <p data-hero data-reveal>
          {profile.role}
        </p>
        <p data-hero data-reveal className="hidden text-right sm:block">
          {profile.location}
        </p>
      </div>

      <h1 className="font-display text-paper mx-auto w-full max-w-7xl text-center leading-[0.92] tracking-[-0.035em]">
        <SplitText
          text={first}
          className="block text-[clamp(3rem,10.5vw,10.5rem)] font-medium"
          hero
        />
        <SplitText
          text={middle}
          className="text-gradient block font-serif text-[clamp(3rem,10.5vw,10.5rem)] italic"
          hero
        />
        <SplitText
          text={last}
          className="text-paper/70 block text-[clamp(2rem,6vw,6rem)] font-medium"
          hero
        />
      </h1>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <p
          data-hero
          data-reveal
          className="text-mute max-w-sm text-base leading-relaxed md:text-lg"
        >
          {profile.intro}
        </p>
        <a
          href="#about"
          data-hero
          data-reveal
          data-magnetic
          className="group text-paper flex items-center gap-3 font-mono text-xs tracking-widest uppercase"
        >
          Scroll to explore
          <span className="border-line relative flex h-10 w-6 justify-center rounded-full border">
            <span className="animate-scroll-cue bg-paper mt-2 h-2 w-px" />
          </span>
        </a>
      </div>
    </section>
  );
}
