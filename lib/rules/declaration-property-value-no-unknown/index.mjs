import { TokenType, stringify as stringifyTokens, tokenize } from '@csstools/css-tokenizer';
import { definitionSyntax, find, parse, string } from 'css-tree';
import {
	isFunctionNode,
	parseListOfComponentValues,
	stringify,
	walk,
} from '@csstools/css-parser-algorithms';
import { calcFromComponentValues } from '@csstools/css-calc';

import { atRuleRegexes, descriptorRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import substituteVarFunctions, {
	getSubstitutedValue,
} from '../../utils/substituteVarFunctions.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getCustomPropertyNames from '../../utils/getCustomPropertyNames.mjs';
import getCustomPropertyValues from '../../utils/getCustomPropertyValues.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getDeclaredCustomPropertyNames from '../../utils/getDeclaredCustomPropertyNames.mjs';
import getLexer from '../../utils/getLexer.mjs';
import getOrInsertComputed from '../../utils/getOrInsertComputed.mjs';
import getSourceRange from '../../utils/getSourceRange.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import { isDeclaration } from '../../utils/typeGuards.mjs';
import isDescriptorDeclaration from '../../utils/isDescriptorDeclaration.mjs';
import isRootEmbeddedInSomeReferenceRoots from '../../utils/isRootEmbeddedInSomeReferenceRoots.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import memoize from '../../utils/memoize.mjs';
import memoizeForReferenceRoots from '../../utils/memoizeForReferenceRoots.mjs';
import optionsMatchesEntry from '../../utils/optionsMatchesEntry.mjs';
import parseValue from '../../utils/parseValue.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value, varFunctions, syntax) => {
		let message = `Unknown value "${value}" for property "${property}"`;

		if (syntax) message += `, registered as "${syntax}"`;

		if (Array.isArray(varFunctions) && varFunctions.length > 0) {
			message += `, via "${varFunctions.join(', ')}"`;
		}

		return message;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

const FUNCTIONS_UNKNOWN_TO_CSSTREE = new Set([
	'container-progress',
	'env',
	'media-progress',
	'progress',
	'random',
	'sibling-count',
	'sibling-index',
]);

/** @type {ReadonlyMap<string, string[]>} */
const representativeValuesBySyntaxComponentName = new Map([
	['angle', ['1deg']],
	['color', ['red']],
	['image', ['url(x)']],
	['integer', ['1']],
	['length', ['1px']],
	['length-percentage', ['1px', '1%']],
	['number', ['1']],
	['percentage', ['1%']],
	['resolution', ['1dppx']],
	['string', ["'x'"]],
	['time', ['1s']],
	['transform-function', ['scale(1)']],
	['transform-list', ['scale(1)']],
	['url', ['url(x)']],
]);

/**
 * Any cache keys let css-calc solve `random()`, whose result only matters for its type
 * see the `randomCaching` option of `@csstools/css-calc`
 */
const randomCaching = { propertyName: '', propertyN: 0, elementID: '', documentID: '' };

/** @type {WeakMap<object, Set<string>>} */
const validMatchesCacheByLexer = new WeakMap();
const MAX_CACHE_SIZE = 10000;

/** @import { CssNode, DSNodeGroup, Lexer } from 'css-tree' */
/** @import { OffsetRange } from '../../utils/getSourceRange.mjs' */
/** @import { Root } from 'postcss' */
/** @import { VarFunctionSubstitution } from '../../utils/substituteVarFunctions.mjs' */

/** @typedef {import('stylelint').CoreRules[typeof ruleName]} Rule */
/** @typedef {{ range: OffsetRange, substitutions: VarFunctionSubstitution[] }} SubstitutedMismatch */
/** @typedef {{ syntax: string, syntaxDefinition: DSNodeGroup }} RegisteredCustomProperty */

const getRegisteredCustomPropertiesOfRoots = memoizeForReferenceRoots(
	getRegisteredCustomProperties,
);
// Computed once, as reference roots are shared across linted files
const getCustomPropertyValuesMemo = memoize(getCustomPropertyValues);

/**
 * @typedef {object} DeclaredReferenceValues
 * @property {Map<string, string[]>} declared - the reference roots' values matching their registered syntaxes
 * @property {Map<string, string[]>} substitutable - `declared`, plus representative values where a registered custom property has none
 * @property {Map<string, string>} representedSyntaxes - the syntax each representative value stands for, by custom property
 */

/**
 * By lexer, as the lexer is built from the registered syntaxes that filter the values
 *
 * @type {WeakMap<Lexer, WeakMap<Root[], DeclaredReferenceValues>>}
 */
const declaredReferenceValuesByLexer = new WeakMap();

/** @type {Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {(name: string, propValue: string) => boolean} */
		const isPropIgnored = (name, value) =>
			optionsMatchesEntry(secondaryOptions, 'ignoreProperties', name, value);

		const referenceRoots = result.stylelint.referenceRoots;

		/** @type {Map<string, RegisteredCustomProperty>} */
		const typedCustomProperties = new Map(
			getRegisteredCustomPropertiesOfRoots(root, referenceRoots).flatMap((registered) => [
				...registered,
			]),
		);

		const lexer =
			typedCustomProperties.size > 0
				? getLexer(result.stylelint.config ?? {}, {
						properties: Object.fromEntries(
							[...typedCustomProperties].map(([name, { syntax }]) => [
								getPrefixedPropName(name),
								syntax,
							]),
						),
					})
				: /** @type {Lexer} */ (result.stylelint.lexer);

		let validMatchesCache = validMatchesCacheByLexer.get(lexer);

		if (!validMatchesCache) {
			validMatchesCache = new Set();
			validMatchesCacheByLexer.set(lexer, validMatchesCache);
		}

		/**
		 * @param {string} prop
		 * @param {string} value
		 * @returns {OffsetRange | undefined}
		 */
		const findCachedMismatch = (prop, value) => {
			const cacheKey = `${prop}:${value}`;

			if (validMatchesCache.has(cacheKey)) return undefined;

			const mismatch = findMismatch(
				value,
				typedCustomProperties.has(prop) ? getPrefixedPropName(prop) : prop,
				lexer,
			);

			if (!mismatch && validMatchesCache.size < MAX_CACHE_SIZE) {
				validMatchesCache.add(cacheKey);
			}

			return mismatch;
		};

		/**
		 * @param {string} name
		 * @param {string} value
		 * @returns {boolean} `true` without a registered syntax
		 */
		const matchesRegisteredSyntax = (name, value) =>
			!typedCustomProperties.has(name) || !findCachedMismatch(name, value);

		/**
		 * The declared values of a custom property, last declared first, without those that
		 * mismatch its registered syntax as they're invalid at computed-value time
		 *
		 * @param {string} name
		 * @param {string[]} values
		 * @returns {string[] | undefined} none when a value can't be substituted
		 */
		const getMatchingDeclaredValues = (name, values) => {
			const matchingValues = values
				.toReversed()
				.filter((value) => matchesRegisteredSyntax(name, value));

			return matchingValues.every(isSubstitutableValue) ? matchingValues : undefined;
		};

		/**
		 * @param {Map<string, string[]>} declaredValues
		 * @param {Map<string, string[]>} valuesByName
		 * @returns {Map<string, string[]>} `declaredValues`
		 */
		const setMatchingDeclaredValues = (declaredValues, valuesByName) => {
			for (const [name, values] of valuesByName) {
				const matchingValues = getMatchingDeclaredValues(name, values);

				if (matchingValues) declaredValues.set(name, matchingValues);
				else declaredValues.delete(name);
			}

			return declaredValues;
		};

		/**
		 * The syntax each custom property's representative values stand for
		 *
		 * @type {Map<string, string>}
		 */
		let representedSyntaxes = new Map();

		/**
		 * Representative values stand in for a registered custom property declaring none
		 *
		 * @param {Map<string, string[]>} values
		 * @param {Map<string, string>} syntaxes - the syntax each stands for, by custom property
		 */
		const addRepresentativeValues = (values, syntaxes) => {
			for (const [name, { syntax, syntaxDefinition }] of typedCustomProperties) {
				if (values.get(name)?.length) continue;

				values.set(name, getRepresentativeValues(syntaxDefinition));
				syntaxes.set(name, syntax);
			}
		};

		/**
		 * @returns {DeclaredReferenceValues}
		 */
		const getDeclaredReferenceValues = () => {
			const declaredReferenceValuesByReferenceRoots = getOrInsertComputed(
				declaredReferenceValuesByLexer,
				lexer,
				() => new WeakMap(),
			);

			return getOrInsertComputed(declaredReferenceValuesByReferenceRoots, referenceRoots, () => {
				const declared = setMatchingDeclaredValues(
					new Map(),
					getCustomPropertyValuesMemo(referenceRoots),
				);
				const substitutable = new Map(declared);
				/** @type {Map<string, string>} */
				const syntaxes = new Map();

				addRepresentativeValues(substitutable, syntaxes);

				return { declared, substitutable, representedSyntaxes: syntaxes };
			});
		};

		/** @type {Map<string, string[]> | undefined} */
		let customPropertyValues;

		/**
		 * Each custom property's declared values, or representative values of its syntax when none match
		 *
		 * @returns {Map<string, string[]>}
		 */
		const getSubstitutableValues = () => {
			const {
				declared,
				substitutable,
				representedSyntaxes: syntaxes,
			} = getDeclaredReferenceValues();

			// A root declaring no custom property shares the reference maps, and so their memoised
			// substitutions. So does a root that a reference root already embeds.
			if (
				isRootEmbeddedInSomeReferenceRoots(root, referenceRoots) ||
				getDeclaredCustomPropertyNames(root).size === 0
			) {
				representedSyntaxes = syntaxes;

				return substitutable;
			}

			const referenceValues = getCustomPropertyValuesMemo(referenceRoots);

			// The root's values follow the reference roots' in source order
			const ownValues = new Map(
				[...getCustomPropertyValues([root])].map(([name, values]) => [
					name,
					[...(referenceValues.get(name) ?? []), ...values],
				]),
			);

			const values = setMatchingDeclaredValues(new Map(declared), ownValues);

			addRepresentativeValues(values, representedSyntaxes);

			return values;
		};

		/**
		 * In the message a representative value stands for its syntax, unless substituted into another
		 * custom property
		 *
		 * @param {VarFunctionSubstitution} substitution
		 * @returns {VarFunctionSubstitution}
		 */
		const withRepresentedSyntax = (substitution) => {
			const syntax = representedSyntaxes.get(substitution.name);

			return syntax === undefined ? substitution : { ...substitution, value: syntax };
		};

		/**
		 * The mismatch of a value with `var()`s, if every combination of their values mismatches
		 *
		 * @param {string} prop
		 * @param {string} value
		 * @returns {SubstitutedMismatch | undefined}
		 */
		const findSubstitutedMismatch = (prop, value) => {
			customPropertyValues ??= getSubstitutableValues();

			const substitutedValues = substituteVarFunctions(value, customPropertyValues);

			/** @type {SubstitutedMismatch | undefined} */
			let firstMismatch;

			for (const { tokens, substitutions } of substitutedValues) {
				if (isPropIgnored(prop, getSubstitutedValue(value, substitutions))) return undefined;

				const mismatch = findCachedMismatch(prop, stringifyTokens(...tokens));

				if (!mismatch) return undefined;

				// The last declared value is substituted first, so its mismatch is reported
				firstMismatch ??= {
					range: getSourceRange(tokens, mismatch) ?? [0, value.length],
					substitutions,
				};
			}

			return firstMismatch;
		};

		root.walkDecls((decl) => {
			const { prop } = decl;
			const value = getDeclarationValue(decl);

			// csstree/csstree#243
			// NOTE: CSSTree's `fork()` doesn't support `-moz-initial`, but it may be possible in the future.
			if (/^-moz-initial$/i.test(value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (isDescriptorDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			if (isCustomProperty(prop) && !typedCustomProperties.has(prop)) return;

			if (isPropIgnored(prop, value)) return;

			/**
			 * Report the enclosing function, if any, rather than the mismatched fragment within it
			 *
			 * @param {OffsetRange} range
			 * @param {VarFunctionSubstitution[]} [substitutions]
			 */
			const complain = ([startOffset, endOffset], substitutions = []) => {
				const cssTreeValueNode = parseValue(value);
				const functionNode =
					cssTreeValueNode && findEnclosingFunction(cssTreeValueNode, startOffset, endOffset);
				const start = functionNode?.loc?.start.offset ?? startOffset;
				const end = functionNode?.loc?.end.offset ?? endOffset;
				const valueIndex = declarationValueIndex(decl);
				const substitutionsInRange = substitutions.filter((substitution) =>
					isWithinRange(substitution, start, end),
				);
				const unknownValue = getSubstitutedValue(
					value,
					substitutionsInRange.map(withRepresentedSyntax),
					start,
					end,
				);
				const varFunctions = substitutionsInRange.map((substitution) =>
					value.slice(substitution.start, substitution.end),
				);
				const syntax = typedCustomProperties.get(prop)?.syntax ?? '';

				report({
					message: messages.rejected,
					messageArgs: [prop, unknownValue, varFunctions, syntax],
					node: decl,
					index: valueIndex + start,
					endIndex: valueIndex + end,
					result,
					ruleName,
				});
			};

			if (mayIncludeRegexes.varFunction.test(value)) {
				const mismatch = findSubstitutedMismatch(prop, value);

				if (mismatch) complain(mismatch.range, mismatch.substitutions);

				return;
			}

			const mismatch = findCachedMismatch(prop, value);

			if (mismatch) complain(mismatch);
		});
	};
};

/**
 * @param {string} value
 * @param {string} property - the name the lexer knows the property by
 * @param {Lexer} lexer
 * @returns {OffsetRange | undefined}
 */
function findMismatch(value, property, lexer) {
	const mathFuncResult = validateMathFunctions(value, property, lexer);

	if (mathFuncResult === 'valid' || mathFuncResult === 'skip-validation') return undefined;

	const cssTreeValueNode = parseValue(value);

	if (!cssTreeValueNode) return undefined;

	// The remaining result is the range of an invalid math expression
	if (mathFuncResult !== 'undetermined') return mathFuncResult;

	if (containsFunctionsUnknownToCSSTree(cssTreeValueNode)) return undefined;

	const { error } = lexer.matchProperty(property, cssTreeValueNode);

	if (!isMismatchError(error)) return undefined;

	return [error.loc.start.offset, error.loc.end.offset];
}

/**
 * csstree's generic numeric types accept a fixed list of function names,
 * so its lexer mismatches these functions for every property
 * see https://github.com/csstree/csstree/issues/245
 *
 * @param {CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsFunctionsUnknownToCSSTree(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) =>
				node.type === 'Function' && FUNCTIONS_UNKNOWN_TO_CSSTREE.has(node.name.toLowerCase()),
		),
	);
}

/**
 * Detect `calc-size()` with the `size` keyword in its arguments.
 *
 * @param {Array<import('@csstools/css-parser-algorithms').ComponentValue>} componentValues
 * @returns {boolean}
 */
function containsCalcSizeWithSizeKeyword(componentValues) {
	let contains = false;

	walk(componentValues, ({ node }) => {
		if (!isFunctionNode(node) || node.getName().toLowerCase() !== 'calc-size') return;

		contains = node
			.tokens()
			.some((token) => token[0] === TokenType.Ident && token[4]?.value.toLowerCase() === 'size');

		if (contains) return false; // halt
	});

	return contains;
}

/**
 * Validate math functions (calc, min, max, clamp, etc.) in a CSS value.
 * Uses @csstools/css-calc to solve expressions and validate the result.
 *
 * @param {string} value - The CSS property value
 * @param {string} property - The name the lexer knows the property by
 * @param {Lexer} lexer - The csstree lexer
 * @returns {'undetermined' | 'valid' | 'skip-validation' | OffsetRange} - The validation result, or the range of the invalid expression
 */
function validateMathFunctions(value, property, lexer) {
	// If the value doesn't contain any math functions, continue with normal validation
	if (!mayIncludeRegexes.mathFunction.test(value)) return 'undetermined';

	const nodes = parseListOfComponentValues(tokenize({ css: value }), {});

	if (containsCalcSizeWithSizeKeyword(nodes)) {
		return 'skip-validation';
	}

	// Try to solve the math expression
	const solvedNodes = calcFromComponentValues([nodes], { randomCaching });

	const solvedValue = stringify(solvedNodes);

	// For other cases where calc can't be fully solved (like 100% - 10px),
	// skip validation and let csstree handle it (csstree allows these)
	if (mayIncludeRegexes.mathFunction.test(solvedValue)) {
		return 'undetermined';
	}

	// If the expression was fully solved (no more math functions),
	// validate the result with csstree
	try {
		const solvedCssTreeNode = parse(solvedValue, { context: 'value', positions: true });

		if (containsFunctionsUnknownToCSSTree(solvedCssTreeNode)) {
			return 'skip-validation';
		}

		const { error } = lexer.matchProperty(property, solvedCssTreeNode);

		// If the solved value is valid, skip further validation
		if (!error) return 'valid';

		// If the solved value is invalid, it means the calc result type doesn't match the property
		// e.g., calc(2) for height: results in a number "2", but height expects a length
		if (isMismatchError(error)) {
			// Lookup the original source position of the invalid expression
			// by finding the tokens that correspond to the positions reported by csstree
			const solvedTokens = solvedNodes.flatMap((componentValues) =>
				componentValues.flatMap((node) => node.tokens()),
			);

			const range = getSourceRange(solvedTokens, [error.loc.start.offset, error.loc.end.offset]);

			return range ?? [0, value.length];
		}
	} catch {
		// If parsing fails, continue with normal validation
		return 'undetermined';
	}

	return 'undetermined';
}

/**
 * @param {CssNode} cssTreeValueNode
 * @param {number} startOffset
 * @param {number} endOffset
 * @returns {CssNode | null}
 */
function findEnclosingFunction(cssTreeValueNode, startOffset, endOffset) {
	return find(
		cssTreeValueNode,
		(node) =>
			node.type === 'Function' &&
			node.loc !== undefined &&
			startOffset >= node.loc.start.offset &&
			endOffset <= node.loc.end.offset,
	);
}

/**
 * Empty values are hooks for overriding, and non-standard values can't be matched
 *
 * @param {string} value
 * @returns {boolean}
 */
function isSubstitutableValue(value) {
	const trimmedValue = value.trim();

	return trimmedValue !== '' && isStandardSyntaxValue(trimmedValue);
}

/**
 * Representative values of each alternative, so a declaration matches when any can
 *
 * @param {DSNodeGroup} syntaxDefinition
 * @returns {string[]} none when an alternative has none
 */
function getRepresentativeValues(syntaxDefinition) {
	if (syntaxDefinition.combinator !== '|' && syntaxDefinition.terms.length !== 1) return [];

	const valuesOfAlternatives = syntaxDefinition.terms.map(getRepresentativeValuesOfTerm);

	return valuesOfAlternatives.every((values) => values.length > 0)
		? valuesOfAlternatives.flat()
		: [];
}

/**
 * @param {import('css-tree').DSNode} term
 * @returns {string[]}
 */
function getRepresentativeValuesOfTerm(term) {
	// One value satisfies the `+` and `#` multipliers
	if (term.type === 'Multiplier') return getRepresentativeValuesOfTerm(term.term);

	if (term.type === 'Keyword') return [term.name];

	if (term.type === 'Type') return representativeValuesBySyntaxComponentName.get(term.name) ?? [];

	return [];
}

/**
 * The custom properties a root's `@property` rules register with a checkable syntax
 *
 * @param {Root} rootNode
 * @returns {Map<string, RegisteredCustomProperty>}
 */
function getRegisteredCustomProperties(rootNode) {
	/** @type {Map<string, RegisteredCustomProperty>} */
	const registered = new Map();

	rootNode.walkAtRules(atRuleRegexes.propertyName, (atRule) => {
		const propNames = getCustomPropertyNames(atRule);

		if (propNames.length === 0 || !atRule.nodes) return;

		for (const node of atRule.nodes) {
			if (isDeclaration(node) && descriptorRegexes.syntaxName.test(node.prop)) {
				const value = node.value.trim();
				const unquoted = string.decode(value);

				// Only string values are valid.
				// We can not check the syntax of this property.
				if (unquoted === value) continue;

				// Any value is allowed in this custom property.
				// We don't need to check this property.
				if (unquoted === '*') continue;

				const syntaxDefinition = parseSyntax(unquoted);

				// An invalid syntax string is ignored, so any value is allowed.
				if (!syntaxDefinition) continue;

				for (const propName of propNames) {
					registered.set(propName, { syntax: unquoted, syntaxDefinition });
				}
			}
		}
	});

	return registered;
}

/**
 * @param {string} syntax
 * @returns {DSNodeGroup | undefined}
 */
function parseSyntax(syntax) {
	try {
		return definitionSyntax.parse(syntax);
	} catch (error) {
		if (error instanceof SyntaxError) return undefined;

		throw error;
	}
}

/**
 * The lexer takes extra vendor-prefixed properties but not custom ones, see csstree/csstree#256
 *
 * @param {string} name
 * @returns {string}
 */
function getPrefixedPropName(name) {
	return `-stylelint${name}`;
}

/**
 * @param {VarFunctionSubstitution} substitution
 * @param {number} start
 * @param {number} end
 * @returns {boolean}
 */
function isWithinRange(substitution, start, end) {
	return start <= substitution.start && substitution.end <= end;
}

/**
 * @param {import('css-tree').LexerMatchResult['error']} error
 * @returns {error is import('css-tree').SyntaxMatchError}
 */
function isMismatchError(error) {
	return (
		error !== null &&
		'mismatchLength' in error &&
		error.name === 'SyntaxMatchError' &&
		error.rawMessage === 'Mismatch'
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
