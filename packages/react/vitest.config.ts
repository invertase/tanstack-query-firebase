import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
    },
    alias: {
      "~/testing-utils": path.resolve(__dirname, "./vitest/utils"),
      "@/dataconnect/default-connector": path.resolve(
        __dirname,
        "../../dataconnect-sdk/js/default-connector",
      ),
    },
  },
});
