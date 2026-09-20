import type { Locale } from "@/domain/models";

export function countLabel(
  locale: Locale,
  count: number,
  en: [one: string, many: string],
  pl: [one: string, few: string, many: string],
) {
  if (locale === "en") return count === 1 ? en[0] : en[1];
  const absolute = Math.abs(count);
  const mod10 = absolute % 10;
  const mod100 = absolute % 100;
  if (absolute === 1) return pl[0];
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return pl[1];
  return pl[2];
}