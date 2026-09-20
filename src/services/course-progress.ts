import type { Progress } from "@/domain/models";
import {
  codingChallengeTemplateIds,
  type CodingCourse,
} from "@/domain/coding-challenges";
import { studyContentFor } from "@/content/study-content";
import { courseRepository } from "@/services/courses";

const CODING_COURSES = new Set<CodingCourse>([
  "javascript",
  "typescript",
  "react",
]);

function percentage(done: number, total: number) {
  if (!total) return null;
  return Math.round((done / total) * 100);
}

export function overallCourseProgress(courseSlug: string, progress: Progress) {
  const modeScores: number[] = [];
  const study = studyContentFor(courseSlug);

  if (study) {
    const chapters = study.knowledge.filter((section) => section.level === "beginner");
    const visited = new Set(progress.knowledgeVisited);
    const read = chapters.filter((section) =>
      visited.has(`${courseSlug}:${section.id}`),
    ).length;
    const score = percentage(read, chapters.length);
    if (score !== null) modeScores.push(score);
  }

  const course = courseRepository.get(courseSlug);
  if (course) {
    const freeModules = course.modules.filter((module) => module.access === "free");
    const freeModuleIds = new Set(freeModules.map((module) => module.id));
    const lessons = courseRepository
      .lessons()
      .filter(
        (lesson) =>
          lesson.courseId === course.id && freeModuleIds.has(lesson.moduleId),
      );

    if (lessons.length) {
      const checkpointModules = freeModules.filter(
        (module) => module.lessonIds.length > 0,
      );
      const completedLessons = lessons.filter(
        (lesson) => progress.completed[lesson.id],
      ).length;
      const completedCheckpoints = checkpointModules.filter(
        (module) =>
          progress.quizBest[`checkpoint-${module.id}`] !== undefined,
      ).length;
      const score = percentage(
        completedLessons + completedCheckpoints,
        lessons.length + checkpointModules.length,
      );
      if (score !== null) modeScores.push(score);
    }
  }

  if (CODING_COURSES.has(courseSlug as CodingCourse)) {
    const templateIds = codingChallengeTemplateIds(courseSlug as CodingCourse);
    const solved = new Set(progress.codingSolved);
    const completed = templateIds.filter((id) => solved.has(id)).length;
    const score = percentage(completed, templateIds.length);
    if (score !== null) modeScores.push(score);
  }

  if (!modeScores.length) return 0;
  return Math.round(
    modeScores.reduce((sum, score) => sum + score, 0) / modeScores.length,
  );
}
