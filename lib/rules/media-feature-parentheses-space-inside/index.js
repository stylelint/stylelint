'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'media-feature-parentheses-space-inside';

const messages = ruleMessages(ruleName, {
	expectedOpening: 'Expected single space after "("',
	rejectedOpening: 'Unexpected whitespace after "("',
	expectedClosing: 'Expected single space before ")"',
	rejectedClosing: 'Unexpected whitespace before ")"',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-parentheses-space-inside',
	fixable: true,
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			// If there are comments in the params, the complete string
			// will be at atRule.raws.params.raw
			const params = (atRule.raws.params && atRule.raws.params.raw) || atRule.params;
			const indexBoost = atRuleParamIndex(atRule);
			/** @type {Array<{ message: string, index: number }>} */
			const problems = [];

			const parsedParams = valueParser(params).walk((node) => {
				if (node.type === 'function') {
					const len = valueParser.stringify(node).length;

					if (primary === 'never') {
						if (/[ \t]/.test(node.before)) {
							if (context.fix) node.before = '';

							problems.push({
								message: messages.rejectedOpening,
								index: node.sourceIndex + 1 + indexBoost,
							});
						}

						if (/[ \t]/.test(node.after)) {
							if (context.fix) node.after = '';

							problems.push({
								message: messages.rejectedClosing,
								index: node.sourceIndex - 2 + len + indexBoost,
							});
						}
					} else if (primary === 'always') {
						if (node.before === '') {
							if (context.fix) node.before = ' ';

							problems.push({
								message: messages.expectedOpening,
								index: node.sourceIndex + 1 + indexBoost,
							});
						}

						if (node.after === '') {
							if (context.fix) node.after = ' ';

							problems.push({
								message: messages.expectedClosing,
								index: node.sourceIndex - 2 + len + indexBoost,
							});
						}
					}
				}
			});

			if (problems.length) {
				if (context.fix) {
					atRule.params = parsedParams.toString();

					return;
				}

				for (const err of problems) {
					report({
						message: err.message,
						node: atRule,
						index: err.index,
						result,
						ruleName,
					});
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
