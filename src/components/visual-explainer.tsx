"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  LockKeyhole,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { useLocale } from "./providers";
type Kind =
  "execution" | "variable" | "constant" | "types" | "operators" | "condition";
export function VisualExplainer({ kind = "variable" }: { kind?: Kind }) {
  const { t, locale } = useLocale();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % 3), 1800);
    return () => clearInterval(timer);
  }, [playing, reduced]);
  const typeValues = ["42", '"42"', "true"];
  const typeNames = ["number", "string", "boolean"];
  const captions: Record<Kind, string[]> = {
    variable:
      locale === "en"
        ? [
            "Create a name. Assign a value.",
            "Reassign the same name.",
            "Read the current value.",
          ]
        : [
            "Utwórz nazwę. Przypisz wartość.",
            "Przypisz nową wartość do tej samej nazwy.",
            "Odczytaj obecną wartość.",
          ],
    constant:
      locale === "en"
        ? [
            "A constant starts with a value.",
            "A new assignment is blocked.",
            "The original value stays.",
          ]
        : [
            "Stała zaczyna się od wartości.",
            "Nowe przypisanie jest zablokowane.",
            "Początkowa wartość pozostaje.",
          ],
    types:
      locale === "en"
        ? [
            "A number for calculations.",
            "Quotes make it a string.",
            "A boolean expresses true or false.",
          ]
        : [
            "Liczba do obliczeń.",
            "Cudzysłowy tworzą tekst.",
            "Boolean oznacza prawdę lub fałsz.",
          ],
    execution:
      locale === "en"
        ? [
            "Start at the first instruction.",
            "Print the text Hello!.",
            "Calculate 2 + 3, then print 5.",
          ]
        : [
            "Zacznij od pierwszej instrukcji.",
            "Wyświetl tekst Hello!.",
            "Oblicz 2 + 3 i wyświetl 5.",
          ],
    operators:
      locale === "en"
        ? [
            "Two numbers: add them.",
            "A string: join the text.",
            "Convert to a number before adding.",
          ]
        : [
            "Dwie liczby: dodaj je.",
            "Tekst: połącz ciągi znaków.",
            "Przed dodawaniem zamień tekst na liczbę.",
          ],
    condition:
      locale === "en"
        ? [
            "75 is at least 60: take the first branch.",
            "40 is below 60: take the else branch.",
            "60 is at least 60: the boundary passes too.",
          ]
        : [
            "75 to co najmniej 60: wybierz pierwszą gałąź.",
            "40 jest mniejsze niż 60: wybierz else.",
            "60 to co najmniej 60: granica też spełnia warunek.",
          ],
  };
  const codes: Record<Kind, string[]> = {
    variable: ["let score = 10;", "score = 20;", "console.log(score);"],
    constant: [
      'const course = "JavaScript";',
      'course = "Python";',
      "console.log(course);",
    ],
    types: ["typeof 42", 'typeof "42"', "typeof true"],
    execution: ["// start", 'console.log("Hello!");', "console.log(2 + 3);"],
    operators: ["2 + 3", '"2" + 3', 'Number("2") + 3'],
    condition: ["75 >= 60", "40 >= 60", "60 >= 60"],
  };
  return (
    <figure className="visual-explainer">
      <div className="visual-topline">
        <span>
          <span className="live-dot" />
          {locale === "en" ? "CONCEPT IN MOTION" : "POJĘCIE W RUCHU"}
        </span>
        <span>0{step + 1} / 03</span>
      </div>
      <div className="visual-stage">
        {kind === "condition" ? (
          <div className="branch-visual">
            <code className="condition-node">{codes[kind][step]}</code>
            <ArrowDown size={25} />
            <div className="branches">
              <span className={step !== 1 ? "branch active" : "branch"}>
                <Check size={18} />
                true → Pass
              </span>
              <span className={step === 1 ? "branch active" : "branch"}>
                false → Try again
              </span>
            </div>
          </div>
        ) : kind === "execution" ? (
          <div className="execution-visual">
            <div className="instruction-stack">
              <code className={step === 1 ? "executing" : ""}>
                {'console.log("Hello!");'}
              </code>
              <code className={step === 2 ? "executing" : ""}>
                console.log(2 + 3);
              </code>
            </div>
            <ArrowRight className="visual-arrow" />
            <div className="visual-console">
              <small>{t.console}</small>
              {step > 0 && <span>Hello!</span>}
              {step > 1 && <span>5</span>}
            </div>
          </div>
        ) : kind === "operators" ? (
          <div className="equation">
            <code>{codes[kind][step]}</code>
            <ArrowRight />
            <motion.strong
              key={step}
              initial={reduced ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {step === 1 ? '"23"' : "5"}
            </motion.strong>
          </div>
        ) : (
          <div className="memory-model">
            <div className="name-tag">
              <span>{kind === "types" ? "typeof" : t.binding}</span>
              <code>
                {kind === "types"
                  ? typeValues[step]
                  : kind === "constant"
                    ? "course"
                    : "score"}
              </code>
            </div>
            <ArrowRight className="visual-arrow" />
            <div
              className={`value-cube ${kind === "constant" ? "is-constant" : ""}`}
            >
              <small>{kind === "types" ? "type" : t.memory}</small>
              <AnimatePresence mode="wait">
                <motion.strong
                  key={kind === "variable" ? (step === 0 ? 0 : 1) : step}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {kind === "types"
                    ? typeNames[step]
                    : kind === "constant"
                      ? "JavaScript"
                      : step === 0
                        ? "10"
                        : "20"}
                </motion.strong>
              </AnimatePresence>
              {kind === "constant" && <LockKeyhole size={17} />}
            </div>
          </div>
        )}
      </div>
      <div className="visual-code">
        <code>{codes[kind][step]}</code>
        <span>
          {kind === "constant" && step === 1 ? (
            <>
              <LockKeyhole size={14} />
              TypeError
            </>
          ) : (
            <Check size={14} />
          )}
        </span>
      </div>
      <figcaption aria-live="polite">{captions[kind][step]}</figcaption>
      <div className="visual-controls">
        <button
          className="icon-button"
          aria-label={t.reset}
          onClick={() => {
            setStep(0);
            setPlaying(false);
          }}
        >
          <RotateCcw size={17} />
        </button>
        <div className="step-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span className={i === step ? "active" : ""} key={i} />
          ))}
        </div>
        <button
          className="button small secondary"
          onClick={() => {
            setPlaying(false);
            setStep((s) => (s + 1) % 3);
          }}
        >
          {t.step}
          <SkipForward size={15} />
        </button>
        {!reduced && (
          <button
            className="icon-button"
            aria-label={playing ? t.pause : t.play}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
        )}
      </div>
    </figure>
  );
}
