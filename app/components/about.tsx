import { useEffect, useRef } from "react";

import { SplitText } from "~/components/split-text";
import { profile, services, skills, stats } from "~/content/portfolio";

/** Lights the About paragraph word by word as it scrolls through the viewport. */
function useScrollHighlight() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".hl-word"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph's top hits 85% of the viewport, 1 when its bottom reaches 45%.
      const progress = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0), 1);
      const lit = progress * words.length;
      words.forEach((w, i) => {
        w.style.opacity = String(0.14 + 0.86 * Math.min(Math.max(lit - i, 0), 1));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return ref;
}

export function About() {
  const paragraph = useScrollHighlight();

  return (
    <section id="about" data-scene className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="01" label="About" />

        <p
          ref={paragraph}
          className="text-paper mt-10 max-w-5xl text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.18] font-medium tracking-[-0.02em]"
        >
          {profile.about.split(" ").map((word, i) => (
            <span key={i} className="hl-word opacity-[0.14] transition-opacity duration-150">
              {word}{" "}
            </span>
          ))}
        </p>

        <dl className="border-line bg-line mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink/80 p-6 backdrop-blur-sm md:p-8">
              <dt className="text-mute font-mono text-xs tracking-widest uppercase">
                {stat.label}
              </dt>
              <dd className="font-display text-paper mt-6 flex items-baseline text-5xl font-medium tracking-tight md:text-6xl">
                <span data-count={stat.value} data-decimals={stat.decimals ?? 0}>
                  {stat.value}
                </span>
                <span className="text-gradient">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div data-stagger className="mt-24 grid gap-10 md:grid-cols-3 md:gap-8">
          {services.map((service, i) => (
            <article key={service.title} className="border-line border-t pt-6">
              <span className="text-mute font-mono text-xs">0{i + 1}</span>
              <h3 className="text-paper mt-4 text-2xl font-medium tracking-tight">
                {service.title}
              </h3>
              <p className="text-mute mt-3 leading-relaxed">{service.body}</p>
            </article>
          ))}
        </div>
      </div>

      <Marquee items={skills} />
    </section>
  );
}

function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li
          key={item}
          className="font-display text-paper/80 flex items-center gap-10 text-4xl font-medium tracking-tight whitespace-nowrap md:text-6xl"
        >
          {item}
          <span className="from-ember to-iris size-2.5 rounded-full bg-gradient-to-br" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-label="Skills"
      className="marquee border-line mt-32 flex overflow-hidden border-y [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] py-8"
    >
      <div className="animate-marquee flex">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div
      data-reveal
      className="flex items-center gap-4 font-mono text-xs tracking-widest uppercase"
    >
      <span className="text-gradient">{index}</span>
      <span className="bg-line h-px w-12" />
      <span className="text-mute">{label}</span>
    </div>
  );
}
