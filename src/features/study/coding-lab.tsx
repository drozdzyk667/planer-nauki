"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Dices,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Breadcrumb } from "@/components/shell";
import { useLocale, useProgress } from "@/components/providers";
import { courseRepository } from "@/services/courses";
import { progressStore } from "@/services/progress";
import { Exercise } from "@/features/learning/exercise";
import { CourseModeDock } from "./course-mode-dock";
import {
  codingChallengeCount,
  generateCodingChallenge,
  type CodingCourse,
} from "@/domain/coding-challenges";

export function CodingLab({ courseSlug }: { courseSlug: CodingCourse }) {
  const { locale, l } = useLocale();
  const progress = useProgress();
  const course = courseRepository.get(courseSlug)!;
  const en = locale === "en";
  const total = codingChallengeCount(courseSlug);

  const [templateIndex, setTemplateIndex] = useState(0);
  const [seed, setSeed] = useState(1);
  const [passed, setPassed] = useState(false);
  const [reward, setReward] = useState<number | null>(null);

  const challenge = useMemo(
    () => generateCodingChallenge(courseSlug, templateIndex, seed),
    [courseSlug, templateIndex, seed],
  );

  const solved = progress.codingSolved.includes(challenge.templateId);

  const onPassed = useCallback(
    (value: boolean) => {
      setPassed(value);
      if (!value) return;
      setReward(progressStore.completeCodingChallenge(challenge.templateId));
    },
    [challenge.templateId],
  );

  function resetFeedback() {
    setPassed(false);
    setReward(null);
  }

  function newVariant() {
    resetFeedback();
    setSeed((current) => current + 1);
  }

  function nextChallenge() {
    resetFeedback();
    setTemplateIndex((current) => (current + 1) % total);
    setSeed((current) => current + 1);
  }

  return (
    <div className="container page-space coding-lab-page">
      <CourseModeDock courseSlug={courseSlug} active="coding" />
      <Breadcrumb current={l(course.title)} />

      <header className="coding-lab-hero">
        <div>
          <span className="eyebrow">
            <Code2 size={16} />
            {en ? "CODE LAB · GENERATED PRACTICE" : "CODE LAB · GENEROWANA PRAKTYKA"}
          </span>
          <h1>
            {en ? "Write code, not answers." : "Pisz kod, nie odpowiedzi."}
          </h1>
          <p>
            {en
              ? "Each challenge is generated from a tested template. A new seed changes identifiers, values and test cases, so memorising one solution is not enough."
              : "Każde zadanie powstaje z przetestowanego szablonu. Nowy seed zmienia identyfikatory, wartości i przypadki testowe, więc zapamiętanie jednego rozwiązania nie wystarczy."}
          </p>
        </div>

      </header>

      <section className="coding-lab-toolbar">
        <div className="coding-challenge-position">
          <span>{String(templateIndex + 1).padStart(2, "0")}</span>
          <small>/ {String(total).padStart(2, "0")}</small>
        </div>

        <div className="coding-challenge-meta">
          <span className={`coding-difficulty ${challenge.difficulty}`}>
            {challenge.difficulty}
          </span>
          <span>{l(challenge.concept)}</span>
          {solved && (
            <span className="coding-solved">
              <CheckCircle2 size={14} />
              {en ? "Solved family" : "Rodzina zaliczona"}
            </span>
          )}
        </div>

        <div className="coding-lab-actions">
          <button className="button secondary coding-randomize" onClick={newVariant}>
            <Dices size={16} />
            {en ? "Shuffle task variant" : "Losuj wariant zadania"}
          </button>
          <button className="button secondary" onClick={nextChallenge}>
            {en ? "Next task" : "Następne zadanie"}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="coding-challenge-card">
        <header>
          <div>
            <span className="eyebrow">
              {en ? "CURRENT CHALLENGE" : "AKTUALNE ZADANIE"}
            </span>
            <h2>{l(challenge.title)}</h2>
            <p>{l(challenge.description)}</p>
          </div>
          <span className="coding-xp">
            <Zap size={15} />
            +35 XP
          </span>
        </header>

        <div className="coding-variant-note">
          <Sparkles size={16} />
          <span>{l(challenge.variantNote)}</span>
        </div>

        <Exercise
          key={challenge.id}
          exercise={challenge.exercise}
          onPassed={onPassed}
        />

        {passed && (
          <div className="coding-success">
            <Trophy size={24} />
            <div>
              <strong>
                {reward
                  ? en
                    ? `Challenge solved · +${reward} XP`
                    : `Zadanie rozwiązane · +${reward} XP`
                  : en
                    ? "Correct. This challenge family was already rewarded."
                    : "Poprawnie. Ta rodzina zadań była już wcześniej nagrodzona."}
              </strong>
              <p>
                {en
                  ? "Generate another variant to prove the solution is reusable."
                  : "Wygeneruj kolejny wariant, żeby sprawdzić, czy rozwiązanie jest naprawdę uniwersalne."}
              </p>
            </div>
            <button className="button primary" onClick={newVariant}>
              <Dices size={16} />
              {en ? "Generate variant" : "Generuj wariant"}
            </button>
          </div>
        )}
      </section>

      <aside className="coding-lab-note">
        <strong>{en ? "How checking works" : "Jak działa sprawdzanie"}</strong>
        <p>
          {courseSlug === "javascript"
            ? en
              ? "JavaScript runs inside the same isolated worker sandbox used by the interactive lessons. Hidden generated test cases verify the result."
              : "JavaScript uruchamia się w tym samym izolowanym sandboxie Worker co lekcje interaktywne. Wynik sprawdzają ukryte, generowane test cases."
            : en
              ? "This first TypeScript/React version checks the required source structure. A full TypeScript/JSX compiler can be added as the next engine layer."
              : "Pierwsza wersja dla TypeScript/React sprawdza wymaganą strukturę kodu źródłowego. Pełny compiler TypeScript/JSX można dodać jako kolejną warstwę silnika."}
        </p>
      </aside>
    </div>
  );
}
