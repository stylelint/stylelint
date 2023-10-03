'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const typeGuards = require('../../utils/typeGuards.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'no-invalid-position-at-import-rule';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected invalid position @import rule',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-invalid-position-at-import-rule',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, options) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: options,
				possible: {
					ignoreAtRules: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		let invalidPosition = false;

		root.walk((node) => {
			const nodeName = ('name' in node && node.name && node.name.toLowerCase()) || '';

			if (
				(typeGuards.isAtRule(node) &&
					nodeName !== 'charset' &&
					nodeName !== 'import' &&
					nodeName !== 'layer' &&
					!optionsMatches(options, 'ignoreAtRules', node.name) &&
					isStandardSyntaxAtRule(node)) ||
				(node.type === 'rule' && isStandardSyntaxRule(node))
			) {
				invalidPosition = true;

				return;
			}

			if (typeGuards.isAtRule(node) && nodeName === 'import' && invalidPosition) {
				report({
					message: messages.rejected,
					node,
					result,
					ruleName,
					word: node.toString(),
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
