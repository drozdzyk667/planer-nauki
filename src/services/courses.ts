import {
  courses as foundationCourses,
  lessons as foundationLessons,
  quizzes as foundationQuizzes,
  conceptNames as foundationConceptNames,
} from "@/content/curriculum";
import {
  modernCourses,
  modernLessons,
  modernQuizzes,
  modernConceptNames,
} from "@/content/modern-courses";
import { platformCourses } from "@/content/platform-courses";
import {
  courseSchema,
  lessonSchema,
  quizSchema,
  type Course,
  type Lesson,
  type Quiz,
} from "@/domain/models";
export interface CourseRepository {
  list(): Course[];
  get(slug: string): Course | undefined;
  lesson(id: string): Lesson | undefined;
  quiz(moduleId: string): Quiz | undefined;
  lessons(): Lesson[];
}
const replacementCourses = [...modernCourses, ...platformCourses];
const replacements = new Map(
  replacementCourses.map((course) => [course.id, course]),
);
const foundationCourseIds = new Set(foundationCourses.map((course) => course.id));
const allCourses = [
  ...foundationCourses.map((course) => replacements.get(course.id) ?? course),
  ...replacementCourses.filter((course) => !foundationCourseIds.has(course.id)),
];
const allLessons = [...foundationLessons, ...modernLessons];
const allQuizzes = [...foundationQuizzes, ...modernQuizzes];
const allConceptNames: Record<string, { en: string; pl: string }> = {
  ...foundationConceptNames,
  ...modernConceptNames,
};

class StaticCourseRepository implements CourseRepository {
  private courses = allCourses.map((c) => courseSchema.parse(c));
  private content = allLessons.map((l) => lessonSchema.parse(l));
  private quizzes = allQuizzes.map((q) => quizSchema.parse(q));
  list() {
    return this.courses;
  }
  get(slug: string) {
    return this.courses.find((c) => c.slug === slug);
  }
  lesson(id: string) {
    return this.content.find((l) => l.id === id);
  }
  lessons() {
    return this.content;
  }
  quiz(moduleId: string) {
    return this.quizzes.find((q) => q.moduleId === moduleId);
  }
}
export const courseRepository: CourseRepository = new StaticCourseRepository();
export const conceptLabel = (id: string) =>
  allConceptNames[id] ?? { en: id, pl: id };
