import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Landmark, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSession, getSession, type Session } from "@/lib/auth";

export function SiteHeader() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    setSessionState(getSession());
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-soft">
            <Landmark className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold tracking-tight">Bill Trax</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Legislation, tracked
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {session && (
            <>
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/upload" label="Upload Bill" />
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {session.firstName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearSession();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useRouterState({ select: (s) => s.location });
  const active = location.pathname === to || location.pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
