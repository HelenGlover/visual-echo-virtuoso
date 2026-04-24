import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Upload as UploadIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockBills } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload bill · Bill Trax" }] }),
});

function UploadPage() {
  const navigate = useNavigate();
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [chamber, setChamber] = useState("house");
  const [billType, setBillType] = useState("HR");
  const [congress, setCongress] = useState("119");

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
  }, [navigate]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Bill queued", {
      description: "We'll process the version and tag it shortly.",
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">Upload a bill</h1>
        <p className="mt-2 text-muted-foreground">
          Pick from the directory or upload a PDF. We'll extract the text and prepare it for diff
          and topic tagging.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <Checkbox
                id="newv"
                checked={isNewVersion}
                onCheckedChange={(v) => setIsNewVersion(Boolean(v))}
              />
              <div>
                <Label htmlFor="newv" className="font-medium">
                  This is a new version of an existing bill
                </Label>
                <p className="text-xs text-muted-foreground">
                  We'll attach this version to the bill you select below.
                </p>
              </div>
            </div>
          </div>

          {isNewVersion ? (
            <Field label="Existing bill">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tracked bill" />
                </SelectTrigger>
                <SelectContent>
                  {mockBills.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.number} — {b.shortTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Bill from directory">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Search directory…" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBills.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.number} — {b.shortTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="…or upload PDF">
                <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  <UploadIcon className="mr-1.5 h-4 w-4" /> Drop PDF here
                </div>
              </Field>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Congress session">
              <Input
                value={congress}
                onChange={(e) => setCongress(e.target.value)}
                placeholder="119"
              />
            </Field>
            <Field label="Chamber">
              <Select value={chamber} onValueChange={setChamber}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="senate">Senate</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bill type">
              <Select value={billType} onValueChange={setBillType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR — House Bill</SelectItem>
                  <SelectItem value="S">S — Senate Bill</SelectItem>
                  <SelectItem value="HJRES">HJRES — House Joint Res.</SelectItem>
                  <SelectItem value="SJRES">SJRES — Senate Joint Res.</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Version label">
            <Input placeholder="e.g. Introduced, Engrossed, Enrolled" />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Related bill (other chamber)">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {mockBills.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.number} — {b.shortTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Previous-year bill (for compare)">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {mockBills.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.number} — {b.shortTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button asChild type="button" variant="ghost">
              <Link to="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Add to workspace
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
