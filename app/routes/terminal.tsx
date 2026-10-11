import { useState } from "react";
import { Link } from "react-router";

import { AsciiCanvas } from "~/components/terminal/ascii-canvas";
import {
  AboutBody,
  ContactBody,
  EducationBody,
  ExperienceBody,
  HeroBody,
  ProjectsBody,
  SkillsBody,
} from "~/components/terminal/sections";
import { TermSection } from "~/components/terminal/term-section";
import { TmuxBar } from "~/components/terminal/tmux-bar";
import { profile } from "~/content/portfolio";
import type { ShapeName } from "~/terminal/ascii-model";

export function meta() {
  const title = `${profile.name} — ~/portfolio`;
  return [
    { title },
    { name: "description", content: profile.intro },
    { property: "og:title", content: title },
    { property: "og:description", content: profile.intro },
    { name: "theme-color", content: "#0b0a0f" },
  ];
}

/**
 * The session, in order. Sections alternate sides and the ASCII model takes whichever
 * half is free; each `shape` is what it morphs into while that section is on screen.
 */
const SECTIONS: {
  id: string;
  label: string;
  cmd: string;
  path?: string;
  shape: ShapeName;
  Body: () => React.ReactNode;
}[] = [
  { id: "home", label: "~", cmd: "whoami", shape: "k", Body: HeroBody },
  { id: "about", label: "about", cmd: "cat ~/about.md", shape: "person", Body: AboutBody },
  {
    id: "projects",
    label: "projects",
    cmd: "ls -la ~/projects",
    shape: "laptop",
    Body: ProjectsBody,
  },
  {
    id: "experience",
    label: "experience",
    cmd: "git log --graph --oneline",
    path: "~/career",
    shape: "stairs",
    Body: ExperienceBody,
  },
  { id: "skills", label: "skills", cmd: "tree ~/skills", shape: "gear", Body: SkillsBody },
  {
    id: "education",
    label: "education",
    cmd: "cat ~/education.yml",
    shape: "cap",
    Body: EducationBody,
  },
  {
    id: "contact",
    label: "contact",
    cmd: "cat ~/contact.md",
    shape: "envelope",
    Body: ContactBody,
  },
];

export default function Terminal() {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<{ cols: number; rows: number } | null>(null);

  return (
    <div className="term-page bg-[#0b0a0f] font-mono text-[14.5px] leading-[1.65]">
      <a
        href="#about"
        className="bg-paper text-ink sr-only z-[60] px-4 py-2 focus:not-sr-only focus:fixed focus:top-10 focus:left-4"
      >
        Skip to content
      </a>

      <header className="border-line text-mute fixed inset-x-0 top-0 z-30 flex h-[34px] items-center gap-3.5 border-b bg-[#110f17]/85 px-4 text-xs backdrop-blur-md">
        <span aria-hidden="true" className="hidden gap-[7px] sm:flex">
          <i className="block size-[11px] rounded-full bg-[#ff5f57]" />
          <i className="block size-[11px] rounded-full bg-[#febc2e]" />
          <i className="block size-[11px] rounded-full bg-[#28c840]" />
        </span>
        <span className="flex-1 truncate text-center">
          keval@portfolio: ~ — zsh{size ? ` — ${size.cols}×${size.rows}` : ""}
        </span>
        <Link to="/" className="hover:text-paper">
          classic ↗
        </Link>
      </header>

      <AsciiCanvas onActive={setActive} onSize={setSize} />

      <main className="relative z-[2] grid gap-[24vh] px-4 pt-[76px] pb-[120px] sm:px-[5vw] lg:gap-[34vh]">
        {SECTIONS.map(({ id, cmd, path, shape, Body }, i) => (
          <TermSection
            key={id}
            id={id}
            cmd={cmd}
            path={path}
            shape={shape}
            side={i % 2 === 0 ? "left" : "right"}
            className={i === 0 ? "min-h-[calc(100svh-120px)] content-center" : ""}
          >
            <Body />
          </TermSection>
        ))}
      </main>

      <TmuxBar sections={SECTIONS} active={active} />
    </div>
  );
}
