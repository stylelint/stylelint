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
	Rule,
	RuleBase,
	RuleMeta,
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
	ignorePath: ['foo'],
	customSyntax: 'postcss-scss',
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
	const firstResult: LintResult | undefined = results[0];
	if (firstResult) {
		const warnings: Warning[] = firstResult.warnings;
	}
});

stylelint.resolveConfig('path').then((config) => stylelint.lint({ config }));

stylelint.resolveConfig('path', { config: options }).then((config) => stylelint.lint({ config }));

stylelint
	.resolveConfig('path', { configBasedir: 'path' })
	.then((config) => stylelint.lint({ config }));

stylelint
	.resolveConfig('path', { configFile: 'path' })
	.then((config) => stylelint.lint({ config }));

stylelint.resolveConfig('path', { cwd: 'path' }).then((config) => stylelint.lint({ config }));

stylelint
	.resolveConfig('path', {
		config: options,
		configBasedir: 'path',
		configFile: 'path',
		cwd: 'path',
	})
	.then((config) => stylelint.lint({ config }));

const formatter: FormatterType = 'json';

const ruleName = 'sample-rule';
const messages = stylelint.utils.ruleMessages(ruleName, {
	problem: 'This a rule problem message',
	warning: (reason) => `This is not allowed because ${reason}`,
	withNarrowedParam: (mixinName: string) => `Mixin not allowed: ${mixinName}`,
});
const meta: RuleMeta = { url: '...' };
const problemMessage: string = messages.problem;
const problemFunc: (...reason: string[]) => string = messages.warning;

const testRule: RuleBase = (option) => {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, { actual: option });
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

(testRule as Rule).ruleName = ruleName;
(testRule as Rule).messages = messages;
(testRule as Rule).primaryOptionArray = true;
(testRule as Rule).meta = meta;

stylelint.createPlugin(ruleName, testRule as Rule);

messages.withNarrowedParam('should work');

// @ts-expect-error Boolean should not be allowed here.
messages.withNarrowedParam(true);
// @ts-expect-error Expected a required parameter.
messages.withNarrowedParam();

// For non-explicit parameters, boolean, strings etc. are always allowed.
// Not `null` for example though.
messages.warning(true);
messages.warning('some string');

// @ts-expect-error Null is not allowed in `RuleMessageFunc` parameters.
messages.warning(null);

const shorthandSubProps: ReadonlySet<string> | undefined =
	stylelint.reference.longhandSubPropertiesOfShorthandProperties.get('border-color');
// @ts-expect-error -- Readonly.
shorthandSubProps.clear();
// @ts-expect-error -- Readonly.
stylelint.reference.longhandSubPropertiesOfShorthandProperties.clear();
// @ts-expect-error -- Unknown key.
stylelint.reference.longhandSubPropertiesOfShorthandProperties.get('unknown-property');
