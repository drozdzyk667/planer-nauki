import type { Metadata } from "next";
import { FundamentalsHub } from "@/features/fundamentals/fundamentals-hub";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "pl"
        ? "Fundamenty IT — słownik pojęć"
        : "IT Fundamentals — glossary",
    description:
      locale === "pl"
        ? "Słownik pojęć w kursie IT fundamenty i aplikacje produkcyjne."
        : "The glossary module inside IT Fundamentals & Production Applications.",
  };
}

export default function Page() {
  return <FundamentalsHub />;
}
