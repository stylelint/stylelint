'use strict';

const _ = require('lodash');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-max-empty-lines';

const messages = ruleMessages(ruleName, {
	expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
});

function rule(max, options, context) {
	const maxAdjacentNewlines = max + 1;

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: max,
			possible: _.isNumber,
		});

		if (!validOptions) {
			return;
		}

		const violatedCRLFNewLinesRegex = new RegExp(`(?:\r\n){${maxAdjacentNewlines + 1},}`);
		const violatedLFNewLinesRegex = new RegExp(`\n{${maxAdjacentNewlines + 1},}`);
		const allowedLFNewLinesString = context.fix ? '\n'.repeat(maxAdjacentNewlines) : '';
		const allowedCRLFNewLinesString = context.fix ? '\r\n'.repeat(maxAdjacentNewlines) : '';

		root.walkRules((rule) => {
			const selector = rule.raws.selector ? rule.raws.selector.raw : rule.selector;

			if (context.fix) {
				const newSelectorString = selector
					.replace(new RegExp(violatedLFNewLinesRegex, 'gm'), allowedLFNewLinesString)
					.replace(new RegExp(violatedCRLFNewLinesRegex, 'gm'), allowedCRLFNewLinesString);

				if (rule.raws.selector) {
					rule.raws.selector.raw = newSelectorString;
				} else {
					rule.selector = newSelectorString;
				}
			} else if (
				violatedLFNewLinesRegex.test(selector) ||
				violatedCRLFNewLinesRegex.test(selector)
			) {
				report({
					message: messages.expected(max),
					node: rule,
					index: 0,
					result,
					ruleName,
				});
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
