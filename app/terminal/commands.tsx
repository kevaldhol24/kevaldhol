import type { ReactNode } from "react";

import { education, experience, profile, projects, skillGroups, stats } from "~/content/portfolio";

/** What a command can do besides printing: run another command or jump to a section. */
export type ShellContext = {
  run: (line: string) => void;
  cd: (id: string) => void;
};

export const SECTION_IDS = [
  "home",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "contact",
];

export const projectId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Short, stable pseudo commit hash for git-log style output. */
export function shortHash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function Run({ ctx, cmd, children }: { ctx: ShellContext; cmd: string; children?: ReactNode }) {
  return (
    <button type="button" className="term-link" onClick={() => ctx.run(cmd)}>
      {children ?? cmd}
    </button>
  );
}

function Go({ ctx, id }: { ctx: ShellContext; id: string }) {
  return (
    <>
      →{" "}
      <button type="button" className="term-link" onClick={() => ctx.cd(id)}>
        cd {id}
      </button>
    </>
  );
}

type Command = (arg: string, ctx: ShellContext) => ReactNode;

const COMMANDS: Record<string, Command> = {
  help: (_, ctx) => (
    <>
      available commands:
      {"\n  "}
      {["whoami", "about", "projects", "experience", "skills", "education", "contact"].map((c) => (
        <span key={c}>
          <Run ctx={ctx} cmd={c} />{" "}
        </span>
      ))}
      {"\n  "}
      <Run ctx={ctx} cmd="cd projects">
        cd &lt;section&gt;
      </Run>{" "}
      <Run ctx={ctx} cmd={`open ${projectId(projects[0].title)}`}>
        open &lt;project&gt;
      </Run>{" "}
      <Run ctx={ctx} cmd="clear" /> <Run ctx={ctx} cmd="sudo hire-me" />
    </>
  ),
  whoami: () => (
    <>
      {profile.name.toLowerCase()}{" "}
      <span className="text-mute">
        — {profile.role.toLowerCase()} · {profile.location.toLowerCase()}
      </span>
      {"\n"}
      <span className="text-mute">{profile.headline.join(" ").toLowerCase()}</span>
    </>
  ),
  about: (_, ctx) => (
    <>
      {stats.map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join(" · ")}
      {"\n"}
      {profile.intro}
      {"\n"}
      <Go ctx={ctx} id="about" />
    </>
  ),
  projects: (_, ctx) => (
    <>
      {projects.map((p) => (
        <span key={p.title}>
          <Run ctx={ctx} cmd={`open ${projectId(p.title)}`}>
            {projectId(p.title).padEnd(16)}
          </Run>{" "}
          <span className="text-dim">{p.kind.toLowerCase().padEnd(20)}</span>
          {p.year ? <span className="text-gold">{p.year}</span> : null}
          {"\n"}
        </span>
      ))}
      <Go ctx={ctx} id="projects" />
    </>
  ),
  open: (arg, ctx) => {
    const p = projects.find((x) => projectId(x.title) === arg.toLowerCase());
    if (!p) {
      return (
        <>
          open: no such project. try{" "}
          {projects.map((x) => (
            <span key={x.title}>
              <Run ctx={ctx} cmd={`open ${projectId(x.title)}`}>
                {projectId(x.title)}
              </Run>{" "}
            </span>
          ))}
        </>
      );
    }
    return (
      <>
        <span className="text-ember">{projectId(p.title)}/</span>{" "}
        <span className="text-dim">
          {p.kind.toLowerCase()}
          {p.year ? ` · ${p.year}` : ""}
        </span>
        {"\n"}
        {p.summary}
        {"\n"}
        <span className="text-mute">[{p.tags.join("] [")}]</span>
      </>
    );
  },
  experience: (_, ctx) => (
    <>
      {experience.map((x) => (
        <span key={x.period}>
          <span className="text-gold">{shortHash(x.role + x.company)}</span> {x.role}{" "}
          <span className="text-mute">
            @ {x.company} · {x.period}
          </span>
          {"\n"}
        </span>
      ))}
      <Go ctx={ctx} id="experience" />
    </>
  ),
  skills: (_, ctx) => (
    <>
      {skillGroups.map((g) => (
        <span key={g.name}>
          <span className="text-iris">{g.name.padEnd(10)}</span>
          {g.items.join(", ")}
          {"\n"}
        </span>
      ))}
      <Go ctx={ctx} id="skills" />
    </>
  ),
  education: (_, ctx) => (
    <>
      {education.map((e) => (
        <span key={e.degree}>
          {e.degree} <span className="text-mute">· {e.school}</span>
          {e.period ? <span className="text-mute"> · {e.period}</span> : null}
          {"\n"}
        </span>
      ))}
      <Go ctx={ctx} id="education" />
    </>
  ),
  contact: (_, ctx) => (
    <>
      email{"   "}
      {profile.email}
      {"\n"}status{"  "}
      {profile.available ? <span className="text-mint">● available</span> : "busy"}, replies within
      a day{"\n"}
      <Go ctx={ctx} id="contact" />
    </>
  ),
  cd: (arg, ctx) => {
    const id = arg.replace(/^~\/?/, "") || "home";
    if (!SECTION_IDS.includes(id)) return `cd: no such section: ${arg}`;
    ctx.cd(id);
    return <span className="text-mute">→ /{id}</span>;
  },
  ls: () => (
    <>
      {["about.md", "projects/", "career/", "skills/", "education.yml", "contact.md"].map((f) => (
        <span key={f} className={f.endsWith("/") ? "text-iris" : undefined}>
          {f}
          {"   "}
        </span>
      ))}
    </>
  ),
  date: () =>
    `${new Date().toLocaleString("en-GB", {
      timeZone: profile.timeZone,
      dateStyle: "medium",
      timeStyle: "short",
    })} (${profile.timeZone.split("/")[1]})`,
  echo: (arg) => arg,
  sudo: (arg, ctx) =>
    arg.startsWith("hire") ? (
      <>
        [sudo] password for recruiter: ********{"\n"}
        <span className="text-mint">access granted.</span>
        {"\n"}
        <Go ctx={ctx} id="contact" />
      </>
    ) : (
      <>
        usage: <Run ctx={ctx} cmd="sudo hire-me" />
      </>
    ),
  rm: () => "nice try. this system has backups.",
  exit: (_, ctx) => (
    <>
      there is no exit. only <Go ctx={ctx} id="contact" />.
    </>
  ),
};

export const COMPLETIONS = [
  ...Object.keys(COMMANDS),
  "clear",
  ...projects.map((p) => `open ${projectId(p.title)}`),
  ...SECTION_IDS.map((id) => `cd ${id}`),
  "sudo hire-me",
];

/** Runs one line. Returns what to print, or "clear" to wipe the log. */
export function execute(line: string, ctx: ShellContext): ReactNode | "clear" {
  const [name, ...rest] = line.trim().split(/\s+/);
  if (name === "clear") return "clear";
  const command = COMMANDS[name];
  if (command) return command(rest.join(" "), ctx);
  return (
    <>
      <span className="text-pink">zsh: command not found:</span> {name}{" "}
      <span className="text-mute">— try</span> <Run ctx={ctx} cmd="help" />
    </>
  );
}

export function Welcome({ ctx }: { ctx: ShellContext }) {
  return (
    <>
      Hi, I&apos;m {profile.name}. Ask me anything this shell understands.{"\n"}Try{" "}
      <Run ctx={ctx} cmd="help" /> <Run ctx={ctx} cmd="projects" /> <Run ctx={ctx} cmd="skills" />{" "}
      <Run ctx={ctx} cmd="contact" />
    </>
  );
}
