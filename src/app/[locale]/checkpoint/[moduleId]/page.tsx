import { notFound } from "next/navigation";
import { courseRepository } from "@/services/courses";
import { Checkpoint } from "@/features/learning/checkpoint";
export function generateStaticParams() {
  return courseRepository
    .get("javascript")!
    .modules.filter((m) => m.access === "free")
    .map((m) => ({ moduleId: m.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    title: (await params).locale === "pl" ? "Sprawdzian" : "Checkpoint",
    robots: { index: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  if (!courseRepository.quiz(moduleId)) notFound();
  return <Checkpoint key={moduleId} moduleId={moduleId} />;
}
