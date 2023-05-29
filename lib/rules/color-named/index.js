'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const optionsMatches = require('../../utils/optionsMatches');
const { acceptCustomIdentsProperties } = require('../../reference/properties');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const { isRegExp, isString } = require('../../utils/validateTypes');
const { colord } = require('./colordUtils');
const hasNamedColor = require('../../utils/hasNamedColor');
const hasValidHex = require('../../utils/hasValidHex');
const hasColorFunction = require('../../utils/hasColorFunction');
const { namedColorsKeywords } = require('../../reference/keywords');

const ruleName = 'color-named';

const messages = ruleMessages(ruleName, {
	expected: (named, original) => `Expected "${original}" to be "${named}"`,
	rejected: (named) => `Unexpected named color "${named}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-named',
};

// Todo tested on case insensitivity
const NODE_TYPES = new Set(['word', 'function']);

const HAS_GRAY_FUNCTION = /\bgray\(/i;

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['never', 'always-where-possible'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
					ignore: ['inside-function'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (acceptCustomIdentsProperties.has(decl.prop)) {
				return;
			}

			// Return early if the property is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreProperties', decl.prop)) {
				return;
			}

			const { value: declValue } = decl;

			if (primary === 'never' && !hasNamedColor(declValue)) {
				return;
			}

			if (
				primary === 'always-where-possible' &&
				!hasValidHex(declValue) &&
				!hasColorFunction(declValue) &&
				!HAS_GRAY_FUNCTION.test(declValue)
			) {
				return;
			}

			valueParser(declValue).walk((node) => {
				const value = node.value;
				const type = node.type;
				const sourceIndex = node.sourceIndex;

				if (optionsMatches(secondaryOptions, 'ignore', 'inside-function') && type === 'function') {
					return false;
				}

				if (!isStandardSyntaxFunction(node)) {
					return false;
				}

				if (!isStandardSyntaxValue(value)) {
					return;
				}

				// Return early if neither a word nor a function
				if (!NODE_TYPES.has(type)) {
					return;
				}

				// Check for named colors for "never" option
				if (
					primary === 'never' &&
					type === 'word' &&
					namedColorsKeywords.has(value.toLowerCase())
				) {
					complain(
						messages.rejected(value),
						decl,
						declarationValueIndex(decl) + sourceIndex,
						value.length,
					);

					return;
				}

				// Check "always-where-possible" option ...
				if (primary !== 'always-where-possible') {
					return;
				}

				let rawColorString = null;
				let colorString = null;

				if (type === 'function') {
					rawColorString = valueParser.stringify(node);

					// First by checking for alternative color function representations ...
					// Remove all spaces to match what's in `representations`
					colorString = rawColorString.replace(/\s*([,/()])\s*/g, '$1').replace(/\s{2,}/g, ' ');
				} else if (type === 'word' && value.startsWith('#')) {
					// Then by checking for alternative hex representations
					rawColorString = colorString = value;
				} else {
					return;
				}

				const color = colord(colorString);

				if (!color.isValid()) {
					return;
				}

				const namedColor = color.toName();

				if (namedColor && namedColor.toLowerCase() !== 'transparent') {
					complain(
						messages.expected(namedColor, colorString),
						decl,
						declarationValueIndex(decl) + sourceIndex,
						rawColorString.length,
					);
				}
			});
		});

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {number} length
		 */
		function complain(message, node, index, length) {
			report({
				result,
				ruleName,
				message,
				node,
				index,
				endIndex: index + length,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
