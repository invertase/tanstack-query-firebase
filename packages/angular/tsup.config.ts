import { defineConfig } from "tsup";

const supportedPackages = ['data-connect'];
export default defineConfig({
	entry: [`src/data-connect/index.ts`, 'src/index.ts'],
	format: ["esm"],
	dts: true, // generates .d.ts files
	outDir: "./dist",
	clean: true,
	esbuildOptions(options) {
		options.outbase = './src';
	},
});
