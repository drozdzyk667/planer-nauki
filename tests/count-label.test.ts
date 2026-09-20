import { describe, expect, it } from "vitest";
import { countLabel } from "../src/lib/count-label";

describe("localized count labels", () => {
  it("uses correct Polish noun forms", () => {
    const forms: [string, string, string] = ["lekcja", "lekcje", "lekcji"];
    expect(countLabel("pl", 1, ["lesson", "lessons"], forms)).toBe("lekcja");
    expect(countLabel("pl", 2, ["lesson", "lessons"], forms)).toBe("lekcje");
    expect(countLabel("pl", 4, ["lesson", "lessons"], forms)).toBe("lekcje");
    expect(countLabel("pl", 5, ["lesson", "lessons"], forms)).toBe("lekcji");
    expect(countLabel("pl", 12, ["lesson", "lessons"], forms)).toBe("lekcji");
    expect(countLabel("pl", 22, ["lesson", "lessons"], forms)).toBe("lekcje");
  });

  it("uses singular and plural in English", () => {
    expect(countLabel("en", 1, ["chapter", "chapters"], ["rozdział", "rozdziały", "rozdziałów"])).toBe("chapter");
    expect(countLabel("en", 3, ["chapter", "chapters"], ["rozdział", "rozdziały", "rozdziałów"])).toBe("chapters");
  });
});