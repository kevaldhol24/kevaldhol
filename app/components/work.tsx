import type { PointerEvent as ReactPointerEvent } from "react";

import { SectionLabel } from "~/components/about";
import { SplitText } from "~/components/split-text";
import { type Project, projects } from "~/content/portfolio";

export function Work() {
  return (
    <section id="work" data-scene className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="02" label="Selected work" />
            <h2 className="font-display text-paper mt-8 text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.035em]">
              <SplitText text="Things I've" className="block" />
              <SplitText text="built lately" className="text-gradient block font-serif italic" />
            </h2>
          </div>
          <p data-reveal className="text-mute max-w-sm leading-relaxed">
            A few recent projects across platforms, data and interfaces. Each one started with a
            messy problem and ended with something people actually enjoy using.
          </p>
        </div>

        <ul className="mt-20 grid gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((project, i) => (
            <li key={project.title} className={i % 2 === 1 ? "md:mt-24" : undefined}>
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [a, b] = project.palette;

  // Tilt toward the pointer; values feed CSS custom properties read in app.css.
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = (e: ReactPointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  const Tag = project.href ? "a" : "article";

  return (
    <Tag
      {...(project.href ? { href: project.href, target: "_blank", rel: "noreferrer" } : {})}
      data-reveal
      data-cursor
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="project-card group border-line block rounded-[2rem] border bg-white/[0.02] p-3 backdrop-blur-sm"
      style={{ "--a": a, "--b": b } as React.CSSProperties}
    >
      <div className="project-cover relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
        <div className="project-blob project-blob-a" />
        <div className="project-blob project-blob-b" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)] bg-[size:48px_48px]" />
        <span className="absolute top-5 left-6 font-mono text-xs tracking-widest text-white/70 uppercase">
          {project.kind}
        </span>
        <span className="absolute top-5 right-6 font-mono text-xs text-white/70">
          {project.year}
        </span>
        <span className="font-display absolute -bottom-6 left-4 text-[9rem] leading-none font-medium tracking-tighter text-white/90 mix-blend-overlay transition-transform duration-700 group-hover:-translate-y-3">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-ink absolute right-5 bottom-5 flex size-12 -rotate-45 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100">
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <div className="flex flex-col gap-4 px-3 pt-6 pb-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-paper text-3xl font-medium tracking-tight">{project.title}</h3>
          <ul className="flex flex-wrap justify-end gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border-line text-mute rounded-full border px-2.5 py-1 font-mono text-[0.65rem] tracking-wider uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-mute max-w-md leading-relaxed">{project.summary}</p>
      </div>
    </Tag>
  );
}
