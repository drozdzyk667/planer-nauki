"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Eye,
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
export function Landing() {
  const { t, locale, href } = useLocale();
  const [demo, setDemo] = useState<string | null>(null);
  const en = locale === "en";
  return (
    <>
      <section className="hero container">
        <Reveal className="hero-copy">
          <div className="hero-kicker">
            <span className="live-dot" />
            {en
              ? "LESS SCROLLING. MORE BUILDING."
              : "MNIEJ PRZEWIJANIA. WIĘCEJ TWORZENIA."}
            <ArrowUpRight size={14} />
          </div>
          <h1>
            {en ? (
              <>
                Don’t just
                <br />
                learn code.
                <br />
                <span className="gradient-text">Make it click.</span>
              </>
            ) : (
              <>
                Nie tylko
                <br />
                poznawaj kod.
                <br />
                <span className="gradient-text">Zrozum go.</span>
              </>
            )}
          </h1>
          <p>
            {en
              ? "See the idea. Try the code. Make it yours. Short, visual lessons that turn curiosity into real skills."
              : "Zobacz pomysł. Wypróbuj kod. Zrozum, jak działa. Krótkie, wizualne lekcje, które zamieniają ciekawość w umiejętności."}
          </p>
          <div className="hero-buttons">
            <Link className="button primary" href={href("/courses/javascript")}>
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
          <span>
            {en
              ? "YOUR CURIOSITY HAS NO LIMIT."
              : "TWOJA CIEKAWOŚĆ NIE MA GRANIC."}
          </span>
          <div>
            <b className="strip-active">JavaScript</b>
            <b>TypeScript</b>
            <b>React</b>
            <b>Python</b>
            <b>SQL</b>
            <b>AI</b>
          </div>
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
              Icon: Eye,
              n: "01",
              title: en ? "See it." : "Zobacz.",
              body: en
                ? "Ideas come to life with interactive visual explanations."
                : "Pojęcia ożywają w interaktywnych wyjaśnieniach.",
            },
            {
              Icon: Braces,
              n: "02",
              title: en ? "Try it." : "Spróbuj.",
              body: en
                ? "Make a prediction. Write real code. Find out what happens."
                : "Przewiduj. Pisz prawdziwy kod. Zobacz, co się wydarzy.",
            },
            {
              Icon: Sparkles,
              n: "03",
              title: en ? "Get it." : "Zrozum.",
              body: en
                ? "Helpful feedback makes every mistake a step forward."
                : "Przydatna informacja zwrotna zamienia błąd w krok naprzód.",
            },
            {
              Icon: RotateCw,
              n: "04",
              title: en ? "Keep it." : "Zapamiętaj.",
              body: en
                ? "Come back to the right ideas before they fade."
                : "Wracaj do właściwych pojęć, zanim umkną z pamięci.",
            },
          ].map(({ Icon, n, title, body }, i) => (
            <Reveal className="method" key={n} delay={i * 0.07}>
              <div className="method-top">
                <Icon size={24} />
                <span>{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
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
          <Link className="button primary" href={href("/courses/javascript")}>
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
