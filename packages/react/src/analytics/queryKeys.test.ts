import { describe, expect, test } from "vitest";
import { analyticsQueryKeys } from "./queryKeys";

describe("analyticsQueryKeys", () => {
  test("builds a google analytics client id key from app name", () => {
    expect(analyticsQueryKeys.googleAnalyticsClientId("my-app")).toEqual([
      "analytics",
      "googleAnalyticsClientId",
      "my-app",
    ]);
  });

  test("builds an isSupported key", () => {
    expect(analyticsQueryKeys.isSupported()).toEqual([
      "analytics",
      "isSupported",
    ]);
  });
});
