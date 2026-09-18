import { Review } from "@/features/progress/review";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    title: (await params).locale === "pl" ? "Powtórki" : "Smart review",
    robots: { index: false },
  };
}
export default function Page() {
  return <Review />;
}
