import stylelintConfig from 'eslint-config-stylelint';
import stylelintJestConfig from 'eslint-config-stylelint/jest';

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
	...stylelintJestConfig,
	{
		languageOptions: {
			globals: {
				testRule: 'readonly',
				testRuleConfigs: 'readonly',
			},
		},
		rules: {
			'jest/no-standalone-expect': [
				'error',
				{ additionalTestBlockFunctions: ['testFn', 'win32OnlyTest'] },
			],
			'jest/expect-expect': [
				'error',
				{ additionalTestBlockFunctions: ['testFn', 'win32OnlyTest'] },
			],
		},
	},
	{
		files: ['lib/**/*.mjs'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							regex: '^css-tree(?!/dist/csstree\\.esm$)',
							message: "Import 'css-tree/dist/csstree.esm'",
						},
					],
				},
			],
		},
	},
];
