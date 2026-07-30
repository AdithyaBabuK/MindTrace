export type Category = "Personal" | "Work" | "Ideas" | "Reflection";
export type MoodId = "happy" | "calm" | "anxious" | "sad" | "energetic";

export interface Entry {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  category: Category;
  mood: MoodId;
  content: string;
  createdAt: number;
}

export const CATEGORIES: Category[] = ["Personal", "Work", "Ideas", "Reflection"];

export const MOODS: { id: MoodId; emoji: string; label: string }[] = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "calm", emoji: "🌿", label: "Calm" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "energetic", emoji: "⚡", label: "Energetic" },
];

export const moodOf = (id: MoodId) => MOODS.find((m) => m.id === id) ?? MOODS[0];

const KEY = "mindtrace.entries.v1";

export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function sampleEntries(): Entry[] {
  return [
    {
      id: "sample-1",
      title: "Morning light on the kitchen table",
      date: todayISO(),
      category: "Personal",
      mood: "calm",
      content:
        "## A slow start\n\nWoke before the alarm and let the coffee steep longer than usual. The light came in **sideways** through the blinds and made stripes across everything.\n\n- Read ten pages, no phone\n- Watered the monstera (finally)\n- Wrote down three things I'm not worried about anymore\n\nSmall mornings like this are the whole point.",
      createdAt: Date.now(),
    },
    {
      id: "sample-2",
      title: "Shipping the redesign",
      date: daysAgoISO(1),
      category: "Work",
      mood: "energetic",
      content:
        "## Launch day\n\nWe pushed the new onboarding flow at 11am. Zero rollbacks, and the drop-off between step two and three already looks *better*.\n\nWhat worked:\n\n- Cutting the form from nine fields to four\n- Writing the copy before the layout\n\nNext week: instrument the empty states properly.",
      createdAt: Date.now() - 1,
    },
    {
      id: "sample-3",
      title: "A notebook is a slower kind of memory",
      date: daysAgoISO(4),
      category: "Reflection",
      mood: "happy",
      content:
        "Found an old journal in the closet — entries from four years ago, mostly about things that felt enormous at the time.\n\n> The worry you write down stops growing in the dark.\n\nI barely remember half of it, which is oddly comforting. Writing isn't only for remembering; it's for **putting things down** so your hands are free.",
      createdAt: Date.now() - 2,
    },
  ];
}

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seed = sampleEntries();
      window.localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Entry[]) : [];
  } catch {
    return sampleEntries();
  }
}

export function saveEntries(entries: Entry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

export function sortEntries(entries: Entry[]) {
  return [...entries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  );
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return iso;
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function plainText(md: string) {
  return md
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Writing streak: consecutive days ending today (or yesterday) with an entry. */
export function computeStreak(entries: Entry[]) {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map((e) => e.date));
  const cursor = new Date();
  const iso = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (!days.has(iso(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(iso(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(iso(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function topMood(entries: Entry[]) {
  if (entries.length === 0) return null;
  const counts = new Map<MoodId, number>();
  entries.forEach((e) => counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1));
  const [id] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return moodOf(id);
}

export function exportEntries(entries: Entry[]) {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mindtrace-entries-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
