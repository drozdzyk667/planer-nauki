import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import { courseStudyContent } from "../src/content/study-content";
import { courseRepository } from "../src/services/courses";
import {
  glossaryFor,
  glossaryHighlightPlan,
  glossaryMatches,
  glossaryTerms,
} from "../src/content/glossary";
import { glossaryTermsForSection } from "../src/content/glossary-context";
import {
  fundamentalsDomains,
  fundamentalsDomainFor,
  fundamentalsLevel,
} from "../src/content/fundamentals";
import type { Localized } from "../src/domain/models";
import {
  codingChallengeCount,
  generateCodingChallenge,
  type CodingCourse,
} from "../src/domain/coding-challenges";

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
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(4);
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
        if (section.id === "ts-compiler") {
          expect(
            () => JSON.parse(section.code!.value),
            `${course}/${section.id} JSON snippet`,
          ).not.toThrow();
          continue;
        }
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
      if (lesson.exercise.fileName?.endsWith(".json")) {
        expect(
          () => JSON.parse(lesson.exercise.starter),
          `${lesson.id} JSON starter`,
        ).not.toThrow();
      } else {
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
      }

      for (const check of lesson.exercise.tests) {
        expect(() => new Function(`return Boolean(${check.expression});`), `${lesson.id}: ${check.expression}`).not.toThrow();
      }
    }
  });


  it("keeps the glossary bilingual, unique and available for every study course", () => {
    const ids = new Set<string>();
    for (const term of glossaryTerms) {
      expect(ids.has(term.id), `duplicate glossary term ${term.id}`).toBe(false);
      ids.add(term.id);
      expect(term.term.trim()).not.toBe("");
      expectLocalized(term.definition, `glossary/${term.id}/definition`);
      expectLocalized(term.details, `glossary/${term.id}/details`);
      expect(term.details.en.length).toBeGreaterThan(term.definition.en.length + 30);
      expect(term.details.pl.length).toBeGreaterThan(term.definition.pl.length + 30);
      expect(term.details.en.trim()).not.toBe(term.definition.en.trim());
      expect(term.details.pl.trim()).not.toBe(term.definition.pl.trim());
      expect(
        term.details.en.trim().toLocaleLowerCase().startsWith(
          term.definition.en.trim().toLocaleLowerCase(),
        ),
        `glossary/${term.id}/details repeats short EN definition`,
      ).toBe(false);
      expect(
        term.details.pl.trim().toLocaleLowerCase().startsWith(
          term.definition.pl.trim().toLocaleLowerCase(),
        ),
        `glossary/${term.id}/details repeats short PL definition`,
      ).toBe(false);
      if (term.expanded) expectLocalized(term.expanded, `glossary/${term.id}/expanded`);
      expect(term.aliases.length).toBeGreaterThan(0);
    }

    for (const course of ["javascript", "typescript", "react", "ai", "it-foundations"]) {
      expect(glossaryFor(course).length, `${course} glossary size`).toBeGreaterThanOrEqual(15);
    }

    expect(glossaryFor("ai").some((term) => term.id === "mcp")).toBe(true);
    expect(glossaryFor("ai").some((term) => term.id === "rag")).toBe(true);
    expect(glossaryFor("it-foundations").some((term) => term.id === "http2")).toBe(true);
    expect(glossaryFor("it-foundations").some((term) => term.id === "kubernetes")).toBe(true);
  });

  it("matches glossary terms as whole concepts, not substrings", () => {
    const paintMatches = glossaryMatches(
      "it-foundations",
      "CSS controls style, layout and paint in the browser.",
    );
    expect(paintMatches.some((match) => match.term.id === "ai")).toBe(false);

    const exactMatches = glossaryMatches(
      "it-foundations",
      "AI can call an API over HTTP/2.",
    ).map((match) => match.term.id);
    expect(exactMatches).toContain("ai");
    expect(exactMatches).toContain("api");
    expect(exactMatches).toContain("http2");

    const polishPreposition = glossaryMatches(
      "it-foundations",
      "Cache'owanie prywatnych danych pod współdzielonym kluczem może wyciekać.",
    );
    expect(polishPreposition.some((match) => match.term.id === "pod")).toBe(false);

    const kubernetesPod = glossaryMatches(
      "it-foundations",
      "Pod receives traffic only when it is ready.",
    );
    expect(kubernetesPod.some((match) => match.term.id === "pod")).toBe(true);
  });

  it("uses lesson context instead of annotating every matching dictionary word", () => {
    expect(glossaryTermsForSection("it-kubernetes")).toContain("pod");
    expect(glossaryTermsForSection("it-redis-cache")).not.toContain("pod");
    expect(glossaryTermsForSection("react-effects")).toContain("effect");

    const plan = glossaryHighlightPlan(
      "it-foundations",
      [
        {
          key: "copy",
          text: "Cache'owanie danych pod współdzielonym kluczem może wyciekać między użytkownikami.",
        },
      ],
      [],
      8,
      glossaryTermsForSection("it-redis-cache"),
    );
    expect(plan.copy).toContain("cache");
    expect(plan.copy).not.toContain("pod");
  });

  it("highlights a glossary concept only on its first useful occurrence per page", () => {
    const entries = [
      { key: "lead", text: "DNS resolves a hostname before the request starts." },
      { key: "body", text: "DNS answers can be cached. DNS uses records." },
    ];
    const plan = glossaryHighlightPlan("it-foundations", entries);
    expect(plan.lead).toContain("dns");
    expect(plan.body).not.toContain("dns");

    const explainedOnPage = glossaryHighlightPlan(
      "it-foundations",
      entries,
      ["dns"],
    );
    expect(explainedOnPage.lead).not.toContain("dns");
    expect(explainedOnPage.body).not.toContain("dns");
  });

  it("keeps IT Fundamentals broad, categorized and levelled", () => {
    const fundamentals = glossaryTerms.filter((term) =>
      term.courses.includes("it-foundations"),
    );
    expect(fundamentals.length).toBeGreaterThanOrEqual(120);
    expect(fundamentalsDomains.length).toBeGreaterThanOrEqual(12);

    for (const domain of fundamentalsDomains) {
      const available = domain.termIds.filter((id) =>
        fundamentals.some((term) => term.id === id),
      );
      expect(available.length, domain.id).toBeGreaterThanOrEqual(5);
    }

    for (const term of fundamentals) {
      expect(["fundamentals", "junior", "mid", "advanced"]).toContain(
        fundamentalsLevel(term),
      );
      if (fundamentalsDomainFor(term.id)) {
        expect(fundamentalsDomainFor(term.id)?.termIds).toContain(term.id);
      }
    }
  });

  it("ships a revealable reference answer for every generated coding family", () => {
    for (const course of ["javascript", "typescript", "react"] as CodingCourse[]) {
      for (let index = 0; index < codingChallengeCount(course); index += 1) {
        const challenge = generateCodingChallenge(course, index, 17);
        expect(challenge.exercise.solution, challenge.templateId).toBeTruthy();

        const extension =
          challenge.exercise.language === "tsx"
            ? "tsx"
            : challenge.exercise.language === "typescript"
              ? "ts"
              : "js";
        const result = ts.transpileModule(challenge.exercise.solution!, {
          fileName: `solution.${extension}`,
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
          errors.map((diagnostic) =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
          ),
          `${challenge.templateId} solution`,
        ).toEqual([]);
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
