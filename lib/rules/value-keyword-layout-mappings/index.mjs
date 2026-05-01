import valueParser from 'postcss-value-parser';

import { assert, isRegExp, isString } from '../../utils/validateTypes.mjs';
import {
	flowRelativeValueKeywordsByProperty,
	physicalToFlowRelativeValueKeywordsByProperty,
} from '../../reference/keywords.mjs';
import { mayIncludeRegexes, propertyRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import directionFlowToSides from '../../utils/directionFlowToSides.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import { isValueWord } from '../../utils/typeGuards.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'value-keyword-layout-mappings';

const messages = ruleMessages(ruleName, {
	rejected: (type, keyword) => `Disallowed ${type} keyword "${keyword}"`,
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-keyword-layout-mappings',
	fixable: true,
};

/** @import {Directionality} from 'stylelint' */

const directionalMappingKinds = new Map([
	['caption-side', 'side'],
	['offset-anchor', 'side'],
	['offset-position', 'side'],
	['clear', 'inlineSide'],
	['float', 'inlineSide'],
	['resize', 'axis'],
	['text-align', 'startEnd'],
	['text-align-last', 'startEnd'],
]);

/**
 * @param {{ block: Directionality, inline: Directionality }} directionality
 * @returns {Map<string, Map<string, string>>}
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

	/** @type {Map<string, Map<string, string>>} */
	const result = new Map();

	for (const [property, defaults] of physicalToFlowRelativeValueKeywordsByProperty) {
		const kind = directionalMappingKinds.get(property);
		/** @type {Map<string, string>} */
		const mapping = new Map();

		switch (kind) {
			case 'side':
				for (const physical of defaults.keys()) {
					const logical = sideToLogical[physical];

					if (logical) mapping.set(physical, logical);
				}

				break;
			case 'inlineSide':
				if (inlineIsHorizontal) {
					mapping.set(inlineStart, 'inline-start');
					mapping.set(inlineEnd, 'inline-end');
				}

				break;
			case 'axis':
				mapping.set(inlineIsHorizontal ? 'horizontal' : 'vertical', 'inline');
				mapping.set(inlineIsHorizontal ? 'vertical' : 'horizontal', 'block');
				break;
			case 'startEnd':
				if (inlineIsHorizontal) {
					mapping.set(inlineStart, 'start');
					mapping.set(inlineEnd, 'end');
				}

				break;
		}

		result.set(property, mapping);
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
					ignoreKeywords: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const directionality = result.stylelint.config?.languageOptions?.directionality;
		const block = directionality?.block;
		const inline = directionality?.inline;
		const directionalMap = block && inline ? buildDirectionalMap({ block, inline }) : null;

		const mayIncludeRegex =
			primary === 'physical'
				? mayIncludeRegexes.layoutFlowRelativeKeyword
				: mayIncludeRegexes.layoutPhysicalKeyword;

		const disallowedKeywordsByProperty =
			primary === 'physical'
				? flowRelativeValueKeywordsByProperty
				: physicalToFlowRelativeValueKeywordsByProperty;

		/**
		 * @param {string} type
		 * @param {string} keyword
		 * @param {number} index
		 * @param {number} endIndex
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(type, keyword, index, endIndex, decl) {
			report({
				index,
				endIndex,
				message: messages.rejected,
				messageArgs: [type, keyword],
				node: decl,
				result,
				ruleName,
			});
		}

		root.walkDecls(propertyRegexes.layoutMappings, (decl) => {
			const { prop, value } = decl;

			if (!mayIncludeRegex.test(value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) return;

			const propLower = prop.toLowerCase();
			const disallowedKeywords = disallowedKeywordsByProperty.get(propLower);

			assert(disallowedKeywords);

			const parsedValue = valueParser(getDeclarationValue(decl));
			const valueIndex = declarationValueIndex(decl);

			parsedValue.walk((valueNode) => {
				if (!isValueWord(valueNode)) return;

				const { value: keyword, sourceIndex } = valueNode;

				if (!isStandardSyntaxValue(keyword)) return;

				const keywordLower = keyword.toLowerCase();

				if (!disallowedKeywords.has(keywordLower)) return;

				if (optionsMatches(secondaryOptions, 'ignoreKeywords', keyword)) return;

				const index = valueIndex + sourceIndex;
				const endIndex = index + keyword.length;

				if (primary === 'physical') {
					complain('flow-relative', keyword, index, endIndex, decl);

					return;
				}

				if (!directionalMap) {
					complain('physical', keyword, index, endIndex, decl);

					return;
				}

				const expectedKeyword = directionalMap.get(propLower)?.get(keywordLower);

				if (!expectedKeyword) {
					complain('physical', keyword, index, endIndex, decl);

					return;
				}

				report({
					index,
					endIndex,
					message: messages.expected,
					messageArgs: [keyword, expectedKeyword],
					node: decl,
					result,
					ruleName,
					fix: {
						apply: () => {
							valueNode.value = expectedKeyword;
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
