import { describe, expect, test } from "vitest";
import { deepEqual } from "./utils";

describe("utils", () => {
  test("should compare native types correctly", () => {
    const nonEqualNumbers = deepEqual(1, 2);
    expect(nonEqualNumbers).to.eq(false);
    const equalNumbers = deepEqual(2, 2);
    expect(equalNumbers).to.eq(true);
    const nonEqualBools = deepEqual(false, true);
    expect(nonEqualBools).to.eq(false);
    const equalBools = deepEqual(false, false);
    expect(equalBools).to.eq(true);
    const nonEqualStrings = deepEqual("a", "b");
    expect(nonEqualStrings).to.eq(false);
    const equalStrings = deepEqual("a", "a");
    expect(equalStrings).to.eq(true);
  });
  test("should compare object types correctly", () => {
    const equalNulls = deepEqual(null, null);
    expect(equalNulls).to.eq(true);
    const nonEqualNulls = deepEqual(null, {});
    expect(nonEqualNulls).to.eq(false);
    const nonEqualObjects = deepEqual({}, { a: "b" });
    expect(nonEqualObjects).to.eq(false);
    const equalObjects = deepEqual({ a: "b" }, { a: "b" });
    expect(equalObjects).to.eq(true);
    const equalObjectsWithOrder = deepEqual(
      { a: "b", b: "c" },
      { b: "c", a: "b" },
    );
    expect(equalObjectsWithOrder).to.eq(true);
    const nestedObjects = deepEqual(
      { a: { movie_insert: "b" } },
      { a: { movie_insert: "c" } },
    );
    expect(nestedObjects).to.eq(false);
  });
  test("should compare arrays correctly", () => {
    const emptyArrays = deepEqual([], []);
    expect(emptyArrays).to.eq(true);
    const nonEmptyArrays = deepEqual([1], [1]);
    expect(nonEmptyArrays).to.eq(true);
    const nonEmptyDiffArrays = deepEqual([2], [1]);
    expect(nonEmptyDiffArrays).to.eq(false);
  });
});
