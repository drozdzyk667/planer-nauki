import type { Locale } from "@/lib/config";
export type Theme = "dark" | "light" | "system";
export const preferences = {
  theme(): Theme {
    try {
      const v = localStorage.getItem("nuvecto.theme");
      return v === "light" || v === "system" ? v : "dark";
    } catch {
      return "dark";
    }
  },
  applyTheme(theme: Theme) {
    document.documentElement.dataset.theme =
      theme === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
  },
  setTheme(theme: Theme) {
    try {
      localStorage.setItem("nuvecto.theme", theme);
    } catch {}
    this.applyTheme(theme);
    window.dispatchEvent(new Event("nuvecto-preferences"));
  },
  subscribe(listener: () => void) {
    const media = matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("nuvecto-preferences", listener);
    window.addEventListener("storage", listener);
    media.addEventListener("change", listener);
    return () => {
      window.removeEventListener("nuvecto-preferences", listener);
      window.removeEventListener("storage", listener);
      media.removeEventListener("change", listener);
    };
  },
  resolvedTheme(): "dark" | "light" {
    const theme = preferences.theme();
    return theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  },
  setLocale(locale: Locale) {
    try {
      localStorage.setItem("nuvecto.locale", locale);
    } catch {}
  },
  locale(): Locale {
    try {
      const saved = localStorage.getItem("nuvecto.locale");
      if (saved === "en" || saved === "pl") return saved;
    } catch {}
    return navigator.language.startsWith("pl") ? "pl" : "en";
  },
};
