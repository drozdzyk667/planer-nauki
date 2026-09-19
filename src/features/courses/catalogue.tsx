"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  Clock3,
  Code2,
  LockKeyhole,
} from "lucide-react";
import { useLocale } from "@/components/providers";
import { Reveal } from "@/components/ui";
import { courseRepository } from "@/services/courses";
import type { Course } from "@/domain/models";
import { studyContentFor } from "@/content/study-content";
export function CourseCard({
  course,
  featured = false,
}: {
  course: Course;
  featured?: boolean;
}) {
  const { t, l, href } = useLocale();
  const freeLessonCount = course.modules
    .filter((module) => module.access === "free")
    .reduce((count, module) => count + module.lessonIds.length, 0);
  const study = studyContentFor(course.slug);
  const freeChapterCount =
    study?.knowledge.filter((section) => section.level === "beginner").length ?? 0;
  const target = study
    ? `/courses/${course.slug}/knowledge`
    : freeLessonCount > 0
      ? `/courses/${course.slug}`
      : `/courses#course-${course.slug}`;
  return (
    <article
      id={`course-${course.slug}`}
      className={`course-card ${featured ? "featured" : ""} ${course.color}`}
    >
      <div className="course-card-top">
        <span className={`language-icon ${course.color}`}>{course.short}</span>
        <span
          className={`badge ${course.status === "available" ? "green" : "subtle"}`}
        >
          {course.status === "available" ? (
            <>
              <span className="live-dot" />
              {t.available}
            </>
          ) : (
            t.soon
          )}
        </span>
      </div>
      <h3>{l(course.title)}</h3>
      <p>{l(course.description)}</p>
      <div className="course-card-bottom">
        {course.status === "available" ? (
          <>
            <span>
              {freeLessonCount > 0 ? (
                <>
                  <Code2 size={15} />
                  {freeLessonCount} {t.lessons} · {t.free}
                </>
              ) : (
                <>
                  <BookOpenText size={15} />
                  {freeChapterCount} {t.chapters} · {t.free}
                </>
              )}
            </span>
            <Link
              className="round-link"
              href={href(target)}
              aria-label={`${t.start} · ${l(course.title)}`}
            >
              <ArrowUpRight size={21} />
              <span className="card-link-overlay" />
            </Link>
          </>
        ) : (
          <>
            <span>{t.planned}</span>
            <LockKeyhole size={17} />
          </>
        )}
      </div>
    </article>
  );
}
export function Catalogue() {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState("all");
  const courses = courseRepository
    .list()
    .filter((c) => filter === "all" || c.category === filter);
  return (
    <div className="container page-space">
      <Reveal>
        <div className="eyebrow">
          <span className="tiny-line" />
          {locale === "en" ? "YOUR NEXT CHAPTER" : "TWÓJ KOLEJNY ROZDZIAŁ"}
        </div>
        <h1 className="page-heading">
          {locale === "en" ? (
            <>
              Big ideas.
              <br />
              <span className="muted">Small, doable steps.</span>
            </>
          ) : (
            <>
              Wielkie pomysły.
              <br />
              <span className="muted">Małe, wykonalne kroki.</span>
            </>
          )}
        </h1>
        <p className="page-intro">
          {locale === "en"
            ? "Pick a skill. Build it one “aha” moment at a time."
            : "Wybierz umiejętność. Rozwijaj ją z każdym „aha, rozumiem”."}
        </p>
      </Reveal>
      <div className="filter-bar" aria-label={t.courses}>
        {(["all", "web", "data", "ai", "it"] as const).map((key) => (
          <button
            key={key}
            className={`filter ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
          >
            {t[key]}
          </button>
        ))}
      </div>
      <div className="course-grid">
        {courses.map((course, i) => (
          <Reveal key={course.id} delay={i * 0.04}>
            <CourseCard course={course} />
          </Reveal>
        ))}
      </div>
      <div className="catalogue-note">
        <Check size={18} />
        {t.noAccount}
        <span>·</span>
        <Clock3 size={18} />
        {t.noPressure}
        <ArrowRight size={18} />
      </div>
    </div>
  );
}
