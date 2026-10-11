import { SectionLabel } from "~/components/about";
import { SplitText } from "~/components/split-text";
import { experience } from "~/content/portfolio";

export function Experience() {
  return (
    <section id="experience" data-scene className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[1fr_1.4fr]">
        <div className="md:sticky md:top-32 md:self-start">
          <SectionLabel index="03" label="Experience" />
          <h2 className="font-display text-paper mt-8 text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.035em]">
            <SplitText text="A short" className="block" />
            <SplitText text="track record" className="text-gradient block font-serif italic" />
          </h2>
        </div>

        <ol data-stagger className="border-line relative border-l">
          {experience.map((item) => (
            <li key={item.period} className="group relative pb-16 pl-10 last:pb-0">
              <span className="border-paper/40 bg-ink group-hover:bg-ember absolute top-2 -left-[5px] size-[9px] rounded-full border transition-colors duration-500 group-hover:border-transparent" />
              <p className="text-mute font-mono text-xs tracking-widest uppercase">{item.period}</p>
              <h3 className="text-paper mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                {item.role}
              </h3>
              <p className="text-paper/60 mt-1 text-lg">{item.company}</p>
              <p className="text-mute mt-4 max-w-lg leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
