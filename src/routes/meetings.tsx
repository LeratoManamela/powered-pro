import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured summaries, decisions and owned action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Summarise meetings into decisions, risks and action items with owners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={CalendarCheck}
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript and get a structured recap with decisions and action items."
      />
      <ToolWorkspace
        system="You are a meeting analyst. Summarise notes accurately and never invent attendees, decisions or dates. Output markdown with sections: Summary, Key Decisions, Action Items (owner — task — due date), Risks & Open Questions."
        fields={[
          { name: "title", label: "Meeting title", type: "text", placeholder: "Q3 roadmap review" },
          { name: "attendees", label: "Attendees", type: "text", placeholder: "Lerato, Sipho, Anna" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, required: true, placeholder: "Paste your notes here…" },
          { name: "focus", label: "Summary style", type: "select", options: ["Balanced recap", "Action-item focused", "Executive brief", "Detailed minutes"] },
        ]}
        buildPrompt={(v) =>
          `Summarise the following meeting.\nTitle: ${v["title"] || "Untitled meeting"}\nAttendees: ${v["attendees"] || "not specified"}\nStyle: ${v["focus"]}\n\nNotes:\n${v["notes"]}`
        }
        submitLabel="Summarize notes"
        outputLabel="Meeting summary (editable)"
      />
    </AppShell>
  );
}
