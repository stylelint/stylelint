import valueParser from 'postcss-value-parser';

import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

import { isValueDiv, isValueFunction, isValueWord } from '../../utils/typeGuards.mjs';

const ruleName = 'shorthand-property-no-redundant-values';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/shorthand-property-no-redundant-values',
	fixable: true,
};

// prettier-ignore
/** @type {ReadonlySet<string>} */
const SUPPORTED_SHORTHANDS = new Set([
	'margin', 'margin-block', 'margin-inline',
	'padding', 'padding-block', 'padding-inline',
	'border-color', 'border-style', 'border-width',
	'border-radius',
	'border-block-color', 'border-block-style', 'border-block-width',
	'border-inline-color', 'border-inline-style', 'border-inline-width',
	'gap', 'grid-gap',
	'overflow',
	'overscroll-behavior',
	'scroll-margin', 'scroll-margin-block', 'scroll-margin-inline',
	'scroll-padding', 'scroll-padding-block', 'scroll-padding-inline',
	'inset', 'inset-block', 'inset-inline',
]);

// prettier-ignore
/** @type {ReadonlySet<string>} */
const FOUR_DIRECTIONAL_SHORTHAND_PROPERTIES = new Set([
	'margin',
	'padding',
	'border-color', 'border-style', 'border-width',
	'scroll-margin', 'scroll-padding',
	'inset',
]);

/**
 * @param {string} top
 * @param {string} right
 * @param {string} bottom
 * @param {string} left
 * @returns {string[]}
 */
function canCondense(top, right, bottom, left) {
	const lowerTop = top.toLowerCase();
	const lowerRight = right.toLowerCase();
	const lowerBottom = bottom && bottom.toLowerCase();
	const lowerLeft = left && left.toLowerCase();

	if (canCondenseToOneValue(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
		return [top];
	}

	if (canCondenseToTwoValues(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
		return [top, right];
	}

	if (canCondenseToThreeValues(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
		return [top, right, bottom];
	}

	return [top, right, bottom, left];
}

/**
 * @param {string} top
 * @param {string} right
 * @param {string} bottom
 * @param {string} left
 * @returns {boolean}
 */
function canCondenseToOneValue(top, right, bottom, left) {
	if (top !== right) {
		return false;
	}

	return (top === bottom && (bottom === left || !left)) || (!bottom && !left);
}

/**
 * @param {string} top
 * @param {string} right
 * @param {string} bottom
 * @param {string} left
 * @returns {boolean}
 */
function canCondenseToTwoValues(top, right, bottom, left) {
	return (top === bottom && right === left) || (top === bottom && !left && top !== right);
}

/**
 * @param {string} _top
 * @param {string} right
 * @param {string} _bottom
 * @param {string} left
 * @returns {boolean}
 */
function canCondenseToThreeValues(_top, right, _bottom, left) {
	return right === left;
}

/**
 * Split the `border-radius` value into horizontal and vertical radius arrays.
 *
 * @param {string} value
 * @returns {{ horizontal: string[]; vertical: string[]; sawSlash: boolean, horizontalHasVar: boolean, verticalHasVar: boolean }}
 */
function splitBorderRadius(value) {
	/** @type {string[]} */
	const horizontal = [];
	/** @type {string[]} */
	const vertical = [];
	let sawSlash = false;

	let horizontalHasVar = false;
	let verticalHasVar = false;

	for (const node of valueParser(value).nodes) {
		// Handle dividers: we only care about the slash
		if (isValueDiv(node)) {
			if (node.value === '/') {
				sawSlash = true;
				continue;
			}

			// Any other divider means we cannot safely lint
			return {
				horizontal: [],
				vertical: [],
				sawSlash: false,
				horizontalHasVar: false,
				verticalHasVar: false,
			};
		}

		if (isVarFunction(node)) {
			if (sawSlash) {
				verticalHasVar = true;
			} else {
				horizontalHasVar = true;
			}
		}

		if (isValueWord(node) || isValueFunction(node)) {
			const token = valueParser.stringify(node);

			if (sawSlash) {
				vertical.push(token);
			} else {
				horizontal.push(token);
			}
		}
	}

	return { horizontal, vertical, sawSlash, horizontalHasVar, verticalHasVar };
}

/**
 * Process the `border-radius` value when a slash is present.
 *
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Declaration} decl
 * @param {string[]} horizontal
 * @param {string[]} vertical
 * @param {boolean} horizontalHasVar
 * @param {boolean} verticalHasVar
 */
function processBorderRadiusValue(
	result,
	decl,
	horizontal,
	vertical,
	horizontalHasVar,
	verticalHasVar,
) {
	const [h1 = '', h2 = '', h3 = '', h4 = ''] = horizontal;
	const [v1 = '', v2 = '', v3 = '', v4 = ''] = vertical;

	// Skip condensation on the side containing `var()`, condense the other.
	const condensedHorizontal = horizontalHasVar
		? horizontal.join(' ')
		: canCondense(h1, h2, h3, h4).filter(Boolean).join(' ');
	const condensedVertical = verticalHasVar
		? vertical.join(' ')
		: canCondense(v1, v2, v3, v4).filter(Boolean).join(' ');

	const shortestFormString = `${condensedHorizontal} / ${condensedVertical}`.trim();
	const valueLower = decl.value.trim().toLowerCase().replace(/\s+/g, ' ');
	const shortestLower = shortestFormString.toLowerCase();

	if (valueLower === shortestLower) return; // Already optimal

	const fix = () => {
		decl.value = shortestFormString;
	};

	const index = declarationValueIndex(decl);
	const endIndex = index + decl.value.length;

	report({
		message: messages.expected,
		messageArgs: [decl.value, shortestFormString],
		node: decl,
		index,
		endIndex,
		result,
		ruleName,
		fix: {
			apply: fix,
			node: decl,
		},
	});
}

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['four-into-three-edge-values'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			const { prop, value } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			const normalizedProp = vendor.unprefixed(prop.toLowerCase());

			if (!SUPPORTED_SHORTHANDS.has(normalizedProp)) return;

			// Special handling for `border-radius` when a slash is present
			if (normalizedProp === 'border-radius') {
				const { horizontal, vertical, sawSlash, horizontalHasVar, verticalHasVar } =
					splitBorderRadius(value);

				if (sawSlash) {
					processBorderRadiusValue(
						result,
						decl,
						horizontal,
						vertical,
						horizontalHasVar,
						verticalHasVar,
					);

					return;
				}
			}

			/** @type {string[]} */
			const valuesToShorthand = [];

			for (const valueNode of valueParser(value).nodes) {
				if (isValueDiv(valueNode)) {
					return;
				}

				// `var()` should be ignored. E.g.
				//
				//   --padding: 20px 5px;
				//   padding: 0 var(--padding) 0;
				//
				if (isVarFunction(valueNode)) {
					return;
				}

				if (isValueWord(valueNode) || isValueFunction(valueNode)) {
					valuesToShorthand.push(valueParser.stringify(valueNode));
				}
			}

			if (valuesToShorthand.length <= 1 || valuesToShorthand.length > 4) {
				return;
			}

			const [first = '', second = '', third = '', fourth = ''] = valuesToShorthand;
			const shortestForm = canCondense(first, second, third, fourth);

			if (optionsMatches(secondaryOptions, 'ignore', 'four-into-three-edge-values')) {
				if (
					FOUR_DIRECTIONAL_SHORTHAND_PROPERTIES.has(normalizedProp) &&
					valuesToShorthand.length === 4 &&
					shortestForm.length === 3
				) {
					return;
				}
			}

			const shortestFormString = shortestForm.filter(Boolean).join(' ');
			const valuesFormString = valuesToShorthand.join(' ');

			if (shortestFormString.toLowerCase() === valuesFormString.toLowerCase()) {
				return;
			}

			const fix = () => {
				decl.value = decl.value.replace(value, shortestFormString);
			};

			const index = declarationValueIndex(decl);
			const endIndex = index + decl.value.length;

			report({
				message: messages.expected,
				messageArgs: [value, shortestFormString],
				node: decl,
				index,
				endIndex,
				result,
				ruleName,
				fix: {
					apply: fix,
					node: decl,
				},
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
