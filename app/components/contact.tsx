import { useEffect, useState } from "react";

import { SectionLabel } from "~/components/about";
import { SplitText } from "~/components/split-text";
import { profile } from "~/content/portfolio";

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(
        new Date()
      );
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useLocalTime(profile.timeZone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      data-scene
      className="relative flex min-h-dvh flex-col justify-between px-5 pt-32 pb-8 md:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <SectionLabel index="04" label="Contact" />

        <h2 className="font-display text-paper mt-10 text-center text-[clamp(3rem,11vw,11rem)] leading-[0.9] font-medium tracking-[-0.045em]">
          <SplitText text="Let's build" className="block" />
          <SplitText text="something good." className="text-gradient block font-serif italic" />
        </h2>

        <div data-reveal className="mt-14 flex flex-col items-center gap-5">
          <a
            href={`mailto:${profile.email}`}
            data-magnetic
            className="group bg-paper text-ink relative overflow-hidden rounded-full px-9 py-5 text-lg font-medium"
          >
            <span className="group-hover:text-paper relative z-10 transition-colors duration-500">
              {profile.email}
            </span>
            <span className="from-ember to-iris absolute inset-0 translate-y-full rounded-full bg-gradient-to-r transition-transform duration-500 ease-out group-hover:translate-y-0" />
          </a>
          <button
            type="button"
            onClick={copy}
            className="text-mute hover:text-paper font-mono text-xs tracking-widest uppercase transition-colors"
            aria-live="polite"
          >
            {copied ? "Copied to clipboard ✓" : "Copy email"}
          </button>
        </div>
      </div>

      <footer className="border-line mx-auto mt-24 flex w-full max-w-7xl flex-col gap-8 border-t pt-8 md:flex-row md:items-end md:justify-between">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-paper/80 hover:text-paper transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="text-mute flex items-center gap-8 font-mono text-xs tracking-widest uppercase">
          <span>
            Local time <span className="text-paper">{time ?? "--:--"}</span>
          </span>
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a href="#top" data-magnetic className="text-paper">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
