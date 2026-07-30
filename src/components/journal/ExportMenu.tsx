import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileText, FileType2, Presentation, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Entry } from "@/lib/journal";
import {
  exportJSON,
  exportMarkdown,
  exportPDF,
  exportPPTX,
  exportText,
  parseImportFile,
} from "@/lib/journal-io";

export function ExportMenu({
  entries,
  onImport,
}: {
  entries: Entry[];
  onImport: (imported: Entry[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (label: string, fn: () => void | Promise<void>) => {
    if (entries.length === 0) {
      toast.error("Nothing to export yet");
      return;
    }
    try {
      setBusy(true);
      await fn();
      toast.success(`Exported as ${label}`);
    } catch {
      toast.error(`Could not export as ${label}`);
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      const imported = await parseImportFile(file);
      if (imported.length === 0) {
        toast.error("No entries found in that file");
        return;
      }
      onImport(imported);
      toast.success(`Imported ${imported.length} ${imported.length === 1 ? "entry" : "entries"}`);
    } catch {
      toast.error("Could not read that file");
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.md,.markdown,.txt,application/json,text/markdown,text/plain"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" disabled={busy}>
            <Download className="size-4" /> Export / Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export entries</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => void run("PDF", () => exportPDF(entries))}>
            <FileType2 className="size-4" /> PDF document
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run("PowerPoint", () => exportPPTX(entries))}>
            <Presentation className="size-4" /> PowerPoint (.pptx)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run("JSON", () => exportJSON(entries))}>
            <FileJson className="size-4" /> JSON backup
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run("Markdown", () => exportMarkdown(entries))}>
            <FileText className="size-4" /> Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run("text", () => exportText(entries))}>
            <FileText className="size-4" /> Plain text (.txt)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Import</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
            <Upload className="size-4" /> From JSON / Markdown / text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
