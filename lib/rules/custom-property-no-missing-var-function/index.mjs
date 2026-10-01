import valueParser from 'postcss-value-parser';

import { atRuleRegexes, mayIncludeRegexes, propertyRegexes } from '../../utils/regexes.mjs';
import { isValueDiv, isValueFunction, isValueWord } from '../../utils/typeGuards.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isComma from '../../utils/isComma.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'custom-property-no-missing-var-function';

const messages = ruleMessages(ruleName, {
	rejected: (customProperty) => `Missing var function for "${customProperty}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-no-missing-var-function',
};

/** @import { Node } from 'postcss-value-parser' */
/** @import { Lexer } from 'css-tree' */

/**
 * Probe used to find properties whose grammar accepts a `<dashed-ident>`
 * as a complete value, rather than a custom property reference via `var()`.
 */
const DASHED_IDENT_PROBE = '--foo';

/** @type {WeakMap<Lexer, Set<string>>} */
const ignoredPropertiesByLexer = new WeakMap();

/**
 * Properties that can receive a `<dashed-ident>` / custom-ident, derived from
 * the css-tree lexer so the list stays in sync with CSS grammar.
 *
 * @param {Lexer} lexer
 * @returns {Set<string>}
 */
function getIgnoredProperties(lexer) {
	let ignoredProperties = ignoredPropertiesByLexer.get(lexer);

	if (!ignoredProperties) {
		// css-tree's published Lexer types omit the syntax dictionaries.
		const { properties } = /** @type {Lexer & { properties: Record<string, unknown> }} */ (lexer);

		ignoredProperties = new Set(
			Object.keys(properties).filter(
				(property) => !lexer.matchProperty(property, DASHED_IDENT_PROBE).error,
			),
		);
		ignoredPropertiesByLexer.set(lexer, ignoredProperties);
	}

	return ignoredProperties;
}

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		const lexer = /** @type {Lexer} */ (result.stylelint.lexer);
		const ignoredProperties = getIgnoredProperties(lexer);

		/** @type {Set<string>} */
		const knownCustomProperties = new Set();

		root.walkAtRules(atRuleRegexes.propertyName, ({ params }) => {
			knownCustomProperties.add(params);
		});

		root.walkDecls(propertyRegexes.custom, ({ prop }) => {
			knownCustomProperties.add(prop);
		});

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			if (!mayIncludeRegexes.customProperty.test(value)) return;

			if (ignoredProperties.has(prop.toLowerCase())) return;

			valueParser(value).nodes.forEach((childNode) => {
				check(childNode, decl);
			});
		});

		/**
		 * @param {Node} node
		 * @param {import('postcss').Declaration} decl
		 */
		function check(node, decl) {
			if (isValueFunction(node)) {
				const name = node.value.toLowerCase();

				let args = node.nodes;

				if (name === 'var') args = node.nodes.slice(1);
				else if (name === 'running') {
					const [child] = node.nodes;
					const mustDrill = child && isVarFunction(child);

					if (mustDrill) args = child.nodes.slice(1);
					else return;
				} else if (name === 'anchor' || name === 'anchor-size') {
					// Only the `<anchor-name>` is ignored
					const commaIndex = node.nodes.findIndex(isComma);

					args = node.nodes.filter((arg, index) => !isAnchorName(arg, index, commaIndex));
				} else if (name === 'style') {
					// For style() queries, only exempt the property name (first word before colon)
					// but still check the value part after the colon
					let foundColon = false;

					node.nodes.forEach((arg) => {
						if (isValueDiv(arg) && arg.value === ':') {
							foundColon = true;
						} else if (!foundColon && isDashedIdent(arg)) {
							// This is the property name in the query - skip it
						} else if (foundColon) {
							// This is after the colon (the value) - check it normally
							check(arg, decl);
						}
					});

					return;
				}

				args.forEach((arg) => check(arg, decl));

				return;
			}

			if (!isDashedIdent(node)) return;

			// `postcss-value-parser` incorrectly includes semicolons in word tokens.
			const cleanValue = node.value.replace(/;+$/, '');

			if (!knownCustomProperties.has(cleanValue)) return;

			const index = declarationValueIndex(decl) + node.sourceIndex;
			const endIndex = index + cleanValue.length;

			report({
				message: messages.rejected,
				messageArgs: [cleanValue],
				node: decl,
				index,
				endIndex,
				result,
				ruleName,
			});
		}
	};
};

/**
 * @param {Node} node
 */
function isDashedIdent(node) {
	return isValueWord(node) && node.value.startsWith('--');
}

/**
 * Whether a node is the `<anchor-name>` argument of `anchor()` or `anchor-size()`:
 * a `<dashed-ident>` before the comma that introduces the fallback value.
 *
 * @param {Node} node
 * @param {number} index
 * @param {number} commaIndex
 */
function isAnchorName(node, index, commaIndex) {
	return isDashedIdent(node) && (commaIndex === -1 || index < commaIndex);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
