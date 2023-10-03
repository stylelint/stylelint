import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isMathFunction from '../../utils/isMathFunction.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import { lengthUnits } from '../../reference/units.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setAtRuleParams from '../../utils/setAtRuleParams.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'length-zero-no-unit';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected unit',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/length-zero-no-unit',
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
export default rule;
