import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import { courseStudyContent } from "../src/content/study-content";
import { courseRepository } from "../src/services/courses";
import type { Localized } from "../src/domain/models";

function expectLocalized(value: Localized, label: string) {
  expect(value.en.trim(), `${label} EN`).not.toBe("");
  expect(value.pl.trim(), `${label} PL`).not.toBe("");
  expect(value.en, `${label} EN placeholder`).not.toMatch(/\bTODO\b/i);
  expect(value.pl, `${label} PL placeholder`).not.toMatch(/\bTODO\b/i);
}

describe("study content quality", () => {
  it("has unique IDs and complete bilingual copy", () => {
    const globalSectionIds = new Set<string>();
    const globalCardIds = new Set<string>();

    for (const [course, content] of Object.entries(courseStudyContent)) {
      for (const section of content.knowledge) {
        expect(globalSectionIds.has(section.id), `duplicate section ${section.id}`).toBe(false);
        globalSectionIds.add(section.id);
        expectLocalized(section.title, `${course}/${section.id}/title`);
        expectLocalized(section.lead, `${course}/${section.id}/lead`);
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(2);
        expect(section.bullets.length).toBeGreaterThanOrEqual(3);
        section.paragraphs.forEach((item, index) =>
          expectLocalized(item, `${course}/${section.id}/paragraph-${index}`),
        );
        section.bullets.forEach((item, index) =>
          expectLocalized(item, `${course}/${section.id}/bullet-${index}`),
        );
        expectLocalized(section.rule, `${course}/${section.id}/rule`);
        expectLocalized(section.pitfall, `${course}/${section.id}/pitfall`);
        if (section.code) expectLocalized(section.code.label, `${course}/${section.id}/code-label`);
      }

      for (const card of content.flashcards) {
        expect(globalCardIds.has(card.id), `duplicate flashcard ${card.id}`).toBe(false);
        globalCardIds.add(card.id);
        expectLocalized(card.front, `${course}/${card.id}/front`);
        expectLocalized(card.back, `${course}/${card.id}/back`);
        expectLocalized(card.tag, `${course}/${card.id}/tag`);
        if (card.why) expectLocalized(card.why, `${course}/${card.id}/why`);
      }
    }
  });

  it("keeps the major libraries substantial", () => {
    expect(courseStudyContent.javascript.knowledge.length).toBeGreaterThanOrEqual(16);
    expect(courseStudyContent.typescript.knowledge.length).toBeGreaterThanOrEqual(16);
    expect(courseStudyContent.react.knowledge.length).toBeGreaterThanOrEqual(16);
    expect(courseStudyContent.ai.knowledge.length).toBeGreaterThanOrEqual(18);
    expect(courseStudyContent["it-foundations"].knowledge.length).toBeGreaterThanOrEqual(28);
  });

  it("parses JavaScript, TypeScript and React knowledge snippets", () => {
    const configs = {
      javascript: { fileName: "sample.js", jsx: ts.JsxEmit.Preserve, allowJs: true },
      typescript: { fileName: "sample.ts", jsx: ts.JsxEmit.Preserve, allowJs: false },
      react: { fileName: "sample.tsx", jsx: ts.JsxEmit.ReactJSX, allowJs: false },
    } as const;

    for (const [course, config] of Object.entries(configs)) {
      for (const section of courseStudyContent[course].knowledge) {
        if (!section.code) continue;
        const result = ts.transpileModule(section.code.value, {
          fileName: config.fileName,
          reportDiagnostics: true,
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
            jsx: config.jsx,
            allowJs: config.allowJs,
          },
        });
        const errors = (result.diagnostics ?? []).filter(
          (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
        );
        expect(
          errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
          `${course}/${section.id} code snippet`,
        ).toEqual([]);
      }
    }
  });

  it("keeps lesson starters and check expressions syntactically valid", () => {
    for (const lesson of courseRepository.lessons()) {
      const extension =
        lesson.exercise.language === "tsx"
          ? "tsx"
          : lesson.exercise.language === "typescript"
            ? "ts"
            : "js";
      const result = ts.transpileModule(lesson.exercise.starter, {
        fileName: `exercise.${extension}`,
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
          allowJs: extension === "js",
        },
      });
      const errors = (result.diagnostics ?? []).filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
      );
      expect(
        errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
        `${lesson.id} starter`,
      ).toEqual([]);

      for (const check of lesson.exercise.tests) {
        expect(() => new Function(`return Boolean(${check.expression});`), `${lesson.id}: ${check.expression}`).not.toThrow();
      }
    }
  });

  it("publishes AI and production IT as available reference courses", () => {
    expect(courseRepository.get("ai")?.status).toBe("available");
    expect(courseRepository.get("it-foundations")?.status).toBe("available");
    expect(courseRepository.get("ai")?.modules.some((module) => module.access === "premium")).toBe(true);
    expect(courseRepository.get("it-foundations")?.modules.some((module) => module.access === "premium")).toBe(true);
  });
});
