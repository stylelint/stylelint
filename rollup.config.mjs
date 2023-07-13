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

export default inputFiles.map((input) => {
	return {
		input,
		output: {
			format: 'cjs',
			file: input.replace('.mjs', '.cjs'),
			generatedCode: 'es2015',
			interop: 'auto',
		},
	};
});
