import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSearch, GitCompare, Sparkles, Landmark } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bill Trax — Track every version of every bill" },
      {
        name: "description",
        content:
          "Bill Trax helps policy teams compare bill versions, tag topics with AI, and never miss an amendment.",
      },
      { property: "og:title", content: "Bill Trax — Track every version of every bill" },
      {
        property: "og:description",
        content: "Compare bill versions, tag topics with AI, and never miss an amendment.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/70 bg-grain">
          <div className="absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-gold/10 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                119th Congress · Live
              </div>
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                Track every version of <em className="text-gold not-italic">every bill</em>.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Bill Trax is the workspace for policy teams, journalists, and advocacy
                organizations to compare versions, tag topics with AI, and follow amendments —
                all in one place.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-elevated"
                >
                  <Link to="/register">
                    Get started free <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              icon={<GitCompare className="h-5 w-5" />}
              title="Side-by-side compare"
              body="See exactly what changed between House and Senate versions, or year over year. Adds in green, removes in red."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="AI topic tagging"
              body="Define a topic — “defense spending for Maryland” — and Bill Trax surfaces every matching passage."
            />
            <Feature
              icon={<FileSearch className="h-5 w-5" />}
              title="Amendments, tracked"
              body="Sponsor, party, status, and a preview of how the bill would read if adopted."
            />
          </div>
        </section>

        <footer className="border-t border-border/70 bg-card/50">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4" /> Bill Trax · For the public record.
            </div>
            <div>© {new Date().getFullYear()} Bill Trax</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
