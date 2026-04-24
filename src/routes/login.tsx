import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Log in · Bill Trax" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const firstName = email.split("@")[0].split(".")[0] || "Friend";
    setSession({ email, firstName, lastName: "" });
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your Bill Trax workspace.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.gov"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pwd">Password</Label>
          <Input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground">
          Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Register a new account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:block">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
              <Landmark className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold">Bill Trax</span>
          </Link>
          <div className="max-w-md">
            <h2 className="font-serif text-4xl leading-tight">
              The workspace for the people reading the bill.
            </h2>
            <p className="mt-4 text-primary-foreground/70">
              Compare versions, follow amendments, and tag topics that matter — all powered by AI.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/50">
            119th Congress
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <Landmark className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold">Bill Trax</span>
          </Link>
          <h1 className="font-serif text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
