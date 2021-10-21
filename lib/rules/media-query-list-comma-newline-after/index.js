'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const mediaQueryListCommaWhitespaceChecker = require('../mediaQueryListCommaWhitespaceChecker');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'media-query-list-comma-newline-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected newline after ","',
	expectedAfterMultiLine: () => 'Expected newline after "," in a multi-line list',
	rejectedAfterMultiLine: () => 'Unexpected whitespace after "," in a multi-line list',
});

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('newline', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'always-multi-line', 'never-multi-line'],
		});

		if (!validOptions) {
			return;
		}

		// Only check for the newline after the comma, while allowing
		// arbitrary indentation after the newline
		/** @type {Map<import('postcss').AtRule, number[]> | undefined} */
		let fixData;

		mediaQueryListCommaWhitespaceChecker({
			root,
			result,
			locationChecker: checker.afterOneOnly,
			checkedRuleName: ruleName,
			allowTrailingComments: primary.startsWith('always'),
			fix: context.fix
				? (atRule, index) => {
						const paramCommaIndex = index - atRuleParamIndex(atRule);

						fixData = fixData || new Map();
						const commaIndices = fixData.get(atRule) || [];

						commaIndices.push(paramCommaIndex);
						fixData.set(atRule, commaIndices);

						return true;
				  }
				: null,
		});

		if (fixData) {
			fixData.forEach((commaIndices, atRule) => {
				let params = atRule.raws.params ? atRule.raws.params.raw : atRule.params;

				commaIndices
					.sort((a, b) => b - a)
					.forEach((index) => {
						const beforeComma = params.slice(0, index + 1);
						const afterComma = params.slice(index + 1);

						if (primary.startsWith('always')) {
							params = /^\s*\n/.test(afterComma)
								? beforeComma + afterComma.replace(/^[^\S\r\n]*/, '')
								: beforeComma + context.newline + afterComma;
						} else if (primary.startsWith('never')) {
							params = beforeComma + afterComma.replace(/^\s*/, '');
						}
					});

				if (atRule.raws.params) {
					atRule.raws.params.raw = params;
				} else {
					atRule.params = params;
				}
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
