"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Code2,
  Lightbulb,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { studyContentFor } from "@/content/study-content";

export function KnowledgeLibrary({ courseSlug }: { courseSlug: string }) {
  const { locale, l, href } = useLocale();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [upgrade, setUpgrade] = useState(false);
  const course = courseRepository.get(courseSlug)!;
  const study = studyContentFor(courseSlug);
  const en = locale === "en";

  const beginnerSections = useMemo(
    () => study?.knowledge.filter((section) => section.level === "beginner") ?? [],
    [study],
  );
  const advancedSections = useMemo(
    () => study?.knowledge.filter((section) => section.level === "advanced") ?? [],
    [study],
  );

  const section = beginnerSections[index];

  function move(next: number) {
    if (!beginnerSections.length) return;
    const normalized =
      (next + beginnerSections.length) % beginnerSections.length;
    setDirection(normalized > index || (index === beginnerSections.length - 1 && normalized === 0) ? 1 : -1);
    setIndex(normalized);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(index - 1);
      if (event.key === "ArrowRight") move(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, beginnerSections.length]);

  if (!study || !section) return null;

  return (
    <div className="container page-space study-library-page">
      <Breadcrumb current={l(course.title)} />

      <header className="study-library-hero compact-study-hero">
        <div>
          <span className="eyebrow">
            <BookOpenText size={16} />
            {en ? "KNOWLEDGE LIBRARY" : "BIBLIOTEKA WIEDZY"}
          </span>
          <h1>
            {l(course.title)}
            <span className="accent-dot">.</span>{" "}
            {en ? "Understand it, page by page." : "Zrozum to, strona po stronie."}
          </h1>
          <p>
            {en
              ? "No wall of text. One topic at a time, explained from the basics, with a rule, a real example and the mistake you are most likely to make."
              : "Bez ściany tekstu. Jeden temat na raz — od podstaw, z prostym wyjaśnieniem, regułą, przykładem i błędem, który najłatwiej popełnić."}
          </p>
        </div>

        <div className="study-library-actions">
          <Link
            className="button secondary"
            href={href(`/courses/${courseSlug}/flashcards`)}
          >
            <Sparkles size={17} />
            {en ? "Practice with flashcards" : "Powtórz fiszkami"}
          </Link>
          <Link className="button secondary" href={href(`/courses/${courseSlug}`)}>
            <Code2 size={17} />
            {en ? "Interactive practice" : "Praktyka interaktywna"}
          </Link>
        </div>
      </header>

      <section className="knowledge-reader-shell">
        <div className="knowledge-reader-top">
          <div className="knowledge-track-tabs" role="tablist" aria-label={en ? "Knowledge level" : "Poziom wiedzy"}>
            <button type="button" className="active" role="tab" aria-selected="true">
              <span>01</span>
              <strong>{en ? "Foundations" : "Podstawy"}</strong>
              <small>{beginnerSections.length}</small>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="false"
              onClick={() => setUpgrade(true)}
            >
              <span>02</span>
              <strong>{en ? "Advanced" : "Zaawansowane"}</strong>
              <small>
                <LockKeyhole size={12} />
                {advancedSections.length}
              </small>
            </button>
          </div>

          <div className="knowledge-page-counter" aria-live="polite">
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>/ {String(beginnerSections.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="knowledge-chapter-strip" aria-label={en ? "Chapters" : "Rozdziały"}>
          {beginnerSections.map((item, itemIndex) => (
            <button
              type="button"
              key={item.id}
              className={itemIndex === index ? "active" : ""}
              aria-current={itemIndex === index ? "step" : undefined}
              onClick={() => {
                setDirection(itemIndex >= index ? 1 : -1);
                setIndex(itemIndex);
              }}
            >
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              {l(item.title)}
            </button>
          ))}
        </div>

        <div className="knowledge-reader-stage">
          <button
            type="button"
            className="knowledge-arrow knowledge-arrow-left"
            onClick={() => move(index - 1)}
            aria-label={en ? "Previous chapter" : "Poprzedni rozdział"}
          >
            <ArrowLeft size={22} />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={section.id}
              className="knowledge-reader-page"
              initial={{ opacity: 0, x: direction * 44 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -44 }}
              transition={{ duration: 0.22 }}
            >
              <header className="knowledge-page-header">
                <div>
                  <span className="eyebrow">
                    {en ? "FOUNDATION" : "PODSTAWY"} ·{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>{l(section.title)}</h2>
                  <p>{l(section.lead)}</p>
                </div>
                <span className="knowledge-page-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </header>

              <div className="knowledge-page-grid">
                <section className="knowledge-explanation">
                  <span className="knowledge-section-label">
                    {en ? "STEP BY STEP" : "KROK PO KROKU"}
                  </span>
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <div className="knowledge-paragraph" key={paragraphIndex}>
                      <span>{paragraphIndex + 1}</span>
                      <p>{l(paragraph)}</p>
                    </div>
                  ))}

                  <div className="knowledge-remember">
                    <span className="knowledge-section-label">
                      {en ? "REMEMBER" : "ZAPAMIĘTAJ"}
                    </span>
                    <ul>
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>
                          <CheckCircle2 size={17} />
                          <span>{l(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <aside className="knowledge-example-column">
                  {section.code && (
                    <figure className="knowledge-code-card">
                      <figcaption>
                        <Code2 size={16} />
                        {l(section.code.label)}
                      </figcaption>
                      <pre className="code-block">
                        <code>{section.code.value}</code>
                      </pre>
                    </figure>
                  )}

                  <div className="knowledge-callout rule">
                    <Lightbulb size={19} />
                    <div>
                      <strong>{en ? "The rule" : "Najważniejsza reguła"}</strong>
                      <p>{l(section.rule)}</p>
                    </div>
                  </div>

                  <div className="knowledge-callout pitfall">
                    <ShieldAlert size={19} />
                    <div>
                      <strong>{en ? "Watch out" : "Uważaj na to"}</strong>
                      <p>{l(section.pitfall)}</p>
                    </div>
                  </div>
                </aside>
              </div>

              <footer className="knowledge-page-footer">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => move(index - 1)}
                >
                  <ArrowLeft size={17} />
                  {en ? "Previous" : "Poprzednia"}
                </button>
                <div>
                  <span>
                    {en
                      ? "Use ← → on the keyboard too"
                      : "Możesz też używać klawiszy ← →"}
                  </span>
                  <i>
                    <b style={{ width: `${((index + 1) / beginnerSections.length) * 100}%` }} />
                  </i>
                </div>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => move(index + 1)}
                >
                  {index === beginnerSections.length - 1
                    ? en
                      ? "Start again"
                      : "Od początku"
                    : en
                      ? "Next chapter"
                      : "Następny rozdział"}
                  <ArrowRight size={17} />
                </button>
              </footer>
            </motion.article>
          </AnimatePresence>

          <button
            type="button"
            className="knowledge-arrow knowledge-arrow-right"
            onClick={() => move(index + 1)}
            aria-label={en ? "Next chapter" : "Następny rozdział"}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </section>

      <section className="advanced-study-gate">
        <span className="advanced-study-lock">
          <LockKeyhole size={24} />
        </span>
        <div>
          <span className="eyebrow">PREMIUM · ADVANCED</span>
          <h3>
            {en
              ? "After the foundations: deeper architecture and production details."
              : "Po podstawach: głębsza architektura i produkcyjne smaczki."}
          </h3>
          <p>
            {en
              ? `${advancedSections.length} advanced chapters continue the same page-by-page format.`
              : `${advancedSections.length} zaawansowanych rozdziałów kontynuuje ten sam prosty format strona po stronie.`}
          </p>
        </div>
        <button className="button primary" onClick={() => setUpgrade(true)}>
          <LockKeyhole size={17} />
          {en ? "See advanced track" : "Zobacz ścieżkę zaawansowaną"}
        </button>
      </section>

      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
