"use client";
import { useMemo, useState } from "react";
import { Check, CircleHelp, X } from "lucide-react";
import { useLocale } from "@/components/providers";
import type { Question } from "@/domain/models";
import { shuffleQuestionOptions } from "@/domain/quiz-randomization";
export function QuestionCard({
  question,
  onAnswered,
  record = true,
  shuffleSeed,
}: {
  question: Question;
  onAnswered: (answer: string, correct: boolean) => void;
  record?: boolean;
  shuffleSeed?: string;
}) {
  const { t, l } = useLocale();
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const options = useMemo(
    () => shuffleQuestionOptions(question, shuffleSeed),
    [question, shuffleSeed],
  );
  const correct = answer === question.answer;
  function submit() {
    if (!answer) return;
    setChecked(true);
    onAnswered(answer, correct);
  }
  return (
    <div className="question-card">
      <div className="eyebrow">
        <CircleHelp size={15} />
        {t.question}
      </div>
      <fieldset disabled={checked}>
        <legend>{l(question.prompt)}</legend>
        {question.code && (
          <pre className="code-block">
            <code>{question.code}</code>
          </pre>
        )}
        <div className="answer-options">
          {options.map((option, i) => (
            <label
              key={option.id}
              className={`answer-option ${answer === option.id ? "selected" : ""} ${checked && option.id === question.answer ? "is-correct" : ""} ${checked && answer === option.id && !correct ? "is-incorrect" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={answer === option.id}
                onChange={() => setAnswer(option.id)}
              />
              <span className="option-letter" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{l(option.text)}</span>
              {checked && option.id === question.answer && <Check size={19} />}
            </label>
          ))}
        </div>
      </fieldset>
      {!checked ? (
        <button className="button primary" disabled={!answer} onClick={submit}>
          {t.check}
          <Check size={17} />
        </button>
      ) : (
        <div
          className={`feedback ${correct ? "success" : "error"}`}
          role="status"
        >
          {correct ? <Check size={20} /> : <X size={20} />}
          <div>
            <strong>{correct ? t.correct : t.incorrect}</strong>
            <p>{l(question.explanation)}</p>
          </div>
        </div>
      )}
      {!record && <span className="sr-only">{t.checkpoint}</span>}
    </div>
  );
}
