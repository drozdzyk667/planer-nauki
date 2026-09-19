"use client";
import Link from "next/link";
import { Celebration } from "@/components/celebration";
import { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCw } from "lucide-react";
import { useLocale, useProgress } from "@/components/providers";
import { EmptyState, ProgressBar } from "@/components/ui";
import { courseRepository, conceptLabel } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { isDue } from "@/domain/learning";
import { QuestionCard } from "@/features/learning/question";
import type { Question } from "@/domain/models";
export function Review() {
  const { t, l, href } = useLocale();
  const progress = useProgress();
  const [queue, setQueue] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const due = Object.entries(progress.concepts).filter(
    ([, c]) => c.mastery < 50 || isDue(c),
  );
  const questions = courseRepository
    .lessons()
    .filter((lesson) => due.some(([id]) => id === lesson.concept))
    .map((l) => l.recall);
  return (
    <div className="container page-space review-page">
      <div className="eyebrow">
        <RotateCw size={17} />
        {t.review}
      </div>
      <h1 className="page-heading">{t.reviewTitle}</h1>
      <p className="page-intro">{t.reviewCopy}</p>
      {queue ? (
        index >= queue.length ? (
          <div className="completion">
            <Celebration />
            <CheckCircle2 size={55} />
            <h2>{t.reviewDone}</h2>
            <p>{t.reviewDoneCopy}</p>
            <Link className="button primary" href={href("/dashboard")}>
              {t.dashboard}
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="review-session">
            <p>
              {index + 1} / {queue.length} ·{" "}
              {l(conceptLabel(queue[index].concept))}
            </p>
            <ProgressBar
              value={(index / queue.length) * 100}
              label={t.progress}
            />
            <QuestionCard
              key={queue[index].id}
              question={queue[index]}
              onAnswered={(answer) => {
                progressStore.review(queue[index], answer);
                setAnswered(true);
              }}
            />
            <div className="quiz-next">
              <button
                className="button primary"
                disabled={!answered}
                onClick={() => {
                  setIndex((i) => i + 1);
                  setAnswered(false);
                }}
              >
                {index === queue.length - 1 ? t.done : t.next}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )
      ) : questions.length ? (
        <div className="review-queue">
          {due.map(([id, c]) => (
            <div className="review-row" key={id}>
              <strong>{l(conceptLabel(id))}</strong>
              <span>
                {c.mastery}% · {c.mastery < 50 ? t.weak : t.review}
              </span>
            </div>
          ))}
          <button
            className="button primary"
            onClick={() => setQueue(questions)}
          >
            {t.reviewNow}
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <EmptyState
          title={t.noReview}
          description={t.noReviewCopy}
          action={t.reviewEmptyLink}
          href={href("/courses/javascript/knowledge")}
        />
      )}
    </div>
  );
}
