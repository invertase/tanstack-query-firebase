import { defineConfig } from "tsup";
import * as fs from 'node:fs/promises';
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
	async onSuccess() {
		try {
			await fs.copyFile('./package.json', './dist/package.json');
			await fs.copyFile('./README.md', './dist/README.md');
			await fs.copyFile('./LICENSE', './dist/LICENSE');
		} catch (e) {
			console.error(`Error copying files: ${e}`);
		}
	}
});
