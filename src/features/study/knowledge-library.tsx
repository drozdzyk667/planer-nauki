"use client";

import Link from "next/link";
import { BookOpenText, Code2, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/shell";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { studyContentFor, type StudyLevel } from "@/content/study-content";

export function KnowledgeLibrary({ courseSlug }: { courseSlug: string }) {
  const { locale, l, href } = useLocale();
  const course = courseRepository.get(courseSlug)!;
  const content = studyContentFor(courseSlug);
  if (!content) return null;

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
      note: en ? "The details that separate good from great." : "Smaczki, które odróżniają dobry kod od świetnego.",
    },
  ];

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
          <Link className="button secondary" href={href(`/courses/${courseSlug}/flashcards`)}>
            <Sparkles size={17} />
            {en ? "Learn with flashcards" : "Ucz się fiszkami"}
          </Link>
          <Link className="button primary" href={href(`/courses/${courseSlug}`)}>
            <Code2 size={17} />
            {en ? "Practice path" : "Ścieżka praktyczna"}
          </Link>
        </div>
      </header>

      <div className="knowledge-index" aria-label={en ? "Knowledge index" : "Spis wiedzy"}>
        {levels.map((level) => (
          <section key={level.id}>
            <div>
              <strong>{level.label}</strong>
              <small>{level.note}</small>
            </div>
            <nav>
              {content.knowledge
                .filter((section) => section.level === level.id)
                .map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {l(section.title)}
                  </a>
                ))}
            </nav>
          </section>
        ))}
      </div>

      {levels.map((level) => (
        <section className="knowledge-level" key={level.id}>
          <div className="knowledge-level-heading">
            <span>{level.id === "beginner" ? "01" : "02"}</span>
            <div>
              <h2>{level.label}</h2>
              <p>{level.note}</p>
            </div>
          </div>
          <div className="knowledge-sections">
            {content.knowledge
              .filter((section) => section.level === level.id)
              .map((section, index) => (
                <article id={section.id} className="knowledge-article" key={section.id}>
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
                          <strong>{en ? "Rule to remember" : "Reguła do zapamiętania"}</strong>
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
      ))}
    </div>
  );
}
