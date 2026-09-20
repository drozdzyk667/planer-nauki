"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  CheckCircle2,
  Code2,
  FlaskConical,
  RotateCw,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useLocale } from "./providers";
import { Reveal } from "./ui";
import { asset } from "@/lib/config";
import { VisualExplainer } from "./visual-explainer";
import { CourseCard } from "@/features/courses/catalogue";
import { courseRepository } from "@/services/courses";
import { studyContentFor } from "@/content/study-content";
export function Landing() {
  const { t, locale, href } = useLocale();
  const [demo, setDemo] = useState<string | null>(null);
  const en = locale === "en";
  const javascriptCourse = courseRepository.get("javascript");
  const freeInteractiveLessons =
    javascriptCourse?.modules
      .filter((module) => module.access === "free")
      .reduce((count, module) => count + module.lessonIds.length, 0) ?? 0;
  const freeKnowledgeChapters =
    studyContentFor("javascript")?.knowledge.filter(
      (section) => section.level === "beginner",
    ).length ?? 0;

  return (
    <>
      <section className="hero container">
        <Reveal className="hero-copy">
          <div className="hero-kicker">
            <span className="live-dot" />
            {en
              ? "FIRST COURSE · JAVASCRIPT"
              : "PIERWSZY KURS · JAVASCRIPT"}
            <ArrowUpRight size={14} />
          </div>
          <h1>
            {en ? (
              <>
                JavaScript.
                <br />
                <span className="gradient-text">From first line</span>
                <br />
                to real confidence.
              </>
            ) : (
              <>
                JavaScript.
                <br />
                <span className="gradient-text">Od pierwszej linii</span>
                <br />
                do pewnego kodu.
              </>
            )}
          </h1>
          <p>
            {en
              ? "Short visual lessons, real code, checkpoints and smart review. Learn by doing — then prove to yourself that the idea actually stuck."
              : "Krótkie wizualne lekcje, prawdziwy kod, checkpointy i mądre powtórki. Uczysz się przez działanie — a potem sprawdzasz, czy temat naprawdę został w głowie."}
          </p>
          <div className="hero-buttons">
            <Link className="button primary" href={href("/courses/javascript/knowledge")}>
              {t.startFree}
              <ArrowUpRight size={19} />
            </Link>
            <a className="button ghost" href="#how-it-works">
              {t.how}
              <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <Check size={14} />
              {t.noAccount}
            </span>
            <span>
              <Check size={14} />
              {en ? "Learn at your pace" : "Ucz się w swoim tempie"}
            </span>
          </div>
        </Reveal>
        <Reveal className="hero-art" delay={0.12}>
          <div className="core-image">
            <picture>
              <source
                media="(max-width: 600px)"
                srcSet={asset("knowledge-core-small.webp")}
              />
              <Image
                src={asset("knowledge-core.webp")}
                alt=""
                width={1400}
                height={933}
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </picture>
            <div className="core-vignette" />
          </div>
          <span className="orbit-label orbit-js">
            <span className="mini-js">JS</span>JavaScript
            <span className="live-dot" />
          </span>
          <span className="orbit-label orbit-ts">
            <span className="mini-ts">TS</span>TypeScript
          </span>
          <span className="orbit-label orbit-react">
            <span className="react-glyph">⚛</span>React
          </span>
          <div className="hero-code-fragment">
            <div className="fragment-heading">
              <span className="live-dot" />
              your-next-step.js
            </div>
            <code>
              <span>const</span> future = <em>{'"built by you"'}</em>;
            </code>
          </div>
          <div className="hero-reward">
            <span className="reward-icon">
              <Zap size={19} />
            </span>
            <div>
              <strong>
                {en ? "One idea. Understood." : "Jeden pomysł. Zrozumiany."}
              </strong>
              <span>
                {en
                  ? "That’s where it starts."
                  : "Właśnie od tego się zaczyna."}
              </span>
            </div>
            <CheckCircle2 size={19} />
          </div>
          <div className="hero-course-card">
            <span>{en ? "JAVASCRIPT PATH" : "ŚCIEŻKA JAVASCRIPT"}</span>
            <div>
              <strong>{freeInteractiveLessons}</strong>
              <small>
                {en ? "FREE INTERACTIVE LESSONS" : "DARMOWYCH LEKCJI INTERAKTYWNYCH"}
              </small>
            </div>
            <p>
              {en
                ? `${freeKnowledgeChapters} knowledge chapters are free too. Advanced knowledge is Premium.`
                : `${freeKnowledgeChapters} rozdziałów wiedzy też jest za darmo. Wiedza zaawansowana jest Premium.`}
            </p>
            <Link href={href("/courses/javascript/knowledge")}>
              {en ? "Start free" : "Zacznij za darmo"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="core-caption">
            <span>{en ? "01 — KNOWLEDGE CORE" : "01 — RDZEŃ WIEDZY"}</span>
            <span>
              {en ? "BUILT ONE IDEA AT A TIME" : "JEDEN POMYSŁ PO DRUGIM"}
            </span>
          </div>
        </Reveal>
      </section>
      <div className="skills-strip">
        <div className="container">
          <nav className="skills-list" aria-label={en ? "Course shortcuts" : "Skróty do kursów"}>
            {[
              ["JavaScript", "/courses/javascript/knowledge", "js"],
              ["TypeScript", "/courses/typescript/knowledge", "ts"],
              ["React", "/courses/react/knowledge", "react"],
              ["Python", "/courses#course-python", "python"],
              ["SQL", "/courses#course-sql", "sql"],
              ["AI", "/courses/ai/knowledge", "ai"],
              ["IT", "/courses/it-foundations/knowledge", "it"],
            ].map(([label, path, tone]) => (
              <Link
                key={label}
                className={`skill-link skill-${tone}`}
                href={href(path as string)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <section id="how-it-works" className="container section how-section">
        <Reveal className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" />
              {en ? "A BETTER WAY TO LEARN" : "LEPSZY SPOSÓB NA NAUKĘ"}
            </div>
            <h2>
              {en ? (
                <>
                  From “what?”
                  <br />
                  to <span className="serif-word">“I get it.”</span>
                </>
              ) : (
                <>
                  Od „co?”
                  <br />
                  do <span className="serif-word">„rozumiem”.</span>
                </>
              )}
            </h2>
          </div>
          <p>
            {en
              ? "You don’t need another video to save for later. You need a small win. Then another."
              : "Nie potrzebujesz kolejnego filmu na później. Potrzebujesz małego sukcesu. A potem następnego."}
          </p>
        </Reveal>
        <div className="method-grid">
          {[
            {
              Icon: BookOpenText,
              n: "01",
              tone: "amber",
              visual: "observe",
              title: en ? "Knowledge." : "Wiedza.",
              body: en
                ? "Clear chapters explain the mechanism, show code and connect the topic with rules, pitfalls and real production context."
                : "Konkretne rozdziały wyjaśniają mechanizm, pokazują kod i łączą temat z regułami, pułapkami oraz prawdziwym kontekstem produkcyjnym.",
            },
            {
              Icon: RotateCw,
              n: "02",
              tone: "blue",
              visual: "memory",
              title: en ? "Flashcards." : "Fiszki.",
              body: en
                ? "Fast question–answer cards help you recall syntax, mental models and details that are easy to forget."
                : "Szybkie karty pytanie–odpowiedź pomagają utrwalić składnię, modele mentalne i szczegóły, które łatwo wypadają z pamięci.",
            },
            {
              Icon: FlaskConical,
              n: "03",
              tone: "violet",
              visual: "logic",
              title: en ? "Tests." : "Testy.",
              body: en
                ? "Randomized questions, predictions and checkpoints verify whether you understand the idea instead of only recognizing it."
                : "Losowane pytania, przewidywanie wyniku i checkpointy sprawdzają, czy naprawdę rozumiesz temat, a nie tylko go rozpoznajesz.",
            },
            {
              Icon: Code2,
              n: "04",
              tone: "mint",
              visual: "code",
              title: en ? "Coding." : "Kodowanie.",
              body: en
                ? "Generated task variants make you write code, while hidden checks verify the general rule instead of one memorised example."
                : "Generowane warianty zadań każą pisać kod, a ukryte checki sprawdzają ogólną regułę zamiast jednego zapamiętanego przykładu.",
            },
          ].map(({ Icon, n, tone, visual, title, body }, i) => (
            <Reveal className={`method method-${tone}`} key={n} delay={i * 0.07}>
              <div className="method-top">
                <span className="method-icon">
                  <Icon size={24} />
                </span>
                <span className="method-number">{n}</span>
              </div>
              <div className={`method-scene method-scene-${visual}`} aria-hidden="true">
                {visual === "observe" && (
                  <>
                    <span className="radar-ring radar-ring-a" />
                    <span className="radar-ring radar-ring-b" />
                    <span className="radar-pulse" />
                    <span className="radar-beam" />
                  </>
                )}
                {visual === "code" && (
                  <>
                    <span className="code-line code-line-a" />
                    <span className="code-line code-line-b" />
                    <span className="code-line code-line-c" />
                    <span className="code-cursor" />
                    <span className="code-output">✓</span>
                  </>
                )}
                {visual === "logic" && (
                  <>
                    <span className="logic-link logic-link-a" />
                    <span className="logic-link logic-link-b" />
                    <span className="logic-node logic-node-a" />
                    <span className="logic-node logic-node-b" />
                    <span className="logic-node logic-node-c" />
                  </>
                )}
                {visual === "memory" && (
                  <>
                    <span className="memory-orbit" />
                    <span className="memory-dot memory-dot-a" />
                    <span className="memory-dot memory-dot-b" />
                    <span className="memory-dot memory-dot-c" />
                    <span className="memory-arrow">↻</span>
                  </>
                )}
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
        <p className="learning-modes-note">
          <span aria-hidden="true">*</span>
          {en
            ? "IT Fundamentals & Production Applications is conceptual: it uses Knowledge, Flashcards and the dedicated IT Fundamentals reference instead of the coding lab."
            : "Kurs „IT fundamenty i aplikacje produkcyjne” jest koncepcyjny: korzysta z Wiedzy, Fiszek i osobnego modułu Fundamenty IT zamiast laboratorium kodowania."}
        </p>
      </section>
      <section className="container section visual-story">
        <Reveal className="visual-story-copy">
          <div className="eyebrow">
            <span className="tiny-line" />
            {en
              ? "LESS ABSTRACT. MORE AHA."
              : "MNIEJ ABSTRAKCJI. WIĘCEJ „AHA”."}
          </div>
          <h2>
            {en ? (
              <>
                The moment
                <br />
                it <span className="serif-word">makes sense.</span>
              </>
            ) : (
              <>
                Ten moment,
                <br />
                gdy <span className="serif-word">to ma sens.</span>
              </>
            )}
          </h2>
          <p>
            {en
              ? "A variable isn’t just a line of code. Watch a name connect to a value. Change it. See the result. That’s understanding you can build on."
              : "Zmienna to więcej niż linia kodu. Zobacz, jak nazwa łączy się z wartością. Zmień ją. Sprawdź wynik. Na takim zrozumieniu można budować."}
          </p>
          <Link className="text-link" href={href("/learn/variables")}>
            {en
              ? "Try your first visual lesson"
              : "Wypróbuj pierwszą wizualną lekcję"}
            <ArrowUpRight size={18} />
          </Link>
          <div className="visual-footnote">
            <CheckCircle2 size={16} />
            {en
              ? "Interactive. Replayable. At your pace."
              : "Interaktywnie. Z powtórkami. W Twoim tempie."}
          </div>
        </Reveal>
        <Reveal>
          <VisualExplainer />
        </Reveal>
      </section>
      <section className="container section">
        <Reveal className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" />
              {en ? "CHOOSE YOUR NEXT SKILL" : "WYBIERZ KOLEJNĄ UMIEJĘTNOŚĆ"}
            </div>
            <h2>
              {en ? (
                <>
                  Start somewhere.
                  <br />
                  <span className="serif-word">Go anywhere.</span>
                </>
              ) : (
                <>
                  Zacznij tutaj.
                  <br />
                  <span className="serif-word">Idź, gdzie chcesz.</span>
                </>
              )}
            </h2>
          </div>
          <Link className="button secondary" href={href("/courses")}>
            {t.explore}
            <ArrowUpRight size={17} />
          </Link>
        </Reveal>
        <div className="featured-grid">
          {courseRepository
            .list()
            .slice(0, 3)
            .map((course, i) => (
              <Reveal key={course.id} delay={i * 0.06}>
                <CourseCard course={course} featured={i === 0} />
              </Reveal>
            ))}
        </div>
      </section>
      <section className="container section challenge-section">
        <Reveal className="challenge-intro">
          <div className="eyebrow">
            <Terminal size={16} />
            {t.tryDemo}
          </div>
          <h2>
            {en ? (
              <>
                Your first
                <br />
                <span className="serif-word">“I did that.”</span>
              </>
            ) : (
              <>
                Twoje pierwsze
                <br />
                <span className="serif-word">„udało się”.</span>
              </>
            )}
          </h2>
          <p>
            {en
              ? "No setup. No downloads. Just you, a few lines, and that satisfying moment when it works."
              : "Bez konfiguracji. Bez pobierania. Tylko Ty, kilka linii i satysfakcja, kiedy wszystko działa."}
          </p>
          <span className="pill">
            <Code2 size={15} />
            {en ? "A 20-second head start" : "20 sekund na dobry początek"}
          </span>
        </Reveal>
        <Reveal className="demo-card">
          <div className="demo-header">
            <span className="mini-js">JS</span>
            <span>hello-curiosity.js</span>
            <span className="badge subtle">
              {en ? "Try it live" : "Wypróbuj"}
            </span>
          </div>
          <pre className="demo-code">
            <code>
              <span className="line-num">1</span>{" "}
              <span className="code-keyword">const</span> name ={" "}
              <span className="code-string">{'"Ada"'}</span>;{"\n"}
              <span className="line-num">2</span> console.
              <span className="code-function">log</span>(
              <span className="code-string">{'"Hello, "'}</span> + name);
            </code>
          </pre>
          <fieldset>
            <legend>{t.demoPrompt}</legend>
            <div className="demo-answers">
              {["Hello, Ada", "Hello, name", "undefined"].map((answer) => (
                <button
                  className={`demo-answer ${demo === answer ? "selected" : ""}`}
                  key={answer}
                  onClick={() => setDemo(answer)}
                  aria-pressed={demo === answer}
                >
                  {answer}
                  {demo === answer && <Check size={14} />}
                </button>
              ))}
            </div>
          </fieldset>
          {demo && (
            <div
              role="status"
              className={`feedback ${demo === "Hello, Ada" ? "success" : "error"}`}
            >
              {demo === "Hello, Ada" ? (
                <Check size={18} />
              ) : (
                <RotateCw size={18} />
              )}
              <span>{demo === "Hello, Ada" ? t.demoSuccess : t.demoWrong}</span>
            </div>
          )}
        </Reveal>
      </section>
      <section className="container section last-cta">
        <Reveal>
          <span className="cta-spark">
            <Sparkles size={30} />
          </span>
          <div className="eyebrow">
            {en ? "CURIOSITY LOOKS GOOD ON YOU" : "CIEKAWOŚĆ DOBRZE CI SŁUŻY"}
          </div>
          <h2>{t.getStarted}</h2>
          <p>{t.getStartedCopy}</p>
          <Link className="button primary" href={href("/courses/javascript/knowledge")}>
            {t.startFree}
            <ArrowRight size={19} />
          </Link>
          <small>
            {t.noAccount} · {t.noPressure}
          </small>
        </Reveal>
      </section>
    </>
  );
}
