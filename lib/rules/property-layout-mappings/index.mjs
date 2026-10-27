import valueParser from 'postcss-value-parser';

import { assert, isRegExp, isString } from '../../utils/validateTypes.mjs';
import {
	flowRelativeProperties,
	physicalShorthandToFlowRelativePropertiesByAxis,
	physicalToFlowRelativeProperties,
} from '../../reference/properties.mjs';
import { isAtRule, isValueDiv, isValueFunction, isValueWord } from '../../utils/typeGuards.mjs';
import { mayIncludeRegexes, propertyRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import directionFlowToSides from '../../utils/directionFlowToSides.mjs';
import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'property-layout-mappings';

const messages = ruleMessages(ruleName, {
	rejected: (type, property) => `Disallowed ${type} property "${property}"`,
	expected: (actual, expected, alsoExpected) =>
		`Expected "${actual}" to be "${expected}"${alsoExpected ? ` and "${alsoExpected}"` : ''}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-layout-mappings',
	fixable: true,
};

/** @param {import('postcss').Node} node */
function isPageAtRule(node) {
	return isAtRule(node) && node.name.toLowerCase() === 'page';
}

/** @import {Directionality} from 'stylelint' */

/**
 * Builds a physical → flow-relative property map based on the directionality config.
 *
 * @param {{ block: Directionality, inline: Directionality }} directionality
 * @returns {Map<string, string>}
 */
function buildDirectionalMap(directionality) {
	const [blockStart, blockEnd] = directionFlowToSides(directionality.block);
	const [inlineStart, inlineEnd] = directionFlowToSides(directionality.inline);

	const inlineIsHorizontal =
		directionality.inline === 'left-to-right' || directionality.inline === 'right-to-left';

	/** @type {Record<string, string>} */
	const sideToLogical = {
		[blockStart]: 'block-start',
		[blockEnd]: 'block-end',
		[inlineStart]: 'inline-start',
		[inlineEnd]: 'inline-end',
	};

	/** @type {Map<string, string>} */
	const result = new Map();

	for (const [physical, defaultLogical] of physicalToFlowRelativeProperties) {
		// Border radius properties (two physical sides → block + inline positions)
		if (physical.endsWith('-radius')) {
			const verticalSide = physical.includes('top') ? 'top' : 'bottom';
			const horizontalSide = physical.includes('left') ? 'left' : 'right';

			if (inlineIsHorizontal) {
				// Vertical sides are block, horizontal sides are inline
				const blockPosition = verticalSide === blockStart ? 'start' : 'end';
				const inlinePosition = horizontalSide === inlineStart ? 'start' : 'end';

				result.set(physical, `border-${blockPosition}-${inlinePosition}-radius`);
			} else {
				// Horizontal sides are block, vertical sides are inline
				const blockPosition = horizontalSide === blockStart ? 'start' : 'end';
				const inlinePosition = verticalSide === inlineStart ? 'start' : 'end';

				result.set(physical, `border-${blockPosition}-${inlinePosition}-radius`);
			}

			continue;
		}

		// Size properties (width/height ↔ inline-size/block-size)
		if (physical.includes('width') || physical.includes('height')) {
			if (inlineIsHorizontal) {
				result.set(physical, defaultLogical);
			} else {
				const swapped = defaultLogical.includes('inline')
					? defaultLogical.replace('inline', 'block')
					: defaultLogical.replace('block', 'inline');

				result.set(physical, swapped);
			}

			continue;
		}

		// Axis properties (overflow-x/y, overscroll-behavior-x/y)
		if (physical.endsWith('-x') || physical.endsWith('-y')) {
			if (inlineIsHorizontal) {
				result.set(physical, defaultLogical);
			} else {
				const swapped = defaultLogical.includes('inline')
					? defaultLogical.replace('inline', 'block')
					: defaultLogical.replace('block', 'inline');

				result.set(physical, swapped);
			}

			continue;
		}

		// Side properties (margin-left, padding-top, left, etc.)
		/** @type {string | undefined} */
		let physicalSide;

		for (const side of ['left', 'right', 'top', 'bottom']) {
			if (physical === side || physical.endsWith(`-${side}`) || physical.includes(`-${side}-`)) {
				physicalSide = side;
				break;
			}
		}

		if (!physicalSide) continue;

		const logicalPosition = sideToLogical[physicalSide];

		if (!logicalPosition) continue;

		let logicalProp = defaultLogical;

		if (defaultLogical.includes('inline-start')) {
			logicalProp = defaultLogical.replace('inline-start', logicalPosition);
		} else if (defaultLogical.includes('inline-end')) {
			logicalProp = defaultLogical.replace('inline-end', logicalPosition);
		} else if (defaultLogical.includes('block-start')) {
			logicalProp = defaultLogical.replace('block-start', logicalPosition);
		} else if (defaultLogical.includes('block-end')) {
			logicalProp = defaultLogical.replace('block-end', logicalPosition);
		}

		result.set(physical, logicalProp);
	}

	return result;
}

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['flow-relative', 'physical'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const directionality = result.stylelint.config?.languageOptions?.directionality;

		const block = directionality?.block;
		const inline = directionality?.inline;
		const directionalMap = block && inline ? buildDirectionalMap({ block, inline }) : null;

		/**
		 * @param {string} type
		 * @param {string} name
		 * @param {import('postcss').Declaration} decl
		 * @param {number} index
		 * @param {number} endIndex
		 */
		function complain(type, name, decl, index, endIndex) {
			report({
				message: messages.rejected,
				messageArgs: [type, name],
				node: decl,
				result,
				ruleName,
				index,
				endIndex,
			});
		}

		/**
		 * @param {import('postcss').Declaration} decl
		 * @param {{ block: string, inline: string, axes?: true }} flowRelativePropertiesByAxis
		 * @param {number} index
		 * @param {number} endIndex
		 */
		function checkPhysicalShorthand(decl, flowRelativePropertiesByAxis, index, endIndex) {
			if (!mayIncludeRegexes.multipleValues.test(decl.value)) return;

			if (findNodeUpToRoot(decl, isPageAtRule)) return;

			const { axes: isAxisShorthand = false } = flowRelativePropertiesByAxis;
			const componentValueNodes = getComponentValueNodes(decl.value);

			// A single value applies to every side or axis
			if (componentValueNodes.length < 2) return;

			// More values than the shorthand takes is invalid
			if (componentValueNodes.length > (isAxisShorthand ? 2 : 4)) return;

			const { prop } = decl;

			if (!block || !inline) {
				complain('physical', prop, decl, index, endIndex);

				return;
			}

			// A `var()` may hold any number of values
			const fix = componentValueNodes.some(isVarFunction)
				? undefined
				: () => {
						const valueBySide = getValueBySide(
							componentValueNodes.map((node) => valueParser.stringify(node)),
							isAxisShorthand,
						);

						decl.replaceWith(
							decl.clone({
								prop: flowRelativePropertiesByAxis.block,
								value: getAxisValue(valueBySide, block),
							}),
							decl.clone({
								prop: flowRelativePropertiesByAxis.inline,
								value: getAxisValue(valueBySide, inline),
							}),
						);
					};

			report({
				message: messages.expected,
				messageArgs: [
					prop,
					flowRelativePropertiesByAxis.block,
					flowRelativePropertiesByAxis.inline,
				],
				index,
				endIndex,
				node: decl,
				result,
				ruleName,
				fix: { apply: fix, node: decl.parent },
			});
		}

		root.walkDecls((decl) => {
			const { prop } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			if (isCustomProperty(prop)) return;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) return;

			const propLower = prop.toLowerCase();
			const index = 0;
			const endIndex = index + prop.length;

			if (primary === 'physical') {
				if (!flowRelativeProperties.has(propLower)) return;

				if (findNodeUpToRoot(decl, isPageAtRule)) return;

				complain('flow-relative', prop, decl, index, endIndex);
			} else {
				const flowRelativePropertiesByAxis =
					physicalShorthandToFlowRelativePropertiesByAxis.get(propLower);

				if (flowRelativePropertiesByAxis) {
					checkPhysicalShorthand(decl, flowRelativePropertiesByAxis, index, endIndex);

					return;
				}

				if (!physicalToFlowRelativeProperties.has(propLower)) return;

				if (findNodeUpToRoot(decl, isPageAtRule)) return;

				if (!directionalMap) {
					complain('physical', prop, decl, index, endIndex);

					return;
				}

				const expectedProp = directionalMap.get(propLower);

				if (!expectedProp) return;

				report({
					message: messages.expected,
					messageArgs: [prop, expectedProp],
					index,
					endIndex,
					node: decl,
					result,
					ruleName,
					fix: {
						apply: () => {
							decl.prop = expectedProp;
						},
						node: decl,
					},
				});
			}
		});

		root.walkDecls(propertyRegexes.propertyAcceptingNames, (decl) => {
			if (optionsMatches(secondaryOptions, 'ignoreProperties', decl.prop)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));
			const baseIndex = declarationValueIndex(decl);

			parsedValue.walk((node) => {
				if (!isValueWord(node)) return;

				const { value: nodeValue, sourceIndex } = node;

				if (optionsMatches(secondaryOptions, 'ignoreProperties', nodeValue)) return;

				const nodeValueLower = nodeValue.toLowerCase();
				const index = baseIndex + sourceIndex;
				const endIndex = index + nodeValue.length;

				if (primary === 'physical') {
					if (!flowRelativeProperties.has(nodeValueLower)) return;

					complain('flow-relative', nodeValue, decl, index, endIndex);
				} else {
					if (!physicalToFlowRelativeProperties.has(nodeValueLower)) return;

					if (!directionalMap) {
						complain('physical', nodeValue, decl, index, endIndex);

						return;
					}

					const expectedProp = directionalMap.get(nodeValueLower);

					if (!expectedProp) return;

					report({
						message: messages.expected,
						messageArgs: [nodeValue, expectedProp],
						node: decl,
						result,
						ruleName,
						index,
						endIndex,
						fix: {
							apply: () => {
								node.value = expectedProp;
								setDeclarationValue(decl, parsedValue.toString());
							},
							node: decl,
						},
					});
				}
			});
		});
	};
};

/**
 * @param {string} value
 * @returns {import('postcss-value-parser').Node[]} empty when a `/` or `,` makes the value something other than a plain list
 */
function getComponentValueNodes(value) {
	const { nodes } = valueParser(value);

	if (nodes.some(isValueDiv)) return [];

	return nodes.filter((node) => isValueWord(node) || isValueFunction(node));
}

/**
 * Omitted values repeat as the shorthand's grammar expands them.
 *
 * @param {string[]} componentValues
 * @param {boolean} isAxisShorthand
 * @returns {{ top: string, right: string, bottom: string, left: string }}
 */
function getValueBySide(componentValues, isAxisShorthand) {
	// Two side values run vertical then horizontal, whereas axis values run x then y
	const [top = '', right = top, bottom = top, left = right] = isAxisShorthand
		? componentValues.toReversed()
		: componentValues;

	return { top, right, bottom, left };
}

/**
 * @param {ReturnType<typeof getValueBySide>} valueBySide
 * @param {Directionality} flow
 * @returns {string} the start and end values, or one when they match
 */
function getAxisValue(valueBySide, flow) {
	const [startValue, endValue] = directionFlowToSides(flow).map((side) => valueBySide[side]);

	assert(startValue && endValue);

	return startValue === endValue ? startValue : `${startValue} ${endValue}`;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
