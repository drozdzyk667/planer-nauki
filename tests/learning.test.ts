import { describe, expect, it } from "vitest";
import {
  canAccess,
  isDue,
  lessonReward,
  level,
  localDay,
  moduleProgress,
  quizReward,
  scoreQuiz,
  streak,
  updateConcept,
} from "@/domain/learning";
import { emptyProgress, progressSchema } from "@/domain/models";
import { courseRepository } from "@/services/courses";
describe("learning rules", () => {
  const course = courseRepository.get("javascript")!;
  const variables = course.modules[1];
  const quiz = courseRepository.quiz(variables.id)!;
  it("scores unanswered questions as incorrect", () => {
    expect(scoreQuiz(quiz.questions, {})).toBe(0);
    expect(
      scoreQuiz(quiz.questions, {
        [quiz.questions[0].id]: quiz.questions[0].answer,
      }),
    ).toBe(Math.round(100 / quiz.questions.length));
  });
  it("scores complete correct answers at 100%", () => {
    expect(
      scoreQuiz(
        quiz.questions,
        Object.fromEntries(quiz.questions.map((q) => [q.id, q.answer])),
      ),
    ).toBe(100);
  });
  it("does not farm XP through repeated lessons", () => {
    const p = emptyProgress();
    expect(lessonReward(p, "variables")).toBe(80);
    p.completed.variables = new Date().toISOString();
    expect(lessonReward(p, "variables")).toBe(0);
  });
  it("rewards only improvements to a checkpoint best", () => {
    const p = emptyProgress();
    p.quizBest.test = 67;
    expect(quizReward(p, "test", 100)).toBe(33);
    expect(quizReward(p, "test", 50)).toBe(0);
    expect(quizReward(p, "test", 67)).toBe(0);
  });
  it("measures module completion against actual lessons", () => {
    const p = emptyProgress();
    p.completed.variables = "2026-09-18T12:00:00Z";
    expect(moduleProgress(variables, p)).toBe(33);
    p.completed.constants = p.completed.variables;
    p.completed.types = p.completed.variables;
    expect(moduleProgress(variables, p)).toBe(100);
  });
  it("allows free content and gates planned premium content", () => {
    expect(canAccess(variables)).toBe(true);
    expect(canAccess(course.modules[4])).toBe(false);
    expect(canAccess({ ...variables, lessonIds: [] })).toBe(false);
  });
  it("increases mastery and schedules a review", () => {
    const now = new Date("2026-09-18T12:00:00Z");
    const first = updateConcept(undefined, true, now);
    expect(first.mastery).toBe(25);
    expect(first.attempts).toBe(1);
    expect(isDue(first, now)).toBe(false);
    expect(isDue(first, new Date("2026-09-20T12:00:00Z"))).toBe(true);
  });
  it("brings failed concepts back sooner and bounds mastery", () => {
    const now = new Date("2026-09-18T12:00:00Z");
    let c = updateConcept(undefined, true, now);
    for (let i = 0; i < 5; i++) c = updateConcept(c, true, now);
    expect(c.mastery).toBe(100);
    c = updateConcept(c, false, now);
    expect(c.mastery).toBe(70);
    expect(new Date(c.nextReview).getTime() - now.getTime()).toBe(600000);
    for (let i = 0; i < 5; i++) c = updateConcept(c, false, now);
    expect(c.mastery).toBe(0);
  });
  it("counts a streak from today or yesterday, allowing a day to begin", () => {
    const now = new Date(2026, 8, 18, 12);
    expect(streak(["2026-09-16", "2026-09-17"], now)).toBe(2);
    expect(streak(["2026-09-16"], now)).toBe(0);
    expect(streak(["2026-09-17", "2026-09-18"], now)).toBe(2);
  });
  it("uses local calendar dates rather than UTC strings", () => {
    expect(localDay(new Date(2026, 0, 2, 0, 1))).toBe("2026-01-02");
  });
  it("starts at level one and advances every 400 XP", () => {
    expect(level(0)).toBe(1);
    expect(level(399)).toBe(1);
    expect(level(400)).toBe(2);
  });
  it("rejects malformed or unsupported stored progress", () => {
    expect(
      progressSchema.safeParse({ ...emptyProgress(), xp: -1 }).success,
    ).toBe(false);
    expect(
      progressSchema.safeParse({ ...emptyProgress(), version: 2 }).success,
    ).toBe(false);
    expect(progressSchema.safeParse(emptyProgress()).success).toBe(true);
  });
});
describe("course content integrity", () => {
  it("has a complete bilingual free foundation and 20-module roadmap", () => {
    const course = courseRepository.get("javascript")!;
    expect(course.modules).toHaveLength(20);
    expect(course.modules.filter((m) => m.access === "free")).toHaveLength(4);
    expect(courseRepository.lessons()).toHaveLength(6);
    for (const m of course.modules)
      for (const id of m.lessonIds)
        expect(courseRepository.lesson(id)?.moduleId).toBe(m.id);
  });
  it("keeps IDs unique and every lesson question bilingual", () => {
    const lessons = courseRepository.lessons();
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    const questions = lessons.flatMap((l) => [l.prediction, l.recall]);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const q of questions) {
      expect(q.prompt.en.length).toBeGreaterThan(0);
      expect(q.prompt.pl.length).toBeGreaterThan(0);
      expect(q.options.some((o) => o.id === q.answer)).toBe(true);
    }
  });
  it("never advertises coming-soon courses as playable", () => {
    for (const c of courseRepository.list().filter((c) => c.status === "soon"))
      expect(c.modules).toHaveLength(0);
  });
});
