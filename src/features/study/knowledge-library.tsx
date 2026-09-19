"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Code2,
  Lightbulb,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { studyContentFor } from "@/content/study-content";
import { CourseModeDock } from "./course-mode-dock";

export function KnowledgeLibrary({ courseSlug }: { courseSlug: string }) {
  const { locale, l } = useLocale();
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

  const goToChapter = useCallback(
    (nextIndex: number) => {
      if (!beginnerSections.length) return;
      const normalized =
        (nextIndex + beginnerSections.length) % beginnerSections.length;
      setDirection(
        normalized > index ||
          (index === beginnerSections.length - 1 && normalized === 0)
          ? 1
          : -1,
      );
      setIndex(normalized);
    },
    [beginnerSections.length, index],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      )
        return;
      if (event.key === "ArrowLeft") goToChapter(index - 1);
      if (event.key === "ArrowRight") goToChapter(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, beginnerSections.length, goToChapter]);

  if (!study || !section) return null;

  return (
    <div className="container page-space study-library-page">
      <CourseModeDock courseSlug={courseSlug} active="knowledge" />
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
      </header>

      <section className="knowledge-reader-shell">
        <div className="knowledge-reader-top">
          <div
            className="knowledge-track-tabs"
            role="tablist"
            aria-label={en ? "Knowledge level" : "Poziom wiedzy"}
          >
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

        <label className="knowledge-mobile-chapter">
          <span>{en ? "Chapter" : "Rozdział"}</span>
          <select
            value={index}
            onChange={(event) => goToChapter(Number(event.target.value))}
          >
            {beginnerSections.map((item, itemIndex) => (
              <option value={itemIndex} key={item.id}>
                {String(itemIndex + 1).padStart(2, "0")} · {l(item.title)}
              </option>
            ))}
          </select>
        </label>

        <div className="knowledge-reader-layout">
          <aside
            className="knowledge-chapter-nav"
            aria-label={en ? "Knowledge chapters" : "Rozdziały biblioteki wiedzy"}
          >
            <div className="knowledge-chapter-nav-inner">
              <span className="eyebrow">
                {en ? "FOUNDATIONS" : "PODSTAWY"} · {beginnerSections.length}
              </span>
              <nav>
                {beginnerSections.map((item, itemIndex) => (
                  <button
                    type="button"
                    key={item.id}
                    className={itemIndex === index ? "active" : ""}
                    aria-current={itemIndex === index ? "step" : undefined}
                    onClick={() => goToChapter(itemIndex)}
                  >
                    <span className="knowledge-chapter-dot" aria-hidden="true" />
                    <span className="knowledge-chapter-copy">
                      <small>{String(itemIndex + 1).padStart(2, "0")}</small>
                      <strong>{l(item.title)}</strong>
                    </span>
                  </button>
                ))}
              </nav>
              <button
                type="button"
                className="knowledge-advanced-link"
                onClick={() => setUpgrade(true)}
              >
                <LockKeyhole size={14} />
                <span>
                  <strong>{en ? "Advanced" : "Zaawansowane"}</strong>
                  <small>{advancedSections.length} {en ? "chapters" : "rozdziałów"}</small>
                </span>
              </button>
            </div>
          </aside>

          <div className="knowledge-reader-stage">
            <button
              type="button"
              className="knowledge-arrow knowledge-arrow-left"
              onClick={() => goToChapter(index - 1)}
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
                    onClick={() => goToChapter(index - 1)}
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
                      <b
                        style={{
                          width: `${((index + 1) / beginnerSections.length) * 100}%`,
                        }}
                      />
                    </i>
                  </div>
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => goToChapter(index + 1)}
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
              onClick={() => goToChapter(index + 1)}
              aria-label={en ? "Next chapter" : "Następny rozdział"}
            >
              <ArrowRight size={22} />
            </button>
          </div>
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
