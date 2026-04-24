import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  NotebookPen,
  Plus,
  StickyNote,
  Upload,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockBills, mockNotes, type Bill } from "@/lib/mock-data";
import { STAGES } from "@/lib/stages";
import { BillProgress } from "@/components/bill-progress";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard · Bill Trax" }] }),
});

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("there");

  useEffect(() => {
    const s = getSession();
    if (!s) navigate({ to: "/login" });
    else setName(s.firstName || "there");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Welcome back, {name}
            </p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight md:text-5xl">
              Your tracked bills
            </h1>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary text-primary-foreground">
              <Link to="/upload">
                <Upload className="mr-1.5 h-4 w-4" /> Upload bill
              </Link>
            </Button>
            <Button variant="outline">
              <NotebookPen className="mr-1.5 h-4 w-4" /> Upload notes
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <SectionHeading icon={<FileText className="h-4 w-4" />} title="Bills" count={mockBills.length} />
            <ul className="mt-4 space-y-4">
              {mockBills.map((b) => (
                <li key={b.id}>
                  <BillCard bill={b} />
                </li>
              ))}
              <li>
                <Link
                  to="/upload"
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-6 py-6 text-sm font-medium text-muted-foreground transition-colors hover:border-border/80 hover:bg-secondary/60 hover:text-foreground"
                >
                  <Plus className="h-4 w-4" /> Add another bill
                </Link>
              </li>
            </ul>
          </section>

          <aside>
            <SectionHeading icon={<StickyNote className="h-4 w-4" />} title="Notes" count={mockNotes.length} />
            <ul className="mt-4 space-y-3">
              {mockNotes.map((n) => (
                <li
                  key={n.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-base font-semibold">{n.title}</h3>
                    <span className="text-xs text-muted-foreground">{formatDate(n.date)}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {n.excerpt}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </span>
      <span className="font-semibold">{title}</span>
      <span className="text-muted-foreground">· {count}</span>
    </div>
  );
}

function BillCard({ bill }: { bill: Bill }) {
  const stageLabel = STAGES.find((s) => s.key === bill.stage)?.label ?? bill.status;
  return (
    <Link
      to="/bills/$billId"
      params={{ billId: bill.id }}
      className="group block rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-elevated md:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-semibold text-primary">
          {bill.chamber === "house" ? "H" : "S"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {bill.number}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] uppercase tracking-wider ${
                bill.stage === "law"
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border"
              }`}
            >
              {stageLabel}
            </Badge>
            {bill.versions.length > 1 && (
              <Badge className="bg-gold/20 text-gold-foreground hover:bg-gold/20 text-[10px] uppercase tracking-wider">
                {bill.versions.length} versions
              </Badge>
            )}
          </div>
          <h3 className="mt-1 font-serif text-lg font-semibold leading-snug">{bill.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{bill.sponsor}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> {formatDate(bill.introduced)}
            </span>
            <span>{bill.amendments.length} amendments</span>
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-5">
        <BillProgress stage={bill.stage} />
      </div>
    </Link>
  );
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
