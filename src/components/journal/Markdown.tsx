import { type ReactNode } from "react";

/** Minimal markdown renderer: headings, blockquote, lists, bold, italic, code. */
function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyBase}-${i++}`;
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="my-3 space-y-1.5 pl-1">
        {list.map((item, idx) => (
          <li key={idx} className="flex gap-2.5 text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            <span>{inline(item, `${key}-${idx}`)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const key = `b-${idx}`;
    if (/^\s*[-*]\s+/.test(line)) {
      list.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList(`l-${idx}`);
    if (line.trim() === "") return;
    if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={key} className="mt-5 font-display text-lg font-semibold">
          {inline(line.slice(4), key)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={key} className="mt-6 font-display text-xl font-semibold">
          {inline(line.slice(3), key)}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={key} className="mt-6 font-display text-2xl font-semibold">
          {inline(line.slice(2), key)}
        </h2>,
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={key}
          className="my-4 border-l-2 border-accent pl-4 font-display text-lg italic text-foreground/80"
        >
          {inline(line.slice(2), key)}
        </blockquote>,
      );
    } else {
      blocks.push(
        <p key={key} className="my-3 leading-relaxed text-muted-foreground">
          {inline(line, key)}
        </p>,
      );
    }
  });
  flushList("l-end");

  return <div className="text-[0.975rem]">{blocks}</div>;
}
