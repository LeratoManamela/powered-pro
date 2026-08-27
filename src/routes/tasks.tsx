import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Break goals into prioritised, time-boxed task plans with dependencies, owners and realistic scheduling.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Turn a goal into a prioritised, time-boxed work plan you can edit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Sparkles}
        title="AI Task Planner"
        description="Describe a goal and get a prioritised, time-boxed plan with milestones and dependencies."
      />
      <ToolWorkspace
        system="You are a pragmatic project planner. Produce realistic, prioritised plans in markdown: Objective, Milestones, Task table (task | priority | estimate | owner | dependency), Suggested schedule, Risks. Be concrete and avoid filler."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", rows: 5, required: true, placeholder: "Launch the new customer onboarding flow" },
          { name: "deadline", label: "Deadline / timeframe", type: "text", placeholder: "3 weeks" },
          { name: "capacity", label: "Time available", type: "select", options: ["A few hours a week", "Half-time", "Full-time", "Team of 3-5"] },
          { name: "constraints", label: "Constraints & context", type: "textarea", rows: 4, placeholder: "Design resource only available week 2, must pass security review." },
          { name: "style", label: "Planning method", type: "select", options: ["Priority-first", "Weekly sprints", "Daily schedule", "Kanban backlog"] },
        ]}
        buildPrompt={(v) =>
          `Create a work plan.\nGoal: ${v.goal}\nDeadline: ${v.deadline || "flexible"}\nCapacity: ${v.capacity}\nPlanning method: ${v.style}\nConstraints: ${v.constraints || "none stated"}`
        }
        submitLabel="Build plan"
        outputLabel="Task plan (editable)"
      />
    </AppShell>
  );
}
