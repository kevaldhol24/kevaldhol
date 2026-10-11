import { useEffect, useRef } from "react";

import { AsciiRenderer, getShapes, pointCount, type ShapeName } from "~/terminal/ascii-model";

/**
 * Where the reading line (45% down the viewport) sits between `[data-shape]` sections:
 * the index of the current section and how far through it we are.
 */
function readSections(sections: HTMLElement[]) {
  const line = window.innerHeight * 0.45;
  const tops = sections.map((s) => s.getBoundingClientRect().top - line);
  let i = 0;
  while (i < tops.length - 1 && tops[i + 1] <= 0) i++;
  const span = (tops[i + 1] ?? tops[i] + 1) - tops[i] || 1;
  const t = i < tops.length - 1 ? Math.min(1, Math.max(0, -tops[i] / span)) : 0;
  return { i, t };
}

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** The model sits in the half of the page a section leaves free. */
const freeSide = (section: HTMLElement) => (section.dataset.side === "right" ? 0.27 : 0.73);

export function AsciiCanvas({
  onActive,
  onSize,
}: {
  onActive: (index: number) => void;
  onSize: (size: { cols: number; rows: number }) => void;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLElement>(null);
  const fpsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const shapes = getShapes();
    const renderer = new AsciiRenderer();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Side-by-side layout only on wide screens; narrower ones centre the model behind the text.
    const wide = window.matchMedia("(min-width: 1024px)");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-shape]"));
    if (!sections.length) return;

    const measure = () => {
      const probe = document.createElement("span");
      probe.textContent = "M".repeat(50);
      pre.appendChild(probe);
      const box = probe.getBoundingClientRect();
      probe.remove();
      const cw = box.width / 50;
      const lh = parseFloat(getComputedStyle(pre).lineHeight) || box.height;
      const cols = Math.max(20, Math.floor(pre.clientWidth / cw));
      const rows = Math.max(10, Math.floor(pre.clientHeight / lh));
      renderer.resize(cols, rows, cw / lh);
      onSize({ cols, rows });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(pre);
    measure();

    let raf = 0;
    let active = -1;
    let last = performance.now();
    let acc = 0;
    let frames = 0;

    const frame = (now: number) => {
      acc += now - last;
      frames++;
      last = now;
      if (acc > 500 && fpsRef.current) {
        fpsRef.current.textContent = String(Math.round(1000 / (acc / frames)));
        acc = 0;
        frames = 0;
      }

      const { i, t } = readSections(sections);
      // Hold each shape for most of its section and morph (and cross sides) near the end.
      const m = smooth((t - 0.5) / 0.4);
      const here = sections[i];
      const next = sections[i + 1] ?? here;
      const cx = wide.matches ? freeSide(here) + (freeSide(next) - freeSide(here)) * m : 0.5;
      const span = wide.matches ? 0.46 : 1;

      const time = reduce ? 0 : now / 1000;
      const y = window.scrollY;
      // Sway rather than spin, so each model mostly shows its front, seen slightly from above.
      const ry = Math.sin(y * 0.0026 + time * 0.75) * 0.9;
      const rx = -0.32 + Math.sin(y * 0.003) * 0.2 + Math.sin(time * 1.1) * 0.06;
      pre.textContent = renderer.render(
        shapes[here.dataset.shape as ShapeName],
        shapes[next.dataset.shape as ShapeName],
        m,
        rx,
        ry,
        cx,
        span
      );
      if (capRef.current) capRef.current.style.left = `${cx * 100}%`;

      const current = m > 0.5 ? Math.min(i + 1, sections.length - 1) : i;
      if (current !== active) {
        active = current;
        onActive(current);
        if (shapeRef.current) shapeRef.current.textContent = sections[current].dataset.shape ?? "";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [onActive, onSize]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[34px] bottom-[30px] z-[1] opacity-20 lg:opacity-100"
    >
      <pre
        ref={preRef}
        className="term-gradient m-0 h-full overflow-hidden text-[11px] leading-[1.12] font-medium whitespace-pre"
      />
      <div
        ref={capRef}
        className="text-dim absolute bottom-2.5 left-[73%] hidden -translate-x-1/2 gap-4 text-[11px] whitespace-nowrap lg:flex"
      >
        <span>
          render <b className="text-mute font-normal">ascii</b> · shape{" "}
          <b ref={shapeRef} className="text-mute font-normal">
            k
          </b>
        </span>
        <span>
          <b className="text-mute font-normal">{pointCount.toLocaleString("en")}</b> pts ·{" "}
          <b ref={fpsRef} className="text-mute font-normal">
            60
          </b>{" "}
          fps
        </span>
      </div>
    </div>
  );
}
