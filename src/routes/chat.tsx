import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { generateAiText } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant for drafting, planning, analysis and day-to-day work questions.",
      },
      { property: "og:title", content: "AI Chatbot | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday professional work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are a helpful workplace productivity assistant for professionals. Be concise, practical and well-structured. Use markdown. Ask a clarifying question when the request is ambiguous. Never fabricate facts, data or sources.";

const SUGGESTIONS = [
  "Rewrite this update so it's clearer for executives",
  "Help me prepare an agenda for a project kickoff",
  "What should I ask in a vendor evaluation call?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const generate = useServerFn(generateAiText);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await generate({ data: { system: SYSTEM, messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The AI request failed.");
      setMessages(next);
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        icon={Bot}
        title="AI Chatbot"
        description="Ask anything about your work — drafting, analysis, planning or preparation."
      />
      <div className="flex h-[calc(100vh-16rem)] min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md py-12 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="size-6" />
              </span>
              <p className="mt-4 text-sm font-medium text-foreground">
                Start a conversation
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try one of these to get going:
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-input px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div className="prose prose-sm max-w-none flex-1 text-sm leading-relaxed text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-4"
        >
          <textarea
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
            className="max-h-40 min-h-[44px] flex-1 resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            <Send className="size-4" /> Send
          </button>
        </form>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Responsible AI: this assistant can make mistakes. Don't share confidential or personal
        data, and verify important answers.
      </p>
    </AppShell>
  );
}
