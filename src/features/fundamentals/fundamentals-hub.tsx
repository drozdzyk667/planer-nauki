"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookMarked,
  BookOpenText,
  Boxes,
  Network,
  Search,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/providers";
import { Breadcrumb } from "@/components/shell";
import { CourseModeDock } from "@/features/study/course-mode-dock";
import { Dialog } from "@/components/ui";
import { glossaryTerms, type GlossaryTerm } from "@/content/glossary";
import {
  conceptualFlow,
  fundamentalsDomainFor,
  fundamentalsDomains,
  fundamentalsDomainsFor,
  fundamentalsExamples,
  fundamentalsLevel,
  relatedTermIds,
  type FundamentalsDomain,
  type FundamentalsLevel,
} from "@/content/fundamentals";

type DomainFilter = "all" | FundamentalsDomain;
type LevelFilter = "all" | FundamentalsLevel;

const levelOrder: FundamentalsLevel[] = [
  "fundamentals",
  "junior",
  "mid",
  "advanced",
];

function levelLabel(
  level: FundamentalsLevel,
  en: boolean,
) {
  const labels = {
    fundamentals: en ? "Fundamentals" : "Podstawy",
    junior: "Junior",
    mid: "Mid",
    advanced: en ? "Advanced" : "Zaawansowane",
  };
  return labels[level];
}

export function FundamentalsHub() {
  const { locale } = useLocale();
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);

  const terms = useMemo(
    () =>
      glossaryTerms.filter((term) => term.courses.includes("it-foundations")),
    [],
  );

  const termMap = useMemo(
    () => new Map(terms.map((term) => [term.id, term])),
    [terms],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return terms
      .filter((term) => {
        const explicitDomains = fundamentalsDomainsFor(term.id).map(
          (item) => item.id,
        );
        const matchesDomain =
          domain === "all" ||
          explicitDomains.includes(domain) ||
          (!explicitDomains.length &&
            domain ===
              (term.category === "ai"
                ? "ai"
                : term.category === "language" || term.category === "framework"
                  ? "frontend"
                  : term.category === "web"
                    ? "web"
                    : "architecture"));
        const matchesLevel =
          level === "all" || fundamentalsLevel(term) === level;
        if (!matchesDomain || !matchesLevel) return false;
        if (!needle) return true;

        return [
          term.term,
          term.expanded?.[locale] ?? "",
          term.definition[locale],
          term.details[locale],
          ...term.aliases,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle);
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [domain, level, locale, query, terms]);

  const groupedCounts = useMemo(() => {
    const counts = new Map<FundamentalsDomain, number>();
    for (const item of fundamentalsDomains) counts.set(item.id, 0);
    for (const term of terms) {
      const item = fundamentalsDomainFor(term.id);
      if (item) counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    }
    return counts;
  }, [terms]);

  const related = selected
    ? relatedTermIds(selected)
        .map((id) => termMap.get(id))
        .filter((term): term is GlossaryTerm => Boolean(term))
    : [];

  return (
    <div className="container page-space fundamentals-page">
      <CourseModeDock courseSlug="it-foundations" active="fundamentals" />
      <Breadcrumb
        current={
          en
            ? "IT Fundamentals & Production Applications"
            : "IT fundamenty i aplikacje produkcyjne"
        }
      />

      <header className="fundamentals-hero">
        <div>
          <span className="eyebrow">
            <BookMarked size={16} />
            {en ? "IT FUNDAMENTALS · REFERENCE" : "IT FUNDAMENTALS · SŁOWNIK"}
          </span>
          <h1>
            {en ? "Understand the words behind the system." : "Zrozum słowa stojące za całym systemem."}
          </h1>
          <p>
            {en
              ? "A searchable map of the concepts people use every day in software: from bits and HTTP to Kubernetes, CI/CD, security and AI. Short answer first, deeper context when you need it."
              : "Przeszukiwalna mapa pojęć używanych codziennie w IT: od bitów i HTTP po Kubernetes, CI/CD, security i AI. Najpierw krótka odpowiedź, a głębszy kontekst dopiero wtedy, gdy go potrzebujesz."}
          </p>
        </div>

        <div className="fundamentals-hero-stats">
          <div>
            <strong>{terms.length}</strong>
            <span>{en ? "terms" : "pojęć"}</span>
          </div>
          <div>
            <strong>{fundamentalsDomains.length}</strong>
            <span>{en ? "areas" : "obszarów"}</span>
          </div>
          <div>
            <strong>4</strong>
            <span>{en ? "levels" : "poziomy"}</span>
          </div>
        </div>
      </header>

      <section className="fundamentals-toolbar">
        <label className="fundamentals-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              en
                ? "Search HTTP, TCP/IP, JWT, Kubernetes, RAG…"
                : "Szukaj HTTP, TCP/IP, JWT, Kubernetes, RAG…"
            }
            aria-label={en ? "Search IT concepts" : "Szukaj pojęć IT"}
          />
        </label>

        <div className="fundamentals-levels" aria-label={en ? "Knowledge level" : "Poziom wiedzy"}>
          <button
            className={level === "all" ? "active" : ""}
            onClick={() => setLevel("all")}
            type="button"
          >
            {en ? "All levels" : "Wszystkie"}
          </button>
          {levelOrder.map((item) => (
            <button
              key={item}
              className={level === item ? "active" : ""}
              onClick={() => setLevel(item)}
              type="button"
            >
              {levelLabel(item, en)}
            </button>
          ))}
        </div>
      </section>

      <div className="fundamentals-layout">
        <aside className="fundamentals-domains">
          <div className="fundamentals-domain-heading">
            <Network size={16} />
            <span>{en ? "Knowledge map" : "Mapa wiedzy"}</span>
          </div>
          <button
            type="button"
            className={domain === "all" ? "active" : ""}
            onClick={() => setDomain("all")}
          >
            <span>
              <Boxes size={15} />
              {en ? "Everything" : "Wszystko"}
            </span>
            <small>{terms.length}</small>
          </button>
          {fundamentalsDomains.map((item) => (
            <button
              type="button"
              key={item.id}
              className={domain === item.id ? "active" : ""}
              onClick={() => setDomain(item.id)}
            >
              <span>{item.title[locale]}</span>
              <small>{groupedCounts.get(item.id) ?? 0}</small>
            </button>
          ))}
        </aside>

        <main className="fundamentals-results">
          <div className="fundamentals-results-heading">
            <div>
              <span className="eyebrow">
                {domain === "all"
                  ? en
                    ? "ALL CONCEPTS"
                    : "WSZYSTKIE POJĘCIA"
                  : fundamentalsDomains.find((item) => item.id === domain)?.title[locale]}
              </span>
              <h2>
                {filtered.length} {en ? "matching terms" : "pasujących pojęć"}
              </h2>
            </div>
            {domain !== "all" && (
              <p>
                {fundamentalsDomains.find((item) => item.id === domain)?.description[locale]}
              </p>
            )}
          </div>

          <div className="fundamentals-grid">
            {filtered.map((term) => {
              const itemLevel = fundamentalsLevel(term);
              const itemDomain = fundamentalsDomainFor(term.id);
              return (
                <article className="fundamentals-card" key={term.id}>
                  <div className="fundamentals-card-top">
                    <span className={`fundamentals-level level-${itemLevel}`}>
                      {levelLabel(itemLevel, en)}
                    </span>
                    <small>{itemDomain?.title[locale] ?? term.category}</small>
                  </div>
                  <h3>{term.term}</h3>
                  {term.expanded && <h4>{term.expanded[locale]}</h4>}
                  <p>{term.definition[locale]}</p>
                  <button type="button" onClick={() => setSelected(term)}>
                    {en ? "Open concept" : "Otwórz pojęcie"}
                    <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>

          {!filtered.length && (
            <div className="fundamentals-empty">
              <Search size={26} />
              <strong>{en ? "Nothing matched." : "Brak wyników."}</strong>
              <span>
                {en
                  ? "Try another term, category or knowledge level."
                  : "Spróbuj innego pojęcia, kategorii albo poziomu."}
              </span>
            </div>
          )}
        </main>
      </div>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.term ?? "IT Fundamentals"}
      >
        {selected && (
          <div className="fundamentals-detail">
            <header>
              <div>
                <span className={`fundamentals-level level-${fundamentalsLevel(selected)}`}>
                  {levelLabel(fundamentalsLevel(selected), en)}
                </span>
                {selected.expanded && <strong>{selected.expanded[locale]}</strong>}
              </div>
              <small>
                {fundamentalsDomainFor(selected.id)?.title[locale] ?? selected.category}
              </small>
            </header>

            <section className="fundamentals-detail-short">
              <span>{en ? "IN SHORT" : "W SKRÓCIE"}</span>
              <p>{selected.definition[locale]}</p>
            </section>

            <section>
              <span className="fundamentals-detail-label">
                {en ? "HOW TO THINK ABOUT IT" : "JAK O TYM MYŚLEĆ"}
              </span>
              <pre className="fundamentals-flow">
                {fundamentalsExamples[selected.id]?.[locale] ?? conceptualFlow(selected)}
              </pre>
            </section>

            <section>
              <span className="fundamentals-detail-label">
                {en ? "YOU SHOULD KNOW" : "MUSISZ WIEDZIEĆ"}
              </span>
              <p className="fundamentals-detail-copy">{selected.details[locale]}</p>
            </section>

            {related.length > 0 && (
              <section>
                <span className="fundamentals-detail-label">
                  {en ? "RELATED CONCEPTS" : "POWIĄZANE POJĘCIA"}
                </span>
                <div className="fundamentals-related">
                  {related.map((term) => (
                    <button
                      type="button"
                      key={term.id}
                      onClick={() => setSelected(term)}
                    >
                      {term.term}
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </Dialog>

      <section className="fundamentals-purpose">
        <Sparkles size={20} />
        <div>
          <strong>
            {en ? "This is a reference, not another linear course." : "To jest moduł referencyjny, a nie kolejny liniowy kurs."}
          </strong>
          <p>
            {en
              ? "Course lessons can link here for a 10-second explanation. The deeper course chapter still teaches the real mechanism."
              : "Lekcje mogą odsyłać tutaj po 10-sekundowe wyjaśnienie. Pełny rozdział kursu nadal uczy mechanizmu dokładnie."}
          </p>
        </div>
        <BookOpenText size={20} />
      </section>
    </div>
  );
}
