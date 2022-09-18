'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isNumbery = require('../../utils/isNumbery');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isVariable = require('../../utils/isVariable');
const {
	fontWeightKeywords,
	fontWeightNonNumericKeywords,
	fontWeightRelativeKeywords,
} = require('../../reference/keywords');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'font-weight-notation';

const messages = ruleMessages(ruleName, {
	expected: (type) => `Expected ${type} font-weight notation`,
	invalidNamed: (name) => `Unexpected invalid font-weight name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/font-weight-notation',
	fixable: true,
};

const NORMAL_KEYWORD = 'normal';

const KEYWORD_TO_NUMERIC = new Map([
	['normal', '400'],
	['bold', '700'],
]);
const NUMERIC_TO_KEYWORD = new Map([
	['400', 'normal'],
	['700', 'bold'],
]);

/** @type {import('stylelint').Rule<'numeric' | 'named-where-possible'>} */
const rule = (primary, secondaryOptions, context) => {
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

		const ignoreRelative = optionsMatches(secondaryOptions, 'ignore', 'relative');

		root.walkDecls(/^font(-weight)?$/i, (decl) => {
			const isFontShorthandProp = decl.prop.toLowerCase() === 'font';

			const parsedValue = valueParser(getDeclarationValue(decl));
			const valueNodes = parsedValue.nodes;

			const hasNumericFontWeight = valueNodes.some((node, index, nodes) => {
				return isNumbery(node.value) && !isDivNode(nodes[index - 1]);
			});

			for (const [index, valueNode] of valueNodes.entries()) {
				if (!isPossibleFontWeightNode(valueNode, index, valueNodes)) continue;

				const { value } = valueNode;

				if (isFontShorthandProp) {
					if (value.toLowerCase() === NORMAL_KEYWORD && hasNumericFontWeight) {
						continue; // Not `normal` for font-weight
					}

					if (checkWeight(decl, valueNode)) {
						break; // Stop traverse if font-weight is processed
					}
				}

				checkWeight(decl, valueNode);
			}

			if (context.fix) {
				// Autofix after the loop ends can prevent value nodes from changing their positions during the loop.
				setDeclarationValue(decl, parsedValue.toString());
			}
		});

		/**
		 * @param {import('postcss').Declaration} decl
		 * @param {import('postcss-value-parser').Node} weightValueNode
		 * @returns {true | undefined}
		 */
		function checkWeight(decl, weightValueNode) {
			const weightValue = weightValueNode.value;

			if (!isStandardSyntaxValue(weightValue)) {
				return;
			}

			if (isVariable(weightValue)) {
				return;
			}

			const lowerWeightValue = weightValue.toLowerCase();

			if (ignoreRelative && fontWeightRelativeKeywords.has(lowerWeightValue)) {
				return;
			}

			if (primary === 'numeric') {
				if (!isNumbery(lowerWeightValue) && fontWeightNonNumericKeywords.has(lowerWeightValue)) {
					if (context.fix) {
						const numericValue = KEYWORD_TO_NUMERIC.get(lowerWeightValue);

						if (numericValue) {
							weightValueNode.value = numericValue;

							return true;
						}
					}

					complain(messages.expected('numeric'), weightValueNode);

					return true;
				}
			}

			if (primary === 'named-where-possible') {
				if (isNumbery(lowerWeightValue) && NUMERIC_TO_KEYWORD.has(lowerWeightValue)) {
					if (context.fix) {
						const keyword = NUMERIC_TO_KEYWORD.get(lowerWeightValue);

						if (keyword) {
							weightValueNode.value = keyword;
						}

						return true;
					}

					complain(messages.expected('named'), weightValueNode);

					return true;
				}

				if (
					decl.prop.toLowerCase() === 'font-weight' &&
					!fontWeightKeywords.has(lowerWeightValue) &&
					lowerWeightValue !== NORMAL_KEYWORD
				) {
					complain(messages.invalidNamed(weightValue), weightValueNode);

					return true;
				}
			}

			/**
			 * @param {string} message
			 * @param {import('postcss-value-parser').Node} valueNode
			 */
			function complain(message, valueNode) {
				const index = declarationValueIndex(decl) + valueNode.sourceIndex;
				const endIndex = index + valueNode.value.length;

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
 * @param {import('postcss-value-parser').Node | undefined} node
 * @returns {boolean}
 */
function isDivNode(node) {
	return node !== undefined && node.type === 'div';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @param {number} index
 * @param {import('postcss-value-parser').Node[]} nodes
 * @returns {boolean}
 */
function isPossibleFontWeightNode(node, index, nodes) {
	if (node.type !== 'word') return false;

	// Exclude `<font-size>/<line-height>` format like `16px/3`.
	if (isDivNode(nodes[index - 1])) return false;

	if (isDivNode(nodes[index + 1])) return false;

	return true;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
