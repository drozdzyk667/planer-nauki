"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Flag,
  Globe2,
  LockKeyhole,
  Play,
  Sparkles,
} from "lucide-react";
import { useLocale, useProgress } from "@/components/providers";
import { Breadcrumb } from "@/components/shell";
import { ProgressBar, Reveal, UpgradeDialog } from "@/components/ui";
import { courseRepository } from "@/services/courses";
import { moduleProgress } from "@/domain/learning";
export function CoursePath() {
  const { t, l, locale, href } = useLocale();
  const progress = useProgress();
  const [upgrade, setUpgrade] = useState(false);
  const [full, setFull] = useState(false);
  const course = courseRepository.get("javascript")!;
  const lessons = courseRepository
    .lessons()
    .filter((l) => l.courseId === course.id);
  const done = lessons.filter((l) => progress.completed[l.id]).length;
  const next = lessons.find((l) => !progress.completed[l.id]);
  return (
    <div className="container page-space">
      <Breadcrumb current="JavaScript" />
      <div className="course-layout">
        <div>
          <Reveal className="course-intro">
            <span className="language-icon yellow large">JS</span>
            <div className="eyebrow">
              {t.beginner} <span>·</span> {t.freeLabel}
            </div>
            <h1 className="page-heading">
              JavaScript<span className="accent-dot">.</span>
            </h1>
            <p className="page-intro">{l(course.description)}</p>
            <div className="course-facts">
              <span>
                <Clock3 size={16} />
                37 {t.minutes}
              </span>
              <span>
                <Globe2 size={16} />
                EN / PL
              </span>
              <span>
                <CheckCircle2 size={16} />
                {t.availableLessonCount}
              </span>
            </div>
          </Reveal>
          <div className="path-heading">
            <h2>{t.freePath}</h2>
            <span className="badge green">4 {t.modules}</span>
          </div>
          <div className="module-path">
            {course.modules
              .filter((m) => m.access === "free")
              .map((module, index) => {
                const percent = moduleProgress(module, progress);
                const checkpointDone =
                  progress.quizBest[`checkpoint-${module.id}`] !== undefined;
                return (
                  <article className="module-section" key={module.id}>
                    <div
                      className={`path-node ${percent === 100 ? "done" : ""}`}
                    >
                      {percent === 100 ? (
                        <Check size={19} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </div>
                    <div className="module-heading">
                      <div>
                        <h3>{l(module.title)}</h3>
                        <span>
                          {module.lessonIds.length} {t.lessons} ·{" "}
                          {module.minutes} {t.minutes}
                        </span>
                      </div>
                      <span className="badge subtle">{t.free}</span>
                    </div>
                    <div className="lesson-list">
                      {module.lessonIds.map((id) => {
                        const lesson = courseRepository.lesson(id)!;
                        return (
                          <Link
                            className={`lesson-row ${progress.completed[id] ? "done" : ""}`}
                            href={href(`/learn/${id}`)}
                            key={id}
                          >
                            <span className="lesson-row-icon">
                              {progress.completed[id] ? (
                                <Check size={17} />
                              ) : (
                                <Play size={15} />
                              )}
                            </span>
                            <div>
                              <strong>{l(lesson.title)}</strong>
                              <small>
                                {lesson.minutes} {t.minutes}
                                {progress.completed[id]
                                  ? ` · ${t.completed}`
                                  : ""}
                              </small>
                            </div>
                            <ArrowUpRight size={17} />
                          </Link>
                        );
                      })}
                      <Link
                        className={`lesson-row checkpoint-row ${percent < 100 ? "not-ready" : ""}`}
                        href={href(`/checkpoint/${module.id}`)}
                      >
                        <span className="lesson-row-icon">
                          {checkpointDone ? (
                            <Check size={17} />
                          ) : (
                            <Flag size={17} />
                          )}
                        </span>
                        <div>
                          <strong>{t.checkpoint}</strong>
                          <small>
                            {checkpointDone
                              ? `${progress.quizBest[`checkpoint-${module.id}`]}%`
                              : percent === 100
                                ? t.available
                                : t.quizLocked}
                          </small>
                        </div>
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </article>
                );
              })}
          </div>
          <div className="path-heading">
            <h2>{t.roadmap}</h2>
            <span className="badge purple">Premium</span>
          </div>
          <p className="muted">{t.roadmapNote}</p>
          <div className="premium-roadmap">
            {course.modules
              .filter((m) => m.access === "premium")
              .slice(0, full ? 16 : 4)
              .map((module, i) => (
                <button
                  className="premium-module"
                  key={module.id}
                  onClick={() => setUpgrade(true)}
                  aria-label={`${l(module.title)} — ${t.locked} — ${t.premium}`}
                >
                  <span>{String(i + 5).padStart(2, "0")}</span>
                  <strong>{l(module.title)}</strong>
                  <small>{t.planned}</small>
                  <LockKeyhole size={16} />
                </button>
              ))}
          </div>
          <button className="text-link" onClick={() => setFull(!full)}>
            {full ? t.hideRoadmap : t.showRoadmap}
            <ArrowDown size={17} />
          </button>
        </div>
        <aside className="course-sidebar">
          <div className="path-summary">
            <span className="eyebrow">
              <Sparkles size={15} />
              {t.courseOverview}
            </span>
            <h2>
              {locale === "en"
                ? "One concept closer."
                : "O jedno pojęcie bliżej."}
            </h2>
            <div className="summary-progress">
              <strong>
                {done}
                <span> / {lessons.length}</span>
              </strong>
              <span>{t.lessons}</span>
            </div>
            <ProgressBar
              value={Math.round((done / lessons.length) * 100)}
              label={t.progress}
            />
            <p>{t.noPressure}</p>
            <Link
              className="button primary full"
              href={href(next ? `/learn/${next.id}` : "/review")}
            >
              {done ? t.continue : t.start}
              <ArrowUpRight size={17} />
            </Link>
            <div className="summary-footnotes">
              <span>
                <Check size={15} />
                {t.noAccount}
              </span>
              <span>
                <Check size={15} />
                {t.saved}
              </span>
              <span>
                <Check size={15} />
                {t.courseLanguage}
              </span>
            </div>
          </div>
          <div className="side-note">
            <span>✦</span>
            <p>
              {locale === "en"
                ? "Understanding beats memorising. Every time."
                : "Zrozumienie daje więcej niż zapamiętywanie. Za każdym razem."}
            </p>
          </div>
        </aside>
      </div>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
