"use client";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { MotionConfig } from "motion/react";
import type { Locale } from "@/lib/config";
import { dictionaries } from "@/lib/i18n";
import { preferences, type Theme } from "@/services/preferences";
import { progressStore } from "@/services/progress";
const Context = createContext<{
  locale: Locale;
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
}>({ locale: "en", theme: "dark", resolvedTheme: "dark", setTheme: () => {} });
export function Providers({
  locale,
  children,
  persistLocale = true,
}: {
  locale: Locale;
  children: React.ReactNode;
  persistLocale?: boolean;
}) {
  const theme = useSyncExternalStore(
    preferences.subscribe,
    preferences.theme,
    (): Theme => "dark",
  );
  const resolved = useSyncExternalStore(
    preferences.subscribe,
    preferences.resolvedTheme,
    () => "dark" as const,
  );
  useEffect(() => {
    document.documentElement.lang = locale;
    if (persistLocale) preferences.setLocale(locale);
  }, [locale, persistLocale]);
  useEffect(() => {
    preferences.applyTheme(resolved);
  }, [resolved]);
  const setTheme = (value: Theme) => preferences.setTheme(value);
  return (
    <Context.Provider
      value={{ locale, theme, resolvedTheme: resolved, setTheme }}
    >
      <MotionConfig reducedMotion="user">
        <div lang={locale}>{children}</div>
      </MotionConfig>
    </Context.Provider>
  );
}
export function useLocale() {
  const context = useContext(Context);
  return {
    ...context,
    t: dictionaries[context.locale],
    l: (value: { en: string; pl: string }) => value[context.locale],
    href: (path = "") => `/${context.locale}${path}/`.replace(/\/{2,}/g, "/"),
  };
}
export function useProgress() {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.snapshot,
    progressStore.serverSnapshot,
  );
}
