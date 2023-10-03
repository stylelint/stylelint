'use strict';

const valueParser = require('postcss-value-parser');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const hasValidHex = require('../../utils/hasValidHex.cjs');
const isHexColor = require('../../utils/isHexColor.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'color-hex-alpha';

const messages = ruleMessages(ruleName, {
	expected: (hex) => `Expected alpha channel in "${hex}"`,
	unexpected: (hex) => `Unexpected alpha channel in "${hex}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-hex-alpha',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!hasValidHex(decl.value)) return;

			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (isUrlFunction(node)) return false;

				if (!isHexColor(node)) return;

				const { value } = node;

				if (primary === 'always' && hasAlphaChannel(value)) return;

				if (primary === 'never' && !hasAlphaChannel(value)) return;

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + value.length;

				report({
					message: primary === 'never' ? messages.unexpected : messages.expected,
					messageArgs: [value],
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
 * @param {import('postcss-value-parser').Node} node
 */
function isUrlFunction({ type, value }) {
	return type === 'function' && value === 'url';
}

/**
 * @param {string} hex
 */
function hasAlphaChannel(hex) {
	return hex.length === 5 || hex.length === 9;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;