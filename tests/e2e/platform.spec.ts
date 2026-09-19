import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { courseRepository } from "../../src/services/courses";
import type { Question } from "../../src/domain/models";
import {
  selectCheckpointQuestions,
  shuffleQuestionOptions,
} from "../../src/domain/quiz-randomization";
const root = "";
async function expectAccessible(page: Page, label = "Learning state") {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    label,
  ).toEqual([]);
}
const solutions: Record<string, string> = {
  variables: "let score = 10;\nscore = 20;\nconsole.log(score);",
  constants:
    'const language = "JavaScript";\nlet completed = 0;\ncompleted = 1;\nconsole.log(language, completed);',
  types: 'const age = 25;\nconst name = "Ada";\nconst isReady = true;',
  operators:
    'const price = "12";\nconst quantity = 3;\nconst total = Number(price) * quantity;\nconsole.log(total);',
  conditions:
    'const score = 75;\nlet result = "";\nif (score >= 60) { result = "Pass"; } else { result = "Try again"; }\nconsole.log(result);',
  "first-program": 'const greeting = "Hello!";\nconsole.log(greeting);',
};
async function answerQuestion(
  page: Page,
  question: Question,
  locale: "en" | "pl",
  correct = true,
) {
  const option =
    question.options.find((item) =>
      correct ? item.id === question.answer : item.id !== question.answer,
    ) ?? question.options[0];
  await page
    .getByRole("radio", { name: option.text[locale], exact: true })
    .check();
  await page
    .getByRole("button", {
      name: locale === "en" ? "Check answer" : "Sprawdź odpowiedź",
      exact: true,
    })
    .click();
}
async function answer(page: Page, index: number) {
  await page.getByRole("radio").nth(index).check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
}
async function completeLesson(page: Page, id: string) {
  await page.goto(`${root}/en/learn/${id}/`);
  const lesson = courseRepository.lesson(id)!;
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await answerQuestion(page, lesson.prediction, "en");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const editor = page.locator(".cm-content");
  await editor.fill(solutions[id]);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByText("All checks passed. You made it work."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await answerQuestion(page, lesson.recall, "en");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(
    page.getByText("Lesson complete", { exact: true }),
  ).toBeVisible();
}

test("full variables module, checkpoint, XP persistence and retry protection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${root}/en/`);
  await page
    .getByRole("link", { name: "Start learning for free", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/courses\/javascript\/?$/);
  for (const id of ["variables", "constants", "types"])
    await completeLesson(page, id);
  await page
    .getByRole("link", { name: "Continue to checkpoint", exact: true })
    .click();
  const checkpoint = courseRepository.quiz("variables-types")!;
  const checkpointQuestions = selectCheckpointQuestions(
    checkpoint.questions,
    "variables-types",
    0,
  );
  for (const [i, question] of checkpointQuestions.entries()) {
    const options = shuffleQuestionOptions(question, "variables-types:0");
    const correctIndex = options.findIndex(
      (option) => option.id === question.answer,
    );
    await answer(page, correctIndex);
    await page
      .getByRole("button", {
        name:
          i === checkpointQuestions.length - 1 ? "See my results" : "Next",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Beautifully done." }),
  ).toBeVisible();
  await expect(page.locator(".reward-large")).toHaveText("+100 XP");
  await expectAccessible(page, "Checkpoint results");
  await page.goto(`${root}/en/dashboard/`);
  await expect(page.locator(".stat").first()).toContainText("340");
  await page.reload();
  await expect(page.locator(".stat").first()).toContainText("340");
  await completeLesson(page, "variables");
  await expect(page.locator(".reward-large")).toHaveText("+0 XP");
  await page.goto(`${root}/en/courses/javascript/`);
  await page
    .getByRole("button", { name: "Functions — Locked — Premium", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectAccessible(page, "Premium dialog");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("all other free modules execute real code", async ({ page }) => {
  for (const id of ["first-program", "operators", "conditions"])
    await completeLesson(page, id);
});

test("runtime errors, infinite loop timeout, DOM isolation and recovery", async ({
  page,
}) => {
  await page.goto(`${root}/en/learn/variables/`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await answer(page, 1);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const editor = page.locator(".cm-content");
  await editor.fill("while (true) {}");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByText(
      "The program took too long. Check for a loop that never stops.",
    ),
  ).toBeVisible();
  await editor.fill("console.log(document.cookie);");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByText("The code could not run.", { exact: false }),
  ).toBeVisible();
  await editor.fill(solutions.variables);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByText("All checks passed. You made it work."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(editor).toContainText("score = 20");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  await editor.fill("while (true) {}");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await editor.fill(solutions.variables);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByText("All checks passed. You made it work."),
  ).toBeVisible();
});

test("language and explicit themes persist across navigation and reload", async ({
  page,
}) => {
  await page.goto(`${root}/en/courses/`);
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("link", { name: "Zmień język na polski" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Wielkie pomysły",
  );
  await page.goto(`${root}/`);
  await expect(page).toHaveURL(/\/pl\/?$/);
  await page.getByRole("button", { name: "Ciemny", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("Polish lesson flow and helpful wrong-answer feedback", async ({
  page,
}) => {
  await page.goto(`${root}/pl/learn/variables/`);
  const lesson = courseRepository.lesson("variables")!;
  await page.getByRole("button", { name: "Kontynuuj", exact: true }).click();
  await answerQuestion(page, lesson.prediction, "pl", false);
  await expect(page.getByText("Jeszcze nie — sprawdź dlaczego.")).toBeVisible();
  await page.getByRole("button", { name: "Kontynuuj", exact: true }).click();
  await page.locator(".cm-content").fill(solutions.variables);
  await page.getByRole("button", { name: "Uruchom kod", exact: true }).click();
  await expect(page.getByText("Wszystko działa. Udało Ci się.")).toBeVisible();
  await page.getByRole("button", { name: "Kontynuuj", exact: true }).click();
  await answerQuestion(page, lesson.recall, "pl");
  await page.getByRole("button", { name: "Gotowe", exact: true }).click();
  await expect(
    page.getByText("Lekcja ukończona", { exact: true }),
  ).toBeVisible();
  await page.goto(`${root}/pl/review/`);
  await page
    .getByRole("button", { name: "Zacznij krótką powtórkę", exact: true })
    .click();
  await page.getByRole("radio").nth(1).check();
  await page
    .getByRole("button", { name: "Sprawdź odpowiedź", exact: true })
    .click();
  await page.getByRole("button", { name: "Gotowe", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Krótka praktyka, mocniejsze podstawy.",
    }),
  ).toBeVisible();
});

test("corrupted storage and unavailable checkpoint remain usable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("nuvecto.progress.v1", "{broken"),
  );
  await page.goto(`${root}/en/dashboard/`);
  await expect(page.locator('.feedback[role="alert"]')).toContainText(
    "Progress could not",
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto(`${root}/en/checkpoint/variables-types/`);
  await expect(
    page.getByText(
      "Complete the lessons in this module to open the checkpoint.",
    ),
  ).toBeVisible();
});

test("keyboard navigation, dialog focus and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${root}/en/`);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Play explanation" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Step", exact: true }).click();
  await expect(page.locator(".visual-code")).toContainText("score = 20;");
  await page.goto(`${root}/en/courses/javascript/`);
  const trigger = page.getByRole("button", {
    name: "Functions — Locked — Premium",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Keep learning for free" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

for (const width of [375, 430, 768, 1024, 1440])
  test(`responsive layouts have no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/en/",
      "/pl/courses/",
      "/pl/courses/javascript/",
      "/en/learn/variables/",
      "/pl/dashboard/",
      "/pl/review/",
    ]) {
      await page.goto(`${root}${route}`);
      if (width === 375 && route === "/en/")
        await page.screenshot({ path: "test-results/mobile-hero.png" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      if (overflow)
        console.log(
          "Overflow elements",
          await page.locator("body *").evaluateAll((elements) =>
            elements
              .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
              .map((e) => ({
                tag: e.tagName,
                class: e.className,
                right: e.getBoundingClientRect().right,
              }))
              .slice(0, 15),
          ),
        );
      if (width === 375 || width === 768 || width === 1440)
        await page.screenshot({
          path: `test-results/preview-${width}-${route.replaceAll("/", "-")}.png`,
          fullPage: true,
        });
      expect(overflow, route).toBe(false);
    }
    await page.screenshot({
      path: `test-results/preview-${width}.png`,
      fullPage: true,
    });
  });

for (const theme of ["dark", "light"])
  test(`major screens pass automated accessibility checks in ${theme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      (value) => localStorage.setItem("nuvecto.theme", value),
      theme,
    );
    for (const route of [
      "/en/",
      "/pl/courses/",
      "/en/courses/javascript/",
      "/pl/learn/variables/",
      "/en/dashboard/",
      "/pl/review/",
    ]) {
      await page.goto(`${root}${route}`);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await expectAccessible(page, `${theme} ${route}`);
      if (route === "/en/")
        await page.screenshot({
          path: `test-results/preview-${theme}.png`,
          fullPage: true,
        });
    }
    await page.goto(`${root}/en/learn/variables/`);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await answer(page, 0);
    await expectAccessible(page, `${theme} question feedback`);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.locator(".cm-content").fill(solutions.variables);
    await page.getByRole("button", { name: "Run code", exact: true }).click();
    await expect(
      page.getByText("All checks passed. You made it work."),
    ).toBeVisible();
    await expectAccessible(page, `${theme} code editor and test results`);
    await page.screenshot({
      path: `test-results/preview-editor-${theme}.png`,
      fullPage: true,
    });
  });

test("celebration bursts can stop and replay, and respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await completeLesson(page, "first-program");
  await expect(page.locator(".celebration-particles i")).toHaveCount(72);
  await page
    .getByRole("button", { name: "Stop animation", exact: true })
    .click();
  await expect(page.locator(".celebration-particles")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Celebrate again", exact: true })
    .click();
  await expect(page.locator(".celebration-particles i")).toHaveCount(72);
  await page.screenshot({
    path: "test-results/celebration.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".celebration-particles")).toBeHidden();
  await expect(
    page.getByText("You did it. One step further!", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Celebrate again", exact: true }),
  ).toHaveCount(0);
});

test("supporting labels stay readable and the theme picker works with a keyboard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`${root}/pl/courses/`);
  const smallText = await page
    .locator(".badge, .eyebrow, .course-card p, .footer-links")
    .evaluateAll((elements) =>
      elements
        .map((element) => ({
          text: element.textContent,
          size: parseFloat(getComputedStyle(element).fontSize),
        }))
        .filter((item) => item.size < 14),
    );
  expect(smallText).toEqual([]);
  const light = page.getByRole("button", { name: "Jasny", exact: true });
  await light.focus();
  await page.keyboard.press("Enter");
  await expect(light).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Ciemny", exact: true }),
  ).toBeFocused();
});
