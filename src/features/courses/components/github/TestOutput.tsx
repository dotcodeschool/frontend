import AnsiToHtml from "ansi-to-html";
import { useCallback, useState } from "react";

import {
  fetchActionLogs,
  type LogJob,
  type LogsResult,
} from "@/features/progress/lib/actions";

interface Props {
  forkUrl: string;
  runId: number | null;
}

const ansiConverter = new AnsiToHtml({
  fg: "#9ba3be",
  bg: "transparent",
  colors: {
    0: "#3a3f54",
    1: "#f87171",
    2: "#4ade80",
    3: "#fbbf24",
    4: "#6b8aed",
    5: "#c084fc",
    6: "#22d3ee",
    7: "#e8eaf0",
  },
});

function StepItem({
  step,
  defaultOpen,
}: {
  step: { name: string; conclusion: string; duration: string; output: string };
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const html = ansiConverter.toHtml(step.output);

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-elevated/50 transition-colors text-left"
      >
        {step.conclusion === "success" ? (
          <svg
            className="w-3 h-3 text-success shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : step.conclusion === "failure" ? (
          <svg
            className="w-3 h-3 text-red-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 text-content-faint shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        )}
        <span className="text-content-secondary truncate flex-1">
          {step.name}
        </span>
        <span className="text-content-faint shrink-0">{step.duration}</span>
        <svg
          className={`w-3 h-3 text-content-faint shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && step.output && (
        <div
          className="px-3 py-2 bg-code text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

function JobSection({ job }: { job: LogJob }) {
  return (
    <div>
      <div className="px-3 py-1.5 text-[10px] font-semibold text-content-muted uppercase tracking-wider bg-elevated/30">
        {job.name}
      </div>
      {job.steps.map((step, i) => (
        <StepItem
          key={i}
          step={step}
          defaultOpen={step.conclusion === "failure"}
        />
      ))}
    </div>
  );
}

export function TestOutput({ forkUrl, runId }: Props) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<LogsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    if (!runId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActionLogs(forkUrl, runId);
      setLogs(data);
    } catch {
      setError("Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [forkUrl, runId]);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !logs && !loading) {
      loadLogs();
    }
  }

  if (!runId) return null;

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-secondary transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {open ? "Hide test output" : "View test output"}
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-border overflow-hidden max-h-[250px] sm:max-h-[300px] overflow-y-auto bg-code">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <svg
                className="w-4 h-4 text-accent animate-spin"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-.7 2.8l1.5 1.5A8 8 0 0012 4zM12 18a6 6 0 01-6-6 6 6 0 01.7-2.8L5.2 7.7A8 8 0 0012 20v3l4-4-4-4v3z" />
              </svg>
            </div>
          )}
          {error && (
            <div className="px-3 py-4 text-xs text-red-400 text-center">
              {error}
              <button
                onClick={loadLogs}
                className="block mx-auto mt-1 text-accent hover:text-accent-dim"
              >
                Retry
              </button>
            </div>
          )}
          {logs && logs.jobs.map((job, i) => <JobSection key={i} job={job} />)}
        </div>
      )}
    </div>
  );
}
