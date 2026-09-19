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
  Star,
} from "lucide-react";
import { useLocale, useProgress } from "@/components/providers";
import { Breadcrumb } from "@/components/shell";
import { ProgressBar, Reveal, UpgradeDialog } from "@/components/ui";
import { courseRepository } from "@/services/courses";
import { CourseModeDock } from "@/features/study/course-mode-dock";
import {
  moduleMaxXp,
  moduleProgress,
  moduleStars,
  moduleXp,
} from "@/domain/learning";
export function CoursePath({ courseSlug = "javascript" }: { courseSlug?: string }) {
  const { t, l, locale, href } = useLocale();
  const progress = useProgress();
  const [upgrade, setUpgrade] = useState(false);
  const [full, setFull] = useState(false);
  const course = courseRepository.get(courseSlug)!;
  const lessons = courseRepository.lessons().filter((l) => l.courseId === course.id);
  const freeModules = course.modules.filter((m) => m.access === "free");
  const premiumModules = course.modules.filter((m) => m.access === "premium");
  const freeLessons = lessons.filter((lesson) =>
    freeModules.some((module) => module.id === lesson.moduleId),
  );
  const freeMinutes = freeModules.reduce((sum, module) => sum + module.minutes, 0);
  const done = freeLessons.filter((lesson) => progress.completed[lesson.id]).length;
  const next = freeLessons.find((lesson) => !progress.completed[lesson.id]);
  return () => observer.disconnect();
  }, [course.id]);

  function goToModule(moduleId: string) {
    setActiveModule(moduleId);
    document
      .getElementById(`module-${moduleId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="container page-space">
      <CourseModeDock courseSlug={course.slug} active="practice" />
      <Breadcrumb current={l(course.title)} />
      <div className="course-layout course-layout-clean">
        <div className="course-main-column">
          <Reveal className="course-intro">
            <span className={`language-icon ${course.color} large`}>{course.short}</span>
            <div className="eyebrow">
              {t.beginner} <span>·</span> {t.freeLabel}
            </div>
            <h1 className="page-heading">
              {l(course.title)}<span className="accent-dot">.</span>
            </h1>
            <p className="page-intro">{l(course.description)}</p>
            <div className="course-facts">
              <span>
                <Clock3 size={16} />
                {freeMinutes} {t.minutes}
              </span>
              <span>
                <Globe2 size={16} />
                EN / PL
              </span>
              <span>
                <CheckCircle2 size={16} />
                {freeLessons.length} {t.lessons} · {t.free}
              </span>
            </div>
          </Reveal>
          <div className="path-heading">
            <h2>{t.freePath}</h2>
            <span className="badge green">{freeModules.length} {t.modules}</span>
          </div>
          <div className="module-path">
            {freeModules.map((module, index) => {
                const percent = moduleProgress(module, progress);
                const checkpointDone =
                  progress.quizBest[`checkpoint-${module.id}`] !== undefined;
                const stars = moduleStars(module, progress);
                const earnedXp = moduleXp(module, progress);
                const maxXp = moduleMaxXp(module);
                return (
                  <article
                    className="module-section"
                    id={`module-${module.id}`}
                    data-module-id={module.id}
                    key={module.id}
                  >
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
                      <div className="module-achievement">
                        <div
                          className="module-stars"
                          role="img"
                          aria-label={
                            locale === "en"
                              ? `${stars} of 3 achievement stars`
                              : `${stars} z 3 gwiazdek osiągnięcia`
                          }
                        >
                          {[0, 1, 2].map((starIndex) => (
                            <Star
                              key={starIndex}
                              size={15}
                              fill={starIndex < stars ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className="module-xp">{earnedXp} / {maxXp} XP</span>
                        <span className="badge subtle">{t.free}</span>
                      </div>
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
            {premiumModules
              .slice(0, full ? premiumModules.length : 4)
              .map((module, i) => (
                <button
                  className="premium-module"
                  key={module.id}
                  onClick={() => setUpgrade(true)}
                  aria-label={`${l(module.title)} — ${t.locked} — ${t.premium}`}
                >
                  <span>{String(i + freeModules.length + 1).padStart(2, "0")}</span>
                  <strong>{l(module.title)}</strong>
                  <small>{l(module.description)}</small>
                  <span className="module-level-tag">
                    {module.level === "advanced"
                      ? locale === "en"
                        ? "Advanced"
                        : "Zaawansowany"
                      : locale === "en"
                        ? "Foundation"
                        : "Podstawowy"}
                  </span>
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
                <span> / {freeLessons.length}</span>
              </strong>
              <span>{t.lessons}</span>
            </div>
            <ProgressBar
              value={
                freeLessons.length
                  ? Math.round((done / freeLessons.length) * 100)
                  : 0
              }
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
