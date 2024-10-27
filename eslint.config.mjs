import importPlugin from 'eslint-plugin-import';
import stylelintConfig from 'eslint-config-stylelint';
import stylelintJestConfig from 'eslint-config-stylelint/jest';

export default [
	{
		ignores: ['**/*.cjs', '.coverage/*'],
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
			'import/extensions': ['error', 'ignorePackages'],
		},
	},
];
