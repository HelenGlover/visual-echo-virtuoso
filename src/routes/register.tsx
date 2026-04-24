import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/lib/auth";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Register · Bill Trax" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    organization: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.firstName) return;
    setSession({ email: form.email, firstName: form.firstName, lastName: form.lastName });
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell title="Create your account" subtitle="Free for individuals. Always.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="fn">First name</Label>
            <Input
              id="fn"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ln">Last name</Label>
            <Input
              id="ln"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="em">Email</Label>
          <Input
            id="em"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="un">
            Username <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="un" value={form.username} onChange={(e) => update("username", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="ph">
              Phone <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="ph" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org">
              Organization <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="org"
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
