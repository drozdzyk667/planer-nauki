"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Braces,
  CirclePause,
  CirclePlay,
  Code2,
  Network,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/providers";
import { Dialog } from "@/components/ui";

type Scene = {
  eyebrow: { en: string; pl: string };
  title: { en: string; pl: string };
  body: { en: string; pl: string };
  code: string;
  tone: "yellow" | "blue" | "cyan" | "purple" | "green";
};

const scenes: Record<string, Scene[]> = {
  javascript: [
    {
      eyebrow: { en: "01 · EXECUTION", pl: "01 · WYKONANIE" },
      title: { en: "Code changes values.", pl: "Kod zmienia wartości." },
      body: {
        en: "Start with instructions, variables and types so every later concept has a concrete mental model.",
        pl: "Zacznij od instrukcji, zmiennych i typów, żeby każdy kolejny temat miał konkretny model w głowie.",
      },
      code: 'let score = 1;\nscore += 2;\n// 3',
      tone: "yellow",
    },
    {
      eyebrow: { en: "02 · DECISIONS", pl: "02 · DECYZJE" },
      title: { en: "Your program learns to choose.", pl: "Program zaczyna podejmować decyzje." },
      body: {
        en: "Conditions and functions turn isolated statements into reusable behaviour.",
        pl: "Warunki i funkcje zmieniają pojedyncze instrukcje w reużywalne zachowanie.",
      },
      code: 'if (score >= 3) {\n  unlock();\n}',
      tone: "yellow",
    },
    {
      eyebrow: { en: "03 · DATA", pl: "03 · DANE" },
      title: { en: "Collections become useful models.", pl: "Kolekcje stają się użytecznymi modelami." },
      body: {
        en: "Arrays, objects and array methods let you represent and transform real application data.",
        pl: "Tablice, obiekty i metody tablic pozwalają modelować i przekształcać prawdziwe dane aplikacji.",
      },
      code: "users.filter(isActive).map(toCard)",
      tone: "yellow",
    },
    {
      eyebrow: { en: "04 · ASYNC + WEB", pl: "04 · ASYNC + WEB" },
      title: { en: "Then JavaScript meets the browser.", pl: "Potem JavaScript spotyka przeglądarkę." },
      body: {
        en: "Promises, async/await, modules and the DOM connect the language to real interfaces.",
        pl: "Promise, async/await, moduły i DOM łączą język z prawdziwymi interfejsami.",
      },
      code: "const data = await fetchData();\nrender(data);",
      tone: "yellow",
    },
  ],
  typescript: [
    {
      eyebrow: { en: "01 · CONTRACTS", pl: "01 · KONTRAKTY" },
      title: { en: "TypeScript describes what code expects.", pl: "TypeScript opisuje, czego oczekuje kod." },
      body: {
        en: "Learn inference and annotations first, before advanced type machinery.",
        pl: "Najpierw poznajesz inferencję i adnotacje, zanim wejdziesz w zaawansowane mechanizmy typów.",
      },
      code: "function price(value: number): number",
      tone: "blue",
    },
    {
      eyebrow: { en: "02 · VALID STATES", pl: "02 · POPRAWNE STANY" },
      title: { en: "Model the domain, not just syntax.", pl: "Modeluj domenę, nie samą składnię." },
      body: {
        en: "Objects, unions and narrowing help make invalid states harder to represent.",
        pl: "Obiekty, unie i narrowing pomagają utrudnić reprezentowanie niepoprawnych stanów.",
      },
      code: 'type Status = "idle" | "loading" | "done";',
      tone: "blue",
    },
    {
      eyebrow: { en: "03 · REUSE", pl: "03 · REUŻYWALNOŚĆ" },
      title: { en: "Generics preserve relationships.", pl: "Generyki zachowują relacje." },
      body: {
        en: "Reusable contracts stay precise instead of escaping into any.",
        pl: "Reużywalne kontrakty pozostają precyzyjne zamiast uciekać w any.",
      },
      code: "function first<T>(items: T[]): T | undefined",
      tone: "blue",
    },
    {
      eyebrow: { en: "04 · REAL BOUNDARIES", pl: "04 · PRAWDZIWE GRANICE" },
      title: { en: "Types stop where runtime begins.", pl: "Typy kończą się tam, gdzie zaczyna się runtime." },
      body: {
        en: "APIs, DOM, React and validation teach you where static types help and where runtime checks are mandatory.",
        pl: "API, DOM, React i walidacja pokazują, gdzie typy statyczne pomagają, a gdzie konieczne są checki runtime.",
      },
      code: "const payload: unknown = await response.json();",
      tone: "blue",
    },
  ],
  react: [
    {
      eyebrow: { en: "01 · COMPONENTS", pl: "01 · KOMPONENTY" },
      title: { en: "UI becomes a tree of responsibilities.", pl: "UI staje się drzewem odpowiedzialności." },
      body: {
        en: "Start from components, JSX and composition before introducing state.",
        pl: "Zaczynasz od komponentów, JSX i kompozycji, zanim pojawi się stan.",
      },
      code: "<ProductCard product={product} />",
      tone: "cyan",
    },
    {
      eyebrow: { en: "02 · DATA FLOW", pl: "02 · PRZEPŁYW DANYCH" },
      title: { en: "Props go down. Events come back up.", pl: "Propsy idą w dół. Zdarzenia wracają w górę." },
      body: {
        en: "State ownership becomes the key to predictable interfaces.",
        pl: "Ownership stanu staje się kluczem do przewidywalnych interfejsów.",
      },
      code: "const [count, setCount] = useState(0);",
      tone: "cyan",
    },
    {
      eyebrow: { en: "03 · SYNCHRONIZATION", pl: "03 · SYNCHRONIZACJA" },
      title: { en: "Effects are for external systems.", pl: "Effecty są do systemów zewnętrznych." },
      body: {
        en: "Hooks, effects and server data make sense once rendering and ownership are clear.",
        pl: "Hooki, effecty i dane serwerowe mają sens dopiero wtedy, gdy rozumiesz rendering i ownership.",
      },
      code: "useEffect(() => subscribe(id), [id]);",
      tone: "cyan",
    },
    {
      eyebrow: { en: "04 · PRODUCTION", pl: "04 · PRODUKCJA" },
      title: { en: "Then measure, test and structure it.", pl: "Na końcu mierzysz, testujesz i porządkujesz." },
      body: {
        en: "Routing, performance, accessibility and tests turn a component demo into an application.",
        pl: "Routing, wydajność, dostępność i testy zmieniają demo komponentu w aplikację.",
      },
      code: "render(<App />);\nexpect(screen.getByRole('button')).toBeVisible();",
      tone: "cyan",
    },
  ],
  ai: [
    {
      eyebrow: { en: "01 · MODEL", pl: "01 · MODEL" },
      title: { en: "Start with tokens, context and outputs.", pl: "Zacznij od tokenów, kontekstu i odpowiedzi." },
      body: {
        en: "Understand the model boundary before adding retrieval, tools or agents.",
        pl: "Zrozum granicę modelu, zanim dodasz retrieval, narzędzia albo agentów.",
      },
      code: "prompt + context → model → output",
      tone: "purple",
    },
    {
      eyebrow: { en: "02 · KNOWLEDGE", pl: "02 · WIEDZA" },
      title: { en: "RAG supplies evidence at runtime.", pl: "RAG dostarcza wiedzę w runtime." },
      body: {
        en: "Embeddings, retrieval and reranking build context from external knowledge.",
        pl: "Embeddingi, retrieval i reranking budują kontekst z wiedzy zewnętrznej.",
      },
      code: "query → retrieve → rerank → context",
      tone: "purple",
    },
    {
      eyebrow: { en: "03 · ACTION", pl: "03 · AKCJA" },
      title: { en: "Tools connect models to real systems.", pl: "Narzędzia łączą modele z prawdziwymi systemami." },
      body: {
        en: "Function calling and MCP make capabilities explicit and governable.",
        pl: "Function calling i MCP sprawiają, że możliwości są jawne i kontrolowalne.",
      },
      code: "model → tool call → validate → execute",
      tone: "purple",
    },
    {
      eyebrow: { en: "04 · RELIABILITY", pl: "04 · NIEZAWODNOŚĆ" },
      title: { en: "Production AI needs measurement.", pl: "Produkcyjne AI wymaga pomiaru." },
      body: {
        en: "Evals, safety, observability and deterministic workflow boundaries keep demos from becoming incidents.",
        pl: "Ewale, bezpieczeństwo, observability i deterministyczne granice workflow chronią przed zamianą demo w incydent.",
      },
      code: "trace → evaluate → improve",
      tone: "purple",
    },
  ],
  "it-foundations": [
    {
      eyebrow: { en: "01 · REQUEST", pl: "01 · REQUEST" },
      title: { en: "Follow one request end to end.", pl: "Prześledź jeden request od początku do końca." },
      body: {
        en: "Browser, DNS, TLS and HTTP are easier when you see them as one path.",
        pl: "Przeglądarka, DNS, TLS i HTTP są prostsze, gdy widzisz je jako jedną ścieżkę.",
      },
      code: "Browser → DNS → TLS → HTTP → Service",
      tone: "green",
    },
    {
      eyebrow: { en: "02 · APPLICATION", pl: "02 · APLIKACJA" },
      title: { en: "Then place frontend, backend and data.", pl: "Potem umieść frontend, backend i dane." },
      body: {
        en: "APIs, databases, caches and queues become parts of one production system.",
        pl: "API, bazy, cache i kolejki stają się elementami jednego systemu produkcyjnego.",
      },
      code: "UI → API → service → database/cache",
      tone: "green",
    },
    {
      eyebrow: { en: "03 · IDENTITY", pl: "03 · TOŻSAMOŚĆ" },
      title: { en: "Identity crosses every boundary.", pl: "Tożsamość przechodzi przez każdą granicę." },
      body: {
        en: "Sessions, OAuth, OIDC, JWT and browser security explain who may do what.",
        pl: "Sesje, OAuth, OIDC, JWT i security przeglądarki wyjaśniają, kto może zrobić co.",
      },
      code: "user → IdP → token/session → API policy",
      tone: "green",
    },
    {
      eyebrow: { en: "04 · DELIVERY", pl: "04 · DOSTARCZANIE" },
      title: { en: "Finally, ship and operate it.", pl: "Na końcu wdrażasz i utrzymujesz." },
      body: {
        en: "Containers, Kubernetes, cloud, Terraform, CI/CD and observability connect code to production.",
        pl: "Kontenery, Kubernetes, cloud, Terraform, CI/CD i observability łączą kod z produkcją.",
      },
      code: "commit → pipeline → artifact → deploy → observe",
      tone: "green",
    },
  ],
};

const fallbackScenes = scenes.javascript;

export function CourseIntroTrailer({
  courseSlug,
  compact = false,
}: {
  courseSlug: string;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const courseScenes = useMemo(
    () => scenes[courseSlug] ?? fallbackScenes,
    [courseSlug],
  );
  const scene = courseScenes[sceneIndex];
  const en = locale === "en";

  useEffect(() => {
    if (!open || !playing || reduceMotion) return;
    const timer = window.setInterval(() => {
      setSceneIndex((current) => (current + 1) % courseScenes.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [courseScenes.length, open, playing, reduceMotion]);

  const openTrailer = () => {
    setSceneIndex(0);
    setPlaying(true);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={compact ? "course-trailer-trigger compact" : "course-trailer-trigger"}
        onClick={openTrailer}
      >
        <span className="course-trailer-play">
          <CirclePlay size={compact ? 18 : 22} />
        </span>
        <span>
          <strong>{en ? "Animated course intro" : "Animowane intro kursu"}</strong>
          <small>{en ? "≈ 45 seconds" : "≈ 45 sekund"}</small>
        </span>
        <ArrowRight size={15} />
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={en ? "How this course fits together" : "Jak ten kurs łączy się w całość"}
      >
        <div className={`course-trailer course-trailer-${scene.tone}`}>
          <div className="course-trailer-toolbar">
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? (en ? "Pause intro" : "Wstrzymaj intro") : (en ? "Play intro" : "Odtwórz intro")}
            >
              {playing ? <CirclePause size={18} /> : <CirclePlay size={18} />}
            </button>
            <div className="course-trailer-dots">
              {courseScenes.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === sceneIndex ? "active" : ""}
                  onClick={() => {
                    setSceneIndex(index);
                    setPlaying(false);
                  }}
                  aria-label={en ? `Scene ${index + 1}` : `Scena ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setSceneIndex(0);
                setPlaying(true);
              }}
              aria-label={en ? "Replay intro" : "Odtwórz od początku"}
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="course-trailer-stage">
            <div className="course-trailer-network" aria-hidden="true">
              <span className="trailer-node trailer-node-a">
                <Braces size={16} />
              </span>
              <span className="trailer-node trailer-node-b">
                <Network size={16} />
              </span>
              <span className="trailer-node trailer-node-c">
                <Sparkles size={16} />
              </span>
              <span className="trailer-line trailer-line-a" />
              <span className="trailer-line trailer-line-b" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="course-trailer-scene"
                key={sceneIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <span className="eyebrow">{scene.eyebrow[locale]}</span>
                <h3>{scene.title[locale]}</h3>
                <p>{scene.body[locale]}</p>
                <pre>
                  <code>{scene.code}</code>
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="course-trailer-footer">
            <Code2 size={15} />
            <span>
              {en
                ? "The course should feel like one path, not a pile of disconnected facts."
                : "Kurs powinien być jedną ścieżką, a nie zbiorem przypadkowych wstawek."}
            </span>
          </div>
        </div>
      </Dialog>
    </>
  );
}
