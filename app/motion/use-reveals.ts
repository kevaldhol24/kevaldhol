import { animate, createTimeline, stagger } from "animejs";
import { useEffect } from "react";

/**
 * Scroll-triggered entrances powered by anime.js. Markup opts in with data attributes:
 *
 * - `data-split`   — text pre-split by <SplitText>; its `.char`s rise out of a mask.
 * - `data-reveal`  — the element fades and lifts in.
 * - `data-stagger` — its direct children fade and lift in, one after another.
 * - `data-count`   — counts up to the number in the attribute (`data-decimals` optional).
 * - `data-hero`    — played once on load as an intro timeline instead of on scroll.
 *
 * The hidden "before" state lives in app.css behind `.js` + `prefers-reduced-motion:
 * no-preference`, so without JS or with reduced motion everything is simply visible.
 */
export function useReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const enter = (el: HTMLElement) => {
      if (el.dataset.split !== undefined) {
        animate(el.querySelectorAll(".char"), {
          translateY: ["105%", "0%"],
          rotate: [6, 0],
          duration: 1300,
          delay: stagger(16),
          ease: "outExpo",
        });
      }
      if (el.dataset.reveal !== undefined) {
        animate(el, {
          opacity: [0, 1],
          translateY: [36, 0],
          duration: 1200,
          delay: Number(el.dataset.delay ?? 0),
          ease: "outExpo",
        });
      }
      if (el.dataset.stagger !== undefined) {
        animate(el.children, {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1200,
          delay: stagger(90),
          ease: "outExpo",
        });
      }
      if (el.dataset.count !== undefined) {
        const to = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const counter = { value: 0 };
        animate(counter, {
          value: to,
          duration: 2200,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = counter.value.toFixed(decimals);
          },
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          enter(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    document
      .querySelectorAll<HTMLElement>(
        "[data-split]:not([data-hero]), [data-reveal]:not([data-hero]), [data-stagger], [data-count]"
      )
      .forEach((el) => observer.observe(el));

    // Hero intro — a single choreographed timeline.
    const tl = createTimeline({ defaults: { ease: "outExpo", duration: 1400 } });
    tl.add("[data-hero][data-split] .char", {
      translateY: ["105%", "0%"],
      rotate: [8, 0],
      delay: stagger(22, { start: 250 }),
    }).add(
      "[data-hero][data-reveal]",
      { opacity: [0, 1], translateY: [24, 0], delay: stagger(110) },
      "-=1100"
    );

    return () => {
      observer.disconnect();
      tl.pause();
    };
  }, []);
}

/** Elements with `data-magnetic` drift toward the pointer and spring back on leave. */
export function useMagnetic() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));

    const handlers = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        animate(el, {
          translateX: dx * 0.3,
          translateY: dy * 0.35,
          duration: 500,
          ease: "outQuad",
        });
      };
      const leave = () => {
        animate(el, { translateX: 0, translateY: 0, duration: 900, ease: "outElastic(1, .5)" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });

    return () => handlers.forEach((off) => off());
  }, []);
}
