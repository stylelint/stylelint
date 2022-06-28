'use strict';

const valueParser = require('postcss-value-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isCustomProperty = require('../../utils/isCustomProperty');
const isMathFunction = require('../../utils/isMathFunction');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const { lengthUnits } = require('../../reference/units');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setAtRuleParams = require('../../utils/setAtRuleParams');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'length-zero-no-unit';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected unit',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/length-zero-no-unit',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['custom-properties'],
					ignoreFunctions: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		let needsFix;

		/**
		 * @param {import('postcss').Node} node
		 * @param {number} nodeIndex
		 * @param {import('postcss-value-parser').Node} valueNode
		 */
		function check(node, nodeIndex, valueNode) {
			const { value, sourceIndex } = valueNode;

			if (isMathFunction(valueNode)) return false;

			if (isFunction(valueNode) && optionsMatches(secondaryOptions, 'ignoreFunctions', value))
				return false;

			if (!isWord(valueNode)) return;

			const numberUnit = valueParser.unit(value);

			if (numberUnit === false) return;

			const { number, unit } = numberUnit;

			if (unit === '') return;

			if (!isLength(unit)) return;

			if (isFraction(unit)) return;

			if (!isZero(number)) return;

			if (context.fix) {
				let regularNumber = number;

				if (regularNumber.startsWith('.')) {
					regularNumber = number.slice(1);
				}

				valueNode.value = regularNumber;
				needsFix = true;

				return;
			}

			const index = nodeIndex + sourceIndex + number.length;
			const endIndex = index + unit.length;

			report({
				index,
				endIndex,
				message: messages.rejected,
				node,
				result,
				ruleName,
			});
		}

		/**
		 * @param {import('postcss').AtRule} node
		 */
		function checkAtRule(node) {
			if (!isStandardSyntaxAtRule(node)) return;

			needsFix = false;

			const index = atRuleParamIndex(node);
			const parsedValue = valueParser(getAtRuleParams(node));

			parsedValue.walk((valueNode) => check(node, index, valueNode));

			if (needsFix) {
				setAtRuleParams(node, parsedValue.toString());
			}
		}

		/**
		 * @param {import('postcss').Declaration} node
		 */
		function checkDecl(node) {
			needsFix = false;

			const { prop } = node;

			if (isLineHeight(prop)) return;

			if (isFlex(prop)) return;

			if (optionsMatches(secondaryOptions, 'ignore', 'custom-properties') && isCustomProperty(prop))
				return;

			const index = declarationValueIndex(node);
			const parsedValue = valueParser(getDeclarationValue(node));

			parsedValue.walk((valueNode, valueNodeIndex, valueNodes) => {
				if (isLineHeightValue(node, valueNodes, valueNodeIndex)) return;

				return check(node, index, valueNode);
			});

			if (needsFix) {
				setDeclarationValue(node, parsedValue.toString());
			}
		}

		root.walkAtRules(checkAtRule);
		root.walkDecls(checkDecl);
	};
};

/**
 * @param {import('postcss').Declaration} decl
 * @param {import('postcss-value-parser').Node[]} nodes
 * @param {number} index
 */
function isLineHeightValue({ prop }, nodes, index) {
	const lastNode = nodes[index - 1];

	return (
		prop.toLowerCase() === 'font' && lastNode && lastNode.type === 'div' && lastNode.value === '/'
	);
}

/**
 * @param {string} prop
 */
function isLineHeight(prop) {
	return prop.toLowerCase() === 'line-height';
}

/**
 * @param {string} prop
 */
function isFlex(prop) {
	return prop.toLowerCase() === 'flex';
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isWord({ type }) {
	return type === 'word';
}

/**
 * @param {string} unit
 */
function isLength(unit) {
	return lengthUnits.has(unit.toLowerCase());
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isFunction({ type }) {
	return type === 'function';
}

/**
 * @param {string} unit
 */
function isFraction(unit) {
	return unit.toLowerCase() === 'fr';
}

/**
 * @param {string} number
 */
function isZero(number) {
	return Number.parseFloat(number) === 0;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
