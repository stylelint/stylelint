import stylelintConfig from 'eslint-config-stylelint';

export default [
	{
		ignores: [
			'.coverage/**',
			'tmp/**',
			'**/.pnp.*',
			'**/.yarn/**',
			'scripts/benchmarking/.workspaces/**',
		],
	},
	...stylelintConfig,
	{
		files: ['**/__tests__/**', '**/*.test.mjs', 'lib/testUtils/**'],
		rules: {
			'n/no-unsupported-features/node-builtins': [
				'error',
				{
					ignores: [
						// eslint-plugin-n doesn't know the Node.js 22.17 backport that made it stable.
						'assert/strict.partialDeepStrictEqual',
						// Release candidate.
						'module.registerHooks',
					],
				},
			],
		},
	},
];
