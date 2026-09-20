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
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { studyContentFor } from "@/content/study-content";
import {
  glossaryHighlightPlan,
  glossaryMatches,
  type GlossaryTerm,
} from "@/content/glossary";
import { glossaryTermsForSection } from "@/content/glossary-context";
import { knowledgeCuriosityFor } from "@/content/knowledge-curiosities";
import { countLabel } from "@/lib/count-label";
import { CourseModeDock } from "./course-mode-dock";
import { CourseIntroTrailer } from "./course-intro-trailer";
import {
  GlossaryDetailDialog,
  GlossaryPanel,
  GlossaryText,
} from "./glossary";

type KnowledgeView = "knowledge" | "glossary";

export function KnowledgeLibrary({ courseSlug }: { courseSlug: string }) {
  const { locale, l } = useLocale();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [upgrade, setUpgrade] = useState(false);
  const [view, setView] = useState<KnowledgeView>("knowledge");
  const [selectedGlossary, setSelectedGlossary] = useState<GlossaryTerm | null>(null);
  const course = courseRepository.get(courseSlug)!;
  const study = studyContentFor(courseSlug);
  const en = locale === "en";
  const hasQuickGlossary = courseSlug !== "it-foundations";

  const beginnerSections = useMemo(
    () => study?.knowledge.filter((section) => section.level === "beginner") ?? [],
    [study],
  );
  const advancedSections = useMemo(
    () => study?.knowledge.filter((section) => section.level === "advanced") ?? [],
    [study],
  );

  const section = beginnerSections[index];
  const curiosity = section ? knowledgeCuriosityFor(section.id) : undefined;
  const advancedChapterLabel = countLabel(
    locale,
    advancedSections.length,
    ["chapter", "chapters"],
    ["rozdział", "rozdziały", "rozdziałów"],
  );

  const glossaryEntries = useMemo(() => {
    if (!section) return [];
    return [
      { key: "lead", text: section.lead[locale] },
      ...section.paragraphs.map((item, itemIndex) => ({
        key: `paragraph-${itemIndex}`,
        text: item[locale],
      })),
      ...section.bullets.map((item, itemIndex) => ({
        key: `bullet-${itemIndex}`,
        text: item[locale],
      })),
      { key: "rule", text: section.rule[locale] },
      { key: "pitfall", text: section.pitfall[locale] },
    ];
  }, [locale, section]);

  const glossaryPlan = useMemo(() => {
    if (!section) return {};
    const titleTerms = glossaryMatches(courseSlug, section.title[locale]).map(
      (match) => match.term.id,
    );
    return glossaryHighlightPlan(
      courseSlug,
      glossaryEntries,
      titleTerms,
      8,
      glossaryTermsForSection(section.id),
    );
  }, [courseSlug, glossaryEntries, locale, section]);

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
    if (section) progressStore.visitKnowledge(courseSlug, section.id);
  }, [courseSlug, section]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (view !== "knowledge") return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.tagName === "BUTTON")
      )
        return;
      if (event.key === "ArrowLeft") goToChapter(index - 1);
      if (event.key === "ArrowRight") goToChapter(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, view, goToChapter]);

  if (!study || !section) return null;

  return (
    <div className="container page-space study-library-page">
      <CourseModeDock courseSlug={courseSlug} active="knowledge" />
      <Breadcrumb current={l(course.title)} />

      <header className="study-library-hero compact-study-hero">
        <div>
          <span className="eyebrow">
            <BookOpenText size={16} />
            {en ? "LEARN" : "NAUKA"}
          </span>
          <h1>
            {l(course.title)}
            <span className="accent-dot">.</span>{" "}
            {en ? "Understand it, page by page." : "Zrozum to, strona po stronie."}
          </h1>
          <p>
            {courseSlug === "it-foundations"
              ? en
                ? "Learn the topic without unnecessary repetition. Important terms are highlighted for quick context; the separate IT Fundamentals module is the full reference."
                : "Ucz się bez niepotrzebnego powtarzania definicji. Ważne pojęcia są podświetlone dla szybkiego kontekstu; pełny słownik znajduje się w osobnym module Fundamenty IT."
              : en
                ? "Learn the topic without unnecessary repetition. Important terms are highlighted — hover or tap them for a short definition, or open the glossary."
                : "Ucz się bez niepotrzebnego powtarzania definicji. Ważne pojęcia są podświetlone — najedź lub kliknij, aby zobaczyć krótkie wyjaśnienie, albo otwórz słownik."}
          </p>
          <CourseIntroTrailer courseSlug={courseSlug} />
        </div>
      </header>

      {hasQuickGlossary && (
        <div className="knowledge-submode-switch" role="tablist" aria-label={en ? "Learning view" : "Widok nauki"}>
          <button
            type="button"
            role="tab"
            aria-selected={view === "knowledge"}
            className={view === "knowledge" ? "active" : ""}
            onClick={() => setView("knowledge")}
          >
            <BookOpenText size={16} />
            <span>{en ? "Knowledge" : "Wiedza"}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "glossary"}
            className={view === "glossary" ? "active" : ""}
            onClick={() => setView("glossary")}
          >
            <Lightbulb size={16} />
            <span>{en ? "Glossary" : "Słownik"}</span>
          </button>
        </div>
      )}


      {hasQuickGlossary && view === "glossary" ? (
        <GlossaryPanel
          courseSlug={courseSlug}
          onExpand={setSelectedGlossary}
        />
      ) : (
        <>
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
                      <small>{advancedSections.length} {advancedChapterLabel}</small>
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
                        <p>
                          <GlossaryText
                            courseSlug={courseSlug}
                            text={l(section.lead)}
                            allowedTermIds={glossaryPlan.lead}
                            maxTerms={2}
                            onExpand={setSelectedGlossary}
                          />
                        </p>
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
                            <p>
                              <GlossaryText
                                courseSlug={courseSlug}
                                text={l(paragraph)}
                                allowedTermIds={glossaryPlan[`paragraph-${paragraphIndex}`]}
                                onExpand={setSelectedGlossary}
                              />
                            </p>
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
                                <span>
                                  <GlossaryText
                                    courseSlug={courseSlug}
                                    text={l(bullet)}
                                    allowedTermIds={glossaryPlan[`bullet-${bulletIndex}`]}
                                    maxTerms={2}
                                    onExpand={setSelectedGlossary}
                                  />
                                </span>
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
                            <p>
                              <GlossaryText
                                courseSlug={courseSlug}
                                text={l(section.rule)}
                                allowedTermIds={glossaryPlan.rule}
                                maxTerms={2}
                                onExpand={setSelectedGlossary}
                              />
                            </p>
                          </div>
                        </div>

                        <div className="knowledge-callout pitfall">
                          <ShieldAlert size={19} />
                          <div>
                            <strong>{en ? "Watch out" : "Uważaj na to"}</strong>
                            <p>
                              <GlossaryText
                                courseSlug={courseSlug}
                                text={l(section.pitfall)}
                                allowedTermIds={glossaryPlan.pitfall}
                                maxTerms={2}
                                onExpand={setSelectedGlossary}
                              />
                            </p>
                          </div>
                        </div>

                        {curiosity && (
                          <div className="knowledge-callout curiosity">
                            <Sparkles size={19} />
                            <div>
                              <strong>{en ? "Did you know?" : "Ciekawostka"}</strong>
                              <p>{curiosity[locale]}</p>
                            </div>
                          </div>
                        )}
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
                  ? `Advanced track: ${advancedSections.length} ${advancedChapterLabel}. The same page-by-page format continues there.`
                  : `Ścieżka zaawansowana: ${advancedSections.length} ${advancedChapterLabel}. Dalej obowiązuje ten sam prosty format strona po stronie.`}
              </p>
            </div>
            <button className="button primary" onClick={() => setUpgrade(true)}>
              <LockKeyhole size={17} />
              {en ? "See advanced track" : "Zobacz ścieżkę zaawansowaną"}
            </button>
          </section>
        </>
      )}

      <GlossaryDetailDialog
        term={selectedGlossary}
        onClose={() => setSelectedGlossary(null)}
      />
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
