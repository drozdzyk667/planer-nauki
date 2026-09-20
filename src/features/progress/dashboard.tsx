"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  Flame,
  Info,
  Layers,
  LockKeyhole,
  RotateCw,
  Sparkles,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import { useLocale, useProgress } from "@/components/providers";
import { Dialog, ProgressBar, Reveal } from "@/components/ui";
import { courseRepository, conceptLabel } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { isDue, level, localDay, streak } from "@/domain/learning";
import { countLabel } from "@/lib/count-label";
export function Dashboard() {
  const { t, l, locale, href } = useLocale();
  const progress = useProgress();
  const [reset, setReset] = useState(false);
  const lessons = courseRepository.lessons();
  const done = lessons.filter((l) => progress.completed[l.id]).length;
  const next = lessons.find((l) => !progress.completed[l.id]);
  const concepts = Object.entries(progress.concepts);
  const latestCompletedLesson = Object.entries(progress.completed)
    .sort(([, a], [, b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([lessonId]) => lessons.find((lesson) => lesson.id === lessonId))
    .find(Boolean);
  const activeCourseId = next?.courseId ?? latestCompletedLesson?.courseId ?? "javascript";
  const activeCourse = courseRepository.get(activeCourseId);
  const activeCourseLessons = lessons.filter(
    (lesson) => lesson.courseId === activeCourseId,
  );
  const activeCourseDone = activeCourseLessons.filter(
    (lesson) => progress.completed[lesson.id],
  ).length;
  const activeCourseProgress = activeCourseLessons.length
    ? Math.round((activeCourseDone / activeCourseLessons.length) * 100)
    : 0;
  const due = concepts.filter(([, c]) => c.mastery < 50 || isDue(c));
  const lessonCountLabel = (count: number) =>
    countLabel(locale, count, ["lesson", "lessons"], ["lekcja", "lekcje", "lekcji"]);
  const conceptCountLabel = (count: number) =>
    countLabel(
      locale,
      count,
      ["concept to revisit", "concepts to revisit"],
      ["zagadnienie do powtórki", "zagadnienia do powtórki", "zagadnień do powtórki"],
    );
  const todayDone = Object.values(progress.completed).some(
    (date) => localDay(new Date(date)) === localDay(),
  );
  return (
    <div className="container page-space dashboard">
      <Reveal>
        <div className="eyebrow">
          <span className="tiny-line" />
          {t.dashboard}
        </div>
        <h1 className="dashboard-heading">
          {done ? t.welcomeBack : t.newHere}
        </h1>
        <p className="page-intro">{t.continueCopy}</p>
      </Reveal>
      {progressStore.warning() && (
        <p className="feedback error" role="alert">
          {t.storageWarning}
        </p>
      )}
      <div className="dashboard-top">
        <Reveal className="continue-card">
          <div className="continue-card-top">
            <span className={`language-icon ${activeCourse?.color ?? "yellow"}`}>
              {activeCourse?.short ?? "JS"}
            </span>
            <span className="badge subtle">
              {activeCourse ? l(activeCourse.title) : "JavaScript"}
            </span>
            <span className="continue-orbit" aria-hidden="true">
              ✦
            </span>
          </div>
          <div className="eyebrow">{next ? t.continue : t.completed}</div>
          <h2>{next ? l(next.title) : t.allFreeDone}</h2>
          <p>{next ? l(next.subtitle) : t.allFreeDoneCopy}</p>
          <ProgressBar value={activeCourseProgress} label={t.courseProgress} />
          <div className="continue-card-bottom">
            <span>
              {activeCourseDone} / {activeCourseLessons.length} {lessonCountLabel(activeCourseLessons.length)}
            </span>
            <Link
              className="button primary"
              href={href(next ? `/learn/${next.id}` : "/review")}
            >
              {next ? t.continue : t.review}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
        <Reveal className="daily-card">
          <Target size={26} />
          <h2>{t.dailyGoal}</h2>
          <div className={`goal-circle ${todayDone ? "complete" : ""}`}>
            {todayDone ? (
              <Check size={39} />
            ) : (
              <span>
                0<small>/ 1</small>
              </span>
            )}
          </div>
          <p>{t.goalCopy}</p>
          <span className="fine-print">{t.noPressure}</span>
        </Reveal>
      </div>
      <div className="stats-grid">
        {[
          { Icon: Zap, value: progress.xp, label: "XP" },
          { Icon: Layers, value: level(progress.xp), label: t.level },
          { Icon: Flame, value: streak(progress.learningDays), label: t.days },
          {
            Icon: Target,
            value: `${activeCourseProgress}%`,
            label: t.courseProgress,
          },
        ].map(({ Icon, value, label }) => (
          <div className="stat" key={label}>
            <Icon size={19} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="dashboard-middle">
        <section className="review-card">
          <div className="section-label">
            <RotateCw size={21} />
            <span>{t.review}</span>
          </div>
          <h2>{t.reviewTitle}</h2>
          <p>
            {due.length ? `${due.length} ${conceptCountLabel(due.length)}` : t.noReviewCopy}
          </p>
          {due.slice(0, 3).map(([id, c]) => (
            <div className="review-row" key={id}>
              <span>{l(conceptLabel(id))}</span>
              <span className="badge subtle">
                {c.mastery < 50 ? t.weak : t.review}
              </span>
            </div>
          ))}
          <Link className="button secondary" href={href("/review")}>
            {due.length ? t.reviewNow : t.review}
            <ArrowRight size={16} />
          </Link>
        </section>
        <section className="skill-map">
          <div className="section-label">
            <Sparkles size={21} />
            <span>{t.mastery}</span>
          </div>
          <h2>{t.skillMap}</h2>
          <p className="mastery-help">
            <Info size={15} />
            <span>{t.masteryHelp}</span>
          </p>
          <div className="skill-nodes">
            {lessons.map((lesson) => {
              const c = progress.concepts[lesson.concept];
              const course = courseRepository.get(lesson.courseId);
              const courseModule = course?.modules.find(
                (item) => item.id === lesson.moduleId,
              );
              const premium = courseModule?.access === "premium";
              return (
                <Link
                  href={href(`/learn/${lesson.id}`)}
                  key={lesson.id}
                  className={`skill-node ${c ? "unlocked" : ""} ${premium ? "premium" : "free"}`}
                >
                  <span>
                    {premium && !c ? (
                      <LockKeyhole size={17} />
                    ) : c?.mastery === 100 ? (
                      <Check size={18} />
                    ) : (
                      <span>{c?.mastery ?? 0}%</span>
                    )}
                  </span>
                  <strong>{l(conceptLabel(lesson.concept))}</strong>
                  <small className="skill-node-status">
                    {premium ? (
                      <>
                        <LockKeyhole size={11} />
                        {t.premium}
                      </>
                    ) : c ? (
                      c.mastery >= 75
                        ? t.strong
                        : c.mastery >= 50
                          ? t.growing
                          : t.weak
                    ) : (
                      <>
                        <i className="free-access-dot" aria-hidden="true" />
                        {t.free}
                      </>
                    )}
                  </small>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
      <section className="achievements">
        <h2>{t.achievements}</h2>
        <div className="badge-grid">
          {[
            { name: t.firstBadge, copy: t.firstBadgeCopy, earned: done >= 1 },
            { name: t.pathBadge, copy: t.pathBadgeCopy, earned: done >= 3 },
            {
              name: t.quizBadge,
              copy: t.quizBadgeCopy,
              earned: Object.values(progress.quizBest).includes(100),
            },
          ].map((b) => (
            <div
              className={`achievement ${b.earned ? "earned" : ""}`}
              key={b.name}
            >
              <span>
                <Award size={30} />
              </span>
              <div>
                <h3>{b.name}</h3>
                <p>{b.copy}</p>
                <small>{b.earned ? t.completed : t.locked}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="data-note">
        <p>{t.localNote}</p>
        <button className="text-button" onClick={() => setReset(true)}>
          <Trash2 size={15} />
          {t.resetProgress}
        </button>
      </div>
      <Dialog open={reset} onClose={() => setReset(false)} title={t.resetTitle}>
        <p>{t.resetCopy}</p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={() => setReset(false)}>
            {t.cancel}
          </button>
          <button
            className="button danger"
            onClick={() => {
              progressStore.reset();
              setReset(false);
            }}
          >
            {t.confirmReset}
          </button>
        </div>
      </Dialog>
      <span className="sr-only">{locale}</span>
    </div>
  );
}
