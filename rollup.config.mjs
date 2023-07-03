import fg from 'fast-glob';

const inputFiles = fg.globSync(['lib/**/*.mjs', '!**/__tests__/**', '!lib/testUtils/**']);

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
