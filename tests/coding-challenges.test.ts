import { describe, expect, it } from "vitest";
import {
  codingChallengeCount,
  generateCodingChallenge,
  type CodingCourse,
} from "../src/domain/coding-challenges";
import { exerciseSchema } from "../src/domain/models";

const courses: CodingCourse[] = ["javascript", "typescript", "react"];

describe("coding challenge generator", () => {
  it("is deterministic for the same course, template and seed", () => {
    const first = generateCodingChallenge("javascript", 0, 42);
    const second = generateCodingChallenge("javascript", 0, 42);
    expect(second).toEqual(first);
  });

  it("changes generated variants when the seed changes", () => {
    const first = generateCodingChallenge("javascript", 0, 1);
    const second = generateCodingChallenge("javascript", 0, 2);
    expect(second.id).not.toBe(first.id);
    expect(second.exercise.tests).not.toEqual(first.exercise.tests);
  });

  it("generates valid exercises for every supported course", () => {
    for (const course of courses) {
      expect(codingChallengeCount(course)).toBeGreaterThanOrEqual(4);
      for (let index = 0; index < codingChallengeCount(course); index += 1) {
        const challenge = generateCodingChallenge(course, index, 7);
        expect(exerciseSchema.safeParse(challenge.exercise).success).toBe(true);
        expect(challenge.templateId).toBeTruthy();
      }
    }
  });
});
