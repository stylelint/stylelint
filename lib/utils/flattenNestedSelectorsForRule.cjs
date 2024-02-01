// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const selectorResolveNested = require('@csstools/selector-resolve-nested');
const getRuleSelector = require('./getRuleSelector.cjs');
const typeGuards = require('./typeGuards.cjs');
const isStandardSyntaxSelector = require('./isStandardSyntaxSelector.cjs');
const selectorAST = require('./selectorAST.cjs');
const selectorParser = require('postcss-selector-parser');

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 * @typedef {import('postcss-selector-parser').Root} SelectorRoot
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}> | undefined}
 */
function flattenNestedSelectorsForRule(rule, result) {
	/** @typedef {import('postcss').Document} Document */
	/** @typedef {import('postcss').Root} Root */
	/** @typedef {import('postcss').Container} Container */

	const ownAST = selectorAST(getRuleSelector(rule), result, rule);

	if (!ownAST) return;

	/** @type {Array<Document|Root|Container>} */
	let ancestors = [];
	/** @type {Document|Root|Container|undefined} */
	let parent = rule.parent;

	while (parent) {
		ancestors.push(parent);
		parent = parent.parent;
	}

	ancestors.reverse();

	/** @type {import('postcss-selector-parser').Root | undefined} */
	let ast = undefined;

	for (const child of ancestors) {
		if (!typeGuards.isRule(child)) continue;

		if (!isStandardSyntaxSelector(child.selector)) return;

		const childAST = selectorAST(getRuleSelector(child), result, child);

		if (!childAST) return;

		if (ast) {
			ast = selectorResolveNested.flattenNestedSelector(childAST, ast);
		} else {
			ast = childAST;
		}
	}

	return ownAST.map((selector) => {
		const root = selectorParser.root({
			value: '',
		});

		root.append(selector.clone());

		if (!ast) {
			return {
				selector,
				resolvedSelectors: root.nodes,
			};
		}

		return {
			selector,
			resolvedSelectors: selectorResolveNested.flattenNestedSelector(root, ast).nodes,
		};
	});
}

module.exports = flattenNestedSelectorsForRule;
