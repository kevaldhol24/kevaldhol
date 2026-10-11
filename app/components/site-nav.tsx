import { useEffect, useRef, useState } from "react";

import { profile, sections } from "~/content/portfolio";

export function SiteNav() {
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current)
        bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink/60 backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="font-display text-paper text-2xl tracking-tight" data-magnetic>
          {profile.initials}
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="border-line flex items-center gap-1 rounded-full border bg-white/[0.03] p-1 backdrop-blur-md">
            {sections.slice(1).map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`block rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                    active === id ? "bg-paper text-ink" : "text-mute hover:text-paper"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          data-magnetic
          className="group border-line text-paper hover:border-paper/40 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
        >
          {profile.available ? (
            <span className="relative flex size-2">
              <span className="bg-lime absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-lime relative inline-flex size-2 rounded-full" />
            </span>
          ) : null}
          <span>{profile.available ? "Available for work" : "Get in touch"}</span>
        </a>
      </div>
      <div
        ref={bar}
        className="from-ember via-iris to-lime h-px origin-left scale-x-0 bg-gradient-to-r"
      />
    </header>
  );
}
