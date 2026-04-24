import { useEffect, useState } from "react";
import { NotebookPen, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type BillNote,
  createNote,
  getNotes,
  saveNotes,
} from "@/lib/bill-notes";

export function BillNotes({ billId }: { billId: string }) {
  const [notes, setNotes] = useState<BillNote[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Load on mount / billId change
  useEffect(() => {
    setNotes(getNotes(billId));
    setDraft("");
    setEditingId(null);
  }, [billId]);

  const persist = (next: BillNote[]) => {
    setNotes(next);
    saveNotes(billId, next);
  };

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const note = createNote(trimmed);
    persist([note, ...notes]);
    setDraft("");
  };

  const handleDelete = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
  };

  const startEdit = (note: BillNote) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editingText.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    persist(
      notes.map((n) =>
        n.id === editingId ? { ...n, text: trimmed, updatedAt: now } : n,
      ),
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <NotebookPen className="h-4 w-4" /> Notes
        </h3>
        <span className="text-xs text-muted-foreground">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note about this bill — markup, questions, talking points…"
          className="min-h-[88px] resize-y text-sm"
          maxLength={2000}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {draft.length}/2000 · ⌘/Ctrl + Enter to save
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!draft.trim()}
            className="bg-primary text-primary-foreground"
          >
            Add note
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <ul className="mt-5 space-y-3">
          {notes.map((note) => {
            const isEditing = editingId === note.id;
            return (
              <li
                key={note.id}
                className="rounded-md border border-border bg-background p-3"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="min-h-[80px] resize-y text-sm"
                      maxLength={2000}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                        }}
                      >
                        <X className="mr-1 h-3 w-3" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-2"
                        onClick={saveEdit}
                        disabled={!editingText.trim()}
                      >
                        <Check className="mr-1 h-3 w-3" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {note.text}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {formatTimestamp(note.updatedAt)}
                        {note.updatedAt !== note.createdAt && " · edited"}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => startEdit(note)}
                          aria-label="Edit note"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(note.id)}
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
