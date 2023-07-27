import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import { rmSync } from 'node:fs';

import fg from 'fast-glob';

const inputFiles = fg.globSync([
	'lib/**/*.mjs',
	'!**/__tests__/**',
	'!lib/testUtils/**',

	// NOTE: We cannot support CJS for `cli.mjs` since the `meow` dependency is pure ESM.
	'!lib/cli.mjs',
]);

// clean up
for (const input of inputFiles) {
	rmSync(input.replace('.mjs', '.cjs'), { force: true });
}

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default inputFiles.map((input) => {
	return {
		input,
		output: {
			format: 'cjs',
			dir: rootDir,
			entryFileNames: ({ facadeModuleId }) => {
				return relative(rootDir, facadeModuleId).replace('.mjs', '.cjs');
			},
			generatedCode: {
				preset: 'es2015',
				symbols: false,
			},
			interop: 'default',
			esModule: false,
			preserveModules: true,
		},
	};
});