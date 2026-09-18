import { notFound } from "next/navigation";
import { courseRepository } from "@/services/courses";
import { LessonRunner } from "@/features/learning/lesson-runner";
import type { Locale } from "@/lib/config";
export function generateStaticParams() {
  return courseRepository.lessons().map((l) => ({ lessonId: l.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; lessonId: string }>;
}) {
  const { locale, lessonId } = await params;
  return {
    title: courseRepository.lesson(lessonId)?.title[locale],
    robots: { index: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!courseRepository.lesson(lessonId)) notFound();
  return <LessonRunner key={lessonId} id={lessonId} />;
}
