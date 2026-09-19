"use client";
import Link from "next/link";
import { Celebration } from "@/components/celebration";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  RotateCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLocale, useProgress } from "@/components/providers";
import { EmptyState, ProgressBar } from "@/components/ui";
import { courseRepository, conceptLabel } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { moduleProgress, scoreQuiz } from "@/domain/learning";
import { QuestionCard } from "./question";
export function Checkpoint({ moduleId }: { moduleId: string }) {
  const { t, l, href } = useLocale();
  const progress = useProgress();
  const quiz = courseRepository.quiz(moduleId)!;
  const courseModule = courseRepository
    .get("javascript")!
    .modules.find((m) => m.id === moduleId)!;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    reward: number;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  if (moduleProgress(courseModule, progress) < 100)
    return (
      <div className="container page-space">
        <EmptyState
          title={t.checkpoint}
          description={t.quizLocked}
          action={t.toPath}
          href={href("/courses/javascript")}
        />
      </div>
    );
  const question = quiz.questions[index];
  const mistakes = Array.from(
    new Set(
      quiz.questions
        .filter((q) => answers[q.id] !== q.answer)
        .map((q) => q.concept),
    ),
  );
  function next() {
    if (index === quiz.questions.length - 1) {
      const score = scoreQuiz(quiz.questions, answers);
      const reward = progressStore.completeQuiz(quiz.id, score);
      setResult({ score, reward });
    } else setIndex((i) => i + 1);
  }
  return (
    <div className="container checkpoint-page">
      <Link className="text-link" href={href("/courses/javascript")}>
        <ArrowLeft size={17} />
        {t.path}
      </Link>
      {result ? (
        <div className="completion">
          <Celebration />
          <div
            className={`score-ring ${result.score === 100 ? "perfect" : ""}`}
            style={{ "--score": `${result.score}%` } as React.CSSProperties}
          >
            <div>
              <strong>
                {result.score}
                <small>%</small>
              </strong>
              <span>{t.accuracy}</span>
            </div>
            {result.score === 100 && (
              <Sparkles className="score-spark" size={30} />
            )}
          </div>
          <div className="eyebrow">
            {l(courseModule.title)} · {t.checkpoint}
          </div>
          <h1>{result.score >= 80 ? t.outstanding : t.goodResult}</h1>
          <p>{t.resultCopy}</p>
          <div className="reward-large">
            <Zap size={22} />+{result.reward} XP
          </div>
          <p className="fine-print">{t.checkpointReward}</p>
          {mistakes.length ? (
            <div className="mistakes-panel">
              <h2>{t.reviewMistakes}</h2>
              {mistakes.map((id) => (
                <span className="pill" key={id}>
                  <RotateCw size={14} />
                  {l(conceptLabel(id))}
                </span>
              ))}
            </div>
          ) : (
            <p className="perfect-note">
              <CheckCircle2 size={18} />
              {t.noMistakes}
            </p>
          )}
          <div className="completion-actions">
            <Link className="button primary" href={href("/courses/javascript")}>
              {t.continue}
              <ArrowRight size={18} />
            </Link>
            {mistakes.length > 0 && (
              <Link className="button secondary" href={href("/review")}>
                {t.review}
              </Link>
            )}
            <button
              className="button secondary"
              onClick={() => {
                setResult(null);
                setAnswers({});
                setIndex(0);
                setAttempt((a) => a + 1);
              }}
            >
              {t.retryQuiz}
            </button>
          </div>
        </div>
      ) : (
        <div className="checkpoint-content">
          <div className="eyebrow">
            <Flag size={17} />
            {l(courseModule.title)}
          </div>
          <h1>{t.checkpoint}</h1>
          <p>{t.checkpointIntro}</p>
          <div className="quiz-count">
            {t.question} {index + 1} {t.of} {quiz.questions.length}
          </div>
          <ProgressBar
            value={(index / quiz.questions.length) * 100}
            label={t.progress}
          />
          <QuestionCard
            key={`${attempt}-${question.id}`}
            question={question}
            onAnswered={(answer) => {
              setAnswers((a) => ({ ...a, [question.id]: answer }));
              progressStore.answer(question, answer);
            }}
          />
          <div className="quiz-next">
            <button
              className="button primary"
              disabled={answers[question.id] === undefined}
              onClick={next}
            >
              {index === quiz.questions.length - 1 ? t.finish : t.next}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
