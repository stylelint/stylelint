import { resolveNestedSelector } from '@csstools/selector-resolve-nested';

import { isAtRule, isRule } from './typeGuards.mjs';
import getRuleSelector from './getRuleSelector.mjs';
import isStandardSyntaxRule from './isStandardSyntaxRule.mjs';
import parseSelector from './parseSelector.mjs';
import selectorParser from 'postcss-selector-parser';

/** @import { Selector, Root as SelectorRoot } from 'postcss-selector-parser' */
/** @import { Rule, Node } from 'postcss' */
/** @import { PostcssResult } from 'stylelint' */

/**
 * Resolve nested selectors following the CSS nesting specification
 *
 * @typedef {{selector: Selector, resolvedSelectors: SelectorRoot, nested: boolean}} ResolvedSelector
 *
 * @param {Rule} rule
 * @param {PostcssResult} result
 * @returns {Array<ResolvedSelector>}
 */
export default function resolveNestedSelectorsForRule(rule, result) {
	const ownAST = parseSelector(getRuleSelector(rule), result, rule);

	if (!ownAST) return [];

	/** @type {SelectorRoot | undefined} */
	let ast = undefined;

	/** @type {Array<Node>} */
	const ancestors = [];

	{
		/** @type {Node['parent']} */
		let parent = rule.parent;

		while (parent) {
			ancestors.push(parent);
			parent = parent.parent;
		}
	}

	ancestors.reverse();

	for (const child of ancestors) {
		if (isAtRule(child) && child.name === 'scope') {
			ast = parseSelector(':where(:scope)', result, child);
			continue;
		}

		if (!isRule(child)) continue;

		if (!isStandardSyntaxRule(child)) return [];

		const childAST = parseSelector(getRuleSelector(child), result, child);

		if (!childAST) return [];

		if (ast) {
			ast = resolveNestedSelector(childAST, ast);
		} else {
			ast = childAST;
		}
	}

	return ownAST.map((selector) => {
		if (!ast) {
			return {
				selector,
				resolvedSelectors: selectorParser.root({
					value: '',
					nodes: [selector],
				}),
				nested: false,
			};
		}

		return {
			selector,
			resolvedSelectors: resolveNestedSelector(
				selectorParser.root({
					nodes: [selector],
					value: '',
				}),
				ast,
			),
			nested: true,
		};
	});
}
