import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateAiText } from "@/lib/ai.functions";

export type Field =
  | { name: string; label: string; type: "text"; placeholder?: string; required?: boolean }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
      required?: boolean;
    }
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean };

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  submitLabel = "Generate",
  outputLabel = "AI output (editable)",
  initialValues = {},
}: {
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel?: string;
  outputLabel?: string;
  initialValues?: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const f of fields) {
      base[f.name] = initialValues[f.name] ?? (f.type === "select" ? f.options[0] : "");
    }
    return base;
  });
  const [output, setOutput] = useState("");
  const generate = useServerFn(generateAiText);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await generate({
        data: { system, messages: [{ role: "user" as const, content: buildPrompt(values) }] },
      });
      return res.text;
    },
    onSuccess: (text) => setOutput(text),
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const missing = fields.some((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-card-foreground">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill the fields — they are assembled into a guided AI prompt.
        </p>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (missing) {
              toast.error("Please fill the required fields.");
              return;
            }
            mutation.mutate();
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={field.name}
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {field.label}
                {field.required ? " *" : ""}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  value={values[field.name]}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  {field.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {mutation.isPending ? "Generating…" : submitLabel}
          </button>
        </form>
      </section>

      <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-card-foreground">{outputLabel}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw className="size-3.5" /> Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                if (!output) return;
                navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent"
            >
              <Copy className="size-3.5" /> Copy
            </button>
          </div>
        </div>
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your AI-generated draft appears here — edit it freely before using it."
          className="mt-4 min-h-[340px] flex-1 resize-y rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          AI-generated content can be wrong or biased. Review, edit and verify before sending.
        </p>
      </section>
    </div>
  );
}
