import { CoursePath } from "@/features/courses/course-path";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: (await params).locale === "pl" ? "React — ścieżka nauki" : "React — learning path" };
}
export default function Page() { return <CoursePath courseSlug="react" />; }
