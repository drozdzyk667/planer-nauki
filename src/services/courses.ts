import { courses, lessons, quizzes, conceptNames } from "@/content/curriculum";
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
class StaticCourseRepository implements CourseRepository {
  private courses = courses.map((c) => courseSchema.parse(c));
  private content = lessons.map((l) => lessonSchema.parse(l));
  private quizzes = quizzes.map((q) => quizSchema.parse(q));
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
  conceptNames[id] ?? { en: id, pl: id };
