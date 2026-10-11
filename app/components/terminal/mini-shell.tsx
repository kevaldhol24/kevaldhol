import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { COMPLETIONS, execute, type ShellContext, Welcome } from "~/terminal/commands";

type Line = { id: number; echo?: string; body: ReactNode };

/** The small interactive shell in the hero: tab completion, history, clickable commands. */
export function MiniShell() {
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<(line: string) => void>(() => {});
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const nextId = useRef(2);
  const [value, setValue] = useState("");

  const ctx = useMemo<ShellContext>(
    () => ({
      run: (line) => runRef.current(line),
      cd: (id) => {
        // Let the echo render first, then travel.
        setTimeout(() => document.getElementById(id)?.scrollIntoView(), 250);
      },
    }),
    []
  );

  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, body: <span className="text-dim">Last login on ttys001</span> },
    { id: 1, body: <Welcome ctx={ctx} /> },
  ]);

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (line) {
        history.current.push(line);
        historyIndex.current = history.current.length;
      }
      const result = line ? execute(line, ctx) : null;
      if (result === "clear") {
        setLines([]);
        return;
      }
      setLines((prev) => [...prev, { id: nextId.current++, echo: line, body: result }]);
    },
    [ctx]
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  const hint = value ? COMPLETIONS.find((c) => c.startsWith(value) && c !== value) : undefined;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const atEnd = e.currentTarget.selectionStart === value.length;
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "Tab" || (e.key === "ArrowRight" && atEnd && hint)) {
      if (hint || (e.key === "Tab" && value)) e.preventDefault();
      if (hint) setValue(hint);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex.current > 0) setValue(history.current[--historyIndex.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1);
      setValue(history.current[historyIndex.current] ?? "");
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    // Clicking anywhere focuses the prompt; the input itself is reachable by keyboard.
    <div
      onClick={focusInput}
      className="border-line w-full max-w-[620px] cursor-text overflow-hidden rounded-[10px] border bg-[#110f17]/85 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] backdrop-blur-sm"
    >
      <div className="border-line text-dim flex items-center justify-between gap-2.5 border-b px-3 py-[7px] text-[11px]">
        <span>~/ask-me — interactive</span>
        <span className="hidden sm:inline">tab ↹ completes · ↑ history</span>
      </div>
      <div
        ref={logRef}
        aria-live="polite"
        className="h-[230px] overflow-y-auto px-3.5 pt-3 pb-1 text-[13px] leading-[1.6]"
      >
        {lines.map((line) => (
          <div key={line.id} className="break-words whitespace-pre-wrap">
            {line.echo !== undefined ? (
              <div>
                <span className="text-mint">~$</span> {line.echo}
              </div>
            ) : null}
            {line.body}
          </div>
        ))}
      </div>
      <div className="flex items-baseline gap-2 px-3.5 pb-3 text-[13px]">
        <span className="text-mint">
          ~<span className="text-paper">$</span>
        </span>
        <div className="relative min-w-0 flex-1">
          <label htmlFor="shell-input" className="sr-only">
            Type a command
          </label>
          <input
            ref={inputRef}
            id="shell-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            className="text-paper caret-ember w-full border-0 bg-transparent p-0 outline-none"
          />
          <div
            aria-hidden="true"
            className="text-dim pointer-events-none absolute inset-0 overflow-hidden whitespace-pre"
          >
            <span className="invisible">{value}</span>
            {hint ? hint.slice(value.length) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
