import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, MOODS, todayISO, type Category, type Entry, type MoodId } from "@/lib/journal";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const blank = () => ({
  title: "",
  date: todayISO(),
  category: "Personal" as Category,
  mood: "calm" as MoodId,
  content: "",
});

export function EntryForm({
  editing,
  onSave,
  onCancelEdit,
}: {
  editing: Entry | null;
  onSave: (data: Omit<Entry, "id" | "createdAt">) => void;
  onCancelEdit: () => void;
}) {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        date: editing.date,
        category: editing.category,
        mood: editing.mood,
        content: editing.content,
      });
    } else {
      setForm(blank());
    }
  }, [editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    if (!editing) setForm(blank());
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {editing ? "Edit entry" : "Today's page"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Markdown supported — use ## headings, **bold**, *italic*, - lists, {"> "}quotes.
          </p>
        </div>
        {editing && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
            <X className="size-4" /> Cancel
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            placeholder="What do you want to remember?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm({ ...form, category: v as Category })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Mood</Label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setForm({ ...form, mood: m.id })}
                aria-pressed={form.mood === m.id}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all",
                  form.mood === m.id
                    ? "border-accent bg-accent/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground",
                )}
              >
                <span className="text-base leading-none">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="content">Entry</Label>
          <Textarea
            id="content"
            required
            rows={10}
            placeholder="Start writing…"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="ruled-paper resize-y bg-paper leading-8 font-display text-[1.02rem]"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" className="gap-2">
          <Check className="size-4" />
          {editing ? "Update entry" : "Save entry"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setForm(blank())}>
          Clear form
        </Button>
      </div>
    </form>
  );
}
