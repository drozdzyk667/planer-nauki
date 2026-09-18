import { Dashboard } from "@/features/progress/dashboard";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    title: (await params).locale === "pl" ? "Moja nauka" : "My learning",
    robots: { index: false },
  };
}
export default function Page() {
  return <Dashboard />;
}
