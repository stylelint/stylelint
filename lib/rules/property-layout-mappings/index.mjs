import {
	flowRelativeProperties,
	physicalToFlowRelativeProperties,
} from '../../reference/properties.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'property-layout-mappings';

const messages = ruleMessages(ruleName, {
	rejected: (type, property) => `Disallowed ${type} property "${property}"`,
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-layout-mappings',
	fixable: true,
};

/** @typedef  {'top-to-bottom'|'bottom-to-top'|'left-to-right'|'right-to-left'} Direction */

/**
 * Resolves a direction flow string to a [start, end] physical-side tuple.
 *
 * @param {Direction} flow - e.g. 'left-to-right', 'top-to-bottom'
 * @returns {[string, string]} - e.g. ['left', 'right']
 */
function directionFlowToSides(flow) {
	switch (flow) {
		case 'top-to-bottom':
			return ['top', 'bottom'];
		case 'bottom-to-top':
			return ['bottom', 'top'];
		case 'left-to-right':
			return ['left', 'right'];
		case 'right-to-left':
			return ['right', 'left'];
	}
}

/**
 * Builds a physical → flow-relative property map based on the directionality config.
 *
 * @param {{ block: Direction, inline: Direction }} directionality
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

/** @type {import('stylelint').CoreRules[ruleName]} */
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
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(type, decl) {
			report({
				message: messages.rejected,
				messageArgs: [type, decl.prop],
				word: decl.prop,
				node: decl,
				result,
				ruleName,
			});
		}

		root.walkDecls((decl) => {
			const { prop } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			if (isCustomProperty(prop)) return;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) return;

			if (primary === 'physical') {
				if (!flowRelativeProperties.has(prop)) return;

				complain('flow-relative', decl);
			} else {
				if (!physicalToFlowRelativeProperties.has(prop)) return;

				if (!directionalMap) {
					complain('physical', decl);

					return;
				}

				const expectedProp = directionalMap.get(prop);

				if (!expectedProp) return;

				report({
					message: messages.expected,
					messageArgs: [prop, expectedProp],
					word: prop,
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
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
