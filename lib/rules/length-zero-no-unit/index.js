// @ts-nocheck

'use strict';

const valueParser = require('postcss-value-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isCustomProperty = require('../../utils/isCustomProperty');
const isMathFunction = require('../../utils/isMathFunction');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setAtRuleParams = require('../../utils/setAtRuleParams');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'length-zero-no-unit';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected unit',
});

function rule(primary, secondary, context) {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
			},
			{
				actual: secondary,
				possible: {
					ignore: ['custom-properties'],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		let needsFix;

		function check(node, nodeIndex, valueNode) {
			const { value, sourceIndex } = valueNode;

			if (isMathFunction(valueNode)) return false;

			if (isWord(valueNode)) return;

			const numberUnit = valueParser.unit(value);

			if (numberUnit === false) return;

			const { number, unit } = numberUnit;

			if (unit === '') return;

			if (!isLength(unit)) return;

			if (isFraction(unit)) return;

			if (isZero(number)) return;

			if (context.fix) {
				valueNode.value = number;
				needsFix = true;

				return;
			}

			report({
				index: nodeIndex + sourceIndex + number.length,
				message: messages.rejected,
				node,
				result,
				ruleName,
			});
		}

		function checkAtRule(node, value, set, getIndex) {
			if (!isStandardSyntaxAtRule(node)) return;

			needsFix = false;

			const parsedValue = valueParser(value);

			parsedValue.walk((valueNode) => {
				return check(node, getIndex(node), valueNode);
			});

			if (needsFix) {
				set(node, parsedValue.toString());
			}
		}

		function checkDecl(node, value, set, getIndex) {
			needsFix = false;

			const { prop } = node;

			if (isLineHeight(prop)) return;

			if (optionsMatches(secondary, 'ignore', 'custom-properties') && isCustomProperty(prop))
				return;

			const parsedValue = valueParser(value);

			parsedValue.walk((valueNode, valueNodeIndex, valueNodes) => {
				if (isLineHeightValue(node, valueNodes, valueNodeIndex)) return;

				return check(node, getIndex(node), valueNode);
			});

			if (needsFix) {
				set(node, parsedValue.toString());
			}
		}

		root.walkAtRules((atRule) =>
			checkAtRule(atRule, getAtRuleParams(atRule), setAtRuleParams, atRuleParamIndex),
		);
		root.walkDecls((decl) =>
			checkDecl(decl, getDeclarationValue(decl), setDeclarationValue, declarationValueIndex),
		);
	};
}

function isLineHeightValue({ prop }, nodes, index) {
	return (
		prop.toLowerCase() === 'font' &&
		index > 0 &&
		nodes[index - 1].type === 'div' &&
		nodes[index - 1].value === '/'
	);
}

function isLineHeight(prop) {
	return prop.toLowerCase() === 'line-height';
}

function isWord({ type }) {
	return type !== 'word';
}

function isLength(unit) {
	return keywordSets.lengthUnits.has(unit.toLowerCase());
}

function isFraction(unit) {
	return unit.toLowerCase() === 'fr';
}

function isZero(number) {
	return Number.parseFloat(number) !== 0;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
