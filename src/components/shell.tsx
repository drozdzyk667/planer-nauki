"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Globe2,
  Menu,
  Moon,
  Star,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useLocale, useProgress } from "./providers";
import { level, levelProgress } from "@/domain/learning";
import { Dialog, Logo } from "./ui";
export function Header() {
  const { locale, t, href, theme, setTheme } = useLocale();
  const path = usePathname();
  const progress = useProgress();
  const currentLevel = level(progress.xp);
  const currentLevelProgress = levelProgress(progress.xp);
  const [menu, setMenu] = useState(false);
  const languagePath = path.replace(
    /^\/(en|pl)(?=\/|$)/,
    locale === "en" ? "/pl" : "/en",
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link href={href()} aria-label={`Nuvecto — ${t.home}`}>
            <Logo />
          </Link>
          <nav
            aria-label={t.menu}
            className={`main-nav ${menu ? "is-open" : ""}`}
          >
            <Link
              className={path.includes("/courses") ? "active" : ""}
              href={href("/courses")}
              onClick={() => setMenu(false)}
            >
              {t.courses}
            </Link>
            <Link
              className={path.includes("/fundamentals") ? "active" : ""}
              href={href("/fundamentals")}
              onClick={() => setMenu(false)}
            >
              {locale === "en" ? "Fundamentals" : "Fundamenty IT"}
            </Link>
            <Link
              href={`${href()}#how-it-works`}
              onClick={() => setMenu(false)}
            >
              {t.how}
            </Link>
            <Link
              className={path.includes("/dashboard") ? "active" : ""}
              href={href("/dashboard")}
              onClick={() => setMenu(false)}
            >
              {t.dashboard}
            </Link>
          </nav>
          <div className="header-actions">
            <Link
              className="learning-hud"
              href={href("/dashboard")}
              aria-label={
                locale === "en"
                  ? `Level ${currentLevel}, ${progress.xp} XP`
                  : `Poziom ${currentLevel}, ${progress.xp} XP`
              }
            >
              <span className="learning-hud-level">
                <Star size={15} fill="currentColor" />
                <b>LV {currentLevel}</b>
              </span>
              <span className="learning-hud-xp">
                <Zap size={14} />
                {progress.xp} XP
              </span>
              <i aria-hidden="true">
                <span style={{ width: `${currentLevelProgress}%` }} />
              </i>
            </Link>
            <Link
              className="language-switch"
              href={
                languagePath === path
                  ? `/${locale === "en" ? "pl" : "en"}/`
                  : languagePath
              }
              scroll
              onClick={() => {
                setMenu(false);
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
              }}
              aria-label={
                locale === "en"
                  ? "Zmień język na polski"
                  : "Switch language to English"
              }
            >
              <Globe2 size={16} />
              <span>{locale.toUpperCase()}</span>
            </Link>
            <div className="theme-switch" role="group" aria-label={t.theme}>
              {(
                [
                  { value: "light", label: t.light, Icon: Sun },
                  { value: "dark", label: t.dark, Icon: Moon },
                ] as const
              ).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className="theme-option"
                  aria-label={label}
                  title={label}
                  aria-pressed={theme === value}
                  onClick={() => setTheme(value)}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <Link
              className="button primary header-cta"
              href={href("/courses/javascript/knowledge")}
            >
              {t.start}
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? t.close : t.menu}
              aria-expanded={menu}
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  const { t, href, locale } = useLocale();
  const [privacy, setPrivacy] = useState(false);
  return (
    <>
      <footer className="footer container">
        <div>
          <Link href={href()}>
            <Logo />
          </Link>
          <p>{t.footerTag}</p>
        </div>
        <div className="footer-links">
          <Link href={href("/courses")}>{t.courses}</Link>
          <Link href={href("/fundamentals")}>
            {locale === "en" ? "IT Fundamentals" : "Fundamenty IT"}
          </Link>
          <Link href={href("/dashboard")}>{t.dashboard}</Link>
          <button className="text-button" onClick={() => setPrivacy(true)}>
            {t.privacy}
          </button>
          <span>© 2026 Nuvecto</span>
        </div>
      </footer>
      <Dialog
        open={privacy}
        onClose={() => setPrivacy(false)}
        title={t.privacyTitle}
      >
        <p>{t.privacyCopy}</p>
        <a
          className="text-link"
          href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
          target="_blank"
          rel="noreferrer"
        >
          GitHub · {t.privacy}
          <ArrowUpRight size={16} />
        </a>
      </Dialog>
    </>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
export function Breadcrumb({ current }: { current: string }) {
  const { t, href } = useLocale();
  return (
    <nav className="breadcrumb" aria-label={t.path}>
      <Link href={href("/courses")}>
        <BookOpen size={14} />
        {t.courses}
      </Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </nav>
  );
}
