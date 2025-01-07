import { defineConfig } from "tsup";

const supportedPackages = ['data-connect', 'firestore', 'auth'];
export default defineConfig({
	entry: [`src/(${supportedPackages.join('|')})/index.ts`, 'src/index.ts'],
	format: ["esm"],
	dts: true, // generates .d.ts files
	outDir: "dist",
	esbuildOptions(options, context) {
		options.outbase = './src';
	},
	// splitting: false, // Disable code splitting to generate distinct files
	clean: true,
});
