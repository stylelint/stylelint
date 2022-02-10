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
	url: 'https://stylelint.io/user-guide/rules/list/media-feature-parentheses-space-inside',
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
			/** @type {Array<{ message: string, index: number, endIndex: number }>} */
			const problems = [];

			const parsedParams = valueParser(params).walk((node) => {
				if (node.type === 'function') {
					const len = valueParser.stringify(node).length;

					if (primary === 'never') {
						const beforeMatch = /[ \t]+/.exec(node.before);

						if (beforeMatch) {
							if (context.fix) node.before = '';

							const index = node.sourceIndex + 1 + indexBoost;
							const endIndex = index + beforeMatch[0].length;

							problems.push({ message: messages.rejectedOpening, index, endIndex });
						}

						const afterMatch = /[ \t]+/.exec(node.after);

						if (afterMatch) {
							if (context.fix) node.after = '';

							const endIndex = node.sourceIndex + len + indexBoost - 1;
							const index = endIndex - afterMatch[0].length;

							problems.push({
								message: messages.rejectedClosing,
								index,
								endIndex,
							});
						}
					} else if (primary === 'always') {
						if (node.before === '') {
							if (context.fix) node.before = ' ';

							const firstNode = node.nodes[0];
							const index = node.sourceIndex + 1 + indexBoost;
							const endIndex = firstNode ? indexBoost + node.nodes[0].sourceEndIndex : index + 1;

							problems.push({
								message: messages.expectedOpening,
								index,
								endIndex,
							});
						}

						if (node.after === '') {
							if (context.fix) node.after = ' ';

							const lastNode = node.nodes[node.nodes.length - 1];
							const endIndex = node.sourceIndex + len + indexBoost - 1;
							const index = lastNode ? lastNode.sourceIndex + indexBoost : endIndex - 1;

							problems.push({
								message: messages.expectedClosing,
								index,
								endIndex,
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

				for (const { message, index, endIndex } of problems) {
					report({ message, node: atRule, index, endIndex, result, ruleName });
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
