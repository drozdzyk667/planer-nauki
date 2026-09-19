"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Code2,
  LockKeyhole,
  RotateCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/shell";
import { UpgradeDialog } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { studyContentFor, type Flashcard, type StudyLevel } from "@/content/study-content";

function shuffle<T>(items: readonly T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function FlashcardStudy({ courseSlug }: { courseSlug: string }) {
  const { locale, l, href } = useLocale();
  const course = courseRepository.get(courseSlug)!;
  const content = studyContentFor(courseSlug);
  const en = locale === "en";
  const [level, setLevel] = useState<StudyLevel>("beginner");
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [upgrade, setUpgrade] = useState(false);

  const cards = useMemo(() => {
    if (!content) return [];
    const source = content.flashcards.filter((card) => card.level === level);
    if (!order.length) return source;
    const byId = new Map(source.map((card) => [card.id, card]));
    return order.map((id) => byId.get(id)).filter(Boolean) as Flashcard[];
  }, [content, level, order]);

  if (!content || !cards.length) return null;
  const card = cards[Math.min(index, cards.length - 1)];

  function setTrack(next: StudyLevel) {
    if (next === "advanced") {
      setUpgrade(true);
      return;
    }
    setLevel(next);
    setIndex(0);
    setFlipped(false);
    setOrder([]);
  }

  function move(delta: number) {
    setIndex((current) => (current + delta + cards.length) % cards.length);
    setFlipped(false);
  }

  function shuffleDeck() {
    setOrder(shuffle(content.flashcards.filter((item) => item.level === level)).map((item) => item.id));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="container page-space flashcards-page">
      <Breadcrumb current={l(course.title)} />
      <header className="flashcards-hero">
        <div>
          <span className="eyebrow">
            <Sparkles size={16} />
            {en ? "FLASHCARD MODE" : "TRYB FISZEK"}
          </span>
          <h1>{en ? "Fast recall. Less reading." : "Szybkie przypominanie. Mniej czytania."}</h1>
          <p>
            {en
              ? "One rule, question or code fragment at a time. Guess first, then flip the card. Use the advanced deck when the foundations feel automatic."
              : "Jedna reguła, pytanie albo fragment kodu na raz. Najpierw odpowiedz w głowie, potem odwróć kartę. Gdy podstawy wchodzą automatycznie, przejdź do talii zaawansowanej."}
          </p>
        </div>
        <div className="flashcards-crosslinks">
          <Link className="button secondary" href={href(`/courses/${courseSlug}/knowledge`)}>
            <BookOpenText size={17} />
            {en ? "Knowledge library" : "Biblioteka wiedzy"}
          </Link>
          <Link className="button secondary" href={href(`/courses/${courseSlug}`)}>
            <Code2 size={17} />
            {en ? "Practice" : "Praktyka"}
          </Link>
        </div>
      </header>

      <div className="flashcard-toolbar">
        <div className="flashcard-levels" role="group" aria-label={en ? "Flashcard level" : "Poziom fiszek"}>
          {(["beginner", "advanced"] as StudyLevel[]).map((value) => (
            <button
              type="button"
              className={level === value ? "active" : ""}
              aria-pressed={level === value}
              onClick={() => setTrack(value)}
              key={value}
            >
              {value === "advanced" && <LockKeyhole size={14} />}
              {value === "beginner"
                ? en ? "Foundations" : "Podstawy"
                : en ? "Advanced secrets" : "Zaawansowane smaczki"}
            </button>
          ))}
        </div>
        <button className="button secondary small" onClick={shuffleDeck}>
          <Shuffle size={16} />
          {en ? "Shuffle deck" : "Przetasuj talię"}
        </button>
      </div>

      <div className="flashcard-progress">
        <span>
          {index + 1} / {cards.length}
        </span>
        <div aria-hidden="true">
          <i style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
        <strong>{l(card.tag)}</strong>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? en ? "Hide answer" : "Ukryj odpowiedź"
            : en ? "Show answer" : "Pokaż odpowiedź"
        }
      >
        <span className="flashcard-inner">
          <span className="flashcard-face flashcard-front">
            <span className="flashcard-kicker">{en ? "QUESTION / RULE" : "PYTANIE / REGUŁA"}</span>
            <strong>{l(card.front)}</strong>
            {card.code && <code>{card.code}</code>}
            <span className="flashcard-hint">
              <RotateCw size={17} />
              {en ? "Tap to reveal the answer" : "Kliknij, aby odwrócić kartę"}
            </span>
          </span>
          <span className="flashcard-face flashcard-back">
            <span className="flashcard-kicker">{en ? "ANSWER" : "ODPOWIEDŹ"}</span>
            <strong>{l(card.back)}</strong>
            {card.code && <code>{card.code}</code>}
            <span className="flashcard-hint">
              <RotateCw size={17} />
              {en ? "Tap to see the question again" : "Kliknij, aby wrócić do pytania"}
            </span>
          </span>
        </span>
      </button>

      <div className="flashcard-controls">
        <button className="button secondary" onClick={() => move(-1)}>
          <ArrowLeft size={18} />
          {en ? "Previous" : "Poprzednia"}
        </button>
        <button className="button primary" onClick={() => setFlipped((value) => !value)}>
          <RotateCw size={18} />
          {flipped ? (en ? "Question" : "Pytanie") : (en ? "Show answer" : "Pokaż odpowiedź")}
        </button>
        <button className="button secondary" onClick={() => move(1)}>
          {en ? "Next" : "Następna"}
          <ArrowRight size={18} />
        </button>
      </div>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  );
}
