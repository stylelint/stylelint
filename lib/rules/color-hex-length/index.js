'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'color-hex-length';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-hex-length',
	fixable: true,
};

const HEX = /^#[\da-z]+$/i;
const CONTAINS_HEX = /#[\da-z]+/i;
const IGNORED_FUNCTIONS = new Set(['url']);

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['short', 'long'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!CONTAINS_HEX.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));
			let needsFix = false;

			parsedValue.walk((node) => {
				const { value: hexValue } = node;

				if (isIgnoredFunction(node)) return false;

				if (!isHexColor(node)) return;

				if (primary === 'long' && hexValue.length !== 4 && hexValue.length !== 5) {
					return;
				}

				if (primary === 'short' && (hexValue.length < 6 || !canShrink(hexValue))) {
					return;
				}

				const variant = primary === 'long' ? longer : shorter;
				const expectedHex = variant(hexValue);

				if (context.fix) {
					node.value = expectedHex;
					needsFix = true;

					return;
				}

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.expected,
					messageArgs: [hexValue, expectedHex],
					node: decl,
					index,
					endIndex,
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
 * @param {string} hex
 */
function canShrink(hex) {
	hex = hex.toLowerCase();

	return (
		hex[1] === hex[2] &&
		hex[3] === hex[4] &&
		hex[5] === hex[6] &&
		(hex.length === 7 || (hex.length === 9 && hex[7] === hex[8]))
	);
}

/**
 * @param {string} hex
 */
function shorter(hex) {
	let hexVariant = '#';

	for (let i = 1; i < hex.length; i += 2) {
		hexVariant += hex[i];
	}

	return hexVariant;
}

/**
 * @param {string} hex
 */
function longer(hex) {
	let hexVariant = '#';

	for (let i = 1; i < hex.length; i++) {
		hexVariant += hex.charAt(i).repeat(2);
	}

	return hexVariant;
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isIgnoredFunction({ type, value }) {
	return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase());
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isHexColor({ type, value }) {
	return type === 'word' && HEX.test(value);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
