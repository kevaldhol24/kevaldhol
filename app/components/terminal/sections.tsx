import { useState } from "react";

import { MiniShell } from "~/components/terminal/mini-shell";
import { Cursor, Prompt } from "~/components/terminal/term-section";
import {
  asciiName,
  certifications,
  education,
  experience,
  profile,
  projects,
  skillGroups,
  stats,
} from "~/content/portfolio";
import { projectId, shortHash } from "~/terminal/commands";

const snake = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "_");

function MdHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">
      <span className="text-dim font-normal"># </span>
      {children}
    </h2>
  );
}

function KeyValues({ rows }: { rows: [string, React.ReactNode, string?][] }) {
  return (
    <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-[18px] gap-y-1">
      {rows.map(([k, v, tone]) => (
        <div key={k} className="contents">
          <dt className="text-iris">
            {k}
            <span className="text-dim">:</span>
          </dt>
          <dd className={`m-0 min-w-0 [overflow-wrap:anywhere] ${tone ?? ""}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HeroBody() {
  const [lead, ...rest] = profile.headline;
  return (
    <>
      <h1 className="sr-only">
        {profile.name}, {profile.role}
      </h1>
      <pre
        aria-hidden="true"
        className="term-gradient m-0 text-[clamp(7px,1.32vw,15px)] leading-[1.08] whitespace-pre"
      >
        {asciiName}
      </pre>
      <p className="max-w-[30ch] text-[clamp(1.15rem,2.1vw,1.6rem)] leading-[1.35] font-light tracking-[-0.01em]">
        {profile.role}. {lead} {rest.slice(0, -1).join(" ")}{" "}
        <em className="text-ember font-medium not-italic">{rest.at(-1)}</em>
      </p>
      <MiniShell />
      <p className="text-dim text-xs">↓ scroll to read the rest of the session, or keep typing</p>
    </>
  );
}

export function AboutBody() {
  return (
    <>
      <MdHeading>About</MdHeading>
      <p className="max-w-[64ch] text-[#cfcad9]">{profile.intro}</p>
      <p className="max-w-[64ch] text-[#cfcad9]">{profile.about}</p>
      <h3 className="text-[15px] font-bold">
        <span className="text-dim font-normal">## </span>uptime
      </h3>
      <KeyValues
        rows={[
          ...stats.map(
            (s) =>
              [snake(s.label), `${s.value.toFixed(s.decimals ?? 0)}${s.suffix}`, "text-gold"] as [
                string,
                string,
                string,
              ]
          ),
          ["location", `${profile.location} (${profile.timeZone.split("/")[1]} time)`],
        ]}
      />
    </>
  );
}

export function ProjectsBody() {
  return (
    <>
      <div className="overflow-x-auto text-[13px]">
        <table className="border-collapse">
          <tbody>
            <tr>
              <td colSpan={5} className="text-dim">
                total {projects.length}
              </td>
            </tr>
            {projects.map((p) => (
              <tr key={p.title} className="[&>td]:py-px [&>td]:pr-[18px] [&>td]:whitespace-nowrap">
                <td className="text-dim">drwxr-xr-x</td>
                <td className="text-mute">keval</td>
                <td className="text-mute">staff</td>
                <td className="text-gold">{p.year ?? "—"}</td>
                <td>
                  <a href={`#p-${projectId(p.title)}`} className="term-link !text-iris">
                    {projectId(p.title)}/
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {projects.map((p) => {
        const Title = p.href ? "a" : "span";
        return (
          <article
            key={p.title}
            id={`p-${projectId(p.title)}`}
            className="border-line hover:border-ember grid scroll-mt-20 gap-2 border-l py-1 pl-[18px] transition-colors duration-300"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">
                <Title
                  {...(p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {})}
                  className={p.href ? "hover:text-ember" : undefined}
                >
                  {projectId(p.title)}
                </Title>
                <span className="text-dim font-normal">/</span>
              </h3>
              <span className="text-dim">
                {p.kind.toLowerCase()}
                {p.year ? ` · ${p.year}` : ""}
              </span>
            </div>
            <p className="max-w-[64ch] text-[#cfcad9]">{p.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="text-mute text-xs">
                  <span className="text-dim">[</span>
                  {t}
                  <span className="text-dim">]</span>
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </>
  );
}

export function ExperienceBody() {
  return (
    <div className="grid text-[13.5px]">
      {experience.map((x, i) => (
        <div key={x.period}>
          <div className="grid grid-cols-[2.4ch_minmax(0,1fr)]">
            <span className="text-iris">*</span>
            <div>
              <span className="text-gold">{shortHash(x.role + x.company)}</span>
              {i === 0 ? (
                <>
                  {" "}
                  <span className="text-iris">(</span>
                  <span className="text-mint">HEAD -&gt; now</span>
                  <span className="text-iris">)</span>
                </>
              ) : null}{" "}
              <span className="font-bold">{x.role}</span>{" "}
              <span className="text-mute">@ {x.company}</span>{" "}
              <span className="text-dim">· {x.period}</span>
            </div>
          </div>
          <div className="grid grid-cols-[2.4ch_minmax(0,1fr)]">
            <span className="text-iris">|</span>
            <p className="text-mute max-w-[62ch] pb-3.5">{x.body}</p>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[2.4ch_minmax(0,1fr)]">
        <span className="text-iris">*</span>
        <span className="text-dim">0000000 initial commit · hello, world</span>
      </div>
    </div>
  );
}

export function SkillsBody() {
  const files = skillGroups.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-7 gap-y-[18px] text-[13.5px]">
        {skillGroups.map((g) => (
          <pre key={g.name} className="m-0 font-[inherit] leading-[1.7] whitespace-pre">
            <span className="text-iris">{g.name}/</span>
            {g.items.map((s, i) => (
              <span key={s}>
                {"\n"}
                <span className="text-dim">{i === g.items.length - 1 ? "└──" : "├──"}</span> {s}
              </span>
            ))}
          </pre>
        ))}
      </div>
      <p className="text-dim">
        {skillGroups.length} directories, {files} files
      </p>
    </>
  );
}

export function EducationBody() {
  return (
    <pre className="m-0 font-[inherit] text-[13.5px] leading-[1.75] whitespace-pre-wrap">
      <span className="text-iris">education</span>
      <span className="text-dim">:</span>
      {education.map((e) => (
        <span key={e.degree}>
          {"\n  "}
          <span className="text-dim">-</span> <span className="text-iris">degree</span>
          <span className="text-dim">:</span>{" "}
          <span className="text-gold">&quot;{e.degree}&quot;</span>
          {"\n    "}
          <span className="text-iris">school</span>
          <span className="text-dim">:</span>{" "}
          <span className="text-gold">&quot;{e.school}&quot;</span>
          {e.period ? (
            <>
              {"\n    "}
              <span className="text-iris">years</span>
              <span className="text-dim">:</span> <span className="text-mint">{e.period}</span>
            </>
          ) : null}
          {e.focus?.length ? (
            <>
              {"\n    "}
              <span className="text-iris">focus</span>
              <span className="text-dim">:</span> [
              <span className="text-gold">{e.focus.join(", ")}</span>]
            </>
          ) : null}
        </span>
      ))}
      {certifications.length ? (
        <>
          {"\n\n"}
          <span className="text-iris">certifications</span>
          <span className="text-dim">:</span>
          {certifications.map((c) => (
            <span key={c.name}>
              {"\n  "}
              <span className="text-dim">-</span>{" "}
              <span className="text-gold">&quot;{c.name}&quot;</span>
            </span>
          ))}
        </>
      ) : null}
      {"\n\n"}
      <span className="text-iris">always_learning</span>
      <span className="text-dim">:</span> <span className="text-mint">true</span>
    </pre>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="term-link"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        })
      }
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}

export function ContactBody() {
  return (
    <>
      <MdHeading>Contact</MdHeading>
      <p className="max-w-[64ch] text-[#cfcad9]">
        Have a loud problem? <em className="text-ember not-italic">Let&apos;s make it calm.</em>{" "}
        {profile.available
          ? "I'm available for new projects and usually reply within a day."
          : "I usually reply within a day."}
      </p>
      <KeyValues
        rows={[
          [
            "email",
            <>
              <a href={`mailto:${profile.email}`} className="hover:text-ember">
                {profile.email}
              </a>{" "}
              <CopyButton text={profile.email} />
            </>,
          ],
          ...profile.socials.map(
            (s) =>
              [
                snake(s.label),
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="term-link"
                >
                  {s.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>,
              ] as [string, React.ReactNode]
          ),
        ]}
      />
      <div className="text-[15px]">
        <Prompt /> <Cursor on />
      </div>
      <p className="text-dim text-xs">
        © {new Date().getFullYear()} {profile.name} · built with React Router, a hand-rolled ASCII
        renderer and a lot of semicolons · exit 0
      </p>
    </>
  );
}
