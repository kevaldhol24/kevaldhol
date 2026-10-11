import { useEffect, useRef } from "react";

import type { SceneKeyframe } from "~/three/portfolio-scene";

/**
 * One keyframe per `[data-scene]` section, in DOM order:
 * hero → about → work → experience → contact.
 */
const KEYFRAMES: SceneKeyframe[] = [
  {
    x: 0,
    y: 0,
    scale: 1,
    distort: 0.22,
    spread: 1,
    tilt: 0.25,
    colorA: "#ff6b3d",
    colorB: "#7c5cff",
  },
  {
    x: 0.26,
    y: 0,
    scale: 0.82,
    distort: 0.38,
    spread: 1.35,
    tilt: 0.9,
    colorA: "#7c5cff",
    colorB: "#3dd6ff",
  },
  {
    x: -0.3,
    y: 0.02,
    scale: 0.6,
    distort: 0.14,
    spread: 1.9,
    tilt: 1.4,
    colorA: "#ff3d9a",
    colorB: "#ffb03d",
  },
  {
    x: 0.3,
    y: -0.02,
    scale: 0.7,
    distort: 0.5,
    spread: 1.15,
    tilt: 0.4,
    colorA: "#3dd6ff",
    colorB: "#c6ff3d",
  },
  {
    x: 0,
    y: 0.04,
    scale: 1.15,
    distort: 0.3,
    spread: 0.85,
    tilt: 0.1,
    colorA: "#ff6b3d",
    colorB: "#ff3d9a",
  },
];

/** `sectionIndex + progress` based on where the viewport's centre sits between section tops. */
function readScrollPosition(sections: HTMLElement[]) {
  const probe = window.scrollY + window.innerHeight * 0.5;
  const tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
  for (let i = tops.length - 1; i >= 0; i--) {
    if (probe >= tops[i]) {
      if (i === tops.length - 1) return i;
      const span = tops[i + 1] - tops[i] || 1;
      return i + Math.min((probe - tops[i]) / span, 1);
    }
  }
  return 0;
}

export function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    // three.js is only ever loaded in the browser, and in its own chunk.
    import("~/three/portfolio-scene").then(({ PortfolioScene }) => {
      if (disposed) return;
      let scene: InstanceType<typeof PortfolioScene>;
      try {
        scene = new PortfolioScene(canvas, KEYFRAMES);
      } catch {
        // No WebGL: the page still works, just without the centrepiece.
        canvas.style.display = "none";
        return;
      }

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const onScroll = () => scene.setScroll(readScrollPosition(sections));
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      canvas.classList.add("is-ready");

      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        scene.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="scene-canvas pointer-events-none fixed inset-0 z-0 h-dvh w-full opacity-0 transition-opacity duration-1600"
    />
  );
}
