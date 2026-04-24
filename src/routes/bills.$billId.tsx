import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  GitCompare,
  MessageSquare,
  Plus,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicDialog } from "@/components/topic-dialog";
import { getBill, type TopicTag } from "@/lib/mock-data";
import { diffWords } from "@/lib/diff";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/bills/$billId")({
  component: BillDetail,
  loader: ({ params }) => {
    const bill = getBill(params.billId);
    if (!bill) throw notFound();
    return { bill };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.bill.number} · Bill Trax` },
      { name: "description", content: loaderData?.bill.summary },
      { property: "og:title", content: `${loaderData?.bill.number} — ${loaderData?.bill.title}` },
      { property: "og:description", content: loaderData?.bill.summary },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold">Bill not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-primary underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  ),
});

function BillDetail() {
  const { bill } = Route.useLoaderData();
  const navigate = useNavigate();
  const [extraTopics, setExtraTopics] = useState<TopicTag[]>([]);
  const [topicOpen, setTopicOpen] = useState(false);

  const versions = bill.versions;
  const initialBase = versions.find((v) => v.isBase) ?? versions[0];
  const initialNew = versions.find((v) => v.isNew) ?? versions[versions.length - 1];

  const [baseId, setBaseId] = useState(initialBase.id);
  const [newId, setNewId] = useState(initialNew.id);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
  }, [navigate]);

  const baseV = versions.find((v) => v.id === baseId) ?? initialBase;
  const newV = versions.find((v) => v.id === newId) ?? initialNew;

  const allTopics = [...bill.topics, ...extraTopics];
  const currentText = newV.text;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        {/* Header */}
        <header className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                {bill.number}
              </span>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {bill.chamber === "house" ? "House" : "Senate"}
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary text-[10px] uppercase tracking-wider">
                {bill.status}
              </Badge>
              <Badge className="bg-gold/20 text-gold-foreground hover:bg-gold/20 text-[10px] uppercase tracking-wider">
                {bill.congress}th Congress
              </Badge>
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              {bill.title}
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">{bill.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {bill.sponsor}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Introduced{" "}
                {new Date(bill.introduced).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Upload className="mr-1.5 h-4 w-4" /> Upload new version
            </Button>
            <Button onClick={() => setTopicOpen(true)} className="bg-primary text-primary-foreground">
              <Sparkles className="mr-1.5 h-4 w-4" /> Tag topic
            </Button>
          </div>
        </header>

        {/* Legislative progress */}
        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Legislative progress
            </h2>
            <span className="text-xs text-muted-foreground">
              From introduction to law
            </span>
          </div>
          <BillProgress stage={bill.stage} />
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div>
            <Tabs defaultValue="compare" className="w-full">
              <TabsList>
                <TabsTrigger value="compare">
                  <GitCompare className="mr-1.5 h-4 w-4" /> Compare
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FileText className="mr-1.5 h-4 w-4" /> Bill text
                </TabsTrigger>
                <TabsTrigger value="amendments">
                  <MessageSquare className="mr-1.5 h-4 w-4" /> Amendments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="compare" className="mt-6">
                <CompareView
                  versions={versions}
                  baseId={baseId}
                  newId={newId}
                  onBase={setBaseId}
                  onNew={setNewId}
                  baseText={baseV.text}
                  newText={newV.text}
                />
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <article className="rounded-xl border border-border bg-card p-8 shadow-soft">
                  <div className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {newV.label} · {new Date(newV.date).toLocaleDateString("en-US")}
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {newV.text}
                  </pre>
                </article>
              </TabsContent>

              <TabsContent value="amendments" className="mt-6">
                {bill.amendments.length === 0 ? (
                  <EmptyState
                    icon={<MessageSquare className="h-5 w-5" />}
                    title="No amendments yet"
                    body="When amendments are filed, they'll appear here with sponsor, party, and a preview."
                  />
                ) : (
                  <ul className="space-y-3">
                    {bill.amendments.map((a) => (
                      <li
                        key={a.id}
                        className="rounded-xl border border-border bg-card p-5 shadow-soft"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{a.number}</span>
                          <Badge
                            className={
                              a.party === "D"
                                ? "bg-chart-5/20 text-chart-5 hover:bg-chart-5/20"
                                : a.party === "R"
                                  ? "bg-destructive/15 text-destructive hover:bg-destructive/15"
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary"
                            }
                          >
                            {a.party}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            {a.status}
                          </Badge>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {new Date(a.date).toLocaleDateString("en-US")}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium">{a.sponsor}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {a.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <SidebarCard title="Versions">
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-background p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{v.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(v.date).toLocaleDateString("en-US")}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-[10px] uppercase tracking-wider">
                      {baseId === v.id && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">
                          base
                        </span>
                      )}
                      {newId === v.id && (
                        <span className="rounded bg-gold/20 px-1.5 py-0.5 text-gold-foreground">
                          new
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </SidebarCard>

            <SidebarCard
              title="Topics of interest"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => setTopicOpen(true)}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              }
            >
              {allTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No topics yet. Tag one to surface every matching passage.
                </p>
              ) : (
                <ul className="space-y-2">
                  {allTopics.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between rounded-md border border-border bg-background p-3"
                    >
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.matches} matches</span>
                    </li>
                  ))}
                </ul>
              )}
            </SidebarCard>

            {(bill.relatedBillId || bill.previousYearBillId) && (
              <SidebarCard title="Related">
                <ul className="space-y-2 text-sm">
                  {bill.relatedBillId && (
                    <li>
                      <Link
                        to="/bills/$billId"
                        params={{ billId: bill.relatedBillId }}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Companion bill →
                      </Link>
                    </li>
                  )}
                  {bill.previousYearBillId && (
                    <li>
                      <span className="text-muted-foreground">Previous year: </span>
                      <span className="font-mono text-xs">{bill.previousYearBillId}</span>
                    </li>
                  )}
                </ul>
              </SidebarCard>
            )}
          </aside>
        </div>
      </main>

      <TopicDialog
        open={topicOpen}
        onOpenChange={setTopicOpen}
        text={currentText}
        onAdd={(t) =>
          setExtraTopics((prev) => [
            ...prev,
            { id: `local-${Date.now()}`, name: t.name, matches: t.matches },
          ])
        }
      />
    </div>
  );
}

function CompareView({
  versions,
  baseId,
  newId,
  onBase,
  onNew,
  baseText,
  newText,
}: {
  versions: { id: string; label: string; date: string }[];
  baseId: string;
  newId: string;
  onBase: (v: string) => void;
  onNew: (v: string) => void;
  baseText: string;
  newText: string;
}) {
  const segs = useMemo(() => diffWords(baseText, newText), [baseText, newText]);
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const s of segs) {
      if (s.type === "add") added += s.text.trim().split(/\s+/).filter(Boolean).length;
      else if (s.type === "remove")
        removed += s.text.trim().split(/\s+/).filter(Boolean).length;
    }
    return { added, removed };
  }, [segs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex-1 min-w-[180px]">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Base version</div>
          <Select value={baseId} onValueChange={onBase}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label} · {new Date(v.date).toLocaleDateString("en-US")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <GitCompare className="mb-2 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-[180px]">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">New version</div>
          <Select value={newId} onValueChange={onNew}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label} · {new Date(v.date).toLocaleDateString("en-US")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-md bg-diff-add px-2 py-1 font-medium text-diff-add-foreground">
            +{stats.added} added
          </span>
          <span className="rounded-md bg-diff-remove px-2 py-1 font-medium text-diff-remove-foreground">
            −{stats.removed} removed
          </span>
        </div>
      </div>

      {baseId === newId ? (
        <EmptyState
          icon={<GitCompare className="h-5 w-5" />}
          title="Pick two different versions"
          body="Choose a base and a new version to see what changed."
        />
      ) : (
        <article className="rounded-xl border border-border bg-card p-8 font-mono text-sm leading-[1.7] shadow-soft">
          {segs.map((s, i) =>
            s.type === "same" ? (
              <span key={i}>{s.text}</span>
            ) : s.type === "add" ? (
              <span
                key={i}
                className="rounded-sm bg-diff-add px-0.5 text-diff-add-foreground"
              >
                {s.text}
              </span>
            ) : (
              <span
                key={i}
                className="rounded-sm bg-diff-remove px-0.5 text-diff-remove-foreground line-through decoration-diff-remove-foreground/40"
              >
                {s.text}
              </span>
            ),
          )}
        </article>
      )}
    </div>
  );
}

function SidebarCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
