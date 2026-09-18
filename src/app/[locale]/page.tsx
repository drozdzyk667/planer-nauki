import { Landing } from "@/components/landing";
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "pl" ? "Zrozum kod. Zbuduj coś swojego." : "Make code click",
    description:
      locale === "pl"
        ? "Nauka programowania przez wizualne wyjaśnienia, kod i powtórki. Zacznij JavaScript za darmo."
        : "Learn programming with visual explanations, real code and smart review. Start JavaScript for free.",
    alternates: {
      canonical: `/planer-nauki/${locale}/`,
      languages: { en: "/planer-nauki/en/", pl: "/planer-nauki/pl/" },
    },
  };
}
export default function Home() {
  return <Landing />;
}
