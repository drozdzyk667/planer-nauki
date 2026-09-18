import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/shell";
import { locales, type Locale } from "@/lib/config";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return (
    <Providers locale={locale as Locale}>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
