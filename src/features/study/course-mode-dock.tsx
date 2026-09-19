"use client";

import Link from "next/link";
import { BookOpenText, Code2, FlaskConical, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";

type StudyMode = "knowledge" | "flashcards" | "coding" | "practice";

export function CourseModeDock({
  courseSlug,
  active,
}: {
  courseSlug: string;
  active: StudyMode;
}) {
  const { locale, href } = useLocale();
  const en = locale === "en";
  const course = courseRepository.get(courseSlug);
  const supportsCoding = ["javascript", "typescript", "react"].includes(courseSlug);
  const supportsPractice =
    course?.modules.some((module) => module.lessonIds.length > 0) ?? false;

  const items = [
    {
      id: "knowledge" as const,
      href: href(`/courses/${courseSlug}/knowledge`),
      label: en ? "Knowledge" : "Wiedza",
      full: en ? "Knowledge library" : "Biblioteka wiedzy",
      Icon: BookOpenText,
      visible: true,
    },
    {
      id: "flashcards" as const,
      href: href(`/courses/${courseSlug}/flashcards`),
      label: en ? "Cards" : "Fiszki",
      full: en ? "Flashcards" : "Fiszki",
      Icon: Sparkles,
      visible: true,
    },
    {
      id: "coding" as const,
      href: href(`/courses/${courseSlug}/coding`),
      label: en ? "Code" : "Kod",
      full: en ? "Practical coding" : "Praktyczne kodowanie",
      Icon: Code2,
      visible: supportsCoding,
    },
    {
      id: "practice" as const,
      href: href(`/courses/${courseSlug}`),
      label: en ? "Practice" : "Testy",
      full: en ? "Practice & tests" : "Praktyka i testy",
      Icon: FlaskConical,
      visible: supportsPractice,
    },
  ].filter((item) => item.visible);

  return (
    <>
      <nav
        className="course-mode-dock"
        aria-label={en ? "Course learning modes" : "Tryby nauki kursu"}
      >
        {items.map(({ id, href: target, label, full, Icon }) => (
          <Link
            key={id}
            href={target}
            className={active === id ? "active" : ""}
            aria-current={active === id ? "page" : undefined}
            aria-label={full}
            title={full}
          >
            <i className="course-mode-dock-line" aria-hidden="true" />
            <span className="course-mode-dock-icon">
              <Icon size={18} />
            </span>
            <span className="course-mode-dock-label">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="course-mode-dock-mobile-space" aria-hidden="true" />
    </>
  );
}
