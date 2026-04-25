import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Users,
  Megaphone,
  Scale,
  Upload,
  Database,
  GitCompare,
  Sparkles,
  Landmark,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Bill Trax — Accessible legislation tracking for everyone" },
      {
        name: "description",
        content:
          "Bill Trax makes bill tracking accessible to lobbying groups, nonprofits, journalists, and the public. Learn how to upload bills or pull them directly from Congress.gov.",
      },
      {
        property: "og:title",
        content: "About Bill Trax — Accessible legislation tracking for everyone",
      },
      {
        property: "og:description",
        content:
          "Bill tracking shouldn't be a privilege. Learn who Bill Trax is for and how to use it.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/70 bg-grain">
          <div className="absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-gold/10 to-transparent" />
          <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              About Bill Trax
            </div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Bill tracking, <em className="text-gold not-italic">for everyone</em>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Legislation moves fast and the tools to follow it have historically been
              expensive, technical, or buried inside law firm subscriptions. Bill Trax exists
              to change that — putting professional-grade bill tracking in the hands of
              anyone who needs it.
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Who it's for</h2>
            <p className="mt-3 text-muted-foreground">
              If your work depends on knowing what's in a bill — and how it changed — Bill
              Trax was built for you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Audience
              icon={<Building2 className="h-5 w-5" />}
              title="Lobbying groups & government affairs"
              body="Track every amendment in real time. Compare House and Senate versions side by side. Build a defensible record of what changed and when."
            />
            <Audience
              icon={<Users className="h-5 w-5" />}
              title="Nonprofits & advocacy organizations"
              body="Monitor the issues your mission depends on without paying for an enterprise subscription. Tag bills by topic and share findings with your team."
            />
            <Audience
              icon={<Megaphone className="h-5 w-5" />}
              title="Journalists & researchers"
              body="See exactly what language was added, removed, or quietly rewritten between drafts. Cite specific versions with confidence."
            />
            <Audience
              icon={<Scale className="h-5 w-5" />}
              title="Engaged citizens & students"
              body="Read what your representatives are actually voting on. No legal training required — Bill Trax surfaces plain-language summaries and topic tags."
            />
          </div>
        </section>

        {/* How to use */}
        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                How to use Bill Trax
              </h2>
              <p className="mt-3 text-muted-foreground">
                Two ways to get a bill into your workspace, depending on where it came from.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Option 1: Upload */}
              <div className="rounded-xl border border-border bg-background p-8 shadow-soft">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Option 1
                </div>
                <h3 className="text-2xl font-semibold">Upload the bill</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Best for drafts that haven't been introduced yet, state-level legislation,
                  committee markups, or anything that isn't published on Congress.gov. Drop in
                  a PDF or paste the text — Bill Trax handles versioning from there.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  <Bullet>Use for non-public or pre-introduction drafts</Bullet>
                  <Bullet>Upload subsequent versions to auto-generate diffs</Bullet>
                  <Bullet>Add private notes only your team can see</Bullet>
                </ul>
                <Button asChild className="mt-6">
                  <Link to="/upload">
                    Upload a bill <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Option 2: Congress.gov */}
              <div className="rounded-xl border border-border bg-background p-8 shadow-soft">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Option 2
                </div>
                <h3 className="text-2xl font-semibold">Pull from Congress.gov</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For any bill introduced in the U.S. Congress, Bill Trax connects directly to
                  the official Congress.gov API. Search by bill number (e.g.{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">HR 1234</code>)
                  and we'll fetch every version, sponsor, and amendment automatically.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  <Bullet>Official source — straight from the Library of Congress</Bullet>
                  <Bullet>Automatic updates when new versions are introduced</Bullet>
                  <Bullet>Sponsor, cosponsors, and amendment history included</Bullet>
                </ul>
                <Button asChild variant="outline" className="mt-6">
                  <Link to="/dashboard">
                    Browse from Congress.gov <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              What you get either way
            </h2>
            <p className="mt-3 text-muted-foreground">
              However the bill gets into Bill Trax, the same tools are waiting.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              icon={<GitCompare className="h-5 w-5" />}
              title="Version compare"
              body="Adds in green, removes in red. See exactly what changed between any two drafts."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="AI topic tagging"
              body="Define a topic in plain English and Bill Trax surfaces every matching passage across versions."
            />
            <Feature
              icon={<Landmark className="h-5 w-5" />}
              title="Amendment tracking"
              body="Sponsor, party, status, and a preview of how the bill would read if the amendment is adopted."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to start tracking?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Free to get started. No credit card. Bring your first bill in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-elevated">
                <Link to="/register">
                  Create an account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
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

function Audience({
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
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-muted-foreground">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}
