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

			// TODO: Remove this config after dropping the Node.js 20 support, since newer versions support them officially.
			'n/no-unsupported-features/node-builtins': [
				'error',
				{ ignores: ['import.meta.dirname', 'import.meta.filename'] },
			],
		},
	},
];
