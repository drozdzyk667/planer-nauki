import { CoursePath } from "@/features/courses/course-path";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: (await params).locale === "pl" ? "TypeScript — ścieżka nauki" : "TypeScript — learning path" };
}
export default function Page() { return <CoursePath courseSlug="typescript" />; }
