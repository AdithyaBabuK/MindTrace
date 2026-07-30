import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Markdown } from "./Markdown";
import { formatDate, moodOf, type Entry } from "@/lib/journal";
import { Pencil, Trash2 } from "lucide-react";

export function EntryDetail({
  entry,
  onClose,
  onEdit,
  onDelete,
}: {
  entry: Entry | null;
  onClose: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-panel max-h-[88vh] gap-0 overflow-y-auto rounded-3xl sm:max-w-2xl">
        {entry && (
          <>
            <DialogHeader className="text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium tracking-wide text-secondary-foreground uppercase">
                  {entry.category}
                </span>
                <span className="text-muted-foreground">{formatDate(entry.date)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {moodOf(entry.mood).emoji} {moodOf(entry.mood).label}
                </span>
              </div>
              <DialogTitle className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight">
                {entry.title}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 border-t border-border pt-4">
              <Markdown content={entry.content} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
              <Button onClick={() => onEdit(entry)} className="gap-2">
                <Pencil className="size-4" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive">
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      “{entry.title}” will be permanently removed from this device. This can't be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(entry.id)}>
                      Delete entry
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
