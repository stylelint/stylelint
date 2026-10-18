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
];
