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
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const isCustomProperty = require('../../utils/isCustomProperty');

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
			if (!isStandardSyntaxProperty(decl.prop)) return;

			if (isCustomProperty(decl.prop)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node, _index, nodes) => {
				if (node.type !== 'function') return;

				if (
					node.value !== 'lch' &&
					node.value !== 'lab' &&
					node.value !== 'oklch' &&
					node.value !== 'oklab'
				)
					return;

				const isInSrgbGamut = new Color(valueParser.stringify(nodes)).inGamut('srgb');

				if (isInSrgbGamut) return;

				if (isInColorGamutP3MediaQuery(decl)) return;

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
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isInColorGamutP3MediaQuery(decl) {
	if (decl.parent && decl.parent.parent && isAtRule(decl.parent.parent)) {
		const parent = decl.parent.parent;

		return parent.name === 'media' && parent.params === '(color-gamut: p3)';
	}

	return false;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
