'use strict';

const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isAtRule } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

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
					ignoreAtRules: [isString, isRegExp],
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
				(isAtRule(node) &&
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

			if (isAtRule(node) && nodeName === 'import' && invalidPosition) {
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
