import { FlashcardStudy } from "@/features/study/flashcard-study";

export function generateStaticParams() {
  return ["javascript", "typescript", "react", "ai", "it-foundations"].map(
    (courseSlug) => ({ courseSlug }),
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  return <FlashcardStudy courseSlug={courseSlug} />;
}
