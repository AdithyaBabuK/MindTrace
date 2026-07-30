import { formatDate, moodOf, plainText, todayISO, type Entry } from "./journal";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const stamp = () => todayISO();

export function exportJSON(entries: Entry[]) {
  download(
    new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" }),
    `mindtrace-entries-${stamp()}.json`,
  );
}

export function entriesToMarkdown(entries: Entry[]) {
  return entries
    .map((e) => {
      const m = moodOf(e.mood);
      return `# ${e.title}\n\n_${formatDate(e.date)} · ${e.category} · ${m.emoji} ${m.label}_\n\n${e.content}\n`;
    })
    .join("\n---\n\n");
}

export function exportMarkdown(entries: Entry[]) {
  download(
    new Blob([entriesToMarkdown(entries)], { type: "text/markdown" }),
    `mindtrace-entries-${stamp()}.md`,
  );
}

export function exportText(entries: Entry[]) {
  const txt = entries
    .map((e) => {
      const m = moodOf(e.mood);
      return `${e.title}\n${formatDate(e.date)} | ${e.category} | ${m.label}\n\n${plainText(e.content)}\n`;
    })
    .join("\n----------------------------------------\n\n");
  download(new Blob([txt], { type: "text/plain" }), `mindtrace-entries-${stamp()}.txt`);
}

export async function exportPDF(entries: Entry[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text("MindTrace Journal", margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${entries.length} entries · exported ${formatDate(todayISO())}`, margin, y);
  y += 30;

  entries.forEach((e, i) => {
    const m = moodOf(e.mood);
    ensure(80);
    if (i > 0) y += 10;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.splitTextToSize(e.title, pageW - margin * 2).forEach((line: string) => {
      ensure(20);
      doc.text(line, margin, y);
      y += 20;
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${formatDate(e.date)}  ·  ${e.category}  ·  ${m.label}`, margin, y);
    y += 18;
    doc.setFontSize(11);
    const body = e.content.replace(/\r/g, "").split("\n");
    body.forEach((para) => {
      if (!para.trim()) {
        y += 8;
        return;
      }
      const clean = para.replace(/^#{1,6}\s*/, "").replace(/[*_`]/g, "");
      doc.splitTextToSize(clean, pageW - margin * 2).forEach((line: string) => {
        ensure(16);
        doc.text(line, margin, y);
        y += 16;
      });
    });
    y += 12;
    ensure(12);
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
  });

  doc.save(`mindtrace-entries-${stamp()}.pdf`);
}

export async function exportPPTX(entries: Entry[]) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  const cover = pptx.addSlide();
  cover.background = { color: "120711" };
  cover.addText("MindTrace Journal", {
    x: 0.7,
    y: 2.1,
    w: 8.6,
    fontSize: 48,
    bold: true,
    color: "FF5C7A",
    fontFace: "Georgia",
  });
  cover.addText(`${entries.length} entries · exported ${formatDate(todayISO())}`, {
    x: 0.7,
    y: 3.2,
    w: 8.6,
    fontSize: 20,
    color: "E8D6DC",
  });

  entries.forEach((e) => {
    const m = moodOf(e.mood);
    const slide = pptx.addSlide();
    slide.background = { color: "1A0D14" };
    slide.addText(e.title, {
      x: 0.6,
      y: 0.45,
      w: 8.8,
      fontSize: 32,
      bold: true,
      color: "FFFFFF",
      fontFace: "Georgia",
    });
    slide.addText(`${formatDate(e.date)}  ·  ${e.category}  ·  ${m.emoji} ${m.label}`, {
      x: 0.6,
      y: 1.35,
      w: 8.8,
      fontSize: 14,
      color: "FF8FA6",
    });
    slide.addText(plainText(e.content).slice(0, 900), {
      x: 0.6,
      y: 1.9,
      w: 8.8,
      h: 3.2,
      fontSize: 16,
      color: "EADFE3",
      valign: "top",
    });
  });

  await pptx.writeFile({ fileName: `mindtrace-entries-${stamp()}.pptx` });
}

/** Parse an imported file (JSON or Markdown/text) into entries. */
export async function parseImportFile(file: File): Promise<Entry[]> {
  const text = await file.text();
  const now = Date.now();

  if (file.name.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list
      .filter((r) => r && typeof r === "object" && (r.title || r.content))
      .map((r, i) => normalize(r, now - i));
  }

  const blocks = text
    .split(/\n---+\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const titleLine = lines.find((l) => l.trim()) ?? "Imported entry";
    const title = titleLine.replace(/^#{1,6}\s*/, "").trim().slice(0, 120);
    const content = lines.slice(lines.indexOf(titleLine) + 1).join("\n").trim();
    return normalize({ title, content }, now - i);
  });
}

function normalize(raw: Record<string, unknown>, createdAt: number): Entry {
  const cats = ["Personal", "Work", "Ideas", "Reflection"];
  const moods = ["happy", "calm", "anxious", "sad", "energetic"];
  const category = cats.includes(String(raw.category)) ? String(raw.category) : "Personal";
  const mood = moods.includes(String(raw.mood)) ? String(raw.mood) : "calm";
  const date =
    typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
      ? raw.date
      : todayISO();
  return {
    id: crypto.randomUUID(),
    title: String(raw.title ?? "Imported entry").slice(0, 200),
    date,
    category: category as Entry["category"],
    mood: mood as Entry["mood"],
    content: String(raw.content ?? ""),
    createdAt,
  };
}
