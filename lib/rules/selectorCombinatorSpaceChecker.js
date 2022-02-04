'use strict';

const isStandardSyntaxCombinator = require('../utils/isStandardSyntaxCombinator');
const isStandardSyntaxRule = require('../utils/isStandardSyntaxRule');
const parseSelector = require('../utils/parseSelector');
const report = require('../utils/report');

/**
 * @typedef {(args: { source: string, index: number, errTarget: string, err: (message: string) => void }) => void} LocationChecker
 *
 * @param {{
 *   root: import('postcss').Root,
 *   result: import('stylelint').PostcssResult,
 *   locationChecker: LocationChecker,
 *   locationType: 'before' | 'after',
 *   checkedRuleName: string,
 *   fix: ((combinator: import('postcss-selector-parser').Combinator) => boolean) | null,
 * }} opts
 * @returns {void}
 */
module.exports = function selectorCombinatorSpaceChecker(opts) {
	let hasFixed;

	opts.root.walkRules((rule) => {
		if (!isStandardSyntaxRule(rule)) {
			return;
		}

		hasFixed = false;
		const selector = rule.raws.selector ? rule.raws.selector.raw : rule.selector;

		const fixedSelector = parseSelector(selector, opts.result, rule, (selectorTree) => {
			selectorTree.walkCombinators((node) => {
				// Ignore non-standard combinators
				if (!isStandardSyntaxCombinator(node)) {
					return;
				}

				// Ignore spaced descendant combinator
				if (/\s/.test(node.value)) {
					return;
				}

				// Check the exist of node in prev of the combinator.
				// in case some that aren't the first begin with combinators (nesting syntax)
				if (opts.locationType === 'before' && !node.prev()) {
					return;
				}

				const parentParentNode = node.parent && node.parent.parent;

				// Ignore pseudo-classes selector like `.foo:nth-child(2n + 1) {}`
				if (parentParentNode && parentParentNode.type === 'pseudo') {
					return;
				}

				const sourceIndex = node.sourceIndex;
				const index =
					node.value.length > 1 && opts.locationType === 'before'
						? sourceIndex
						: sourceIndex + node.value.length - 1;

				check(selector, node, index, rule, sourceIndex);
			});
		});

		if (hasFixed && fixedSelector) {
			if (!rule.raws.selector) {
				rule.selector = fixedSelector;
			} else {
				rule.raws.selector.raw = fixedSelector;
			}
		}
	});

	/**
	 * @param {string} source
	 * @param {import('postcss-selector-parser').Combinator} combinator
	 * @param {number} index
	 * @param {import('postcss').Node} node
	 * @param {number} sourceIndex
	 */
	function check(source, combinator, index, node, sourceIndex) {
		opts.locationChecker({
			source,
			index,
			errTarget: combinator.value,
			err: (message) => {
				if (opts.fix && opts.fix(combinator)) {
					hasFixed = true;

					return;
				}

				report({
					message,
					node,
					index: sourceIndex,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
