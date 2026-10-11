import { useEffect, useState } from "react";

import { profile } from "~/content/portfolio";

/** HH:MM in the profile's time zone; null until mounted so SSR and hydration agree. */
function useClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: profile.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useScrollPercent() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(Math.round(Math.min(1, Math.max(0, window.scrollY / Math.max(1, max))) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return pct;
}

/** tmux-style status line doubling as the page navigation. */
export function TmuxBar({
  sections,
  active,
}: {
  sections: { id: string; label: string }[];
  active: number;
}) {
  const time = useClock();
  const pct = useScrollPercent();

  return (
    <footer className="border-line fixed inset-x-0 bottom-0 z-30 flex h-[30px] items-stretch border-t bg-[#110f17] text-xs whitespace-nowrap">
      <span className="bg-ember text-ink flex items-center px-3 font-bold">
        [{profile.name.toLowerCase()}]
      </span>
      <nav
        aria-label="Sections"
        className="flex min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto"
      >
        {sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={i === active ? "location" : undefined}
            className={`flex items-center px-3 no-underline ${
              i === active ? "bg-mint text-ink font-bold" : "text-mute hover:text-paper"
            }`}
          >
            {i}:{s.label}
            {i === active ? "*" : ""}
          </a>
        ))}
      </nav>
      <span className="text-mute flex items-center gap-3.5 px-3.5">
        <span className="hidden sm:inline">⎇ main</span>
        <span className="hidden tabular-nums sm:inline">{pct}%</span>
        <span className="tabular-nums">{time ?? "--:--"}</span>
      </span>
    </footer>
  );
}
