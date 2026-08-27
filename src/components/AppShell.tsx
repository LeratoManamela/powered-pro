import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: CalendarCheck },
  { to: "/tasks", label: "Task Planner", icon: Sparkles },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-foreground shadow-[inset_2px_0_0_0_var(--color-sidebar-primary)]",
          }}
        >
          <Icon className="size-4.5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 py-1">
        <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <span className="leading-tight">

          <span className="block text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">
            Productivity Assistant
          </span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3 text-xs leading-relaxed text-sidebar-foreground/70">
        AI outputs may be inaccurate. Always review and edit before sharing.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-foreground hover:bg-accent"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold">Workplace AI</span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs text-muted-foreground sm:px-6 lg:px-10">
          Responsible AI: generated content is assistive only. Verify facts, remove sensitive
          data before input, and keep a human in the loop for decisions.
        </footer>
      </div>
    </div>
  );
}
