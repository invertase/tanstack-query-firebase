import * as path from "path";
import { defineConfig } from "vitest/config";

import packageJson from "./package.json";

export default defineConfig({
  resolve: {
    alias: {
      "~/testing-utils": path.resolve(__dirname, "../../vitest/utils"),
      "@/dataconnect/default-connector": path.resolve(
        __dirname,
        "../../dataconnect-sdk/js/default-connector",
      ),
    },
  },
  test: {
    fakeTimers: {
      toFake: ["setTimeout", "clearTimeout", "Date"],
    },
    name: packageJson.name,
    dir: "./src",
    watch: false,
    environment: "happy-dom",
    setupFiles: ["test-setup.ts"],
    coverage: { enabled: true, provider: "istanbul", include: ["src/**/*"] },
    typecheck: { enabled: true },
    globals: true,
    restoreMocks: true,
  },
});
