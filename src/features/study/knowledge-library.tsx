"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpenText,
  Code2,
  Lightbulb,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { studyContentFor, type StudyLevel } from "@/content/study-content";

export function KnowledgeLibrary({ courseSlug }: { courseSlug: string }) {
  const { locale, l, href } = useLocale();
  const [upgrade, setUpgrade] = useState(false);
  const course = courseRepository.get(courseSlug)!;
  const study = studyContentFor(courseSlug);
  if (!study) return null;

  const en = locale === "en";
  const levels: { id: StudyLevel; label: string; note: string }[] = [
    {
      id: "beginner",
      label: en ? "Foundations" : "Podstawy",
      note: en ? "Clear mental models first." : "Najpierw jasne modele myślowe.",
    },
    {
      id: "advanced",
      label: en ? "Advanced notes" : "Zaawansowane tajniki",
      note: en
        ? "The details that separate good from great."
        : "Smaczki, które odróżniają dobry kod od świetnego.",
    },
  ];

  const beginnerSections = study.knowledge.filter(
    (section) => section.level === "beginner",
  );
  const advancedSections = study.knowledge.filter(
    (section) => section.level === "advanced",
  );

  return (
    <div className="container page-space study-library-page">
      <Breadcrumb current={l(course.title)} />
      <header className="study-library-hero">
        <div>
          <span className="eyebrow">
            <BookOpenText size={16} />
            {en ? "KNOWLEDGE LIBRARY" : "BIBLIOTEKA WIEDZY"}
          </span>
          <h1>
            {l(course.title)}
            <span className="accent-dot">.</span>{" "}
            {en ? "The useful theory." : "Teoria, która się przydaje."}
          </h1>
          <p>
            {en
              ? "A compact reference you can read from start to finish or revisit when one concept needs to click. Every section gives you the rule, an example and the trap to avoid."
              : "Przystępne kompendium, które możesz przeczytać od początku do końca albo traktować jak ściągę. Każdy temat ma zasadę, przykład i pułapkę, której warto uniknąć."}
          </p>
        </div>
        <div className="study-library-actions">
          <Link
            className="button secondary"
            href={href(`/courses/${courseSlug}/flashcards`)}
          >
            <Sparkles size={17} />
            {en ? "Learn with flashcards" : "Ucz się fiszkami"}
          </Link>
          <Link className="button primary" href={href(`/courses/${courseSlug}`)}>
            <Code2 size={17} />
            {en ? "Practice path" : "Ścieżka praktyczna"}
          </Link>
        </div>
      </header>

      <div
        className="knowledge-index"
        aria-label={en ? "Knowledge index" : "Spis wiedzy"}
      >
        {levels.map((level) => {
          const sections =
            level.id === "beginner" ? beginnerSections : advancedSections;
          return (
            <section key={level.id}>
              <div>
                <strong>{level.label}</strong>
                <small>{level.note}</small>
              </div>
              <nav>
                {sections.map((section) =>
                  level.id === "advanced" ? (
                    <button
                      type="button"
                      className="knowledge-index-locked"
                      key={section.id}
                      onClick={() => setUpgrade(true)}
                    >
                      <LockKeyhole size={13} />
                      {l(section.title)}
                    </button>
                  ) : (
                    <a key={section.id} href={`#${section.id}`}>
                      {l(section.title)}
                    </a>
                  ),
                )}
              </nav>
            </section>
          );
        })}
      </div>

      <section className="knowledge-level">
        <div className="knowledge-level-heading">
          <span>01</span>
          <div>
            <h2>{en ? "Foundations" : "Podstawy"}</h2>
            <p>{en ? "Clear mental models first." : "Najpierw jasne modele myślowe."}</p>
          </div>
        </div>
        <div className="knowledge-sections">
          {beginnerSections.map((section, index) => (
            <article
              id={section.id}
              className="knowledge-article"
              key={section.id}
            >
              <div className="knowledge-article-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="knowledge-article-main">
                <header>
                  <h3>{l(section.title)}</h3>
                  <p className="knowledge-lead">{l(section.lead)}</p>
                </header>
                <div className="knowledge-copy">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{l(paragraph)}</p>
                  ))}
                </div>
                <ul className="knowledge-points">
                  {section.bullets.map((bullet, i) => (
                    <li key={i}>
                      <span>✓</span>
                      {l(bullet)}
                    </li>
                  ))}
                </ul>
                {section.code && (
                  <figure className="knowledge-code">
                    <figcaption>{l(section.code.label)}</figcaption>
                    <pre className="code-block">
                      <code>{section.code.value}</code>
                    </pre>
                  </figure>
                )}
                <div className="knowledge-callouts">
                  <aside className="knowledge-rule">
                    <Lightbulb size={19} />
                    <div>
                      <strong>
                        {en ? "Rule to remember" : "Reguła do zapamiętania"}
                      </strong>
                      <p>{l(section.rule)}</p>
                    </div>
                  </aside>
                  <aside className="knowledge-pitfall">
                    <ShieldAlert size={19} />
                    <div>
                      <strong>{en ? "Common trap" : "Częsta pułapka"}</strong>
                      <p>{l(section.pitfall)}</p>
                    </div>
                  </aside>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-level">
        <div className="knowledge-level-heading">
          <span>02</span>
          <div>
            <h2>{en ? "Advanced notes" : "Zaawansowane tajniki"}</h2>
            <p>
              {en
                ? "The details that separate good from great."
                : "Smaczki, które odróżniają dobry kod od świetnego."}
            </p>
          </div>
        </div>
        <div className="advanced-study-gate">
          <span className="advanced-study-lock">
            <LockKeyhole size={24} />
          </span>
          <div>
            <span className="eyebrow">PREMIUM · ADVANCED</span>
            <h3>
              {en
                ? "Deeper architecture, production traps and senior-level details."
                : "Głębsza architektura, pułapki produkcyjne i smaczki poziomu senior."}
            </h3>
            <p>
              {en
                ? `${advancedSections.length} advanced chapters are included in the full course, with code examples, rules and common failure modes.`
                : `${advancedSections.length} zaawansowane rozdziały są częścią pełnego kursu — z kodem, regułami i typowymi pułapkami.`}
            </p>
          </div>
          <button className="button primary" onClick={() => setUpgrade(true)}>
            <LockKeyhole size={17} />
            {en ? "Unlock advanced library" : "Odblokuj zaawansowaną bibliotekę"}
          </button>
        </div>
      </section>

      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
