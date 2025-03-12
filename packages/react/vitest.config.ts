import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    fileParallelism: false,
    coverage: {
      provider: "istanbul",
    },
    alias: {
      "~/testing-utils": path.resolve(__dirname, "./vitest/utils"),
      "@/dataconnect/default-connector": path.resolve(
        __dirname,
        "../../dataconnect-sdk/js/default-connector"
      ),
    },
  },
});
