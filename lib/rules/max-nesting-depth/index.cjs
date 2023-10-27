// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

const parser = require('postcss-selector-parser');
const typeGuards = require('../../utils/typeGuards.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const hasBlock = require('../../utils/hasBlock.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'max-nesting-depth';

const messages = ruleMessages(ruleName, {
	expected: (depth) => `Expected nesting depth to be no more than ${depth}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/max-nesting-depth',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	/**
	 * @param {import('postcss').Node} node
	 */
	const isIgnoreAtRule = (node) =>
		typeGuards.isAtRule(node) && optionsMatches(secondaryOptions, 'ignoreAtRules', node.name);

	/**
	 * @param {import('postcss').Node} node
	 */
	const isIgnoreRule = (node) => {
		return typeGuards.isRule(node) && optionsMatches(secondaryOptions, 'ignoreRules', node.selector);
	};

	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [validateTypes.isNumber],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignore: ['blockless-at-rules', 'pseudo-classes'],
					ignoreAtRules: [validateTypes.isString, validateTypes.isRegExp],
					ignoreRules: [validateTypes.isString, validateTypes.isRegExp],
					ignorePseudoClasses: [validateTypes.isString, validateTypes.isRegExp],
				},
			},
		);

		if (!validOptions) return;

		root.walkRules(checkStatement);
		root.walkAtRules(checkStatement);

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} statement
		 */
		function checkStatement(statement) {
			if (isIgnoreAtRule(statement)) {
				return;
			}

			if (isIgnoreRule(statement)) {
				return;
			}

			if (!hasBlock(statement)) {
				return;
			}

			if (typeGuards.isRule(statement) && !isStandardSyntaxRule(statement)) {
				return;
			}

			const depth = nestingDepth(statement, 0);

			if (depth > primary) {
				report({
					ruleName,
					result,
					node: statement,
					message: messages.expected,
					messageArgs: [primary],
				});
			}
		}
	};

	/**
	 * @param {import('postcss').Node} node
	 * @param {number} level
	 * @returns {number}
	 */
	function nestingDepth(node, level) {
		const parent = node.parent;

		if (!parent) {
			return 0;
		}

		if (isIgnoreAtRule(parent)) {
			return 0;
		}

		// The nesting depth level's computation has finished
		// when this function, recursively called, receives
		// a node that is not nested -- a direct child of the
		// root node
		if (typeGuards.isRoot(parent) || (typeGuards.isAtRule(parent) && parent.parent && typeGuards.isRoot(parent.parent))) {
			return level;
		}

		/**
		 * @param {string} selector
		 */
		function containsPseudoClassesOnly(selector) {
			const normalized = parser().processSync(selector, { lossless: false });
			const selectors = normalized.split(',');

			return selectors.every((sel) => extractPseudoRule(sel));
		}

		/**
		 * @param {string[]} selectors
		 * @returns {boolean}
		 */
		function containsIgnoredPseudoClassesOrRulesOnly(selectors) {
			if (
				!(
					secondaryOptions &&
					(secondaryOptions.ignorePseudoClasses || secondaryOptions.ignoreRules)
				)
			)
				return false;

			return selectors.every((selector) => {
				if (
					secondaryOptions.ignoreRules &&
					optionsMatches(secondaryOptions, 'ignoreRules', selector)
				)
					return true;

				if (!secondaryOptions.ignorePseudoClasses) return false;

				const pseudoRule = extractPseudoRule(selector);

				if (!pseudoRule) return false;

				return optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoRule);
			});
		}

		if (
			(optionsMatches(secondaryOptions, 'ignore', 'blockless-at-rules') &&
				typeGuards.isAtRule(node) &&
				node.every((child) => !typeGuards.isDeclaration(child))) ||
			(optionsMatches(secondaryOptions, 'ignore', 'pseudo-classes') &&
				typeGuards.isRule(node) &&
				containsPseudoClassesOnly(node.selector)) ||
			(typeGuards.isRule(node) && containsIgnoredPseudoClassesOrRulesOnly(node.selectors))
		) {
			return nestingDepth(parent, level);
		}

		// Unless any of the conditions above apply, we want to
		// add 1 to the nesting depth level and then check the parent,
		// continuing to add and move up the hierarchy
		// until we hit the root node
		return nestingDepth(parent, level + 1);
	}
};

/**
 * @param {string} selector
 * @returns {string | undefined}
 */
function extractPseudoRule(selector) {
	return selector.startsWith('&:') && selector[2] !== ':' ? selector.slice(2) : undefined;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
