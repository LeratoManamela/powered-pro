import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured prompts, tone control and fully editable AI output.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Generate polished, on-tone work emails and edit them before sending.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Turn a few bullet points into a clear, professional email with the right tone and length."
      />
      <ToolWorkspace
        system="You are an expert business communication assistant. Write clear, concise, professional emails. Return only the email: a subject line, then the body. Never invent facts that were not provided."
        fields={[
          { name: "recipient", label: "Recipient & role", type: "text", placeholder: "Client, Sarah (Head of Ops)" },
          { name: "purpose", label: "Purpose / key points", type: "textarea", rows: 6, required: true, placeholder: "Follow up on the delayed invoice, propose a new deadline of 12 Sept, apologise for the delay." },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
          { name: "cta", label: "Desired outcome", type: "text", placeholder: "Confirm the new deadline by Friday" },
        ]}
        buildPrompt={(v) =>
          `Write a workplace email.\nRecipient: ${v["recipient"] || "colleague"}\nTone: ${v["tone"]}\nLength: ${v["length"]}\nDesired outcome / call to action: ${v["cta"] || "not specified"}\n\nKey points to cover:\n${v["purpose"]}`
        }
        submitLabel="Generate email"
        outputLabel="Email draft (editable)"
      />
    </AppShell>
  );
}
