'use strict';

const validateOptions = require('../../utils/validateOptions');
const ruleMessages = require('../../utils/ruleMessages');
const valueParser = require('postcss-value-parser');
// @ts-expect-error -- TS7016
const Color = require('colorjs.io').default;
const report = require('../../utils/report');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const { isAtRule } = require('../../utils/typeGuards');
const declarationValueIndex = require('../../utils/declarationValueIndex');

const ruleName = 'color-no-out-gamut-range';

const messages = ruleMessages(ruleName, {
	rejected: (color) => `Unexpected color out of gamut range "${color}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/color-no-out-gamut-range',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const parsedValue = valueParser(getDeclarationValue(decl));

			// ignore css variable declaration
			if (decl.prop.startsWith('--')) return;

			// ignore scss variable declaration
			if (decl.prop.startsWith('$')) return;

			parsedValue.walk((node) => {
				if (node.type !== 'function') return;

				if (
					node.value !== 'lch' &&
					node.value !== 'lab' &&
					node.value !== 'oklch' &&
					node.value !== 'oklab'
				)
					return;

				const isInSrgbGamut = new Color(node.value, getColorCoordinates(node)).inGamut('srgb');

				if (isInSrgbGamut) return;

				let isInColorGamutP3MediaQuery;

				if (decl.parent && decl.parent.parent && isAtRule(decl.parent.parent)) {
					isInColorGamutP3MediaQuery = decl.parent.parent.params === '(color-gamut: p3)';
				}

				if (isInColorGamutP3MediaQuery) return;

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + decl.value.length;

				report({
					message: messages.rejected(decl.value),
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').FunctionNode} node
 * @returns {Array<number>}
 */
function getColorCoordinates(node) {
	return node.nodes.filter((n) => n.type === 'word').map((n) => Number(n.value.replace('%', '')));
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
