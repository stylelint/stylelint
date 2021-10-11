/**
 * This file is never executed. It's just here to check that the type
 * definitions for this package are correct when the lint:types script is run.
 *
 * If the type definitions are correct, the script should pass. If they are not,
 * it should fail.
 */

import type {
	LinterOptions,
	FormatterType,
	LintResult,
	LinterResult,
	Plugin,
	Warning,
} from 'stylelint';
import stylelint from 'stylelint';

const options: Partial<LinterOptions> = {
	allowEmptyInput: true,
	code: 'div { color: red }',
	files: ['**/**.scss'],
	formatter: 'json',
	globbyOptions: {
		cwd: './',
	},
	cache: true,
	cacheLocation: './stylelint.cache.json',
	ignoreDisables: true,
	reportDescriptionlessDisables: true,
	reportInvalidScopeDisables: true,
	reportNeedlessDisables: true,
	ignorePath: 'foo',
	customSyntax: 'postcss-scss',
	syntax: 'scss', // Removed but still accepted in type definition
	config: {
		overrides: [
			{
				files: ['**/*.scss'],
				customSyntax: 'postcss-scss',
			},
		],
	},
};

stylelint.lint(options).then((x: LinterResult) => {
	const err: boolean = x.errored;
	const output: string = x.output;
	const results: LintResult[] = x.results;
	if (results.length > 0) {
		const warnings: Warning[] = results[0].warnings;
	}
});

const formatter: FormatterType = 'json';

const ruleName = 'sample-rule';
const messages = stylelint.utils.ruleMessages(ruleName, {
	violation: 'This a rule violation message',
	warning: (reason: string) => `This is not allowed because ${reason}`,
});
const violationMessage: string = messages.violation;
const violationFunc: (reason: string) => string = messages.warning;

const testPlugin: Plugin = (options) => {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, { actual: options });
		if (!validOptions) {
			return;
		}

		stylelint.utils.checkAgainstRule(
			{
				ruleName: 'at-rule-empty-line-before',
				ruleSettings: ['always'],
				root,
			},
			(warning) => {
				stylelint.utils.report({
					ruleName,
					result,
					message: messages.warning(warning.text),
					node: root,
					index: 1,
					word: 'foo',
					line: 2,
				});
			},
		);
	};
};

stylelint.createPlugin(ruleName, testPlugin);
