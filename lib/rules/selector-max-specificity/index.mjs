import { compare, selectorSpecificity } from '@csstools/selector-specificity';
import resolvedNestedSelector from 'postcss-resolve-nested-selector';

import {
	aNPlusBNotationPseudoClasses,
	aNPlusBOfSNotationPseudoClasses,
	linguisticPseudoClasses,
} from '../../reference/selectors.mjs';
import { assertNumber, isRegExp, isString } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-specificity';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) => `Expected "${selector}" to have a specificity no more than "${max}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-specificity',
};

/** @typedef {import('@csstools/selector-specificity').Specificity} Specificity */

/**
 * Return a zero specificity. We need a new instance each time so that it can mutated.
 *
 * @returns {Specificity}
 */
const zeroSpecificity = () => ({ a: 0, b: 0, c: 0 });

/**
 * Calculate the sum of given specificities.
 *
 * @param {Specificity[]} specificities
 * @returns {Specificity}
 */
const specificitySum = (specificities) => {
	const sum = zeroSpecificity();

	for (const { a, b, c } of specificities) {
		sum.a += a;
		sum.b += b;
		sum.c += c;
	}

	return sum;
};

/** @type {import('stylelint').Rule<string>} */
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
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {Specificity}
		 */
		const simpleSpecificity = (node) => {
			if (optionsMatches(secondaryOptions, 'ignoreSelectors', node.toString())) {
				return zeroSpecificity();
			}

			return selectorSpecificity(node);
		};

		/**
		 * Calculate the specificity of the most specific direct child.
		 *
		 * @param {import('postcss-selector-parser').Container<string | undefined>} node
		 * @returns {Specificity}
		 */
		const maxChildSpecificity = (node) =>
			node.reduce((maxSpec, child) => {
				const childSpecificity = nodeSpecificity(child); // eslint-disable-line no-use-before-define

				return compare(childSpecificity, maxSpec) > 0 ? childSpecificity : maxSpec;
			}, zeroSpecificity());

		/**
		 * Calculate the specificity of a pseudo selector including own value and children.
		 *
		 * @param {import('postcss-selector-parser').Pseudo} node
		 * @returns {Specificity}
		 */
		const pseudoSpecificity = (node) => {
			// `node.toString()` includes children which should be processed separately,
			// so use `node.value` instead
			const ownValue = node.value.toLowerCase();

			if (ownValue === ':where') {
				return zeroSpecificity();
			}

			let ownSpecificity;

			if (optionsMatches(secondaryOptions, 'ignoreSelectors', ownValue)) {
				ownSpecificity = zeroSpecificity();
			} else if (aNPlusBOfSNotationPseudoClasses.has(ownValue.replace(/^:/, ''))) {
				return selectorSpecificity(node);
			} else {
				ownSpecificity = selectorSpecificity(node.clone({ nodes: [] }));
			}

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

			if (parentNode && parentNode.type === 'pseudo' && parentNode.value) {
				const pseudoClass = parentNode.value.toLowerCase().replace(/^:/, '');

				return (
					aNPlusBNotationPseudoClasses.has(pseudoClass) || linguisticPseudoClasses.has(pseudoClass)
				);
			}

			return false;
		};

		/**
		 * Calculate the specificity of a node parsed by `postcss-selector-parser`.
		 *
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {Specificity}
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
					return simpleSpecificity(node);
				case 'pseudo':
					return pseudoSpecificity(node);
				case 'selector':
					// Calculate the sum of all the direct children
					return specificitySum(node.map((n) => nodeSpecificity(n)));
				default:
					return zeroSpecificity();
			}
		};

		const [a, b, c] = primary.split(',').map((s) => Number.parseFloat(s));

		assertNumber(a);
		assertNumber(b);
		assertNumber(c);

		const maxSpecificity = { a, b, c };

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Using `.selectors` gets us each selector in the eventuality we have a comma separated set
			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					// Skip non-standard syntax selectors
					if (!isStandardSyntaxSelector(resolvedSelector)) {
						continue;
					}

					parseSelector(resolvedSelector, result, ruleNode, (selectorTree) => {
						// Check if the selector specificity exceeds the allowed maximum
						if (compare(maxChildSpecificity(selectorTree), maxSpecificity) > 0) {
							report({
								ruleName,
								result,
								node: ruleNode,
								message: messages.expected,
								messageArgs: [resolvedSelector, primary],
								word: selector,
							});
						}
					});
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
