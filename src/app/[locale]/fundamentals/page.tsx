import type { Metadata } from "next";
import { FundamentalsHub } from "@/features/fundamentals/fundamentals-hub";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "pl" ? "IT Fundamentals — słownik pojęć" : "IT Fundamentals — glossary",
    description:
      locale === "pl"
        ? "Słownik i mapa pojęć IT: web, sieci, security, frontend, backend, cloud, DevOps, bazy danych, Git, architektura i AI."
        : "A searchable IT glossary covering web, networking, security, frontend, backend, cloud, DevOps, databases, Git, architecture and AI.",
  };
}

export default function Page() {
  return <FundamentalsHub />;
}
