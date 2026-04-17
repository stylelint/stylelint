import valueParser from 'postcss-value-parser';

import { flowRelativeUnits, physicalToFlowRelativeUnits } from '../../reference/units.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import directionFlowToSides from '../../utils/directionFlowToSides.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getDimension from '../../utils/getDimension.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'unit-layout-mappings';

const messages = ruleMessages(ruleName, {
	rejected: (type, unit) => `Disallowed ${type} unit "${unit}"`,
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unit-layout-mappings',
	fixable: true,
};

/** @typedef {import('../../utils/directionFlowToSides.mjs').Direction} Direction */

/**
 * Builds a physical → flow-relative unit map based on the inline direction.
 *
 * @param {Direction} inline
 * @returns {Map<string, string>}
 */
function buildDirectionalMap(inline) {
	const [inlineStart] = directionFlowToSides(inline);
	const key =
		inlineStart === 'left' || inlineStart === 'right' ? 'horizontalInline' : 'verticalInline';

	/** @type {Map<string, string>} */
	const result = new Map();

	for (const [physical, mapping] of physicalToFlowRelativeUnits) {
		result.set(physical, mapping[key]);
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
					ignoreUnits: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const directionality = result.stylelint.config?.languageOptions?.directionality;

		const block = directionality?.block;
		const inline = directionality?.inline;
		const directionalMap = block && inline ? buildDirectionalMap(inline) : null;

		/**
		 * @param {string} type
		 * @param {string} unit
		 * @param {number} index
		 * @param {number} endIndex
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(type, unit, index, endIndex, decl) {
			report({
				index,
				endIndex,
				message: messages.rejected,
				messageArgs: [type, unit],
				node: decl,
				result,
				ruleName,
			});
		}

		root.walkDecls((decl) => {
			if (!mayIncludeRegexes.axisUnit.test(decl.value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((valueNode) => {
				const { number, unit } = getDimension(valueNode);

				if (!number || !unit) return;

				if (optionsMatches(secondaryOptions, 'ignoreUnits', unit)) return;

				const { sourceIndex, sourceEndIndex } = valueNode;
				const valueIndex = declarationValueIndex(decl);
				const index = valueIndex + sourceIndex + number.length;
				const endIndex = valueIndex + sourceEndIndex;

				if (primary === 'physical') {
					if (!flowRelativeUnits.has(unit)) return;

					complain('flow-relative', unit, index, endIndex, decl);

					return;
				}

				if (!physicalToFlowRelativeUnits.has(unit)) return;

				if (!directionalMap) {
					complain('physical', unit, index, endIndex, decl);

					return;
				}

				const expectedUnit = directionalMap.get(unit);

				if (!expectedUnit) return;

				report({
					index,
					endIndex,
					message: messages.expected,
					messageArgs: [unit, expectedUnit],
					node: decl,
					result,
					ruleName,
					fix: {
						apply: () => {
							valueNode.value = number + expectedUnit;
							setDeclarationValue(decl, parsedValue.toString());
						},
						node: decl,
					},
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
