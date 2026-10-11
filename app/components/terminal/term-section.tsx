import { type ReactNode, useEffect, useRef, useState } from "react";

import type { ShapeName } from "~/terminal/ascii-model";

export function Prompt({ path = "~" }: { path?: string }) {
  return (
    <span className="text-mint">
      keval<span className="text-dim">@</span>portfolio<span className="text-dim">:</span>
      <span className="text-iris">{path}</span>
      <span className="text-paper">$</span>
    </span>
  );
}

export function Cursor({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={on ? "term-cursor is-on" : "term-cursor"} />;
}

/**
 * One "command" of the session. Server-rendered complete; with JS (and motion allowed) the
 * command types itself when the section scrolls into view, then the output fades in.
 */
export function TermSection({
  id,
  shape,
  side,
  cmd,
  path,
  className = "",
  children,
}: {
  id: string;
  shape: ShapeName;
  side: "left" | "right";
  cmd: string;
  path?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState<number | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setTimeout>;

    const start = () => {
      if (reduce) {
        setShown(true);
        return;
      }
      let i = 0;
      setTyped(0);
      const step = () => {
        i++;
        setTyped(i);
        if (i < cmd.length) timer = setTimeout(step, 28 + Math.random() * 45);
        else timer = setTimeout(() => setShown(true), 220);
      };
      timer = setTimeout(step, 150);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [cmd]);

  const state = shown ? "shown" : typed === null ? "idle" : "typing";

  return (
    <section
      ref={ref}
      id={id}
      data-shape={shape}
      data-side={side}
      data-state={state}
      className={`term-sec grid w-full max-w-[760px] scroll-mt-16 gap-[22px] lg:w-[50vw] ${
        side === "right" ? "lg:ml-auto" : ""
      } ${className}`}
    >
      <div className="text-[15px] break-words whitespace-pre-wrap">
        <Prompt path={path} />{" "}
        <span className="term-cmd text-paper">{typed === null ? cmd : cmd.slice(0, typed)}</span>
        <Cursor on={state === "typing"} />
      </div>
      <div className="term-out grid gap-4">{children}</div>
    </section>
  );
}
