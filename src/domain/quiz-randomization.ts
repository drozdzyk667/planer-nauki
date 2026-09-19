import type { Question } from "./models";

function hash(value: string) {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function random(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string) {
  const result = [...items];
  const next = random(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectCheckpointQuestions(
  questions: readonly Question[],
  moduleId: string,
  attempt: number,
  recentQuestionIds: readonly string[] = [],
  weakConcepts: readonly string[] = [],
  count = 8,
) {
  const shuffled = seededShuffle(questions, `${moduleId}:${attempt}:questions`);

  if (attempt === 0)
    return shuffled.slice(0, Math.min(count, shuffled.length));

  const recent = new Set(recentQuestionIds);
  const weak = new Set(weakConcepts);

  return shuffled
    .map((question, index) => ({
      question,
      index,
      priority:
        (weak.has(question.concept) ? 4 : 0) +
        (!recent.has(question.id) ? 2 : 0),
    }))
    .sort((a, b) => b.priority - a.priority || a.index - b.index)
    .slice(0, Math.min(count, shuffled.length))
    .map(({ question }) => question);
}

export function shuffleQuestionOptions(question: Question, seed?: string) {
  if (!seed) return question.options;
  return seededShuffle(question.options, `${seed}:${question.id}:options`);
}
