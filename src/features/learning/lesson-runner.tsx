"use client";
import Link from "next/link";
import { Celebration } from "@/components/celebration";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Code2,
  Lightbulb,
  LockKeyhole,
  Info,
  Puzzle,
  RotateCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useProgress } from "@/components/providers";
import { EmptyState, ProgressBar, UpgradeDialog } from "@/components/ui";
import { VisualExplainer } from "@/components/visual-explainer";
import { courseRepository } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { CourseModeDock } from "@/features/study/course-mode-dock";
import { QuestionCard } from "./question";
import { Exercise } from "./exercise";
export function LessonRunner({ id }: { id: string }) {
  const lesson = courseRepository.lesson(id)!;
  const { t, l, href, locale } = useLocale();
  const progress = useProgress();
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [passed, setPassed] = useState(false);
  const [recalled, setRecalled] = useState(false);
  const [reward, setReward] = useState(0);
  const [savedCode, setSavedCode] = useState(lesson.exercise.starter);
  const [upgrade, setUpgrade] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const onPassed = useCallback((value: boolean) => setPassed(value), []);
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);
  const courseModule = courseRepository
    .get(lesson.courseId)!
    .modules.find((m) => m.id === lesson.moduleId)!;

  if (courseModule.access === "premium") {
    return (
      <div className="container page-space premium-lesson-gate">
        <CourseModeDock courseSlug={lesson.courseId} active="practice" />
        <EmptyState
          title={l(courseModule.title)}
          description={
            locale === "en"
              ? "This advanced lesson is part of the full course. The free foundations remain available without an account."
              : "Ta zaawansowana lekcja jest częścią pełnego kursu. Darmowe podstawy pozostają dostępne bez konta."
          }
          action={locale === "en" ? "Back to course" : "Wróć do kursu"}
          href={href(`/courses/${lesson.courseId}`)}
        />
        <button
          className="button primary premium-preview-button"
          onClick={() => setUpgrade(true)}
        >
          <LockKeyhole size={17} />
          {locale === "en" ? "Unlock full course" : "Odblokuj pełny kurs"}
        </button>
        <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
      </div>
    );
  }

  const nextId = courseModule.lessonIds[courseModule.lessonIds.indexOf(id) + 1];
  const phases = [
    { title: t.concept, Icon: BookOpen },
    { title: t.prediction, Icon: CircleHelp },
    { title: t.practice, Icon: Code2 },
    { title: t.recall, Icon: RotateCw },
  ];
  const next = () => {
    if (step === 3) {
      setReward(progressStore.completeLesson(id));
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <div className="container lesson-page">
      <CourseModeDock courseSlug={lesson.courseId} active="practice" />
      <div className="lesson-top">
        <Link className="text-link" href={href(`/courses/${lesson.courseId}`)}>
          <ArrowLeft size={16} />
          {t.path}
        </Link>
        <span>{l(courseModule.title)}</span>
        <span className="xp-pill">
          <Zap size={15} />
          {progress.xp} XP
        </span>
      </div>
      <ProgressBar value={(step / 4) * 100} label={t.progress} />
      {step < 4 ? (
        <div className="learning-layout">
          <aside className="lesson-steps">
            <span className="eyebrow">
              {lesson.minutes} {t.minutes} · +80 XP
            </span>
            <h2>{l(lesson.title)}</h2>
            <ol>
              {phases.map(({ title, Icon }, i) => (
                <li
                  className={step === i ? "current" : step > i ? "done" : ""}
                  key={title}
                >
                  <span>
                    {step > i ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  {title}
                </li>
              ))}
            </ol>
            <div className="lesson-sidebar-note">
              <Lightbulb size={19} />
              <p>{t.noPressure}</p>
              <small>{t.xpOnce}</small>
            </div>
          </aside>
          <section className="learning-content">
            <div className="eyebrow">
              0{step + 1} / 04 · {phases[step].title}
            </div>
            <h1 ref={heading} tabIndex={-1} className="lesson-heading">
              {step === 0
                ? l(lesson.title)
                : step === 1
                  ? t.prediction
                  : step === 2
                    ? t.practice
                    : t.recall}
            </h1>
            {step === 0 ? (
              <>
                <p className="lesson-subtitle">{l(lesson.subtitle)}</p>
                {lesson.blocks.map((block, i) => {
                  switch (block.type) {
                    case "text":
                      return (
                        <div className="lesson-text" key={i}>
                          <h2>{l(block.heading)}</h2>
                          <p>{l(block.body)}</p>
                        </div>
                      );
                    case "code":
                      return (
                        <figure className="lesson-code" key={i}>
                          <pre className="code-block">
                            <code>{block.code}</code>
                          </pre>
                          <figcaption>{l(block.caption)}</figcaption>
                        </figure>
                      );
                    case "visual":
                      return (
                        <div className="lesson-visual" key={i}>
                          <VisualExplainer kind={block.kind} />
                          <p className="fine-print">{l(block.caption)}</p>
                        </div>
                      );
                    case "tip":
                      return (
                        <div className="tip" key={i}>
                          <Lightbulb size={20} />
                          <p>{l(block.body)}</p>
                        </div>
                      );
                    case "fact":
                      return (
                        <aside className="fact-card" key={i}>
                          <Info size={20} />
                          <div>
                            <strong>{l(block.title)}</strong>
                            <p>{l(block.body)}</p>
                          </div>
                        </aside>
                      );
                    case "riddle":
                      return (
                        <details className="riddle-card" key={i}>
                          <summary>
                            <Puzzle size={20} />
                            <span>
                              <strong>{l(block.title)}</strong>
                              <small>{l(block.prompt)}</small>
                            </span>
                          </summary>
                          <div className="riddle-answer">
                            <span aria-hidden="true">↳</span>
                            <p>{l(block.answer)}</p>
                          </div>
                        </details>
                      );
                  }
                })}
              </>
            ) : step === 1 ? (
              <QuestionCard
                key={lesson.prediction.id}
                question={lesson.prediction}
                shuffleSeed={`${lesson.id}:predict:${progress.answers.length}`}
                onAnswered={(answer) => {
                  progressStore.answer(lesson.prediction, answer);
                  setAnswered(true);
                }}
              />
            ) : step === 2 ? (
              <>
                <Exercise
                  exercise={lesson.exercise}
                  onPassed={onPassed}
                  savedCode={savedCode}
                  onCodeChange={setSavedCode}
                />
                {!!lesson.drills?.length && (
                  <section className="lesson-drills" aria-labelledby="drill-heading">
                    <div className="lesson-drills-heading">
                      <Puzzle size={18} />
                      <div>
                        <h2 id="drill-heading">
                          {locale === "en" ? "Bonus drills" : "Dodatkowe mini-zadania"}
                        </h2>
                        <p>
                          {locale === "en"
                            ? "Short prompts to make the idea stick before you move on."
                            : "Krótkie zadania, żeby temat został w głowie przed przejściem dalej."}
                        </p>
                      </div>
                    </div>
                    <div className="drill-list">
                      {lesson.drills.map((drill, drillIndex) => (
                        <details className="drill-card" key={drillIndex}>
                          <summary>
                            <span>{String(drillIndex + 1).padStart(2, "0")}</span>
                            <strong>{l(drill.prompt)}</strong>
                          </summary>
                          <div>
                            {drill.code && (
                              <pre className="code-block">
                                <code>{drill.code}</code>
                              </pre>
                            )}
                            <p>
                              <b>{t.hint}:</b> {l(drill.hint)}
                            </p>
                            <p className="drill-answer">
                              <b>{locale === "en" ? "Answer:" : "Odpowiedź:"}</b>{" "}
                              {l(drill.answer)}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <QuestionCard
                key={lesson.recall.id}
                question={lesson.recall}
                shuffleSeed={`${lesson.id}:recall:${progress.answers.length}`}
                onAnswered={(answer) => {
                  progressStore.answer(lesson.recall, answer);
                  setRecalled(true);
                }}
              />
            )}
            <div className="lesson-navigation">
              {step > 0 ? (
                <button
                  className="button secondary"
                  onClick={() => {
                    if (step === 3) setPassed(false);
                    if (step === 2) setAnswered(false);
                    setStep((s) => s - 1);
                  }}
                >
                  <ArrowLeft size={17} />
                  {t.back}
                </button>
              ) : (
                <span />
              )}
              <button
                className="button primary"
                onClick={next}
                disabled={
                  (step === 1 && !answered) ||
                  (step === 2 && !passed) ||
                  (step === 3 && !recalled)
                }
              >
                {step === 3 ? t.done : t.continue}
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      ) : (
        <motion.div
          className="completion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Celebration />
          <div className="completion-emblem">
            <CheckCircle2 size={52} />
            <Sparkles className="spark-one" size={22} />
            <Sparkles className="spark-two" size={16} />
          </div>
          <div className="eyebrow">{t.complete}</div>
          <h1 ref={heading} tabIndex={-1}>
            {l(lesson.title)}
          </h1>
          <p>{t.resultCopy}</p>
          <div className="reward-large">
            <Zap size={24} />+{reward} XP
          </div>
          <p className="fine-print">
            {progressStore.warning() ? t.storageWarning : t.saved} · {t.xpOnce}
          </p>
          <div className="completion-actions">
            <Link
              className="button primary"
              href={href(
                nextId ? `/learn/${nextId}` : `/checkpoint/${lesson.moduleId}`,
              )}
            >
              {nextId ? t.nextLesson : t.quizNext}
              <ArrowRight size={18} />
            </Link>
            <Link
              className="button secondary"
              href={href(`/courses/${lesson.courseId}`)}
            >
              {t.toPath}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
