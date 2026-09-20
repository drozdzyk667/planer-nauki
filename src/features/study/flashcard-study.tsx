"use client";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  LockKeyhole,
  RotateCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale, useProgress } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { CourseModeDock } from "./course-mode-dock";
import {
  studyContentFor,
  type Flashcard,
  type StudyLevel,
} from "@/content/study-content";

type DeckFilter = "all" | "favorites";

function shuffle<T>(items: readonly T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function FlashcardStudy({ courseSlug }: { courseSlug: string }) {
  const { locale, l } = useLocale();
  const progress = useProgress();
  const course = courseRepository.get(courseSlug)!;
  const content = studyContentFor(courseSlug);
  const en = locale === "en";

  const [level, setLevel] = useState<StudyLevel>("beginner");
  const [filter, setFilter] = useState<DeckFilter>("all");
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [upgrade, setUpgrade] = useState(false);

  const favoriteIds = useMemo(
    () => new Set(progress.favoriteFlashcards),
    [progress.favoriteFlashcards],
  );

  const sourceCards = useMemo(() => {
    if (!content) return [];
    return content.flashcards.filter(
      (card) =>
        card.level === level &&
        (filter === "all" || favoriteIds.has(card.id)),
    );
  }, [content, level, filter, favoriteIds]);

  const cards = useMemo(() => {
    if (!order.length) return sourceCards;
    const byId = new Map(sourceCards.map((card) => [card.id, card]));
    const ordered = order
      .map((id) => byId.get(id))
      .filter(Boolean) as Flashcard[];
    const seen = new Set(ordered.map((card) => card.id));
    return [...ordered, ...sourceCards.filter((card) => !seen.has(card.id))];
  }, [sourceCards, order]);

  if (!content) return null;

  const safeIndex = cards.length ? Math.min(index, cards.length - 1) : 0;
  const card = cards[safeIndex];
  const beginnerCount = content.flashcards.filter(
    (item) => item.level === "beginner",
  ).length;
  const advancedCount = content.flashcards.filter(
    (item) => item.level === "advanced",
  ).length;
  const favoriteCount = content.flashcards.filter((item) =>
    favoriteIds.has(item.id),
  ).length;

  function resetDeck() {
    setIndex(0);
    setFlipped(false);
    setOrder([]);
  }

  function setTrack(next: StudyLevel) {
    if (next === "advanced") {
      setUpgrade(true);
      return;
    }
    setLevel(next);
    setFilter("all");
    resetDeck();
  }

  function setDeckFilter(next: DeckFilter) {
    setFilter(next);
    resetDeck();
  }

  function move(delta: number) {
    if (!cards.length) return;
    setIndex((current) => (current + delta + cards.length) % cards.length);
    setFlipped(false);
  }

  function shuffleDeck() {
    setOrder(shuffle(sourceCards).map((item) => item.id));
    setIndex(0);
    setFlipped(false);
  }

  function toggleFavorite(id: string) {
    progressStore.toggleFavoriteFlashcard(id);
  }

  return (
    <div className="container page-space flashcards-page">
      <CourseModeDock courseSlug={courseSlug} active="flashcards" />
      <Breadcrumb current={l(course.title)} />

      <header className="flashcards-hero compact-study-hero">
        <div>
          <span className="eyebrow">
            <Sparkles size={16} />
            {en ? "FLASHCARD MODE" : "TRYB FISZEK"}
          </span>
          <h1>
            {en ? "One idea. One answer. Repeat." : "Jedna rzecz. Jedna odpowiedź. Powtórka."}
          </h1>
          <p>
            {en
              ? "Short, plain-language cards with code where code makes the idea clearer. Answer in your head first, then reveal the explanation."
              : "Krótkie fiszki prostym językiem, z kodem tam, gdzie kod naprawdę pomaga. Najpierw odpowiedz w głowie, potem odsłoń odpowiedź i wyjaśnienie."}
          </p>

          <div className="flashcard-stats">
            <span>
              <strong>{beginnerCount}</strong>
              {en ? " foundation cards" : " fiszek podstawowych"}
            </span>
            <span>
              <strong>{favoriteCount}</strong>
              {en ? " favorites" : " ulubionych"}
            </span>
            <span className="locked-stat">
              <LockKeyhole size={13} />
              <strong>{advancedCount}</strong>
              {en ? " advanced" : " zaawansowanych"}
            </span>
          </div>
        </div>

      </header>

      <div className="flashcard-toolbar">
        <div className="flashcard-toolbar-left">
          <div
            className="flashcard-levels"
            role="group"
            aria-label={en ? "Flashcard level" : "Poziom fiszek"}
          >
            <button
              type="button"
              className={level === "beginner" ? "active" : ""}
              aria-pressed={level === "beginner"}
              onClick={() => setTrack("beginner")}
            >
              {en ? "Foundations" : "Podstawy"}
              <small>{beginnerCount}</small>
            </button>
            <button
              type="button"
              aria-pressed={false}
              onClick={() => setTrack("advanced")}
            >
              <LockKeyhole size={14} />
              {en ? "Advanced" : "Zaawansowane"}
              <small>{advancedCount}</small>
            </button>
          </div>

          <div
            className="flashcard-filter"
            role="group"
            aria-label={en ? "Deck filter" : "Filtr talii"}
          >
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              aria-pressed={filter === "all"}
              onClick={() => setDeckFilter("all")}
            >
              {en ? "All cards" : "Wszystkie"}
            </button>
            <button
              type="button"
              className={filter === "favorites" ? "active" : ""}
              aria-pressed={filter === "favorites"}
              onClick={() => setDeckFilter("favorites")}
            >
              <Heart size={14} fill={filter === "favorites" ? "currentColor" : "none"} />
              {en ? "Favorites" : "Ulubione"}
              <small>{favoriteCount}</small>
            </button>
          </div>
        </div>

        <button
          className="button secondary small"
          onClick={shuffleDeck}
          disabled={!cards.length}
        >
          <Shuffle size={16} />
          {en ? "Shuffle" : "Przetasuj"}
        </button>
      </div>

      {!cards.length ? (
        <section className="flashcards-empty">
          <span>
            <Heart size={27} />
          </span>
          <h2>{en ? "No favorite cards yet." : "Nie masz jeszcze ulubionych fiszek."}</h2>
          <p>
            {en
              ? "Open all cards and tap the heart on anything you want to revisit quickly."
              : "Wróć do wszystkich fiszek i kliknij serduszko przy tych, do których chcesz szybko wracać."}
          </p>
          <button className="button primary" onClick={() => setDeckFilter("all")}>
            {en ? "Show all cards" : "Pokaż wszystkie fiszki"}
          </button>
        </section>
      ) : (
        <>
          <div className="flashcard-progress">
            <span>
              {safeIndex + 1} / {cards.length}
            </span>
            <div aria-hidden="true">
              <i style={{ width: `${((safeIndex + 1) / cards.length) * 100}%` }} />
            </div>
            <strong>{l(card.tag)}</strong>
          </div>

          <div className="flashcard-stage">
            <button
              type="button"
              className={`flashcard-favorite ${favoriteIds.has(card.id) ? "active" : ""}`}
              aria-label={
                favoriteIds.has(card.id)
                  ? en
                    ? "Remove from favorites"
                    : "Usuń z ulubionych"
                  : en
                    ? "Add to favorites"
                    : "Dodaj do ulubionych"
              }
              aria-pressed={favoriteIds.has(card.id)}
              onClick={() => toggleFavorite(card.id)}
            >
              <Heart
                size={20}
                fill={favoriteIds.has(card.id) ? "currentColor" : "none"}
              />
            </button>

            <button
              type="button"
              className={`flashcard ${flipped ? "is-flipped" : ""} ${
                l(card.front).length > 68 || (card.code?.includes("\n") ?? false)
                  ? "is-dense"
                  : ""
              }`}
              onClick={() => setFlipped((value) => !value)}
              aria-pressed={flipped}
              aria-label={
                flipped
                  ? en
                    ? "Show question"
                    : "Pokaż pytanie"
                  : en
                    ? "Show answer"
                    : "Pokaż odpowiedź"
              }
            >
              <span className="flashcard-inner">
                <span className="flashcard-face flashcard-front">
                  <span className="flashcard-kicker">
                    {en ? "TRY TO ANSWER" : "SPRÓBUJ ODPOWIEDZIEĆ"}
                  </span>
                  <strong>{l(card.front)}</strong>
                  {card.code && (
                    <pre className="flashcard-code">
                      <code>{card.code}</code>
                    </pre>
                  )}
                  <span className="flashcard-hint">
                    <RotateCw size={17} />
                    {en ? "Click the card to reveal" : "Kliknij kartę, żeby odsłonić odpowiedź"}
                  </span>
                </span>

                <span className="flashcard-face flashcard-back">
                  <span className="flashcard-kicker">
                    {en ? "THE SHORT ANSWER" : "NAJKRÓCEJ"}
                  </span>
                  <strong>{l(card.back)}</strong>
                  {card.why && (
                    <span className="flashcard-why">
                      <small>{en ? "WHY?" : "DLACZEGO?"}</small>
                      <p>{l(card.why)}</p>
                    </span>
                  )}
                  <span className="flashcard-hint">
                    <RotateCw size={17} />
                    {en ? "Click to see the question again" : "Kliknij, żeby wrócić do pytania"}
                  </span>
                </span>
              </span>
            </button>
          </div>

          <div className="flashcard-controls">
            <button className="button secondary" onClick={() => move(-1)}>
              <ArrowLeft size={18} />
              {en ? "Previous" : "Poprzednia"}
            </button>
            <button
              className="button primary"
              onClick={() => setFlipped((value) => !value)}
            >
              <RotateCw size={18} />
              {flipped
                ? en
                  ? "Question"
                  : "Pytanie"
                : en
                  ? "Show answer"
                  : "Pokaż odpowiedź"}
            </button>
            <button className="button secondary" onClick={() => move(1)}>
              {en ? "Next" : "Następna"}
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
