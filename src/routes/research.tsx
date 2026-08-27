import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Get structured briefings on any work topic: key findings, comparisons, trade-offs and open questions to verify.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Structured briefings with findings, trade-offs and verification checklists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Produce a structured briefing on any topic, with explicit uncertainty and items to verify."
      />
      <ToolWorkspace
        system="You are a rigorous research assistant. Produce structured markdown briefings: Overview, Key Findings, Comparison/Trade-offs, Implications, Open Questions to Verify. You have no live web access — clearly flag anything uncertain or time-sensitive and never fabricate statistics, citations or sources."
        fields={[
          { name: "topic", label: "Research question", type: "textarea", rows: 4, required: true, placeholder: "How do teams typically structure an internal AI usage policy?" },
          { name: "audience", label: "Audience", type: "select", options: ["Executive", "Team lead", "Technical team", "Client", "General"] },
          { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard briefing", "Deep dive"] },
          { name: "angle", label: "Focus / constraints", type: "textarea", rows: 3, placeholder: "Focus on mid-size companies in regulated industries." },
        ]}
        buildPrompt={(v) =>
          `Research briefing request.\nQuestion: ${v.topic}\nAudience: ${v.audience}\nDepth: ${v.depth}\nFocus: ${v.angle || "none"}`
        }
        submitLabel="Run research"
        outputLabel="Research briefing (editable)"
      />
    </AppShell>
  );
}
