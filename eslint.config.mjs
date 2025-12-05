import importPlugin from 'eslint-plugin-import';
import stylelintConfig from 'eslint-config-stylelint';
import stylelintJestConfig from 'eslint-config-stylelint/jest';

export default [
	{
		ignores: ['.coverage/**', 'tmp/**'],
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
			'jest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['testFn'] }],
		},
	},
];
