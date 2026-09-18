import { Catalogue } from "@/features/courses/catalogue";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    title:
      (await params).locale === "pl"
        ? "Kursy programowania"
        : "Programming courses",
  };
}
export default function Page() {
  return <Catalogue />;
}
