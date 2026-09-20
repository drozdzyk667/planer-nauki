import {
  emptyProgress,
  progressSchema,
  type Progress,
  type Question,
} from "@/domain/models";
import {
  lessonReward,
  localDay,
  quizReward,
  updateConcept,
} from "@/domain/learning";
export interface ProgressRepository {
  load(): Progress;
  save(progress: Progress): boolean;
}
const KEY = "nuvecto.progress.v1";
let warning = false;
export class LocalProgressRepository implements ProgressRepository {
  load() {
    try {
      const data = localStorage.getItem(KEY);
      if (!data) return emptyProgress();
      const parsed = progressSchema.safeParse(JSON.parse(data));
      if (parsed.success) return parsed.data;
      warning = true;
    } catch {
      warning = true;
    }
    return emptyProgress();
  }
  save(progress: Progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progressSchema.parse(progress)));
      return true;
    } catch {
      warning = true;
      return false;
    }
  }
}
const repository: ProgressRepository = new LocalProgressRepository();
let state = emptyProgress();
let initialized = false;
const serverState = state;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((fn) => fn());
}
function commit(next: Progress) {
  state = progressSchema.parse(next);
  repository.save(state);
  emit();
}
function active(progress: Progress, now = new Date()) {
  const today = localDay(now);
  return {
    ...progress,
    learningDays: Array.from(new Set([...progress.learningDays, today])),
  };
}
export const progressStore = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    if (!initialized && typeof window !== "undefined") {
      initialized = true;
      state = repository.load();
      queueMicrotask(emit);
    }
    return () => {
      listeners.delete(fn);
    };
  },
  snapshot: () => state,
  serverSnapshot: () => serverState,
  warning: () => warning,
  answer(question: Question, answer: string) {
    const now = new Date();
    const correct = question.answer === answer;
    commit({
      ...active(state, now),
      concepts: {
        ...state.concepts,
        [question.concept]: updateConcept(
          state.concepts[question.concept],
          correct,
          now,
        ),
      },
      answers: [
        ...state.answers.slice(-199),
        { questionId: question.id, answer, correct, at: now.toISOString() },
      ],
    });
    return correct;
  },
  completeLesson(id: string) {
    const reward = lessonReward(state, id);
    commit({
      ...active(state),
      xp: state.xp + reward,
      completed: {
        ...state.completed,
        [id]: state.completed[id] ?? new Date().toISOString(),
      },
    });
    return reward;
  },
  completeQuiz(id: string, score: number) {
    const reward = quizReward(state, id, score);
    commit({
      ...active(state),
      xp: state.xp + reward,
      quizBest: {
        ...state.quizBest,
        [id]: Math.max(score, state.quizBest[id] ?? 0),
      },
      quizAttempts: {
        ...state.quizAttempts,
        [id]: (state.quizAttempts[id] ?? 0) + 1,
      },
    });
    return reward;
  },
  completeCodingChallenge(id: string) {
    const alreadySolved = state.codingSolved.includes(id);
    const reward = alreadySolved ? 0 : 35;
    commit({
      ...active(state),
      xp: state.xp + reward,
      codingSolved: alreadySolved ? state.codingSolved : [...state.codingSolved, id],
    });
    return reward;
  },
  visitKnowledge(courseSlug: string, sectionId: string) {
    const key = `${courseSlug}:${sectionId}`;
    if (state.knowledgeVisited.includes(key)) return false;
    commit({
      ...active(state),
      knowledgeVisited: [...state.knowledgeVisited, key],
    });
    return true;
  },
  toggleFavoriteFlashcard(id: string) {
    const favoriteFlashcards = state.favoriteFlashcards.includes(id)
      ? state.favoriteFlashcards.filter((item) => item !== id)
      : [...state.favoriteFlashcards, id];
    commit({
      ...state,
      favoriteFlashcards,
    });
    return favoriteFlashcards.includes(id);
  },
  review(question: Question, answer: string) {
    const correct = this.answer(question, answer);
    const key = `${localDay()}:${question.concept}`;
    if (correct && !state.reviewRewards.includes(key))
      commit({
        ...state,
        xp: state.xp + 10,
        reviewRewards: [...state.reviewRewards.slice(-399), key],
      });
    return correct;
  },
  reset() {
    warning = false;
    commit(emptyProgress());
  },
};
