import { describe, it, expect } from "@jest/globals";

const {
  buildSafeRegex,
  parsePagination,
  parseSort,
  parseBoolean,
  escapeRegex,
} = await import("../../../utils/queryHelpers.js");

describe("queryHelpers utility", () => {
  it("escapes regex special characters safely", () => {
    expect(escapeRegex("Sci-Fi (2024)?")).toBe("Sci-Fi \\(2024\\)\\?");
  });

  it("builds safe regex patterns for contains and exact matches", () => {
    expect(buildSafeRegex("Spider-Man").test("spider-man")).toBe(true);
    expect(buildSafeRegex("Spider-Man", "exact").test("Spider-Man")).toBe(true);
    expect(buildSafeRegex("Spider-Man", "exact").test("spider-man")).toBe(true);
    expect(buildSafeRegex("Spider-Man", "exact").test("Iron-Man")).toBe(false);
  });

  it("normalizes pagination values and caps limits", () => {
    expect(parsePagination({ page: "2", limit: "15" })).toEqual({
      page: 2,
      limit: 15,
      skip: 15,
    });

    expect(parsePagination({ page: "0", limit: "9999" }, 20)).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
    });
  });

  it("builds a valid sort object and only allows known fields", () => {
    expect(parseSort({ sortBy: "rating", order: "desc" })).toEqual({
      rating: -1,
    });

    expect(parseSort({ sortBy: "password", order: "asc" })).toEqual({
      createdAt: 1,
    });
  });

  it("converts query string booleans to real booleans", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("yes")).toBeUndefined();
  });
});
