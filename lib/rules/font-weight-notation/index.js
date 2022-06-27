'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isNumbery = require('../../utils/isNumbery');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isVariable = require('../../utils/isVariable');
const { fontWeightKeywords, fontWeightRelativeKeywords } = require('../../reference/keywords');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isAtRule } = require('../../utils/typeGuards');

const ruleName = 'font-weight-notation';

const messages = ruleMessages(ruleName, {
	expected: (type) => `Expected ${type} font-weight notation`,
	invalidNamed: (name) => `Unexpected invalid font-weight name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/font-weight-notation',
};

const INHERIT_KEYWORD = 'inherit';
const INITIAL_KEYWORD = 'initial';
const NORMAL_KEYWORD = 'normal';
const WEIGHTS_WITH_KEYWORD_EQUIVALENTS = new Set(['400', '700']);

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['numeric', 'named-where-possible'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['relative'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^font(-weight)?$/i, (decl) => {
			const prop = decl.prop.toLowerCase();

			if (prop === 'font-weight') {
				checkWeight(decl, decl.value);
			} else if (prop === 'font') {
				checkFont(decl);
			}
		});

		/**
		 * @param {import('postcss').Declaration} decl
		 */
		function checkFont(decl) {
			const valueNodes = findFontWeights(decl.value);

			// We do not need to more carefully distinguish font-weight
			// numbers from unitless line-heights because line-heights in
			// `font` values need to be part of a font-size/line-height pair
			const hasNumericFontWeight = valueNodes.some(({ value }) => isNumbery(value));

			for (const valueNode of valueNodes) {
				const value = valueNode.value;
				const lowerValue = value.toLowerCase();

				if (
					(lowerValue === NORMAL_KEYWORD && !hasNumericFontWeight) ||
					isNumbery(value) ||
					(lowerValue !== NORMAL_KEYWORD && fontWeightKeywords.has(lowerValue))
				) {
					checkWeight(decl, value, valueNode);

					return;
				}
			}
		}

		/**
		 * @param {import('postcss').Declaration} decl
		 * @param {string} weightValue
		 * @param {import('postcss-value-parser').Node} [weightValueNode]
		 */
		function checkWeight(decl, weightValue, weightValueNode) {
			if (!isStandardSyntaxValue(weightValue)) {
				return;
			}

			if (isVariable(weightValue)) {
				return;
			}

			if (includesOnlyFunction(weightValue)) {
				return;
			}

			const lowerWeightValue = weightValue.toLowerCase();

			if (lowerWeightValue === INHERIT_KEYWORD || lowerWeightValue === INITIAL_KEYWORD) {
				return;
			}

			if (
				optionsMatches(secondaryOptions, 'ignore', 'relative') &&
				fontWeightRelativeKeywords.has(lowerWeightValue)
			) {
				return;
			}

			if (primary === 'numeric') {
				const parent = decl.parent;

				if (parent && isAtRule(parent) && parent.name.toLowerCase() === 'font-face') {
					// @font-face allows multiple values.
					for (const valueNode of findFontWeights(weightValue)) {
						if (!isNumbery(valueNode.value)) {
							return complain(messages.expected('numeric'), valueNode.value, valueNode);
						}
					}

					return;
				}

				if (!isNumbery(weightValue)) {
					return complain(messages.expected('numeric'), weightValue, weightValueNode);
				}
			}

			if (primary === 'named-where-possible') {
				if (isNumbery(weightValue)) {
					if (WEIGHTS_WITH_KEYWORD_EQUIVALENTS.has(weightValue)) {
						complain(messages.expected('named'), weightValue, weightValueNode);
					}

					return;
				}

				if (!fontWeightKeywords.has(lowerWeightValue) && lowerWeightValue !== NORMAL_KEYWORD) {
					return complain(messages.invalidNamed(weightValue), weightValue, weightValueNode);
				}
			}

			/**
			 * @param {string} message
			 * @param {string} value
			 * @param {import('postcss-value-parser').Node | undefined} valueNode
			 */
			function complain(message, value, valueNode) {
				const index = declarationValueIndex(decl) + (valueNode ? valueNode.sourceIndex : 0);
				const endIndex = index + value.length;

				report({
					ruleName,
					result,
					message,
					node: decl,
					index,
					endIndex,
				});
			}
		}
	};
};

/**
 * @param {string} value
 * @returns {import('postcss-value-parser').Node[]}
 */
function findFontWeights(value) {
	return valueParser(value).nodes.filter((node, index, nodes) => {
		if (node.type !== 'word') return false;

		// Exclude `<font-size>/<line-height>` format like `16px/3`.
		const prevNode = nodes[index - 1];
		const nextNode = nodes[index + 1];

		if (prevNode && prevNode.type === 'div') return false;

		if (nextNode && nextNode.type === 'div') return false;

		return true;
	});
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function includesOnlyFunction(value) {
	return valueParser(value).nodes.every(({ type }) => {
		return type === 'function' || type === 'comment' || type === 'space';
	});
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
