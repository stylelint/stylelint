import fg from 'fast-glob';

const inputFiles = fg.globSync([
	'lib/**/*.mjs',
	'!**/__tests__/**',
	'!lib/testUtils/**',

	// NOTE: We cannot support CJS for `cli.mjs` since the `meow` dependency is pure ESM.
	'!lib/cli.mjs',
]);

export default inputFiles.map((input) => {
	return {
		input,
		output: {
			format: 'cjs',
			file: input.replace('.mjs', '.cjs'),
			generatedCode: 'es2015',
		},
	};
});
