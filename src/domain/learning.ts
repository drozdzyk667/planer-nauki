import {
  type Concept,
  type CourseModule,
  type Progress,
  type Question,
} from "./models";
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function scoreQuiz(
  questions: Question[],
  answers: Record<string, string>,
) {
  return questions.length
    ? Math.round(
        (questions.filter((q) => answers[q.id] === q.answer).length /
          questions.length) *
          100,
      )
    : 0;
}
export function updateConcept(
  previous: Concept | undefined,
  correct: boolean,
  now = new Date(),
): Concept {
  const attempts = (previous?.attempts ?? 0) + 1;
  const mastery = Math.max(
    0,
    Math.min(100, (previous?.mastery ?? 0) + (correct ? 25 : -30)),
  );
  const days = correct
    ? mastery >= 100
      ? 14
      : mastery >= 75
        ? 7
        : mastery >= 50
          ? 3
          : 1
    : 0;
  const next = new Date(now);
  if (days) next.setDate(next.getDate() + days);
  else next.setMinutes(next.getMinutes() + 10);
  return {
    attempts,
    correct: (previous?.correct ?? 0) + (correct ? 1 : 0),
    mastery,
    lastSeen: now.toISOString(),
    nextReview: next.toISOString(),
  };
}
export function lessonReward(progress: Progress, id: string) {
  return progress.completed[id] ? 0 : 80;
}
export function quizReward(progress: Progress, id: string, score: number) {
  return Math.max(0, score - (progress.quizBest[id] ?? 0));
}
export function moduleProgress(module: CourseModule, progress: Progress) {
  return module.lessonIds.length
    ? Math.round(
        (module.lessonIds.filter((id) => progress.completed[id]).length /
          module.lessonIds.length) *
          100,
      )
    : 0;
}
export const canAccess = (module: CourseModule) =>
  module.access === "free" && module.lessonIds.length > 0;
export function isDue(concept: Concept, now = new Date()) {
  return new Date(concept.nextReview) <= now;
}
export function streak(days: string[], now = new Date()) {
  let count = 0;
  const cursor = new Date(now);
  if (!days.includes(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.includes(localDay(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
export const XP_PER_LEVEL = 400;
export const level = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const levelProgress = (xp: number) =>
  Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
export const xpIntoLevel = (xp: number) => xp % XP_PER_LEVEL;
export const xpToNextLevel = (xp: number) => {
  const intoLevel = xp % XP_PER_LEVEL;
  return intoLevel === 0 ? XP_PER_LEVEL : XP_PER_LEVEL - intoLevel;
};

export function moduleXp(module: CourseModule, progress: Progress) {
  const lessonXp =
    module.lessonIds.filter((id) => progress.completed[id]).length * 80;
  const checkpointXp = progress.quizBest[`checkpoint-${module.id}`] ?? 0;
  return lessonXp + checkpointXp;
}

export function moduleMaxXp(module: CourseModule) {
  return module.lessonIds.length * 80 + 100;
}

export function moduleStars(module: CourseModule, progress: Progress) {
  const completedLessons = module.lessonIds.filter(
    (id) => progress.completed[id],
  ).length;
  const checkpoint = progress.quizBest[`checkpoint-${module.id}`] ?? 0;
  if (checkpoint >= 80 && completedLessons === module.lessonIds.length) return 3;
  if (completedLessons === module.lessonIds.length && completedLessons > 0)
    return 2;
  if (completedLessons > 0) return 1;
  return 0;
}
