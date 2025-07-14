import * as fs from "node:fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/data-connect/index.ts", "src/index.ts"],
  format: ["esm"],
  dts: true, // generates .d.ts files
  outDir: "./dist",
  clean: true,
  esbuildOptions(options) {
    options.outbase = "./src";
  },
  async onSuccess() {
    try {
      await fs.copyFile("./package.json", "./dist/package.json");
      await fs.copyFile("./README.md", "./dist/README.md");
      await fs.copyFile("./LICENSE", "./dist/LICENSE");
    } catch (e) {
      console.error(`Error copying files: ${e}`);
    }
  },
});
