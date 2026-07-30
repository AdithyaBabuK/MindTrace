import { formatDate, moodOf, plainText, type Entry } from "@/lib/journal";

export function EntryCard({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  const mood = moodOf(entry.mood);
  return (
    <button
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium tracking-wide text-secondary-foreground uppercase">
          {entry.category}
        </span>
        <span className="text-xl leading-none" title={mood.label} aria-label={mood.label}>
          {mood.emoji}
        </span>
      </div>

      <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight group-hover:text-accent">
        {entry.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {plainText(entry.content)}
      </p>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {formatDate(entry.date)}
      </p>
    </button>
  );
}
