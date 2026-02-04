import importPlugin from 'eslint-plugin-import';
import stylelintConfig from 'eslint-config-stylelint';
import stylelintJestConfig from 'eslint-config-stylelint/jest';

export default [
	{
		ignores: ['.coverage/**', 'tmp/**', '**/.pnp.*', '**/.yarn/**'],
	},
	...stylelintConfig,
	...stylelintJestConfig,
	{
		plugins: {
			import: importPlugin,
		},
		languageOptions: {
			globals: {
				testRule: 'readonly',
				testRuleConfigs: 'readonly',
			},
		},
		rules: {
			'import/enforce-node-protocol-usage': ['error', 'always'],
			'import/extensions': ['error', 'ignorePackages'],
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
