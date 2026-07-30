import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntryForm } from "@/components/journal/EntryForm";
import { EntryCard } from "@/components/journal/EntryCard";
import { EntryDetail } from "@/components/journal/EntryDetail";
import {
  CATEGORIES,
  MOODS,
  computeStreak,
  exportEntries,
  loadEntries,
  plainText,
  saveEntries,
  sortEntries,
  topMood,
  type Entry,
} from "@/lib/journal";
import { AuroraBackground } from "@/components/journal/AuroraBackground";
import { ExportMenu } from "@/components/journal/ExportMenu";
import { Flame, Moon, NotebookPen, Search, Sun } from "lucide-react";
import { toast } from "sonner";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindTrace — Personal Journal & Mood Tracker" },
      {
        name: "description",
        content:
          "MindTrace is a private, offline-first journal: write markdown entries, track moods and streaks, search your archive, and export everything as JSON.",
      },
      { property: "og:title", content: "MindTrace — Personal Journal & Mood Tracker" },
      {
        property: "og:description",
        content:
          "Write markdown journal entries, track your mood and writing streak, and keep everything private in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [mood, setMood] = useState("all");
  const [selected, setSelected] = useState<Entry | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);

  useEffect(() => {
    setEntries(sortEntries(loadEntries()));
    const savedTheme = window.localStorage.getItem("mindtrace.theme");
    const isDark = savedTheme !== "light";

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("mindtrace.theme", dark ? "dark" : "light");
  }, [dark, ready]);

  const persist = (next: Entry[]) => {
    const sorted = sortEntries(next);
    setEntries(sorted);
    saveEntries(sorted);
  };

  const handleSave = (data: Omit<Entry, "id" | "createdAt">) => {
    if (editing) {
      persist(entries.map((e) => (e.id === editing.id ? { ...editing, ...data } : e)));
      setEditing(null);
      toast.success("Entry updated");
    } else {
      persist([
        ...entries,
        { ...data, id: crypto.randomUUID(), createdAt: Date.now() },
      ]);
      toast.success("Entry saved");
    }
  };

  const handleDelete = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    setSelected(null);
    if (editing?.id === id) setEditing(null);
    toast.success("Entry deleted");
  };

  const startEdit = (entry: Entry) => {
    setSelected(null);
    setEditing(entry);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        plainText(e.content).toLowerCase().includes(q);
      return (
        matchesQuery &&
        (category === "all" || e.category === category) &&
        (mood === "all" || e.mood === mood)
      );
    });
  }, [entries, query, category, mood]);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const dominant = useMemo(() => topMood(entries), [entries]);

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <header className="glass relative z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">

          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-accent uppercase">
                <NotebookPen className="size-3.5" /> Private · stored on this device
              </p>
              <h1 className="mt-2 font-display text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
                MindTrace
                <span className="ml-3 align-middle font-sans text-base font-normal tracking-normal text-muted-foreground">
                  Personal Journal
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sun className="size-4" />
                <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
                <Moon className="size-4" />
              </label>
              <ExportMenu
                entries={entries}
                onImport={(imported) => persist([...entries, ...imported])}
              />

            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total entries" value={String(entries.length)} />
            <Stat
              label="Writing streak"
              value={`${streak} ${streak === 1 ? "day" : "days"}`}
              icon={<Flame className="size-4 text-accent" />}
            />
            <Stat
              label="Mood most often"
              value={dominant ? `${dominant.emoji} ${dominant.label}` : "—"}
            />
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <EntryForm editing={editing} onSave={handleSave} onCancelEdit={() => setEditing(null)} />

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Archive
              <span className="ml-2 text-base font-normal text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </span>
            </h2>

            <div className="flex w-full flex-wrap gap-3 sm:w-auto">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search entries…"
                  className="pl-9"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All moods</SelectItem>
                  {MOODS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.emoji} {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="glass mt-10 rounded-3xl py-16 text-center text-muted-foreground">
              {entries.length === 0
                ? "No entries yet — the first page is always the hardest."
                : "Nothing matches those filters."}
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onOpen={() => setSelected(entry)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <EntryDetail
        entry={selected}
        onClose={() => setSelected(null)}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
        {icon}
        {value}
      </dd>
    </div>
  );
}
