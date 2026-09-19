"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, Lightbulb, Search } from "lucide-react";
import { useLocale } from "@/components/providers";
import { Dialog } from "@/components/ui";
import {
  glossaryFor,
  glossaryMatches,
  type GlossaryMatch,
  type GlossaryTerm,
} from "@/content/glossary";

type GlossarySegment = {
  text: string;
  term?: GlossaryTerm;
};

function buildSegments(
  text: string,
  matches: GlossaryMatch[],
  allowedTermIds: string[] | undefined,
  maxTerms: number,
): GlossarySegment[] {
  const allowed = allowedTermIds ? new Set(allowedTermIds) : null;
  const used = new Set<string>();
  const segments: GlossarySegment[] = [];
  let cursor = 0;
  let highlighted = 0;

  for (const match of matches) {
    if (match.start < cursor) continue;
    if (used.has(match.term.id)) continue;
    if (allowed && !allowed.has(match.term.id)) continue;
    if (highlighted >= maxTerms) continue;

    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start) });
    }
    segments.push({ text: match.text, term: match.term });
    cursor = match.end;
    used.add(match.term.id);
    highlighted += 1;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length ? segments : [{ text }];
}

export function GlossaryText({
  courseSlug,
  text,
  allowedTermIds,
  maxTerms = 3,
  onExpand,
}: {
  courseSlug: string;
  text: string;
  allowedTermIds?: string[];
  maxTerms?: number;
  onExpand: (term: GlossaryTerm) => void;
}) {
  const { locale } = useLocale();
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [pinnedTermId, setPinnedTermId] = useState<string | null>(null);
  const [suppressedTermId, setSuppressedTermId] = useState<string | null>(null);

  const matches = useMemo(
    () => glossaryMatches(courseSlug, text),
    [courseSlug, text],
  );
  const segments = useMemo(
    () => buildSegments(text, matches, allowedTermIds, maxTerms),
    [allowedTermIds, matches, maxTerms, text],
  );

  const openDetails = (term: GlossaryTerm) => {
    setPinnedTermId(null);
    setHoveredTermId(null);
    setSuppressedTermId(term.id);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onExpand(term);
  };

  return (
    <>
      {segments.map((segment, index) => {
        const term = segment.term;
        if (!term) return <span key={index}>{segment.text}</span>;

        const expanded = term.expanded?.[locale];
        const definition = term.definition[locale];
        const accessible = expanded
          ? `${term.term}: ${expanded}. ${definition}`
          : `${term.term}: ${definition}`;
        const visible =
          suppressedTermId !== term.id &&
          (hoveredTermId === term.id || pinnedTermId === term.id);

        return (
          <span
            className={`glossary-inline ${visible ? "is-visible" : ""}`}
            key={index}
            onMouseEnter={() => {
              if (suppressedTermId !== term.id) setHoveredTermId(term.id);
            }}
            onMouseLeave={() => {
              setHoveredTermId((current) => (current === term.id ? null : current));
              setPinnedTermId((current) => (current === term.id ? null : current));
              setSuppressedTermId((current) => (current === term.id ? null : current));
            }}
          >
            <button
              type="button"
              className="glossary-inline-trigger"
              aria-label={accessible}
              aria-expanded={visible}
              onFocus={() => {
                if (suppressedTermId !== term.id) setHoveredTermId(term.id);
              }}
              onBlur={(event) => {
                const next = event.relatedTarget as Node | null;
                if (next && event.currentTarget.parentElement?.contains(next)) return;
                setHoveredTermId((current) => (current === term.id ? null : current));
              }}
              onClick={() => {
                setSuppressedTermId(null);
                setPinnedTermId((current) => (current === term.id ? null : term.id));
              }}
            >
              {segment.text}
              <sup aria-hidden="true">↗</sup>
            </button>

            <span
              className="glossary-tooltip"
              aria-hidden={!visible}
              onMouseEnter={() => setHoveredTermId(term.id)}
              onMouseLeave={() => {
                setHoveredTermId(null);
                setPinnedTermId(null);
              }}
            >
              <strong>{term.term}</strong>
              {expanded && <small>{expanded}</small>}
              <span>{definition}</span>
              <button
                type="button"
                className="glossary-tooltip-expand"
                onClick={() => openDetails(term)}
              >
                {locale === "en" ? "Learn more" : "Rozwiń"}
                <ArrowRight size={12} />
              </button>
            </span>
          </span>
        );
      })}
    </>
  );
}

export function GlossaryPanel({
  courseSlug,
  onExpand,
}: {
  courseSlug: string;
  onExpand: (term: GlossaryTerm) => void;
}) {
  const { locale, href } = useLocale();
  const [query, setQuery] = useState("");
  const terms = useMemo(() => glossaryFor(courseSlug), [courseSlug]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return terms;
    return terms.filter((term) => {
      const haystack = [
        term.term,
        term.expanded?.[locale] ?? "",
        term.definition[locale],
        term.details[locale],
        ...term.aliases,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return haystack.includes(needle);
    });
  }, [locale, query, terms]);

  const en = locale === "en";

  return (
    <section className="glossary-panel">
      <header className="glossary-header">
        <div>
          <span className="eyebrow">
            <Lightbulb size={15} />
            {en ? "QUICK REFERENCE" : "SZYBKI SŁOWNIK"}
          </span>
          <h2>{en ? "Terms worth knowing." : "Pojęcia, które warto znać."}</h2>
          <p>
            {en
              ? "Each card gives you the short version. Open it when you want the longer explanation and practical context."
              : "Każda karta pokazuje krótką wersję. Otwórz ją, gdy chcesz dłuższe wyjaśnienie i praktyczny kontekst."}
          </p>
        </div>
        <div className="glossary-header-actions">
          <Link className="glossary-global-link" href={href("/courses/it-foundations/fundamentals")}>
            <BookMarked size={15} />
            {en ? "IT Fundamentals" : "Pełny słownik IT"}
            <ArrowRight size={13} />
          </Link>
          <label className="glossary-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={en ? "Search a term or acronym…" : "Szukaj pojęcia lub skrótu…"}
            aria-label={en ? "Search glossary" : "Przeszukaj słownik"}
          />
          </label>
        </div>
      </header>

      <div className="glossary-grid">
        {filtered.map((term) => (
          <article className="glossary-card" key={term.id}>
            <div className="glossary-card-title">
              <strong>{term.term}</strong>
              <span>{term.category}</span>
            </div>
            {term.expanded && <h3>{term.expanded[locale]}</h3>}
            <p>{term.definition[locale]}</p>
            <button
              type="button"
              className="glossary-card-expand"
              onClick={() => onExpand(term)}
            >
              {en ? "Learn more" : "Rozwiń"}
              <ArrowRight size={13} />
            </button>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <p className="glossary-empty">
          {en ? "No term matches that search." : "Nie znaleziono takiego pojęcia."}
        </p>
      )}
    </section>
  );
}

export function GlossaryDetailDialog({
  term,
  onClose,
}: {
  term: GlossaryTerm | null;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const en = locale === "en";

  return (
    <Dialog
      open={Boolean(term)}
      onClose={onClose}
      title={term?.term ?? (en ? "Glossary" : "Słownik")}
    >
      {term && (
        <div className="glossary-detail">
          <div className="glossary-detail-meta">
            <span>{term.category}</span>
            {term.expanded && <strong>{term.expanded[locale]}</strong>}
          </div>

          <div className="glossary-detail-short">
            <span>{en ? "In short" : "W skrócie"}</span>
            <p>{term.definition[locale]}</p>
          </div>

          <div className="glossary-detail-long">
            <span>{en ? "In depth" : "Szerzej"}</span>
            <p>{term.details[locale]}</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
