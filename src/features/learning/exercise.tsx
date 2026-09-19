"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Check, CircleHelp, Play, RotateCcw, Terminal, X } from "lucide-react";
import { useLocale } from "@/components/providers";
import { asset } from "@/lib/config";
import type { Exercise as ExerciseModel } from "@/domain/models";
import { z } from "zod";
const Editor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => (
    <div className="editor-loading" aria-busy="true">
      <span />
      <span />
      <span />
    </div>
  ),
});
const resultSchema = z.object({
  status: z.enum(["ok", "error", "timeout"]),
  logs: z.array(z.string().max(1000)).max(50),
  results: z.array(z.boolean()).optional(),
  error: z.string().max(500).optional(),
  id: z.string(),
});
type RunResult = z.infer<typeof resultSchema>;
export function Exercise({
  exercise,
  onPassed,
  savedCode,
  onCodeChange,
}: {
  exercise: ExerciseModel;
  onPassed: (passed: boolean) => void;
  savedCode?: string;
  onCodeChange?: (code: string) => void;
}) {
  const { t, l } = useLocale();
  const [code, setCode] = useState(savedCode ?? exercise.starter);
  const [hint, setHint] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const request = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const passed =
    !!result &&
    result.status === "ok" &&
    result.results?.length === exercise.tests.length &&
    result.results.every(Boolean);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "sandbox-ready") {
        setReady(true);
        return;
      }
      if (!request.current || event.data?.id !== request.current) return;
      const parsed = resultSchema.safeParse(event.data);
      if (!parsed.success) return;
      const data = parsed.data;
      request.current = "";
      if (timer.current) clearTimeout(timer.current);
      setResult(data);
      setRunning(false);
      onPassed(
        data.status === "ok" &&
          data.results?.length === exercise.tests.length &&
          data.results.every(Boolean),
      );
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [exercise.tests.length, onPassed]);
  function run() {
    if (!ready || !frame.current?.contentWindow) return;
    const id = crypto.randomUUID();
    request.current = id;
    setRunning(true);
    setResult(null);
    onPassed(false);
    frame.current?.contentWindow?.postMessage(
      {
        type: "run",
        id,
        code,
        tests: exercise.tests.map((test) => test.expression),
      },
      "*",
    );
    timer.current = setTimeout(() => {
      request.current = "";
      setRunning(false);
      setResult({ id, status: "timeout", logs: [] });
    }, 3500);
  }
  function edit(value: string) {
    request.current = "";
    if (timer.current) clearTimeout(timer.current);
    setRunning(false);
    setCode(value);
    onCodeChange?.(value);
    setResult(null);
    onPassed(false);
  }
  return (
    <div className="exercise">
      <p className="exercise-task">{l(exercise.task)}</p>
      <div className="editor-frame">
        <div className="editor-title">
          <span>
            <span className="file-dot" />
            practice.js
          </span>
          <button
            className="icon-button"
            aria-label={t.resetCode}
            disabled={running}
            onClick={() => edit(exercise.starter)}
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <Editor code={code} onChange={edit} />
        <div className="editor-footer">
          <span>{t.editHint}</span>
          <button
            className="button primary small"
            onClick={run}
            disabled={running || !ready}
          >
            <Play size={15} />
            {running ? t.running : t.run}
          </button>
        </div>
      </div>
      <iframe
        title={t.runtime}
        ref={frame}
        src={asset("sandbox.html")}
        sandbox="allow-scripts"
        hidden
      />
      <button
        className="text-link hint-button"
        onClick={() => setHint(!hint)}
        aria-expanded={hint}
      >
        <CircleHelp size={16} />
        {hint ? t.hideHint : t.hint}
      </button>
      {hint && <p className="hint-box">{l(exercise.hint)}</p>}
      <div className="output-panel" aria-live="polite">
        <div className="output-title">
          <Terminal size={16} />
          {t.console}
        </div>
        <pre>{result?.logs.length ? result.logs.join("\n") : t.runPrompt}</pre>
        {result?.status === "error" && (
          <div className="feedback error">
            <X size={18} />
            <div>
              <p>{t.codeError}</p>
              <code>{result.error}</code>
            </div>
          </div>
        )}
        {result?.status === "timeout" && (
          <p className="feedback error">{t.timeout}</p>
        )}
        {result?.status === "ok" && (
          <>
            <div className={`feedback ${passed ? "success" : "error"}`}>
              {passed ? <Check size={19} /> : <X size={19} />}
              <span>{passed ? t.passed : t.failed}</span>
            </div>
            <ul className="test-list">
              {exercise.tests.map((test, i) => (
                <li key={test.expression}>
                  {result.results?.[i] ? <Check size={17} /> : <X size={17} />}
                  <span>{l(test.label)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
