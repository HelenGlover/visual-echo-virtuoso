import { useMemo, useState } from "react";
import { Sparkles, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function TopicDialog({
  open,
  onOpenChange,
  text,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  text: string;
  onAdd: (topic: { name: string; matches: number }) => void;
}) {
  const [name, setName] = useState("");
  const [running, setRunning] = useState(false);
  const [matches, setMatches] = useState<string[] | null>(null);

  const sentences = useMemo(
    () =>
      text
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [text],
  );

  function runAi() {
    if (!name.trim()) return;
    setRunning(true);
    setMatches(null);
    // Mock AI matching: keyword overlap between topic words and sentences.
    const tokens = name
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 3);
    setTimeout(() => {
      const found = sentences.filter((s) =>
        tokens.some((t) => s.toLowerCase().includes(t)),
      );
      setMatches(found.length ? found.slice(0, 5) : sentences.slice(0, 2));
      setRunning(false);
    }, 700);
  }

  function add() {
    if (!name.trim() || !matches) return;
    onAdd({ name: name.trim(), matches: matches.length });
    toast.success("Topic added", { description: `${matches.length} passages tagged.` });
    setName("");
    setMatches(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Tag a new topic</DialogTitle>
          <DialogDescription>
            Name the topic — Bill Trax will surface every passage in this version that matches.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic name</Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                placeholder="e.g. defense spending for Maryland"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button type="button" onClick={runAi} disabled={running || !name.trim()}>
                <Sparkles className="mr-1.5 h-4 w-4" />
                {running ? "Scanning…" : "Run AI"}
              </Button>
            </div>
          </div>

          {matches && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3.5 w-3.5" /> {matches.length} matches
              </div>
              <ul className="space-y-2">
                {matches.map((m, i) => (
                  <li key={i} className="rounded-md bg-background p-3 text-sm leading-relaxed">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      Match {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={add} disabled={!matches} className="bg-primary text-primary-foreground">
            Add topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
