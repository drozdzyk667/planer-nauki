import { KnowledgeLibrary } from "@/features/study/knowledge-library";

export function generateStaticParams() {
  return ["javascript", "typescript", "react"].map((courseSlug) => ({ courseSlug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  return <KnowledgeLibrary courseSlug={courseSlug} />;
}
