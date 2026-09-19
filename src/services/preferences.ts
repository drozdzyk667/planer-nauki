import type { Locale } from "@/lib/config";

export type Theme = "dark" | "light";

export const preferences = {
  theme(): Theme {
    try {
      return localStorage.getItem("nuvecto.theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  },
  applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
  },
  setTheme(theme: Theme) {
    try { localStorage.setItem("nuvecto.theme", theme); } catch {}
    this.applyTheme(theme);
    window.dispatchEvent(new Event("nuvecto-preferences"));
  },
  subscribe(listener: () => void) {
    window.addEventListener("nuvecto-preferences", listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("nuvecto-preferences", listener);
      window.removeEventListener("storage", listener);
    };
  },
  resolvedTheme(): "dark" | "light" {
    return preferences.theme();
  },
  setLocale(locale: Locale) {
    try { localStorage.setItem("nuvecto.locale", locale); } catch {}
  },
  locale(): Locale {
    try {
      const saved = localStorage.getItem("nuvecto.locale");
      if (saved === "en" || saved === "pl") return saved;
    } catch {}
    return navigator.language.startsWith("pl") ? "pl" : "en";
  },
};
