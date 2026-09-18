import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalProgressRepository } from "@/services/progress";
import { emptyProgress } from "@/domain/models";
describe("local progress repository", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("round-trips progress and handles missing data", () => {
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    });
    const repo = new LocalProgressRepository();
    expect(repo.load()).toEqual(emptyProgress());
    const p = {
      ...emptyProgress(),
      xp: 80,
      completed: { variables: "2026-09-18T12:00:00Z" },
    };
    expect(repo.save(p)).toBe(true);
    expect(repo.load()).toEqual(p);
  });
  it("recovers from corrupt data without crashing", () => {
    vi.stubGlobal("localStorage", { getItem: () => "{invalid" });
    expect(new LocalProgressRepository().load()).toEqual(emptyProgress());
  });
  it("returns a save failure if browser storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
    });
    const repo = new LocalProgressRepository();
    expect(repo.load()).toEqual(emptyProgress());
    expect(repo.save(emptyProgress())).toBe(false);
  });
});
