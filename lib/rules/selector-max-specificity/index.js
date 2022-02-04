'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const specificity = require('specificity');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-max-specificity';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) => `Expected "${selector}" to have a specificity no more than "${max}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-max-specificity',
};

/** @typedef {import('specificity').SpecificityArray} SpecificityArray */

/**
 * Return an array representation of zero specificity. We need a new array each time so that it can mutated.
 *
 * @returns {SpecificityArray}
 */
const zeroSpecificity = () => [0, 0, 0, 0];

/**
 * Calculate the sum of given array of specificity arrays.
 *
 * @param {SpecificityArray[]} specificities
 */
const specificitySum = (specificities) => {
	const sum = zeroSpecificity();

	for (const specificityArray of specificities) {
		for (const [i, value] of specificityArray.entries()) {
			sum[i] += value;
		}
	}

	return sum;
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [
					// Check that the max specificity is in the form "a,b,c"
					(spec) => isString(spec) && /^\d+,\d+,\d+$/.test(spec),
				],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * Calculate the specificity of a simple selector (type, attribute, class, ID, or pseudos's own value).
		 *
		 * @param {string} selector
		 * @returns {SpecificityArray}
		 */
		const simpleSpecificity = (selector) => {
			if (optionsMatches(secondaryOptions, 'ignoreSelectors', selector)) {
				return zeroSpecificity();
			}

			return specificity.calculate(selector)[0].specificityArray;
		};

		/**
		 * Calculate the the specificity of the most specific direct child.
		 *
		 * @param {import('postcss-selector-parser').Container<unknown>} node
		 * @returns {SpecificityArray}
		 */
		const maxChildSpecificity = (node) =>
			node.reduce((maxSpec, child) => {
				const childSpecificity = nodeSpecificity(child); // eslint-disable-line no-use-before-define

				return specificity.compare(childSpecificity, maxSpec) === 1 ? childSpecificity : maxSpec;
			}, zeroSpecificity());

		/**
		 * Calculate the specificity of a pseudo selector including own value and children.
		 *
		 * @param {import('postcss-selector-parser').Pseudo} node
		 * @returns {SpecificityArray}
		 */
		const pseudoSpecificity = (node) => {
			// `node.toString()` includes children which should be processed separately,
			// so use `node.value` instead
			const ownValue = node.value;
			const ownSpecificity =
				ownValue === ':not' || ownValue === ':matches'
					? // :not and :matches don't add specificity themselves, but their children do
					  zeroSpecificity()
					: simpleSpecificity(ownValue);

			return specificitySum([ownSpecificity, maxChildSpecificity(node)]);
		};

		/**
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {boolean}
		 */
		const shouldSkipPseudoClassArgument = (node) => {
			// postcss-selector-parser includes the arguments to nth-child() functions
			// as "tags", so we need to ignore them ourselves.
			// The fake-tag's "parent" is actually a selector node, whose parent
			// should be the :nth-child pseudo node.
			const parentNode = node.parent && node.parent.parent;

			if (parentNode && parentNode.value) {
				const parentNodeValue = parentNode.value;
				const normalisedParentNode = parentNodeValue.toLowerCase().replace(/:+/, '');

				return (
					parentNode.type === 'pseudo' &&
					(keywordSets.aNPlusBNotationPseudoClasses.has(normalisedParentNode) ||
						keywordSets.linguisticPseudoClasses.has(normalisedParentNode))
				);
			}

			return false;
		};

		/**
		 * Calculate the specificity of a node parsed by `postcss-selector-parser`.
		 *
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {SpecificityArray}
		 */
		const nodeSpecificity = (node) => {
			if (shouldSkipPseudoClassArgument(node)) {
				return zeroSpecificity();
			}

			switch (node.type) {
				case 'attribute':
				case 'class':
				case 'id':
				case 'tag':
					return simpleSpecificity(node.toString());
				case 'pseudo':
					return pseudoSpecificity(node);
				case 'selector':
					// Calculate the sum of all the direct children
					return specificitySum(node.map((n) => nodeSpecificity(n)));
				default:
					return zeroSpecificity();
			}
		};

		/** @type {[number, number, number]} */
		const primaryNumbers = primary
			.split(',')
			.map((/** @type {string} */ s) => Number.parseFloat(s));

		/** @type {SpecificityArray} */
		const maxSpecificityArray = [0, ...primaryNumbers];

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Using `.selectors` gets us each selector in the eventuality we have a comma separated set
			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					try {
						// Skip non-standard syntax selectors
						if (!isStandardSyntaxSelector(resolvedSelector)) {
							continue;
						}

						parseSelector(resolvedSelector, result, ruleNode, (selectorTree) => {
							// Check if the selector specificity exceeds the allowed maximum
							if (
								specificity.compare(maxChildSpecificity(selectorTree), maxSpecificityArray) === 1
							) {
								report({
									ruleName,
									result,
									node: ruleNode,
									message: messages.expected(resolvedSelector, primary),
									word: selector,
								});
							}
						});
					} catch {
						result.warn('Cannot parse selector', {
							node: ruleNode,
							stylelintType: 'parseError',
						});
					}
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
