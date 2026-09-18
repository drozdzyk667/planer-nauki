import { CoursePath } from "@/features/courses/course-path";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    title:
      (await params).locale === "pl"
        ? "JavaScript — ścieżka nauki"
        : "JavaScript — learning path",
  };
}
export default function Page() {
  return <CoursePath />;
}
