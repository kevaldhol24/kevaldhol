type SplitTextProps = {
  text: string;
  className?: string;
  /** Play as part of the on-load hero intro instead of on scroll. */
  hero?: boolean;
};

/**
 * Renders text as masked per-character spans so anime.js can lift each glyph into place.
 * Words stay unbreakable and screen readers get the plain string.
 */
export function SplitText({ text, className, hero }: SplitTextProps) {
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let index = 0;
  return (
    <span className={className} data-split="" data-hero={hero ? "" : undefined}>
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, c) => (
            <span key={c} className="char-mask">
              <span
                className="char"
                style={{ "--i": index++, "--n": total } as React.CSSProperties}
              >
                {char}
              </span>
            </span>
          ))}
          {w < words.length - 1 ? <span className="char-mask">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}
