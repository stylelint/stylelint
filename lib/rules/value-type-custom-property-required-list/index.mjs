import { stringify as stringifyTokens } from '@csstools/css-tokenizer';
import { walk } from 'css-tree';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getCustomPropertyValues from '../../utils/getCustomPropertyValues.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getOrInsertComputed from '../../utils/getOrInsertComputed.mjs';
import getSourceRange from '../../utils/getSourceRange.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isDescriptorDeclaration from '../../utils/isDescriptorDeclaration.mjs';
import isRootEmbeddedInSomeReferenceRoots from '../../utils/isRootEmbeddedInSomeReferenceRoots.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import isWithinRange from '../../utils/isWithinRange.mjs';
import { mathFunctions } from '../../reference/functions.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import memoize from '../../utils/memoize.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import optionsMatchesEntry from '../../utils/optionsMatchesEntry.mjs';
import parseValue from '../../utils/parseValue.mjs';
import rangesOverlap from '../../utils/rangesOverlap.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import substituteVarFunctions from '../../utils/substituteVarFunctions.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

/** @import { CssNode, FunctionNode, Lexer, WalkContext } from 'css-tree' */
/** @import { Root } from 'postcss' */
/** @import { VarFunctionSubstitution } from '../../utils/substituteVarFunctions.mjs' */

const ruleName = 'value-type-custom-property-required-list';

const messages = ruleMessages(ruleName, {
	expected: (value, type) => `Expected "${value}" to be a custom property, as of type "<${type}>"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-type-custom-property-required-list',
};

/**
 * A part of a value matched by a type in the property's syntax
 *
 * @typedef {object} Fragment
 * @property {string} type - the name of the type, e.g. `color`
 * @property {number} start - the index of the fragment in the value
 * @property {number} end - the index after the fragment
 * @property {string[]} functions - the names of the functions enclosing it
 */

/** @type {WeakMap<Lexer, Map<string, Fragment[] | undefined>>} */
const fragmentsCacheByLexer = new WeakMap();
const MAX_CACHE_SIZE = 10000;

// Computed once, as reference roots are shared across linted files
const getCustomPropertyValuesMemo = memoize(getCustomPropertyValues);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const lexer = /** @type {Lexer} */ (result.stylelint.lexer);

		/**
		 * @param {unknown} type
		 * @returns {boolean}
		 */
		const isKnownType = (type) => isString(type) && lexer.getType(type) !== null;

		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary, possible: [isKnownType] },
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreValues: [isString, isRegExp],
					ignoreFunctions: [validateObjectWithArrayProps(isString, isRegExp)],
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
				},
			},
		);

		if (!validOptions) return;

		const types = new Set([primary].flat());

		/** @type {Map<string, Fragment[] | undefined>} */
		const fragmentsCache = getOrInsertComputed(fragmentsCacheByLexer, lexer, () => new Map());

		// Configs with different types share a lexer, e.g. via overrides
		const typesKey = [...types].join();

		/** @type {Map<string, string[]> | undefined} */
		let customPropertyValues;

		root.walkDecls((decl) => {
			const { prop } = decl;
			const value = getDeclarationValue(decl);

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (isDescriptorDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			// A custom property's declaration defines it rather than using one
			if (isCustomProperty(prop)) return;

			/**
			 * @param {string} type
			 * @returns {boolean}
			 */
			const isIgnoredType = (type) =>
				optionsMatchesEntry(secondaryOptions, 'ignoreProperties', type, prop);

			const ignoredTypes = new Set([...types].filter(isIgnoredType));

			if (ignoredTypes.size === types.size) return;

			/**
			 * @param {Fragment[]} fragments
			 * @param {VarFunctionSubstitution[]} [substitutions]
			 */
			const check = (fragments, substitutions = []) => {
				const valueIndex = declarationValueIndex(decl);

				/**
				 * @param {Fragment} fragment
				 * @returns {boolean}
				 */
				const isIgnored = ({ type, start, end, functions }) =>
					ignoredTypes.has(type) ||
					optionsMatches(secondaryOptions, 'ignoreValues', value.slice(start, end)) ||
					functions.some((name) =>
						optionsMatchesEntry(secondaryOptions, 'ignoreFunctions', type, name),
					);

				const ignoredFragments = fragments.filter(isIgnored);

				/**
				 * @param {Fragment} fragment
				 * @returns {boolean}
				 */
				const isSubstituted = ({ start, end }) =>
					substitutions.some((range) => rangesOverlap([start, end], [range.start, range.end]));

				/**
				 * @param {Fragment} fragment
				 * @returns {boolean}
				 */
				const isCovered = (fragment) =>
					ignoredFragments.some(
						(ignored) =>
							isWithinRange(fragment, ignored.start, ignored.end) ||
							// Not across types, as rgb(0 0 0) with 0 ignored is still a color
							(ignored.type === fragment.type &&
								isWithinRange(ignored, fragment.start, fragment.end)),
					);

				for (const fragment of fragments) {
					if (isSubstituted(fragment) || isCovered(fragment)) continue;

					const { type, start, end } = fragment;

					report({
						message: messages.expected,
						messageArgs: [value.slice(start, end), type],
						node: decl,
						index: valueIndex + start,
						endIndex: valueIndex + end,
						result,
						ruleName,
					});
				}
			};

			if (mayIncludeRegexes.varFunction.test(value)) {
				customPropertyValues ??= getDeclaredCustomPropertyValues(
					root,
					result.stylelint.referenceRoots,
				);

				for (const { tokens, substitutions } of substituteVarFunctions(
					value,
					customPropertyValues,
				)) {
					const fragments = findCachedFragments(prop, stringifyTokens(...tokens));

					if (!fragments) continue;

					check(withSourceRanges(fragments, tokens), substitutions);

					return;
				}

				return;
			}

			const fragments = findCachedFragments(prop, value);

			if (fragments) check(fragments);
		});

		/**
		 * @param {string} prop
		 * @param {string} value
		 * @returns {Fragment[] | undefined}
		 */
		function findCachedFragments(prop, value) {
			const cacheKey = `${typesKey}|${prop}:${value}`;

			if (fragmentsCache.has(cacheKey)) return fragmentsCache.get(cacheKey);

			const fragments = findFragments(prop, value, lexer, types);

			if (fragmentsCache.size < MAX_CACHE_SIZE) fragmentsCache.set(cacheKey, fragments);

			return fragments;
		}
	};
};

/**
 * The fragments of a value that are of the given types, in source order
 *
 * @param {string} prop
 * @param {string} value
 * @param {Lexer} lexer
 * @param {Set<string>} types
 * @returns {Fragment[] | undefined} `undefined` when the value doesn't match the property
 */
function findFragments(prop, value, lexer, types) {
	const cssTreeValueNode = parseValue(value);

	if (!cssTreeValueNode) return undefined;

	// Unlike findValueFragments(), matchProperty() tells a mismatch from a match without fragments
	if (!lexer.matchProperty(prop, cssTreeValueNode).matched) return undefined;

	const fragments = mayIncludeRegexes.mathFunction.test(value)
		? findCalcValues(cssTreeValueNode, lexer, types)
		: [];

	for (const type of types) {
		for (const { nodes } of lexer.findValueFragments(prop, cssTreeValueNode, 'Type', type)) {
			const { first, last } = nodes;

			if (first === null || last === null) continue;

			// The lexer matches a math function as a whole, so its calc-values stand in for it
			if (first === last && isMathFunctionNode(first)) continue;

			if (first.loc && last.loc) {
				fragments.push(createFragment(type, first.loc.start.offset, last.loc.end.offset));
			}
		}
	}

	addEnclosingFunctions(fragments, cssTreeValueNode);

	return fragments.sort((a, b) => a.start - b.start);
}

/**
 * The `<calc-value>`s of the given types within the math functions of a value
 *
 * @param {CssNode} cssTreeValueNode
 * @param {Lexer} lexer
 * @param {Set<string>} types
 * @returns {Fragment[]}
 */
function findCalcValues(cssTreeValueNode, lexer, types) {
	/** @type {Fragment[]} */
	const fragments = [];

	walk(cssTreeValueNode, {
		/**
		 * @this {WalkContext}
		 * @param {CssNode} node
		 */
		enter(node) {
			if (!this.function || !isMathFunctionNode(this.function)) return;

			if (!isCalcValueNode(node) || !node.loc) return;

			for (const type of types) {
				if (lexer.matchType(type, node).matched) {
					fragments.push(createFragment(type, node.loc.start.offset, node.loc.end.offset));
				}
			}
		},
	});

	return fragments;
}

/**
 * @param {CssNode} node
 * @returns {boolean} whether the node is a `<number>`, `<percentage>` or `<dimension>`
 */
function isCalcValueNode(node) {
	return node.type === 'Number' || node.type === 'Percentage' || node.type === 'Dimension';
}

/**
 * @param {CssNode} node
 * @returns {node is FunctionNode}
 */
function isMathFunctionNode(node) {
	return node.type === 'Function' && mathFunctions.has(node.name.toLowerCase());
}

/**
 * @param {string} type
 * @param {number} start
 * @param {number} end
 * @returns {Fragment} with its enclosing functions still to be added
 */
function createFragment(type, start, end) {
	return { type, start, end, functions: [] };
}

/**
 * @param {Fragment[]} fragments
 * @param {CssNode} cssTreeValueNode
 */
function addEnclosingFunctions(fragments, cssTreeValueNode) {
	walk(cssTreeValueNode, {
		visit: 'Function',
		enter(node) {
			if (!node.loc) return;

			for (const fragment of fragments) {
				if (isWithinRange(fragment, node.loc.start.offset, node.loc.end.offset)) {
					fragment.functions.push(node.name);
				}
			}
		},
	});
}

/**
 * Map the fragments of the stringified tokens back to the source
 *
 * @param {Fragment[]} fragments
 * @param {import('@csstools/css-tokenizer').CSSToken[]} tokens
 * @returns {Fragment[]} without those that don't start and end at tokens
 */
function withSourceRanges(fragments, tokens) {
	/** @type {Fragment[]} */
	const sourceFragments = [];

	for (const fragment of fragments) {
		const range = getSourceRange(tokens, [fragment.start, fragment.end]);

		if (range) sourceFragments.push({ ...fragment, start: range[0], end: range[1] });
	}

	return sourceFragments;
}

/**
 * The reference roots' values, then the root's, in source order. A root declaring none gets the
 * shared reference map, so the result mustn't be mutated
 *
 * @param {Root} root
 * @param {Root[]} referenceRoots
 * @returns {Map<string, string[]>}
 */
function getDeclaredCustomPropertyValues(root, referenceRoots) {
	const referenceValues = getCustomPropertyValuesMemo(referenceRoots);

	if (isRootEmbeddedInSomeReferenceRoots(root, referenceRoots)) return referenceValues;

	const ownValues = getCustomPropertyValues([root]);

	if (ownValues.size === 0) return referenceValues;

	const declared = new Map(referenceValues);

	for (const [name, values] of ownValues) {
		declared.set(name, [...(referenceValues.get(name) ?? []), ...values]);
	}

	return declared;
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
