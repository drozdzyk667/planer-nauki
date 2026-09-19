import { CodingLab } from "@/features/study/coding-lab";
import type { CodingCourse } from "@/domain/coding-challenges";

export function generateStaticParams() {
  return ["javascript", "typescript", "react"].map((courseSlug) => ({ courseSlug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: CodingCourse }>;
}) {
  const { courseSlug } = await params;
  return <CodingLab courseSlug={courseSlug} />;
}
