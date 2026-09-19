import { z } from "zod";
export const textSchema = z.object({
  en: z.string().min(1),
  pl: z.string().min(1),
});
export type Localized = z.infer<typeof textSchema>;
export const T = (en: string, pl: string): Localized => ({ en, pl });
const optionSchema = z.object({ id: z.string(), text: textSchema });
export const questionSchema = z
  .object({
    id: z.string(),
    concept: z.string(),
    type: z.enum(["singleChoice", "predictOutput", "trueFalse"]),
    prompt: textSchema,
    code: z.string().optional(),
    options: z.array(optionSchema).min(2),
    answer: z.string(),
    explanation: textSchema,
  })
  .refine((q) => q.options.some((o) => o.id === q.answer), "Answer must exist");
export type Question = z.infer<typeof questionSchema>;
// Other question kinds can be added as discriminated schemas when their renderer is implemented.
export type FutureQuestionKind =
  | "multipleChoice"
  | "fillCode"
  | "orderCode"
  | "findBug"
  | "writeCode"
  | "shortAnswer";
export const exerciseSchema = z.object({
  task: textSchema,
  starter: z.string(),
  hint: textSchema,
  mode: z.enum(["runtime", "source"]).optional(),
  language: z.enum(["javascript", "typescript", "tsx"]).optional(),
  fileName: z.string().optional(),
  tests: z
    .array(z.object({ label: textSchema, expression: z.string() }))
    .min(1),
});
export type Exercise = z.infer<typeof exerciseSchema>;
export const drillSchema = z.object({
  prompt: textSchema,
  hint: textSchema,
  answer: textSchema,
  code: z.string().optional(),
});
export type Drill = z.infer<typeof drillSchema>;
export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), heading: textSchema, body: textSchema }),
  z.object({ type: z.literal("code"), code: z.string(), caption: textSchema }),
  z.object({ type: z.literal("tip"), body: textSchema }),
  z.object({ type: z.literal("fact"), title: textSchema, body: textSchema }),
  z.object({
    type: z.literal("riddle"),
    title: textSchema,
    prompt: textSchema,
    answer: textSchema,
  }),
  z.object({
    type: z.literal("visual"),
    kind: z.enum([
      "execution",
      "variable",
      "constant",
      "types",
      "operators",
      "condition",
    ]),
    caption: textSchema,
  }),
]);
export const lessonSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  moduleId: z.string(),
  title: textSchema,
  subtitle: textSchema,
  minutes: z.number().positive(),
  concept: z.string(),
  blocks: z.array(blockSchema),
  prediction: questionSchema,
  exercise: exerciseSchema,
  recall: questionSchema,
  drills: z.array(drillSchema).optional(),
});
export type Lesson = z.infer<typeof lessonSchema>;
export const moduleSchema = z.object({
  id: z.string(),
  title: textSchema,
  description: textSchema,
  access: z.enum(["free", "premium"]),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  lessonIds: z.array(z.string()),
  minutes: z.number().nonnegative(),
});
export type CourseModule = z.infer<typeof moduleSchema>;
export const courseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: textSchema,
  short: z.string(),
  description: textSchema,
  category: z.enum(["all", "web", "data", "ai"]),
  status: z.enum(["available", "soon"]),
  color: z.string(),
  modules: z.array(moduleSchema),
});
export type Course = z.infer<typeof courseSchema>;
export const quizSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  questions: z.array(questionSchema).min(1),
});
export type Quiz = z.infer<typeof quizSchema>;
export const conceptSchema = z.object({
  attempts: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  mastery: z.number().min(0).max(100),
  lastSeen: z.string(),
  nextReview: z.string(),
});
export type Concept = z.infer<typeof conceptSchema>;
export const progressSchema = z.object({
  version: z.literal(1),
  xp: z.number().int().nonnegative(),
  completed: z.record(z.string(), z.string()),
  quizBest: z.record(z.string(), z.number().min(0).max(100)),
  quizAttempts: z.record(z.string(), z.number().int().nonnegative()),
  concepts: z.record(z.string(), conceptSchema),
  learningDays: z.array(z.string()),
  reviewRewards: z.array(z.string()),
  favoriteFlashcards: z.array(z.string()).default([]),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
      correct: z.boolean(),
      at: z.string(),
    }),
  ),
});
export type Progress = z.infer<typeof progressSchema>;
export const emptyProgress = (): Progress => ({
  version: 1,
  xp: 0,
  completed: {},
  quizBest: {},
  quizAttempts: {},
  concepts: {},
  learningDays: [],
  reviewRewards: [],
  favoriteFlashcards: [],
  answers: [],
});
