"use client";

import Link from "next/link";
import { BookOpenText, Code2, FlaskConical, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers";

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

  const items = [
    {
      id: "knowledge" as const,
      href: href(`/courses/${courseSlug}/knowledge`),
      label: en ? "Knowledge" : "Wiedza",
      full: en ? "Knowledge library" : "Biblioteka wiedzy",
      Icon: BookOpenText,
    },
    {
      id: "flashcards" as const,
      href: href(`/courses/${courseSlug}/flashcards`),
      label: en ? "Cards" : "Fiszki",
      full: en ? "Flashcards" : "Fiszki",
      Icon: Sparkles,
    },
    {
      id: "coding" as const,
      href: href(`/courses/${courseSlug}/coding`),
      label: en ? "Code" : "Kod",
      full: en ? "Practical coding" : "Praktyczne kodowanie",
      Icon: Code2,
    },
    {
      id: "practice" as const,
      href: href(`/courses/${courseSlug}`),
      label: en ? "Practice" : "Testy",
      full: en ? "Practice & tests" : "Praktyka i testy",
      Icon: FlaskConical,
    },
  ];

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
