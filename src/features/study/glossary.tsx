"use client";

import { useMemo, useState } from "react";
import { Lightbulb, Search } from "lucide-react";
import { useLocale } from "@/components/providers";
import { glossaryFor, type GlossaryTerm } from "@/content/glossary";

const normalize = (value: string) => value.toLocaleLowerCase();

type GlossarySegment = {
  text: string;
  term?: GlossaryTerm;
};

function glossarySegments(
  text: string,
  pattern: RegExp,
  aliasMap: Map<string, GlossaryTerm>,
  maxTerms: number,
): GlossarySegment[] {
  const used = new Set<string>();
  let highlighted = 0;

  return text.split(pattern).map((part) => {
    const term = aliasMap.get(normalize(part));
    if (!term || used.has(term.id) || highlighted >= maxTerms) return { text: part };
    used.add(term.id);
    highlighted += 1;
    return { text: part, term };
  });
}

export function GlossaryText({
  courseSlug,
  text,
  maxTerms = 3,
}: {
  courseSlug: string;
  text: string;
  maxTerms?: number;
}) {
  const { locale } = useLocale();
  const terms = useMemo(() => glossaryFor(courseSlug), [courseSlug]);
  const aliasMap = useMemo(() => {
    const map = new Map<string, GlossaryTerm>();
    for (const term of terms) {
      for (const alias of term.aliases) map.set(normalize(alias), term);
    }
    return map;
  }, [terms]);
  const pattern = useMemo(() => {
    const aliases = [...aliasMap.keys()]
      .sort((a, b) => b.length - a.length)
      .map((value) => value.replace(/[.*+?^\$\{\}()|[\]\\]/g, "\\$&"));
    return aliases.length ? new RegExp(`(${aliases.join("|")})`, "gi") : null;
  }, [aliasMap]);

  const segments = useMemo(
    () => (pattern ? glossarySegments(text, pattern, aliasMap, maxTerms) : [{ text }]),
    [aliasMap, maxTerms, pattern, text],
  );

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

        return (
          <span className="glossary-inline" key={index}>
            <button type="button" aria-label={accessible}>
              {segment.text}
              <sup aria-hidden="true">↗</sup>
            </button>
            <span className="glossary-tooltip" role="tooltip" aria-hidden="true">
              <strong>{term.term}</strong>
              {expanded && <small>{expanded}</small>}
              <span>{definition}</span>
            </span>
          </span>
        );
      })}
    </>
  );
}

export function GlossaryPanel({ courseSlug }: { courseSlug: string }) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const terms = useMemo(() => glossaryFor(courseSlug), [courseSlug]);
  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return terms;
    return terms.filter((term) => {
      const haystack = [
        term.term,
        term.expanded?.[locale] ?? "",
        term.definition[locale],
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
              ? "Short definitions only. The knowledge library explains the important topics in depth."
              : "Tylko krótkie definicje. Najważniejsze tematy biblioteka wiedzy wyjaśnia osobno i dokładniej."}
          </p>
        </div>
        <label className="glossary-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={en ? "Search a term or acronym…" : "Szukaj pojęcia lub skrótu…"}
            aria-label={en ? "Search glossary" : "Przeszukaj słownik"}
          />
        </label>
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
