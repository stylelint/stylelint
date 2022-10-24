'use strict';

const valueParser = require('postcss-value-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isAtRule } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'number-leading-zero';

const messages = ruleMessages(ruleName, {
	expected: 'Expected a leading zero',
	rejected: 'Unexpected leading zero',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/number-leading-zero',
	fixable: true,
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

		root.walkAtRules((atRule) => {
			if (atRule.name.toLowerCase() === 'import') {
				return;
			}

			check(atRule, atRule.params);
		});

		root.walkDecls((decl) => check(decl, decl.value));

		/**
		 * @param {import('postcss').AtRule | import('postcss').Declaration} node
		 * @param {string} value
		 */
		function check(node, value) {
			/** @type {Array<{ startIndex: number, endIndex: number }>} */
			const neverFixPositions = [];
			/** @type {Array<{ index: number }>} */
			const alwaysFixPositions = [];

			// Get out quickly if there are no periods
			if (!value.includes('.')) {
				return;
			}

			valueParser(value).walk((valueNode) => {
				// Ignore `url` function
				if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
					return false;
				}

				// Ignore strings, comments, etc
				if (valueNode.type !== 'word') {
					return;
				}

				// Check leading zero
				if (primary === 'always') {
					const match = /(?:\D|^)(\.\d+)/.exec(valueNode.value);

					if (match == null || match[0] == null || match[1] == null) {
						return;
					}

					// The regexp above consists of 2 capturing groups (or capturing parentheses).
					// We need the index of the second group. This makes sanse when we have "-.5" as an input
					// for regex. And we need the index of ".5".
					const capturingGroupIndex = match[0].length - match[1].length;

					const index = valueNode.sourceIndex + match.index + capturingGroupIndex;

					if (context.fix) {
						alwaysFixPositions.unshift({
							index,
						});

						return;
					}

					const baseIndex = isAtRule(node) ? atRuleParamIndex(node) : declarationValueIndex(node);

					complain(messages.expected, node, baseIndex + index);
				}

				if (primary === 'never') {
					const match = /(?:\D|^)(0+)(\.\d+)/.exec(valueNode.value);

					if (match == null || match[0] == null || match[1] == null || match[2] == null) {
						return;
					}

					// The regexp above consists of 3 capturing groups (or capturing parentheses).
					// We need the index of the second group. This makes sanse when we have "-00.5"
					// as an input for regex. And we need the index of "00".
					const capturingGroupIndex = match[0].length - (match[1].length + match[2].length);

					const index = valueNode.sourceIndex + match.index + capturingGroupIndex;

					if (context.fix) {
						neverFixPositions.unshift({
							startIndex: index,
							// match[1].length is the length of our matched zero(s)
							endIndex: index + match[1].length,
						});

						return;
					}

					const baseIndex = isAtRule(node) ? atRuleParamIndex(node) : declarationValueIndex(node);

					complain(messages.rejected, node, baseIndex + index);
				}
			});

			if (alwaysFixPositions.length) {
				for (const fixPosition of alwaysFixPositions) {
					const index = fixPosition.index;

					if (isAtRule(node)) {
						node.params = addLeadingZero(node.params, index);
					} else {
						node.value = addLeadingZero(node.value, index);
					}
				}
			}

			if (neverFixPositions.length) {
				for (const fixPosition of neverFixPositions) {
					const startIndex = fixPosition.startIndex;
					const endIndex = fixPosition.endIndex;

					if (isAtRule(node)) {
						node.params = removeLeadingZeros(node.params, startIndex, endIndex);
					} else {
						node.value = removeLeadingZeros(node.value, startIndex, endIndex);
					}
				}
			}
		}

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 */
		function complain(message, node, index) {
			report({
				result,
				ruleName,
				message,
				node,
				index,
			});
		}
	};
};

/**
 * @param {string} input
 * @param {number} index
 * @returns {string}
 */
function addLeadingZero(input, index) {
	// eslint-disable-next-line prefer-template
	return input.slice(0, index) + '0' + input.slice(index);
}

/**
 * @param {string} input
 * @param {number} startIndex
 * @param {number} endIndex
 * @returns {string}
 */
function removeLeadingZeros(input, startIndex, endIndex) {
	return input.slice(0, startIndex) + input.slice(endIndex);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
