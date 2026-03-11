import valueParser from 'postcss-value-parser';

import {
	lightnessColorFunctions,
	lightnessZeroToHundredColorFunctions,
	lightnessZeroToOneColorFunctions,
} from '../../reference/functions.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'lightness-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/lightness-notation',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['percentage', 'number'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!mayIncludeRegexes.lightnessColorFunction.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (node.type !== 'function') return;

				const functionName = node.value.toLowerCase();

				if (!lightnessColorFunctions.has(functionName)) return;

				const lightness = findLightness(node);

				if (!lightness) return;

				const { value: unfixedValue } = lightness;

				if (!isStandardSyntaxValue(unfixedValue)) return;

				const dimension = valueParser.unit(unfixedValue);

				if (!dimension) return;

				const isPercentage = dimension.unit === `%`;
				const isNumber = dimension.unit === '';

				if (!isPercentage && !isNumber) return;

				if (primary === 'percentage' && isPercentage) return;

				if (primary === 'number' && isNumber) return;

				const fixedValue =
					primary === 'percentage'
						? asPercentage(unfixedValue, functionName)
						: asNumber(unfixedValue, functionName);
				const valueIndex = declarationValueIndex(decl);
				const fix = () => {
					lightness.value = fixedValue;
					setDeclarationValue(decl, parsedValue.toString());
				};

				report({
					message: messages.expected,
					messageArgs: [unfixedValue, fixedValue],
					node: decl,
					index: valueIndex + lightness.sourceIndex,
					endIndex: valueIndex + lightness.sourceEndIndex,
					result,
					ruleName,
					fix: {
						apply: fix,
						node: decl,
					},
				});
			});
		});
	};
};

/**
 * @param {string} value
 * @param {import('postcss-value-parser').FunctionNode['value']} func
 */
function asPercentage(value, func) {
	let num = Number.parseFloat(value);

	if (lightnessZeroToHundredColorFunctions.has(func)) {
		return `${num}%`;
	}

	if (lightnessZeroToOneColorFunctions.has(func)) {
		num *= 100;
	}

	if (Number.isInteger(num)) {
		return `${num}%`;
	}

	return `${roundToNumberOfDigits(num, value)}%`;
}

/**
 * @param {string} value
 * @param {import('postcss-value-parser').FunctionNode['value']} func
 */
function asNumber(value, func) {
	let num = Number.parseFloat(value);

	if (lightnessZeroToOneColorFunctions.has(func)) {
		num /= 100;

		return `${roundToNumberOfDigits(num, value)}`;
	}

	return `${num}`;
}

/**
 * @param {number} num
 * @param {string} value
 * @returns {string}
 */
function roundToNumberOfDigits(num, value) {
	if (num === 0) return '0';

	const precision = value.replaceAll('%', '').replaceAll('.', '').length;

	if (precision === 0) return `${num}`;

	return num.toPrecision(precision).replace(/\.?0+$/, ''); // trim trailing zeros and decimal point
}

/**
 * @param {import('postcss-value-parser').FunctionNode} node
 */
function findLightness({ nodes }) {
	const args = nodes.filter(({ type }) => type === 'word' || type === 'function');
	const isRelativeColor = args[0]?.value.toLowerCase() === 'from';

	return isRelativeColor ? args[2] : args[0];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
