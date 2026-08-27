import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday work with AI: draft emails, summarise meetings, plan tasks, research topics and chat with an assistant — all editable, all in one dashboard.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One dashboard for AI email drafting, meeting summaries, task planning, research and chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn bullet points into polished, on-tone workplace emails.",
  },
  {
    to: "/meetings",
    icon: CalendarCheck,
    title: "Meeting Notes Summarizer",
    body: "Convert messy notes into decisions, owners and action items.",
  },
  {
    to: "/tasks",
    icon: Sparkles,
    title: "AI Task Planner",
    body: "Break goals into prioritised, time-boxed plans with milestones.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings with trade-offs and things to verify.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    body: "A conversational assistant for anything else on your desk.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--color-primary)_65%,var(--color-accent))] p-8 text-primary-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
          Workplace AI
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Automate the busywork. Keep the judgement.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-90">
          Five AI workspaces for professionals — structured prompts in, editable drafts out.
          Nothing is sent anywhere until you say so.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-4 py-2.5 text-sm font-semibold transition hover:bg-primary-foreground/10"
          >
            Open the chatbot
          </Link>
        </div>
      </section>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Workspaces
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-card-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-secondary/50 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Responsible AI use</h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Outputs are AI-generated and may be inaccurate, biased or out of date. Treat every
              draft as a starting point: review and edit before sending, keep confidential and
              personal information out of your prompts, and keep a human accountable for any
              decision, communication or commitment made with this tool.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
