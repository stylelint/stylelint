'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString, assert } = require('../../utils/validateTypes');

const ruleName = 'alpha-value-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/alpha-value-notation',
};

const ALPHA_PROPS = new Set(['opacity', 'shape-image-threshold']);
const ALPHA_FUNCS = new Set(['hsl', 'hsla', 'hwb', 'lab', 'lch', 'rgb', 'rgba']);

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['number', 'percentage'],
			},
			{
				actual: secondaryOptions,
				possible: {
					exceptProperties: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const optionFuncs = Object.freeze({
			number: {
				expFunc: isNumber,
				fixFunc: asNumber,
			},
			percentage: {
				expFunc: isPercentage,
				fixFunc: asPercentage,
			},
		});

		root.walkDecls((decl) => {
			let needsFix = false;
			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				/** @type {import('postcss-value-parser').Node | undefined} */
				let alpha;

				if (ALPHA_PROPS.has(decl.prop.toLowerCase())) {
					alpha = findAlphaInValue(node);
				} else {
					if (node.type !== 'function') return;

					if (!ALPHA_FUNCS.has(node.value.toLowerCase())) return;

					alpha = findAlphaInFunction(node);
				}

				if (!alpha) return;

				const { value } = alpha;

				if (!isStandardSyntaxValue(value)) return;

				if (!isNumber(value) && !isPercentage(value)) return;

				/** @type {'number' | 'percentage'} */
				let expectation = primary;

				if (optionsMatches(secondaryOptions, 'exceptProperties', decl.prop)) {
					if (expectation === 'number') {
						expectation = 'percentage';
					} else if (expectation === 'percentage') {
						expectation = 'number';
					}
				}

				if (optionFuncs[expectation].expFunc(value)) return;

				const fixed = optionFuncs[expectation].fixFunc(value);
				const unfixed = value;

				if (context.fix) {
					alpha.value = String(fixed);
					needsFix = true;

					return;
				}

				report({
					message: messages.expected(unfixed, fixed),
					node: decl,
					index: declarationValueIndex(decl) + alpha.sourceIndex,
					result,
					ruleName,
				});
			});

			if (needsFix) {
				setDeclarationValue(decl, parsedValue.toString());
			}
		});
	};
};

/**
 * @param {string} value
 * @returns {string}
 */
function asPercentage(value) {
	const number = Number(value);

	return `${Number((number * 100).toPrecision(3))}%`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function asNumber(value) {
	const dimension = valueParser.unit(value);

	assert(dimension);

	const number = Number(dimension.number);

	return Number((number / 100).toPrecision(3)).toString();
}

/**
 * @template {import('postcss-value-parser').Node} T
 * @param {T} node
 * @returns {T | undefined}
 */
function findAlphaInValue(node) {
	return node.type === 'word' || node.type === 'function' ? node : undefined;
}

/**
 * @param {import('postcss-value-parser').FunctionNode} node
 * @returns {import('postcss-value-parser').Node | undefined}
 */
function findAlphaInFunction(node) {
	const args = node.nodes.filter(({ type }) => type === 'word' || type === 'function');

	if (args.length === 4) return args[3];

	const slashNodeIndex = node.nodes.findIndex(({ type, value }) => type === 'div' && value === '/');

	if (slashNodeIndex !== -1) {
		const nodesAfterSlash = node.nodes.slice(slashNodeIndex + 1, node.nodes.length);

		return nodesAfterSlash.find(({ type }) => type === 'word');
	}

	return undefined;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isPercentage(value) {
	const dimension = valueParser.unit(value);

	return dimension && dimension.unit === '%';
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isNumber(value) {
	const dimension = valueParser.unit(value);

	return dimension && dimension.unit === '';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
